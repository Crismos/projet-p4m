var User = function(socket) {
	var onGame = false;
	var socket = socket;
	var name = socket.name;

	this.updateName = function(newName) {
		name = newName;
	}
	this.getName = function() {
		return name;
	}
	this.getId = function() {
		return socket.user;
	}
	this.isOnGame = function() {
		return onGame;
	}
	this.enterGame = function() {
		onGame = true;
	}
	this.leaveGame = function() {
		onGame = false;
	}
	this.getSocket = function() {
		return socket;
	}
}
module.exports = User;