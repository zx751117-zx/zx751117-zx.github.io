from pathlib import Path
import json,re
from urllib.parse import urlsplit, unquote
from lxml import html
scope = {}
exec(Path('work/shared-layout/extract.py').read_text(encoding='utf8').split('representative =')[0],scope)
Blocks=scope['Blocks']
rows=json.loads(Path('work/shared-layout/pages.json').read_text(encoding='utf8'))
for row in rows:
    name=row['file']
    before=(Path('work/shared-layout/before')/name).read_bytes().decode('utf8')
    after=Path(name).read_bytes().decode('utf8')
    b=Blocks(before).blocks
    for lo,hi in sorted([(b['start'][0],b['end'][1]),b['footer']],reverse=True):
        before=before[:lo]+before[hi:]
    stripped=re.sub(r'<script\b[^>]*data-shared-layout="(?:header|footer)"[^>]*></script>','',after)
    assert before==stripped, f'Body changed: {name}'
    dom=html.fromstring(after)
    for part in ('header','footer'):
        scripts=dom.xpath(f'//script[@data-shared-layout="{part}"]')
        assert len(scripts)==1, name
        assert (Path(name).parent/scripts[0].get('src')).is_file(), name
    assert not dom.xpath('//*[@id="logoLink" or @id="dongying-footer"]'),name
refs=0
for part in ('header','footer'):
    dom=html.fromstring(Path(part+'.html').read_text(encoding='utf8'))
    if part=='header':
        ids=set(dom.xpath('//*[@id]/@id'))
        assert all(not r['activeNav'] or r['activeNav'] in ids for r in rows)
    for value in dom.xpath('//@href | //@src'):
        if value.startswith('{{ROOT}}'):
            assert Path(unquote(urlsplit(value[8:]).path)).is_file(),value
            refs+=1
print(f'PASS: {len(rows)} pages preserve all content outside layout; exactly one shared header/footer per page; {refs} template links/assets exist.')
