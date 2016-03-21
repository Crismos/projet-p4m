function Puissance(id, user) {

	var players = [];
	players.push(user);
	var maxPlayer = 2;
	var id = id;

	var tokens = [];
	var playerWhoStarts;
	var player2;
	var nextPlayerWhoPlays;
	
	//initialisation de la grille du morpion
	for(i = 0; i<7; i++){
		tokens[i] = []
		for(j = 0; j<7; j++){
			tokens[i][j] = null;
		}
	}


	this.getId = function() {
		return id;
	}

	this.addPlayer = function(user) {
		if(players.length < maxPlayer && user.getCurrentGame()==null){
			players.push(user);
			return true;
		}else{
			console.log("Impossible de greffer ce joueur à la partie car la partie est pleine ou le joueur qui veut rejoindre appartient déjà à une partie");
			return false;
		}		
	}

	this.getTypeGame = function(){
		return "p4";
	}

	this.go = function(){
		//randomisation du joueur qui commence
		if(Math.random()<0.5){
			console.log("la ma geule");
			playerWhoStarts = players[0];
			player2 = players[1];
			nextPlayerWhoPlays = players[0];
		}else{
			console.log("et ici");
			playerWhoStarts = players[1];
			player2 = players[0];
			nextPlayerWhoPlays = players[1];
		}
		console.log(players[0].getId()+"/"+players[1].getId());
		playerWhoStarts.getSocket().emit("puissance quatre",{yourTurn:1,column:-1});
		player2.getSocket().emit("puissance quatre",{yourTurn:0,column:-1});

		players[0].getSocket().on("puissance quatre", function(column){
			if(!nextPlayerWhoPlays == players[0]){
				console.log("Un joueur essaie de jouer mais ce n'est pas à son tour.");
				return;
			}
			addToken(column,0);
			players[0].getSocket().emit("puissance quatre",{yourTurn:0,column:column});
			players[1].getSocket().emit("puissance quatre",{yourTurn:1,column:column});
		});

		players[1].getSocket().on("puissance quatre", function(column){
			if(!nextPlayerWhoPlays == players[1]){
				console.log("Un joueur essaie de jouer mais ce n'est pas à son tour.");
				return;
			}
			addToken(column,1);
			players[0].getSocket().emit("puissance quatre",{yourTurn:1,column:column});
			players[1].getSocket().emit("puissance quatre",{yourTurn:0,column:column});
		});
	}
	//player[0] jeton = 0
	//player[1] jeton = 1
	var addToken = function(column, token){
		for(i = 0; i<7; i++){
			if(tokens[column][i]==null){
				tokens[column][i] = token;
				return;
			}
		}
	}
}

module.exports = Puissance;