const fs=require('fs'),path=require('path'),http=require('http');
const root=process.cwd();
http.createServer((req,res)=>{
 let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(name.endsWith('/')) name+='index.html';
 const current=path.resolve(root,'.'+name);
 if(!current.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 const before=path.join(root,'work/page-assets/before',name.slice(1));
 const file=name.endsWith('.html')&&fs.existsSync(before)?before:current;
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(data);});
}).listen(8320,'127.0.0.1',()=>console.log('Baseline preview: http://127.0.0.1:8320/'));
