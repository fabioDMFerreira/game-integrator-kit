var http=require('http'),
path=require('path'),
fs=require('fs');

http.createServer(function(req,res){
	var filePath='.'+req.url;
	
	if(filePath == "./"){
		filePath='./index.html';
	}
	
	path.exists(filePath,function(exists){
		if(exists){
			fs.readFile(filePath,function(err,content){
				if(err){
					res.writeHead(500);
					res.end();
				}
				else{
					res.writeHead(200,{'content-Type':'text/html'});
					res.end(content,'utf-8');
				}
			});
		}
		else{
			res.writeHead(404);
			res.end();
		}
	});

})

.listen(80);

console.log("App running, access localhost in your browser!");