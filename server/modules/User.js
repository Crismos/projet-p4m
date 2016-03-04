var _MessageManager = require("./MessageManager.js");

var User = function(socket, pseudo) {
	var id = socket.id;
	var pseudo = pseudo;
	var socket = socket;
	var currentGame = null;
	var MessageManager = null;

	console.log("::green::[User]::white:: > Create new user "+(id ||"undefined")+"("+(pseudo ||"undefined")+")");

	this.connectToChat = function() {
		MessageManager = new _MessageManager(this);
	}
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
}
module.exports = User;