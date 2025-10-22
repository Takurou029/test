# レシート記録アプリ

レシートの画像をアップロードすると、OCR で店舗名・購入日・購入商品を抽出し、結果をデータベースに保存します。登録したデータは CSV でダウンロードできます。

## 必要要件

- Python 3.10 以上
- Tesseract OCR 本体および日本語学習データ (`tesseract-ocr`、`tesseract-ocr-jpn` など)

## セットアップ

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

> **Note:** Tesseract がインストールされていない場合は、OS に応じて別途インストールしてください。例えば Ubuntu 系では `sudo apt install tesseract-ocr tesseract-ocr-jpn` で導入できます。

## アプリの起動

```bash
export FLASK_APP=app.app:app
flask run --reload
```

起動後に `http://127.0.0.1:5000/` にアクセスしてレシート画像をアップロードしてください。

## 主な機能

- 画像アップロード時に OCR を実行し、店舗名・購入日・購入商品を抽出
- 抽出結果を SQLite データベース (`data/receipts.db`) に自動保存
- 登録済みレシートと OCR テキストを一覧表示
- CSV ファイルとして抽出データをダウンロード (`/export`)

## データのバックアップ

保存されたレシート情報は `data/receipts.db` に格納されます。必要に応じてこのファイルをバックアップしてください。

## 注意事項

- OCR の精度はレシート画像の状態や Tesseract の学習データに依存します。必要に応じて画像の解像度や前処理を調整してください。
- 購入商品の抽出は簡易的なルールベース実装のため、レシートのフォーマットによっては意図しない結果になる場合があります。
