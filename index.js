var fs = require('fs');
var http = require('http');
var https = require('https');

var privateKey  = fs.readFileSync('./key.pem', 'utf8');
var certificate = fs.readFileSync('./cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate, passphrase: "heroes"};

var express = require('express');
var app = express();

var data = require('./data.json');

var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/hero', function(req, res) {
	console.log('GET /hero');
	res.send(data.heroes);
});

app.post("/hero", function(req, res) {
	console.log('POST /hero, data: ' + req.body);
	data.heroes.push(req.body);
	res.sendStatus(200);
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(3000);
httpsServer.listen(3443);