import csv
import io
import re
import sqlite3
from contextlib import closing
from dataclasses import dataclass
from datetime import datetime, date
from pathlib import Path
from typing import List, Optional

from flask import (
    Flask,
    flash,
    get_flashed_messages,
    make_response,
    redirect,
    render_template,
    request,
    url_for,
)
from PIL import Image, UnidentifiedImageError
import pytesseract


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / ".." / "data" / "receipts.db"
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


@dataclass
class ParsedReceipt:
    store_name: Optional[str]
    purchase_date: Optional[date]
    items: List[str]
    raw_text: str


CREATE_RECEIPTS_SQL = """
CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    store_name TEXT,
    purchase_date TEXT,
    raw_text TEXT NOT NULL,
    created_at TEXT NOT NULL
);
"""

CREATE_ITEMS_SQL = """
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    receipt_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY(receipt_id) REFERENCES receipts(id) ON DELETE CASCADE
);
"""


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "tiff", "bmp"}


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "change-me"  # For flash messaging

    init_db()

    @app.route("/", methods=["GET", "POST"])
    def index():
        if request.method == "POST":
            file = request.files.get("receipt")
            if not file or file.filename == "":
                flash("ファイルが選択されていません。", "error")
                return redirect(url_for("index"))

            if not allowed_file(file.filename):
                flash("対応していないファイル形式です。画像ファイルを選択してください。", "error")
                return redirect(url_for("index"))

            try:
                parsed = process_receipt(file.read())
                receipt_id = save_parsed_receipt(parsed)
                flash(
                    f"レシートを登録しました (ID: {receipt_id})。店舗: {parsed.store_name or '不明'}, 購入日: {parsed.purchase_date or '不明'}",
                    "success",
                )
            except pytesseract.TesseractNotFoundError:
                flash(
                    "Tesseract OCR が見つかりません。システムに Tesseract をインストールし、環境変数にパスを設定してください。",
                    "error",
                )
            except pytesseract.TesseractError as exc:
                flash(f"OCR の実行に失敗しました: {exc}", "error")
            except UnidentifiedImageError:
                flash("画像を読み込めませんでした。ファイル形式を確認してください。", "error")
            except Exception as exc:  # noqa: BLE001
                flash(f"予期せぬエラーが発生しました: {exc}", "error")

            return redirect(url_for("index"))

        receipts = load_receipts()
        return render_template("index.html", receipts=receipts, messages=get_flashed_messages(with_categories=True))

    @app.route("/export")
    def export_csv():
        receipts = load_receipts()
        csv_content = build_csv(receipts)
        response = make_response(csv_content)
        response.headers["Content-Disposition"] = "attachment; filename=receipts.csv"
        response.headers["Content-Type"] = "text/csv; charset=utf-8"
        return response

    return app


def init_db() -> None:
    with closing(sqlite3.connect(DB_PATH)) as conn:
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.execute(CREATE_RECEIPTS_SQL)
        conn.execute(CREATE_ITEMS_SQL)
        conn.commit()


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def process_receipt(raw_bytes: bytes) -> ParsedReceipt:
    image = Image.open(io.BytesIO(raw_bytes))
    image = image.convert("L")

    text = perform_ocr(image)
    parsed = parse_receipt_text(text)
    return parsed


def perform_ocr(image: Image.Image) -> str:
    try:
        return pytesseract.image_to_string(image, lang="jpn+eng")
    except pytesseract.TesseractError:
        # Fallback to default language configuration
        return pytesseract.image_to_string(image)


def parse_receipt_text(text: str) -> ParsedReceipt:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    store_name = extract_store_name(lines)
    purchase_date = extract_purchase_date(text)
    items = extract_items(lines, store_name)
    return ParsedReceipt(store_name=store_name, purchase_date=purchase_date, items=items, raw_text=text)


def extract_store_name(lines: List[str]) -> Optional[str]:
    for line in lines[:5]:  # The store name is usually near the top
        cleaned = re.sub(r"[\s★☆◆◇\-・]+", "", line)
        if cleaned and not re.search(r"\d", cleaned):
            return line
    return None


