/*
* Cette classe permet de mettre à jour des informations de façon asynchrone
* en utilisant les sockets :
*
* socket.bind(id, var, callback)
*
* Appelera la fonction callback dès que la variable var sera modifiée
* Il est possible de unbind une fonction
*
* socket.unbind(id, var)
*/


var IO = function() {

	// connection au socket
	var soc = io.connect(config.server.socket.addr+":"+config.server.socket.port);
	soc.on("connect_error", function() {
		ERROR.socket();
	});
	// envoi d'une requete d'identification
	var loginBinded = false;

	var params = {
		onlines: 0
	};

	var binded = {
		onlines: {}
	};
	this.binded = binded;

	var call = function(varName) {
		for(var key in binded[varName]) {
			binded[varName][key](params[varName]);
		}
	}
	this.bind = function(ref, varName, callback) {
		binded[varName][ref] = callback;
		callback(params[varName]);
	}
	this.unbind = function(ref, varName) {
		delete binded[varName][ref];
	}
	this.updateName = function(newName) {
		soc.emit('user update name', {name: newName});
	}

	soc.on("connection infos", function(o) {
		params = o;
		call("onlines");
	});

	this.login = function(success, fail) {
		
		console.log("login bind");
		var fct = success || function() {};
		var fail = fail || function() {};
		if(!loginBinded) {
			soc.on("connection success", function(o){
				fct(o);
			});
			soc.on("wrong pseudo", function(o){
				fail(o);
			});
		}
		loginBinded = true;
		soc.emit("user sends his pseudo to server", {name: localStorage.name});
	}

	this.onUserConnection = function(callback) {
		var fct = callback || function(){};
		soc.on("new user connected", function(o) {
			fct(o.id, {name: o.name, status: o.status});
		});
	}

	this.onUserDisconnect = function(callback) {
		var fct = callback || function() {};

		soc.on("user disconnect", function(o) {
			fct(o.id);
		});
	}

	this.onMessage = function(callback) {
		soc.on("message", function(o) {
			callback(o);
		});
	}
	this.onInvitation = function(callback) {
		soc.on("invitation", function(o) {
			callback(o);
		});
	}
	this.send = function(to, text) {
		soc.emit("message", {to:to, text:text});
	}




	this.requestPuissanceQuatre = function(callback) {
		var callback = callback;
		//création salle de jeu
		soc.on("server accept request : create p4 game", function(link_id) {
			console.log("request create p4 ok, mise a jour de linterface graphique");
			callback(link_id);
		});
		soc.emit("client wants to create p4 game");
	}

	this.joinGame = function(link_id, callback) {
		var callback = callback;
		//création salle de jeu
		soc.on("server accept request : want to join game",function(o){
			console.log("request join game ok, mise a jour de linterface graphique");
			callback(o)
		});
		soc.emit("client wants to join game", link_id);
	}

	this.getSocket = function(){
		return soc;
	}

}

var socket = new IO();