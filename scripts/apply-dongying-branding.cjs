const fs=require('fs'),path=require('path');
if (fs.existsSync(path.join(__dirname, '../header.html'))) throw new Error('Shared layout is enabled. Edit header.html and run node scripts/build-layout.cjs instead.');
const c=require(require.resolve('cheerio',{paths:[__dirname,path.resolve('work/home-copy')]}));
const files=require('../site-copy-manifest.json').pages.map(p=>p.file).concat('contact.html');
const wordmark=fs.readFileSync('components/dongying/wordmark.html','utf8');
for(const file of files){
 const html=fs.readFileSync(file,'utf8'),backup=path.join('work/header-branding/before',file);
 if(!fs.existsSync(backup)){fs.mkdirSync(path.dirname(backup),{recursive:true});fs.writeFileSync(backup,html)}
 const $=c.load(html),asset=name=>path.posix.relative(path.posix.dirname(file),'site-assets/dongying/'+name);
 $('#logoLink').html(wordmark).attr('aria-label','東盈創世 ホーム');
 for(const id of ['module314','module315','module316'])$('#'+id).empty().attr('aria-hidden','true');
 $('#navContact,[data-contact-nav-separator],[data-dongying-branding]').remove();
 const nav=$('#nav2').clone();
 nav.attr('id','navContact').attr('class','item itemColContact itemIndex6').removeAttr('colid').removeAttr('onclick').removeAttr('_jump');
 nav.find('.nav-list-layout').empty();
 nav.find('a').attr('href',path.posix.relative(path.posix.dirname(file),'contact.html')).removeAttr('aria-current');
 nav.find('.J_nav_item_name').text('お問い合わせ');
 nav.find('.J_nav_item_subname').text('Contact');
 if(file==='contact.html'){$('#navCenter .itemSelected').removeClass('itemSelected');nav.addClass('itemSelected');nav.find('a').attr('aria-current','page')}
 const separator=$('#navCenter .itemSep').first().clone().attr('data-contact-nav-separator','');
 $('#navCenter .itemContainer').append(separator).append(nav);
 $('head').append(`<link rel="stylesheet" data-dongying-branding href="${asset('header.css')}"><script defer data-dongying-branding src="${asset('header.js')}"></script>`);
 fs.writeFileSync(file,$.html());
}
console.log(`Updated logo, removed header phone and added contact navigation on ${files.length} pages.`);
