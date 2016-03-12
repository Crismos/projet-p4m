function Puissance(id) {
	this.type = "p4";

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

module.exports = Puissance;