const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const c=require('../home-copy/node_modules/cheerio');
const pages=require('../../site-copy-manifest.json').pages.map(p=>p.file).concat('contact.html','contact_cn.html');
let links=0;const issues=[];
for(const file of pages){const $=c.load(fs.readFileSync(file,'utf8'));
 $('a[href],script[src],link[rel="stylesheet"],img[src]').each((_,e)=>{const v=$(e).attr('href')||$(e).attr('src');if(!v||/^(https?:|\/\/|mailto:|tel:|javascript:|data:|#)/.test(v))return;links++;if(!fs.existsSync(path.resolve(path.dirname(file),v.split(/[?#]/)[0])))issues.push(file+': '+v)});
 if(file!=='contact_cn.html'){
  const contact=$('#dongying-header nav a').filter((_,e)=>$(e).text()==='お問い合わせ').attr('href');
  assert.equal(path.resolve(path.dirname(file),contact),path.resolve('contact.html'));
 }
}
// Check email composition without opening a mail application or sending mail.
const handlers={},fields={};for(const id of ['name','company','email','message'])fields[id]={value:'',error:'',setCustomValidity(v){this.error=v}};
const form={elements:{namedItem:id=>fields[id]},addEventListener:(event,fn)=>handlers[event]=fn,reportValidity:()=>!Object.values(fields).some(f=>f.error)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)};
const window={location:{href:''}},document={getElementById:()=>form,addEventListener:(_,fn)=>fn()};
vm.runInNewContext(fs.readFileSync('site-assets/dongying/contact.js','utf8'),{document,window,encodeURIComponent});
handlers.submit({preventDefault(){}});assert.equal(window.location.href,'');
fields.name.value='山田 & 太郎';fields.email.value='wrong';fields.message.value='見積もり\nA&B #1';
handlers.submit({preventDefault(){}});assert.equal(window.location.href,'');
fields.email.value='test@example.com';handlers.submit({preventDefault(){}});
const u=new URL(window.location.href);assert.equal(u.pathname,'info@yinchung.com');assert.equal(u.searchParams.get('subject'),'お問い合わせ: 山田 & 太郎');assert.ok(u.searchParams.get('body').includes('見積もり\nA&B #1'));assert.ok(u.searchParams.get('body').includes('会社名: なし'));
assert.deepEqual(issues,[]);console.log(JSON.stringify({pages:pages.length,localReferences:links,issues,formChecks:'Empty and invalid input blocked; Japanese email draft correctly encoded. No mail sent.'},null,2));
