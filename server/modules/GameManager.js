var _Morpion = require("./Morpion.js");
var _Puissance = require("./Puissance.js");

function GameManager() {

	var games = {};

	this.addGame = function(gameName) {
		var id = Math.floor(Math.random()*99999999999);
		var game;

		switch(gameName) {
			case "p4": game = new _Puissance(id); break;
			case "morpion": game = new _Morpion(id); break;
			default: return null; break;
		}

		games[id] = game;

		return game;
	}
	this.getGame = function(idGame) {
		return games[idGame];
	}

}

module.exports = GameManager;