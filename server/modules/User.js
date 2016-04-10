var User = function(socket) {

	var pseudo = "An unnamed monkey";
	var socket = socket;
	var currentGame = null;

	var callbackStatus = function(){};
	//var statut = afk / busy / available /.....

	var that = this;

	console.log("::green::[User]::white:: > Create new user, socket id : "+ socket.id +", pseudo : "+pseudo);

	this.getId = function(){
		return socket.id;
	}
	this.getSocket = function(){
		return socket;
	}
	this.getPseudo = function() {
		return pseudo;
	}
	this.getCurrentGame = function(){
		return currentGame;
	}

	this.setPseudo = function(nv_pseudo){
		pseudo = nv_pseudo;
		console.log("::green::[User]::white:: > Update pseudo : user socket id : "+ socket.id +", pseudo : "+pseudo);
	}
	this.setCurrentGame = function(game) {
		currentGame = game;
		callbackStatus(that.getStatus());
	}

	/*get statut regarde dabord la game actuelle, si le gars est pas en game ca check le statut a modier*/
	this.getStatus = function() {
		if(!currentGame) 
			return 0;
		if(currentGame.name == "morpion")
			return 1;
		if(currentGame.name == "p4")
			return 2;
		return -1;
	}

	this.onStatus = function(callback) {
		var fct = callback || function(){};
		callbackStatus = fct;
	}

	this.setCurrentGame = function(game) {
		currentGame = game;
	}

	this.getCurrentGame = function(){
		return currentGame;
	}

	this.toObj = function() {
		return {id: socket.id, name: pseudo, status: that.getStatus()};
	}
}
module.exports = User;