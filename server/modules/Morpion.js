function Morpion(id, user) {

	var players = [];
	players.push(user);
	var maxPlayer = 2;
	var id = id;


	this.getId = function() {
		return id;
	}

	this.addPlayer = function(user) {
		if(players.length < maxPlayer && user.getCurrentGame()==null){
			players.push(user);
			return true;
		}else{
			console.log("::red::Impossible de greffer ce joueur à la partie car la partie est pleine ou le joueur qui veut rejoindre appartient déjà à une partie");
			return false;
		}
	}	

	this.getTypeGame = function(){
		return "morpion";
	}


}

module.exports = Morpion;