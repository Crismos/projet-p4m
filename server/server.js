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
	var _GameManager = require("./modules/GameManager.js");

	var UserManager = new _UserManager();
	var GameManager = new _GameManager();

	// connection d'un nouvel utilisateur
	io.on('connection', function(socket){
		var user;
		// l'utilisateur envoi une requete pour s'identifier
		socket.on('user connection', function(o){
			user = new _User(socket, o.name);
			UserManager.addUser(user);
			socket.emit("connection success", {id: socket.id});
			socket.emit("receive chat infos", {users: UserManager.getOnlines(socket.id)})
			io.emit("new user connected", {id: socket.id, name:o.name, status:0});
		});
		// l'utilisateur met à jour son pseudo
		socket.on('user update name', function(o) {
			UserManager.getUserById(socket.id).setPseudo(o.name);
		});
		// l'utilisateur se déconnecte
		socket.on('disconnect', function(){
			io.emit("user disconnect", {id: socket.id});
			UserManager.removeUser(UserManager.getUserById(socket.id));
		});

		// code temporaire
		socket.on("request game id", function(o) {
			var game = GameManager.addGame(o.game);
			if(game){
				user.setGame(game);
				game.addPlayer(user);
			}
			socket.emit("your game id", {game: o.game, id: game.getId()})
		});

		// messages
		socket.on("client send message", function(o) {
			o.from = socket.id;
			var u = UserManager.getUserById(o.to);
			if(u) {

				o.toName = u.getPseudo();
				o.fromName = UserManager.getUserById(socket.id).getPseudo();
				o.to = u.getSocket().id;

				console.log("::red::>>::white:: ["+o.fromName+"] > ["+ o.toName+"] : "+o.content);
				socket.emit("message sended", o);
				u.getSocket().emit("receive message", o);
			} else {
				console.log("::red:: error when trying to send message");
			}
		});
		socket.on("user want to connect to a game", function(o) {
			var game = GameManager.getGame(o.id);
			if(game) {
				// la game existe
				var valide = game.addPlayer(user);
				if(valide) {
					// il y a assez de place
				} else {
					// partie pleine
				}
			} else {
				// retourner une erreur
			}
		});
	});
}
