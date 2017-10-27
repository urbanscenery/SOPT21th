/*
const http = require('http');
const request = require('request');

const server = http.createServer(function(req,res){
	let option = {
		uri : 'http://52.78.124.103:3456/test',
		method : 'GET'
	};
	request(option, function(err, response, body){
		if(err){
			console.log("Request module error : " + err);
			res.writeHead(500, {"Content-Type" : "text/plain"});
			res.end("Request module error!");
		} else{
			let bodyParsed = JSON.parse(body);
			console.log("body : "+body, +"type : " + typeof body);
			console.log("parsed : "+ bodyParsed + "type : "+ typeof bodyParsed);
			console.log("Successful get response");
			res.writeHead(200, {"Content-Type" : "text/plain"});
			res.end(bodyParsed.data);
		}
	});
}).listen(3000, function(){
	console.log('3000포트로 서버 동작중!');
});
*/

const http = require('http');
const request = require('request');

const server = http.createServer(function(req,res){
	let option = {
		uri : 'http://52.78.124.103:3456/test',
		method : 'GET'
	};
	request(option, function(err, response, body){
		if(err){
			console.log("Request module error : " + err);
			res.writeHead(500, {"Content-Type" : "text/plain"});
			res.end("Request module error!");
		} else{
			let bodyParsed = JSON.parse(body);

			let jsonObject = {
				key1 : 'value1',
				key2 : 'value2'
			};

			let stringObj = JSON.stringify(bodyParsed);
			let reJsonObj = JSON.parse(stringObj);

			console.log("bodyParsed : " + bodyParsed); 
			console.log("jsonObject : "  + jsonObject); 
			console.log("stringObj : " + stringObj); 
			console.log("reJsonObj : " + reJsonObj); 

			console.log(typeof jsonObject); // object
			console.log(typeof stringObj); // string
			console.log(typeof reJsonObj); // object
			/*
			stringify 는 type을 string으로 바꿈
			*/ 

			console.log("Successful get response");
			res.writeHead(200, {"Content-Type" : "text/plain"});
			res.end(bodyParsed.data);
		}
	});
}).listen(3000, function(){
	console.log('3000포트로 서버 동작중!');
});