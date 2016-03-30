function Morpion(id) {

	this.type = "morpion";
	var players = [];
	var maxPlayer = 2;

	var id = id;

	this.getId = function() {
		return id;
	}
	this.addPlayer = function(user) {
		if(players.length < maxPlayer){
			players.push(user);
			return true;
		}
		return false;
	}
	
}
module.exports = Morpion;