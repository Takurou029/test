from html.parser import HTMLParser
from pathlib import Path


class LinkChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.hrefs = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if "id" in values:
            self.ids.add(values["id"])
        if tag == "a" and "href" in values:
            self.hrefs.append(values["href"])


parser = LinkChecker()
parser.feed(Path("index.html").read_text(encoding="utf-8"))
missing = [href for href in parser.hrefs if href.startswith("#") and href[1:] not in parser.ids]
if missing:
    raise SystemExit(f"Missing anchor targets: {', '.join(missing)}")

print(f"HTML parsed successfully; {len(parser.ids)} ids and {len(parser.hrefs)} links checked")
