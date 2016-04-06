/*
* Class User
*	id, pseudo, socket, currentGame, MessageManager
*
*	define a user when he's connected
*
*	connectToChat():void  	connect user to tchat
*	getSocket():socket 		get socket of the user
*	getId():id  			get user ID
*	setPseudo(pseudo):void 	update user pseudo
*	getPseudo():pseudo 		get user pseudo
*	getStatus():status 		get user status (-1: error, 0: connected, 1: on Morpion game, 2: on p4 game)
*	getGame():game 			get user current game;
*/

var User = function(socket, pseudo) {

	var pseudo = pseudo;
	var socket = socket;
	var currentGame = null;

	console.log("::green::[User]::white:: > Create new user, socket id : "+ socket.id +", pseudo : "+pseudo);

	this.getSocket = function() {
		return socket;
	}
	this.getId = function(){
		return socket.id;
	}

	this.getPseudo = function() {
		return pseudo;
	}

	this.getStatus = function() {
		if(!currentGame) 
			return 0;
		if(currentGame.name == "morpion")
			return 1;
		if(currentGame.name == "p4")
			return 2;
		return -1;
	}

	this.setCurrentGame = function(game) {
		currentGame = game;
	}

	this.getCurrentGame = function(){
		return currentGame;
	}
}
module.exports = User;