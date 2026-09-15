const fs = require('fs');
const path = require('path');
const cheerio = require(require.resolve('cheerio', { paths: [__dirname, path.resolve('work/home-copy')] }));
const manifest = require('../site-copy-manifest.json');
const headerSource = fs.readFileSync('components/dongying/header.html', 'utf8');
const footerSource = fs.readFileSync('components/dongying/footer.html', 'utf8');
const routes = {'index.html':'index.html','product.html':'h-col-103.html','solution.html':'h-col-137.html','news.html':'h-col-132.html','company.html':'h-col-101.html','contact.html':'contact.html'};
const chrome = '.webTopTable,.webNavTable,#webHeaderTable,#webFooterTable';
function section(file) {
  if(file==='index.html') return 'index.html';
  if(file.startsWith('sys-pd/') || file.startsWith('h-col-103')) return 'h-col-103.html';
  if(file.startsWith('sys-nd/') || file.startsWith('h-col-132')) return 'h-col-132.html';
  if(/h-col-1(?:37|38|39|40|41|42|04)/.test(file)) return 'h-col-137.html';
  if(file==='h-col-101.html') return file;
}
for(const {file} of manifest.pages){
  const html = fs.readFileSync(file,'utf8');
  const backup=path.join('work/dongying-shell/before',file);
  if(!fs.existsSync(backup)){fs.mkdirSync(path.dirname(backup),{recursive:true});fs.writeFileSync(backup,html);}
  const $ = cheerio.load(html), prefix = path.posix.relative(path.posix.dirname(file),'.');
  const local = target => target.startsWith('#') ? target : (prefix ? prefix+'/' : '')+target;
  $('#dongying-header,#dongying-footer,.dongying-header-space').remove();
  $('link[data-dongying-shell]').remove();
  // Leave empty named elements in place for the copied site's layout initialization.
  $(chrome).each((_,root)=>{
    $(root).find('*').contents().filter((_,node)=>node.type==='text').remove();
    $(root).find('img,a,svg,canvas,script,style').remove();
    $(root).attr('aria-hidden','true');
  });
  const h=cheerio.load(headerSource,null,false);
  h('header').attr('id','dongying-header');
  h('.logo').replaceWith(`<a class="logo" href="${local('index.html')}" aria-label="東盈創世 ホーム">${h('.logo').html()}</a>`);
  h('nav').attr('aria-label','メインナビゲーション');
  h('nav a').each((_,el)=>{const target=routes[h(el).attr('href')];h(el).attr('href',local(target));if(target===section(file))h(el).attr('aria-current','page');});
  // Only a Japanese edition exists in the current project.
  h('.lang').html('<span class="language-label" lang="ja">日本語</span>');
  const f=cheerio.load(footerSource,null,false);
  f('footer').attr('id','dongying-footer');
  f('.footer-contact').attr('id','dongying-contact');
  f('.footer-contact p').first().text(f('.footer-contact p').first().text().replace('京都总社','京都本社'));
  f('.footer-contact p').eq(1).html('電話：<a href="tel:0752030940">075-203-0940</a>');
  f('.footer-contact p').eq(3).html('メール：<a href="mailto:info@yinchung.com">info@yinchung.com</a>');
  f('img').attr('src',local('site-assets/dongying/logo.png'));
  $('body').prepend(h.html()+'<div class="dongying-header-space" aria-hidden="true"></div>');
  $('#web').after(f.html());
  $('head').append(`<link rel="stylesheet" data-dongying-shell href="${local('site-assets/dongying/shell.css')}">`);
  fs.writeFileSync(file,$.html());
}
console.log(`Replaced header and footer in ${manifest.pages.length} pages.`);