def extract_purchase_date(text: str) -> Optional[date]:
    date_patterns = [
        re.compile(r"(?P<year>\d{4})[年\-/\.](?P<month>\d{1,2})[月\-/\.](?P<day>\d{1,2})日?"),
        re.compile(r"(?P<month>\d{1,2})[月/\-\.](?P<day>\d{1,2})日?"),
    ]
    for pattern in date_patterns:
        match = pattern.search(text)
        if match:
            groups = match.groupdict()
            year = int(groups.get("year") or datetime.now().year)
            month = int(groups["month"])
            day = int(groups["day"])
            try:
                return date(year=year, month=month, day=day)
            except ValueError:
                continue
    return None


def extract_items(lines: List[str], store_name: Optional[str]) -> List[str]:
    items: List[str] = []
    skip_keywords = {"小計", "小計", "合計", "税込", "税", "お釣", "ポイント"}
    for line in lines:
        if store_name and line == store_name:
            continue
        if any(keyword in line for keyword in skip_keywords):
            continue

        cleaned = line.strip("-*#= ")
        if not cleaned:
            continue

        has_price = bool(re.search(r"[¥￥]\s*\d", cleaned) or re.search(r"\d+[,.]\d+", cleaned))
        if has_price or len(cleaned) > 1:
            name = re.sub(r"[¥￥]\s*[0-9.,]+", "", cleaned)
            name = re.sub(r"\s*\d+[,.]?\d*\s*$", "", name)
            name = name.strip(" -*#=.")
            if name and len(name) > 1:
                items.append(name)
    # Deduplicate while preserving order
    seen = set()
    unique_items = []
    for item in items:
        if item not in seen:
            seen.add(item)
            unique_items.append(item)
    return unique_items


def save_parsed_receipt(parsed: ParsedReceipt) -> int:
    with closing(sqlite3.connect(DB_PATH)) as conn:
        conn.execute("PRAGMA foreign_keys = ON;")
        cursor = conn.cursor()
        purchase_date_str = parsed.purchase_date.isoformat() if parsed.purchase_date else None
        cursor.execute(
            "INSERT INTO receipts (store_name, purchase_date, raw_text, created_at) VALUES (?, ?, ?, ?)",
            (
                parsed.store_name,
                purchase_date_str,
                parsed.raw_text,
                datetime.utcnow().isoformat(timespec="seconds"),
            ),
        )
        receipt_id = cursor.lastrowid
        for item in parsed.items:
            cursor.execute("INSERT INTO items (receipt_id, name) VALUES (?, ?)", (receipt_id, item))
        conn.commit()
        return receipt_id


def load_receipts() -> List[dict]:
    with closing(sqlite3.connect(DB_PATH)) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, store_name, purchase_date, raw_text, created_at FROM receipts ORDER BY created_at DESC"
        )
        receipts = []
        for row in cursor.fetchall():
            cursor.execute("SELECT name FROM items WHERE receipt_id = ?", (row["id"],))
            items = [item_row["name"] for item_row in cursor.fetchall()]
            receipts.append(
                {
                    "id": row["id"],
                    "store_name": row["store_name"],
                    "purchase_date": row["purchase_date"],
                    "items": items,
                    "created_at": row["created_at"],
                    "raw_text": row["raw_text"],
                }
            )
        return receipts


def build_csv(receipts: List[dict]) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["receipt_id", "store_name", "purchase_date", "item_name"])
    for receipt in receipts:
        if receipt["items"]:
            for item in receipt["items"]:
                writer.writerow(
                    [
                        receipt["id"],
                        receipt["store_name"] or "",
                        receipt["purchase_date"] or "",
                        item,
                    ]
                )
        else:
            writer.writerow(
                [receipt["id"], receipt["store_name"] or "", receipt["purchase_date"] or "", ""]
            )
    return output.getvalue()


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
