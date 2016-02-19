var express = require("express");
var app = express();
var config = {};

fs = require('fs');
fs.readFile('../../config.cfg', 'utf8', function (err,data) {
	console.log("Chargement de la config...");
  	if (err) {
    	return console.log(err);
  	}
  	config = JSON.parse(data);
  	console.log("Config chargee");

  	// ajout du dossier publique
	app.use(express.static(__dirname + '/public'));

	// routes
	//config.js
	// sans url
	app.get("/", function(req, res) {
		res.sendFile("main.html", {root: './public'});
	});
	// avec url
	app.get("/:var", function(req, res) {
		console.log(req.params.var);
		if(req.params.var == "config.js") {
			//config
			res.send("var config = "+JSON.stringify(config));
		} else {
			res.sendFile("main.html", {root: './public'});
		}
	});


	console.log("Running > "+config.server.client.addr+":"+config.server.client.port);
	app.listen(config.server.client.port);
});