var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var cheerio = require('cheerio');
const shell = require('shelljs');

const internalIp = require("internal-ip")
const addresIP = internalIp.v4.sync()

const originPath = "E:/projects/nodeJs/upload/";

const thePort = 8082;

http.createServer(function (req, res) {
    if(req.method === 'POST'){
        var progress = 0;
        var n = 0;
        var total = req.headers['content-length'];
        req.on('data', function (chunk) {
            progress += chunk.length;
            n++;
            var perc = parseInt((progress / total) * 100);
            console.log('percent complete: ' + perc + '% || speed : ' + progress / n + '\n');
        });

    }
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var newpath = originPath + '/files/' + files.filetoupload.name;
    const status = shell.mv(oldpath, newpath);
    if(status.stderr)  console.log(status.stderr);
    else console.log('File moved!');



    res.write('File uploaded and moved!');
    res.end();
 });
  } else {
    res.writeHead(200);
    fs.readFile(originPath + 'index.html', 'utf8', function(err, data){
        if(err){
            console.log(err);
            res.writeHead(404);
            res.write("file not found");
        }else{
            res.write(data);
        }
        res.end();
    });
    //res.writeHead(200, {'Content-Type': 'text/html'});
  }
}).listen(thePort, function (){
    console.log("server on ---> " + addresIP +  ":" + thePort);
}); 