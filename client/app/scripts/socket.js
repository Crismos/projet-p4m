var Socket = function() {
	var socket = io.connect(config.server.socket.addr+":"+config.server.socket.port);
	var logged = false;

	socket.on('connection success', function() {
		logged = true;
	});

	this.isLogged = function() {
		return logged;
	}

	this.bind = function() {
		return socket;
	}
	this.getSocket = function() {
		return socket;
	}


}
var socket = new Socket();