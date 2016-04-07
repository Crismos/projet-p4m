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
	var _GameManager = require("./modules/GameManager.js");

	var UserManager = new _UserManager();
	var GameManager = new _GameManager();

	// connection d'un nouvel utilisateur
	io.on('connection', function(socket){
		
		UserManager.addUser(socket);
		var user = UserManager.getUser(socket.id)	
				
		socket.emit("server sends socket id to user", {id: socket.id});

		
		socket.on('user sends his pseudo to server', function(o){
			UserManager.getUser(socket.id).setPseudo(o.name);

			//Chat
			//socket.emit("receive chat infos", {users: UserManager.getOnlines(socket.id)})
			//io.emit("new user connected", {id: socket.id, name:o.name, status:0});
		});

		// l'utilisateur se déconnecte
		socket.on('disconnect', function(){
			io.emit("user disconnect", {id: socket.id});
			UserManager.removeUser(socket.id);
		});

	


		socket.on("client wants to create p4 game", function() {
			var game = GameManager.createPuissanceQuatre(user);
			if(game){
				socket.emit("server accept request : create p4 game", game.getId());
				console.log("Le serveur accepte la demande de créaction de partie de p4");
			}else{
				console.log("Impossible de créer la partie le client appartient surement à une autre partie.");
			}

		});
		socket.on("client wants to join game", function(idGame) {
			var game = GameManager.getGame(idGame);
			if(!game) {
				console.log("Le client ne peut pas rejoindre la game "+idGame+" car elle n'existe pas ou plus.");
				return;
			}
			if(!game.addPlayer(UserManager.getUser(socket.id))){
				console.log("Le client ne peut pas rejoindre la game car il n'y a plus de place.");
				return;
			}
			
			user.setCurrentGame(game);			
			socket.emit("server accept request : want to join game", {typeGame: game.getTypeGame(), id: game.getId()});	
			
			setTimeout(function(){
			    game.go();
			}, 2000);
			console.log("Le serveur accepte que "+UserManager.getUser(socket.id).getPseudo()+ ", puisse rejoindre la game de "+game.getTypeGame()+" num :"+idGame+", envois de la game au client.");
		});




		// messages
		socket.on("client send message", function(o) {
			o.from = socket.id;
			var u = UserManager.getUser(o.to);
			if(u) {

				o.toName = u.getPseudo();
				o.fromName = UserManager.getUser(socket.id).getPseudo();
				o.to = u.getSocket().id;

				console.log("::red::>>::white:: ["+o.fromName+"] > ["+ o.toName+"] : "+o.content);
				socket.emit("message sended", o);
				u.getSocket().emit("receive message", o);
			} else {
				console.log("::red:: error when trying to send message");
			}
		});

	});
}
