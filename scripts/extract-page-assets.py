"""Extract inline style/script blocks without changing the rest of each page.

Run from any directory with Python 3. No third-party packages are required.
Existing external assets and generated layout scripts are left intact.
"""
from collections import Counter
from hashlib import sha256
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import posixpath
import re

ROOT = Path(__file__).resolve().parent.parent


class AssetBlocks(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.offsets = [0]
        for line in source.splitlines(keepends=True):
            self.offsets.append(self.offsets[-1] + len(line))
        self.pending = None
        self.blocks = []
        self.feed(source)

    def source_offset(self):
        line, col = self.getpos()
        return self.offsets[line - 1] + col

    def handle_starttag(self, tag, attrs):
        if tag not in ('script', 'style'):
            return
        attrs = dict(attrs)
        if tag == 'script' and ('src' in attrs or attrs.get('type', '').lower()
                not in ('', 'text/javascript', 'application/javascript')):
            return
        start = self.source_offset()
        opening = self.get_starttag_text()
        self.pending = (tag, attrs, start, start + len(opening), opening)

    def handle_endtag(self, tag):
        if not self.pending or self.pending[0] != tag:
            return
        kind, attrs, start, body_start, opening = self.pending
        body_end = self.source_offset()
        end = self.source.index('>', body_end) + 1
        self.blocks.append(dict(kind=kind, attrs=attrs, start=start, end=end,
                                opening=opening, content=self.source[body_start:body_end]))
        self.pending = None


def label(block):
    text = block['content']
    if block['kind'] == 'style':
        return 'page-visibility'
    if block['attrs'].get('id') == 'firstPaintDataScript':
        return 'first-paint'
    if 'window.Hosts =' in text:
        return 'hosts'
    if 'var _perfGray' in text:
        return 'site-config'
    if '__jzFrontendResRoot__' in text:
        return 'frontend-config'
    return 'init'


def main():
    files = sorted(list(ROOT.glob('*.html')) + list((ROOT / 'sys-pd').glob('*.html'))
                   + list((ROOT / 'sys-nd').glob('*.html')))
    pages = []
    uses = Counter()
    for file in files:
        source = file.read_bytes().decode('utf8')
        blocks = AssetBlocks(source).blocks
        for block in blocks:
            block['key'] = (block['kind'], block['content'])
            uses[block['key']] += 1
        if blocks:
            pages.append((file, source, blocks))
    if not pages:
        print('No inline CSS or JavaScript blocks remain; no files changed.')
        return

    report = []
    assets = set()
    for file, source, blocks in pages:
        name = file.relative_to(ROOT).as_posix()
        backup = ROOT / 'work/page-assets/before' / name
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            backup.write_bytes(file.read_bytes())
        changes = []
        for block in blocks:
            content = block['content']
            digest = sha256(content.encode('utf8')).hexdigest()
            extension = 'css' if block['kind'] == 'style' else 'js'
            # CSS url() resolves relative to its stylesheet, unlike script URL
            # strings, which still resolve relative to the containing document.
            # Current inline CSS has no URLs; fail safely if this changes later.
            if extension == 'css' and re.search(r'url\s*\(|@import', content, re.I):
                raise ValueError(f'{name}: CSS URLs require rebasing before extraction')
            if uses[block['key']] > 1:
                asset = f'site-assets/{extension}/shared/{label(block)}-{digest[:12]}.{extension}'
            else:
                stem = file.relative_to(ROOT).with_suffix('').as_posix()
                asset = f'site-assets/{extension}/pages/{stem}-{label(block)}-{digest[:12]}.{extension}'
            target = ROOT / asset
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(content.encode('utf8'))
            assets.add(asset)
            relative = posixpath.relpath(asset, posixpath.dirname(name) or '.')
            if extension == 'js':
                # Retain IDs/type/other attributes and parser-blocking behavior.
                replacement = block['opening'][:-1] + f' src="{relative}"></script>'
            else:
                attrs = ''.join(f' {key}="{escape(value or "", quote=True)}"'
                                for key, value in block['attrs'].items() if key != 'type')
                replacement = f'<link rel="stylesheet" href="{relative}"{attrs}>'
            changes.append((block['start'], block['end'], replacement))
            report.append(dict(page=name, asset=asset, sha256=digest, kind=block['kind'],
                               start=block['start'], end=block['end'], replacement=replacement))
        for start, end, replacement in sorted(changes, reverse=True):
            source = source[:start] + replacement + source[end:]
        file.write_bytes(source.encode('utf8'))
    report_file = ROOT / 'work/page-assets/extraction.json'
    report_file.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf8')
    print(f'Extracted {len(report)} blocks from {len(pages)} pages into {len(assets)} files.')


if __name__ == '__main__':
    main()
