var http = require('http');
var fs = require('fs');
var path = require("path");
var html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>菜鸟教程(runoob.com)</title> 
<style>
.center {
    margin: auto;
    width: 60%;
    border: 3px solid #73AD21;
    padding: 10px;
}
</style>
</head>
<body>
 
HTML_BODY
 
</body>
</html>`
var filebase = './files';
var indexfiles = [];
readdir(filebase,function(filesname){
    indexfiles = filesname;
});

http.createServer(function (request, response) {

    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    console.log(request.url,indexfiles.indexOf(request.url.replace('/','')) != -1);
    if(indexfiles.indexOf(request.url.replace('/','')) != -1){
        downloadFile(filebase+request.url,response);
        return;
    }
    readdir(filebase,function(filesname){
        var as = '';
        filesname.forEach(element => {
            as += getAText(element) +'</br>'
        });
        response.end(html.replace('HTML_BODY',as));
    });
    
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
//创建a标签
function getAText(name){
    return '<a href='+name+' download='+name+'>'+name+'<a/>'
}
//读取指定目录
function readdir(path,cb) {
    fs.readdir(path,'utf8',function(err,files){
        if(err){
            console.log(err)
        }
        if(cb){
            cb(files)
        }
    });
  }


  function downloadFile (pathUrl, res){
    const readStream = fs.createReadStream(pathUrl);
    const filename = path.basename(pathUrl);
   
    res.writeHead(200, {
      'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
      'Content-Disposition': 'attachment; filename=' + filename //告诉浏览器这是一个需要下载的文件
    });
    readStream.pipe(res);
}