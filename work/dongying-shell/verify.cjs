const fs=require('fs'),path=require('path'),crypto=require('crypto');
const c=require('../home-copy/node_modules/cheerio');
const {pages}=require('../../site-copy-manifest.json');
const issues=[];let links=0;
for(const {file} of pages){
 const before=c.load(fs.readFileSync(path.join(__dirname,'before',file),'utf8'));
 const after=c.load(fs.readFileSync(file,'utf8'));
 for(const id of ['#dongying-header','#dongying-footer'])if(after(id).length!==1)issues.push(file+': shell count '+id);
 after('#dongying-header a,#dongying-footer a,#dongying-footer img,link[data-dongying-shell]').each((_,el)=>{
   const v=after(el).attr('href')||after(el).attr('src');
   if(/^(tel:|mailto:)/.test(v))return;
   links++;
   if(v.startsWith('#')){if(!after(v).length)issues.push(file+': missing anchor '+v)}
   else if(!fs.existsSync(path.resolve(path.dirname(file),v)))issues.push(file+': missing '+v);
 });
 const strip=dom=>{dom('.webTopTable,.webNavTable,#webHeaderTable,#webFooterTable').remove();return dom('#web').html();};
 if(strip(before)!==strip(after))issues.push(file+': body changed');
 const scripts=dom=>dom('script').map((_,el)=>dom.html(el)).get();
 if(JSON.stringify(scripts(before))!==JSON.stringify(scripts(after)))issues.push(file+': scripts changed');
}
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
if(hash('site-assets/dongying/logo.png')!==hash('D:/gitcode/zx751117-zx.github.io-main/zx751117-zx.github.io-main/pic/logo.png'))issues.push('Logo bytes differ from source');
const report={pages:pages.length,checkedShellLinks:links,bodyAndScriptsPreserved:issues.length===0,issues};
fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));if(issues.length)process.exitCode=1;
