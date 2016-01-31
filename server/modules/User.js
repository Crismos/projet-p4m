var User = function(socket) {
	var onGame = false;
	var socket = socket;

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