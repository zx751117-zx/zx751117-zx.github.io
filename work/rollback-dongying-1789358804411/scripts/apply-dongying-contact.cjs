const fs=require('fs'),path=require('path');
const c=require(require.resolve('cheerio',{paths:[__dirname,path.resolve('work/home-copy')]}));
const {pages}=require('../site-copy-manifest.json');
const $=c.load(fs.readFileSync('components/dongying/contact.html','utf8'));
const home=c.load(fs.readFileSync('index.html','utf8'));
$('#header-placeholder').replaceWith(home.html(home('#dongying-header'))+'<div class="dongying-header-space" aria-hidden="true"></div>');
$('#footer-placeholder').replaceWith(home.html(home('#dongying-footer')));
$('#dongying-header a[aria-current]').removeAttr('aria-current');
$('#dongying-header nav a').filter((_,e)=>$(e).text()==='お問い合わせ').attr('href','contact.html').attr('aria-current','page');
$('link[href="css/style.css"]').attr('href','site-assets/dongying/contact-base.css');
$('link[href="css/header.css"],link[href="css/footer.css"],script[src="js/header.js"],script[src="js/footer.js"]').remove();
$('head').append('<link rel="stylesheet" href="site-assets/dongying/shell.css"><link rel="stylesheet" href="site-assets/dongying/contact.css">');
$('script[src="js/contact.js"]').attr('src','site-assets/dongying/contact.js');
$('section.section').addClass('contact-page').attr('aria-labelledby','contact-title');
$('.title h2').replaceWith('<h1 id="contact-title">お問い合わせ</h1>');
$('#name').attr({required:'',autocomplete:'name'});
$('#company').attr('autocomplete','organization');
$('#email').attr({required:'',type:'email',autocomplete:'email'});
$('#message').attr('required','');
$('#contact-form').attr('novalidate','');
$('#contact-form button').attr('type','submit');
$('#contact-form').append('<p class="mail-note">「送信する」を押すと、ご利用のメールアプリが開きます。内容をご確認のうえ、メールアプリから送信してください。</p>');
$('.contact-details p').eq(2).html('<strong>電話</strong><br><a href="tel:0752030940">075-203-0940</a>');
$('.contact-details p').eq(3).html('<strong>メール</strong><br><a href="mailto:info@yinchung.com">info@yinchung.com</a>');
fs.writeFileSync('contact.html',$.html());
let updated=0;
for(const {file} of pages){
 const html=fs.readFileSync(file,'utf8'),dom=c.load(html);
 const rel=path.posix.relative(path.posix.dirname(file),'contact.html');
 dom('a[href]').each((_,e)=>{const a=dom(e),href=a.attr('href');
  if(href==='#dongying-contact'||/jumpToModulePosition\(617\b/.test(href)||/h-col-101\.html#module617/.test(href)){
   a.attr('href',rel).removeAttr('onclick').removeAttr('target');updated++;
  }
 });
 fs.writeFileSync(file,dom.html());
}
fs.writeFileSync('contact_cn.html','<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=contact.html"><title>東盈創世 | お問い合わせ</title></head><body><a href="contact.html">お問い合わせページを開く</a></body></html>');
console.log(`Created Dongying contact page and updated ${updated} contact links.`);
