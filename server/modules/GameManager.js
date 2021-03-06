var _Morpion = require("./Morpion.js");
var _Puissance = require("./Puissance.js");
var _UltimateMorpion = require("./UltimateMorpion.js");

exports.gameManager = function() {

	var games = {};

	this.createPuissanceQuatre = function(user) {
		if(user.getCurrentGame()!=null){
			console.log("::red::[GameManger]::white::Impossible de créer une partie car l'utilisateur est déjà dans une partie."+id);
			return false;
		}

		var id = generateId();
		console.log("::green::[GameManger]::white::création d'une partie de p4, id généré : "+id+".");
		games[id] = new _Puissance(id, user);
		user.setCurrentGame(games[id]);

		return games[id];
	}

	this.createMorpion = function(user) {
		if(user.getCurrentGame()!=null){
			console.log("::red::[GameManger]::white::Impossible de créer une partie car l'utilisateur est déjà dans une partie."+id);
			return false;
		}


		var id = generateId();		
		console.log("::green::[GameManger]::white::création d'une partie de morpion, id généré : "+id+".");
		games[id] = new _Morpion(id, user);
		user.setCurrentGame(games[id]);

		return games[id];
	}

	this.createUltimateMorpion = function(user) {
		if(user.getCurrentGame()!=null){
			console.log("::red::[GameManger]::white::Impossible de créer une partie car l'utilisateur est déjà dans une partie."+id);
			return false;
		}

		var id = generateId();
		console.log("::green::[GameManger]::white::création d'une partie de p4, id généré : "+id+".");
		games[id] = new _UltimateMorpion(id, user);
		user.setCurrentGame(games[id]);

		return games[id];
	}

	this.getGame = function(idGame) {
		if(games[idGame]!=null){
			return games[idGame];
		}else{
			return 0;
		}
		
	}

	//fonctions privés utilisés uniquement dans cet objet
	var generateId = function(){
		var id = Math.floor(Math.random()*99999999999);
		while(games[id]!=null){
			id = Math.floor(Math.random()*99999999999);
		}
		return id;
	}

	var isAvailable = function(user){
		if(user.getCurrentGame()!=null){
			console.log("Impossible de créer la partie car le joueur appartient déjà à une partie.");
			return false;
		}
		return true;
	}
}
