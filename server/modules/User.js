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
	var id = socket.id;
	var pseudo = pseudo;
	var socket = socket;
	var currentGame = null;

	console.log("::green::[User]::white:: > Create new user "+(id ||"undefined")+"("+(pseudo ||"undefined")+")");

	this.getSocket = function() {
		return socket;
	}
	this.getId = function() {
		return id;
	}
	this.setPseudo = function(pseudo) {
		pseudo = pseudo;
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
	this.setGame = function(game) {
		currentGame = game;
	}
}
module.exports = User;