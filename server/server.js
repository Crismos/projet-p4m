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

	var _UserManager = require("./modules/UserManager.js");
	var _User = require("./modules/User.js");

	var UserManager = new _UserManager();

	// connection d'un nouvel utilisateur
	io.on('connection', function(socket){
		var user;
		// l'utilisateur envoi une requete pour s'identifier
		socket.on('user connection', function(o){
			user = new _User(socket, o.name);
			UserManager.addUser(user);
		});
		// l'utilisateur met à jour son pseudo
		socket.on('user update name', function(o) {
			UserManager.getUserById(socket.id).setPseudo(o.name);
		});
		// l'utilisateur se déconnecte
		socket.on('disconnect', function(){
			UserManager.removeUser(UserManager.getUserById(socket.id));
		});
	});
}
