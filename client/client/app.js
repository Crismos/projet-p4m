var express = require("express");
var app = express();
var config = {};

fs = require('fs');
// chargement du fichier de configuration
fs.readFile('../../config.cfg', 'utf8', function (err,data) {

	console.log("Chargement de la config...");

  	if (err) {
    	return console.log(err);
  	}

  	config = JSON.parse(data);
  	console.log("Config chargee");

  	// ajout du dossier publique
	app.use(express.static(__dirname + '/public'));

	// ejs
	app.engine('.html', require('ejs').__express);
	app.set('views', __dirname + '/public');
	app.set('view engine', 'html');

	// routes
	//config.js
	// sans url
	app.get("/", function(req, res) {
		//res.sendFile("main.html", {root: './public'});
		res.render("main", {
			id : 0,
			ip : config.server.socket.addr,
			port : config.server.socket.port
		});
	});
	// avec url
	app.get("/:var(home|config.js)", function(req, res) {
		console.log(req.params.var);
		if(req.params.var == "config.js") {
			//envoi du fichier de configuration au client
			res.send("var config = "+JSON.stringify(config));
		} else {
			//res.sendFile("main.html", {root: './public'});
			res.render("main", {
				id : 0,
				ip : config.server.socket.addr,
				port : config.server.socket.port
			});
		}
	});
	app.get("/:id(\\d+)", function(req, res) {
		res.render("main", {
			id : req.params.id,
			ip : config.server.socket.addr,
			port : config.server.socket.port
		});
	});


	console.log("Running > "+config.server.client.addr+":"+config.server.client.port);
	app.listen(config.server.client.port);
});