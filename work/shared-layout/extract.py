import json, re, posixpath
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
from lxml import html as LH

root = Path.cwd()
files = [p['file'] for p in json.loads((root/'site-copy-manifest.json').read_text(encoding='utf8'))['pages']] + ['contact.html']

class Blocks(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=False)
        self.text = text
        self.offsets = [0]
        for line in text.splitlines(keepends=True): self.offsets.append(self.offsets[-1]+len(line))
        self.depth = {}; self.pending = []; self.blocks = {}
        self.feed(text)
    def at(self):
        line, col = self.getpos(); return self.offsets[line-1]+col
    def handle_starttag(self, tag, attrs):
        if tag not in ('div','footer'): return
        self.depth[tag] = self.depth.get(tag,0)+1
        a = dict(attrs); key = None
        if 'webTopTable' in (a.get('class') or '').split(): key = 'start'
        if a.get('id') == 'webHeaderTable': key = 'end'
        if a.get('id') == 'dongying-footer': key = 'footer'
        if key: self.pending.append((key,tag,self.depth[tag],self.at()))
    def handle_endtag(self, tag):
        if tag not in ('div','footer'): return
        depth = self.depth.get(tag,0)
        for item in self.pending[:]:
            key,t,d,start = item
            if t == tag and d == depth:
                self.blocks[key] = (start,self.text.index('>',self.at())+1)
                self.pending.remove(item)
        self.depth[tag] = depth-1

def common(markup):
    parent = LH.fragment_fromstring(markup, create_parent='div')
    for e in parent.iterdescendants():
        for attr in ('onclick','_jump'): e.attrib.pop(attr,None)
        classes = e.get('class','').split()
        if classes: e.set('class',' '.join(x for x in classes if not x.startswith('itemSelected')))
        e.attrib.pop('aria-current',None)
        for attr in ('href','src','data-original','static_url','link','_srchref'):
            value = e.get(attr)
            if not value or value.startswith(('#','javascript:','mailto:','tel:','data:')): continue
            u = urlsplit(value)
            if u.netloc and u.netloc not in ('yinchung.com','www.yinchung.com','ba31052422.jz.fkw.com'): continue
            file = u.path.lstrip('/') or 'index.html'
            if file == 'index.jsp': file = 'index.html'
            e.set(attr,'{{ROOT}}'+file+('?' + u.query if u.query else '')+('#'+u.fragment if u.fragment else ''))
    return ''.join(LH.tostring(e,encoding='unicode',method='html') for e in parent)

representative = (root/'index.html').read_bytes().decode('utf8')
b = Blocks(representative).blocks
assert all(k in b for k in ('start','end','footer'))
header = common(representative[b['start'][0]:b['end'][1]])
footer = common(representative[slice(*b['footer'])])
(root/'header.html').write_text(header+'\n',encoding='utf8')
(root/'footer.html').write_text(footer+'\n',encoding='utf8')
report = []
for name in files:
    file = root/name; text = file.read_bytes().decode('utf8'); blocks = Blocks(text).blocks
    assert all(k in blocks for k in ('start','end','footer')), name
    backup = root/'work/shared-layout/before'/name
    backup.parent.mkdir(parents=True,exist_ok=True)
    if not backup.exists(): backup.write_bytes(file.read_bytes())
    start,end = blocks['start'][0],blocks['end'][1]
    frag = LH.fragment_fromstring(text[start:end], create_parent='div')
    selected = frag.xpath('.//*[contains(concat(" ",normalize-space(@class)," ")," itemSelected ")]/@id')
    active = 'navContact' if name == 'contact.html' else (selected[0] if selected else '')
    base = posixpath.relpath('site-assets/layout',posixpath.dirname(name) or '.')
    changes = [(start,end,f'<script src="{base}/header.js" data-shared-layout="header" data-active-nav="{active}"></script>'),
               (*blocks['footer'],f'<script src="{base}/footer.js" data-shared-layout="footer"></script>')]
    for lo,hi,value in sorted(changes,reverse=True): text = text[:lo]+value+text[hi:]
    file.write_bytes(text.encode('utf8'))
    report.append({'file':name,'activeNav':active})
(root/'work/shared-layout/pages.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(f'Extracted shared layout from {len(files)} pages.')
