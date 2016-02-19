var console = require("./modules/console.js");
var config = {};

// chargement du fichier de configuration
fs = require('fs');
fs.readFile('../config.cfg', 'utf8', function (err,data) {
	console.log("Chargement de la config...");
  	if (err) {
    	return console.log(err);
  	}
  	config = JSON.parse(data);
  	console.log("Config chargee");

  	run();
});

function run() {
	var io = require("socket.io")(config.server.socket.port);

	console.log("Listening port *: ::green::"+config.server.socket.port);


	var onlines = 0;
	var users = {};
	var User = require("./modules/User.js");

	// connection d'un nouvel utilisateur
	io.on('connection', function(socket){

		onlines++;
		// l'utilisateur envoi une requete pour s'identifier
		socket.on('user connection', function(o){

		  	console.log("::green::>>[USER]::white:: user ::green::"+o.id+"("+(o.name || "no name")+")::white:: connected");

		  	socket.user = o.id;
		  	socket.name = o.name;
		  	users[socket.id] = new User(socket);


		  	io.emit("connection infos", {onlines: onlines});
		});
		// l'utilisateur met à jour son pseudo
		socket.on('user update name', function(o) {
			console.log("::green::>>[USER]::white:: user ::green::"+users[socket.id].getId()+" ::white::update name to ::green::"+o.name+"");

			users[socket.id].updateName(o.name);
		});
		// l'utilisateur se déconnecte
		socket.on('disconnect', function(){

			onlines--;

			delete users[socket.user];

			console.log('::green::<<[USER]::white:: user ::green:: '+(users[socket.id].getId()||"undefined")+' ::white::disconnected');
		
			io.emit("connection infos", {onlines: onlines});
		});
	});
}
