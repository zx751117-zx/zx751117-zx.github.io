const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const c=require('../home-copy/node_modules/cheerio'),{pages}=require('../../site-copy-manifest.json');
let references=0;
for(const {file} of pages){
 const before=c.load(fs.readFileSync(path.join(__dirname,'before',file),'utf8'));
 const after=c.load(fs.readFileSync(file,'utf8'));
 assert.equal(after('#dongying-footer').length,1,file);
 assert.equal(after('#dongying-header').length,0,file);
 after('#dongying-footer img,[data-dongying-footer]').each((_,e)=>{const v=after(e).attr('src')||after(e).attr('href');assert.ok(fs.existsSync(path.resolve(path.dirname(file),v)),file+': '+v);references++});
 before('#webFooterTable').remove();
 after('#webFooterTable,#dongying-footer,[data-dongying-footer]').remove();
 assert.equal(after.html(),before.html(),file+': changes outside footer');
}
console.log(JSON.stringify({pages:pages.length,footerAssetReferences:references,headerBodyNavigationAndScriptsUnchanged:true,issues:[]},null,2));
