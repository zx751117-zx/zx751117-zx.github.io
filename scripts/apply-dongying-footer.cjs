const fs=require('fs'),path=require('path');
if (fs.existsSync(path.join(__dirname, '../footer.html'))) throw new Error('Shared layout is enabled. Edit footer.html and run node scripts/build-layout.cjs instead.');
const c=require(require.resolve('cheerio',{paths:[__dirname,path.resolve('work/home-copy')]}));
const {pages}=require('../site-copy-manifest.json');
if(fs.existsSync('contact.html')&&fs.readFileSync('contact.html','utf8').includes('id="dongying-contact-page"'))pages.push({file:'contact.html'});
const source=fs.readFileSync('components/dongying/footer.html','utf8');
for(const {file} of pages){
 const html=fs.readFileSync(file,'utf8'),backup=path.join('work/footer-only/before',file);
 if(!fs.existsSync(backup)){fs.mkdirSync(path.dirname(backup),{recursive:true});fs.writeFileSync(backup,html)}
 const $=c.load(html),f=c.load(source,null,false);
 const asset=name=>path.posix.relative(path.posix.dirname(file),'site-assets/dongying/'+name);
 $('#dongying-footer,[data-dongying-footer]').remove();
 const old=$('#webFooterTable');
 old.find('*').contents().filter((_,e)=>e.type==='text').remove();
 old.find('img,a,svg,canvas,script,style').remove();
 old.attr('aria-hidden','true');
 f('footer').attr('id','dongying-footer');
 f('.footer-links').empty();
 f('img').attr('src',asset('logo.png'));
 f('.footer-contact p').first().text(f('.footer-contact p').first().text().replace('京都总社','京都本社'));
 f('.footer-contact p').eq(1).html('電話：<a href="tel:0752030940">075-203-0940</a>');
 f('.footer-contact p').eq(3).html('メール：<a href="mailto:info@yinchung.com">info@yinchung.com</a>');
 ($('#dongying-contact-page').length ? $('#dongying-contact-page') : $('#web')).after(f.html().trim());
 $('head').append(`<link rel="stylesheet" data-dongying-footer href="${asset('footer.css')}"><script defer data-dongying-footer src="${asset('footer.js')}"></script>`);
 fs.writeFileSync(file,$.html());
}
console.log(`Updated only the footer on ${pages.length} pages.`);
