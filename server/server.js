var console = require("./modules/console.js");
var module_userManager = require("./modules/UserManager.js");
var module_gameManager = require("./modules/GameManager.js");
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
var userManager = new module_userManager.userManager();
var gameManager = new module_gameManager.gameManager();

function run() {
	var io = require("socket.io")(config.server.socket.port);
	console.log("Listening port *: ::green::"+config.server.socket.port);
	// connection d'un nouvel utilisateur
	io.on('connection', function(socket){
		
		console.log("::green:: >> new user incoming...");
		userManager.addUser(socket, function(user) {
			user.onStatus(function(status) {
				socket.broadcast.emit("upUser", user.toObj());
			});
		});

		socket.on("I'am away bro", function() {
			console.log("::yellow:: user "+userManager.getUser(socket.id).getPseudo()+" is afk");
		});
		socket.on("I'am back bro", function() {
			console.log("::green:: user "+userManager.getUser(socket.id).getPseudo()+" is no longer afk");
		});
		
		socket.on('user sends his pseudo to server', function(o){

			if(userManager.isValidePseudo(o.name)) {
				console.log("::green::[user]::white:: "+o.name+" connected ("+socket.id+")");

				userManager.getUser(socket.id).setPseudo(o.name);

				socket.emit("connection success", {id: socket.id});
				socket.emit("welcome", userManager.getOnlines(socket.id));
				io.emit("newUser", {id: socket.id, name:o.name, status:0});
			} else {
				console.log("::red::[user] error : ::white:: ("+socket.id+") wanted to use pseudo "+o.name);
				socket.emit("wrong pseudo", {name: o.name});
			}
		});

		// l'utilisateur se déconnecte
		socket.on('disconnect', function(){
			io.emit("rmUser", {id: socket.id});
			userManager.removeUser(socket.id);
		});

	


		socket.on("client wants to create p4 game", function() {
			var game = gameManager.createPuissanceQuatre(userManager.getUser(socket.id));
			if(game){
				socket.emit("server accept request : create p4 game", game.getId());
				console.log("Le serveur accepte la demande de créaction de partie de p4");
			}else{
				console.log("Impossible de créer la partie le client appartient surement à une autre partie.");
			}

		});
		socket.on("client wants to join game", function(idGame) {
			var game = gameManager.getGame(idGame);
			if(!game) {
				console.log("Le client ne peut pas rejoindre la game "+idGame+" car elle n'existe pas ou plus.");
				return;
			}
			if(!game.addPlayer(userManager.getUser(socket.id))){
				console.log("Le client ne peut pas rejoindre la game car il n'y a plus de place.");
				return;
			}
			
					
			socket.emit("server accept request : want to join game", {typeGame: game.getTypeGame(), id: game.getId()});	
			
			console.log("Le serveur accepte que "+userManager.getUser(socket.id).getPseudo()+ ", puisse rejoindre la game de "+game.getTypeGame()+" num :"+idGame+", envois de la game au client.");
		});




		// messages
		socket.on("message", function(o) {
			var from = socket.id;
			var to = o.to;
			var text = o.text;
			userManager.getUser(to).getSocket().emit("message", {from: from, text: text});
		});

	});
}

exports.getGameManger = function() {
	return gameManager;

}

exports.getUserManager = function(){
	return userManager;
}	