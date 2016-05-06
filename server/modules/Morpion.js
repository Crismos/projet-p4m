function Morpion(id, user) {

	var players = [];
	players.push(user);
	var maxPlayer = 2;
	var id = id;
	var that = this;

	var SIZE = 3;
	var tokens = [];

	var playerWhoStarts;
	var player2;
	var nextPlayerWhoPlays;


	this.getId = function() {
		return id;
	}

	this.addPlayer = function(user) {
		if(players.length < maxPlayer && user.getCurrentGame()==null){
			players.push(user);
			user.setCurrentGame(this);
			console.log("::green::[Puissance]::white::"+players[1].getPseudo()+" viens de rejoindre la partie "+id+" de morpion/");
				if(players.length == 2){
					var that=this;
					setTimeout(function(){
			    		that.go();
					}, 200);
				}
			return true;
		}else{
			console.log("::red::Impossible de greffer ce joueur à la partie car la partie est pleine ou le joueur qui veut rejoindre appartient déjà à une partie.");
			return false;
		}		
	}
	this.removeUser = function(user){
		var index = players.indexOf(user);
		if(index > -1){
			players.splice(index, 1);
		}
		if(players.length == 1){
			//on le préviens que son adversaire s'est barré
			players[0].getSocket().emit("votre adversaire de morpion s'est barré");
		}
	}
	this.go = function() {
		tokens = [];
		for(var i=0; i<SIZE; i++) {
			tokens[i] = [];
			for(var j=0; j<SIZE; j++) {
				tokens[i][j] = -1;
			}
		}

		players[0].getSocket().removeAllListeners('morpion');
		players[1].getSocket().removeAllListeners('morpion');

		if(Math.random()<0.5){
			playerWhoStarts = players[0];
			player2 = players[1];
			nextPlayerWhoPlays = players[0];
		}else{
			playerWhoStarts = players[1];
			player2 = players[0];
			nextPlayerWhoPlays = players[1];
		}

		playerWhoStarts.getSocket().emit("morpion",{yourTurn:1,tokens: tokens,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
		player2.getSocket().emit("morpion",{yourTurn:0,tokens: tokens,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});

		players[0].getSocket().on("morpion", function(pos){
			if(!players[0]) return;
			if(nextPlayerWhoPlays != players[0]){
				console.log("Un joueur essaie de jouer mais ce n'est pas à son tour.");
				return;
			}
			addToken(pos,0);
			var winner = getWinner();
			if(winner != -1){
				if(winner != 2) {
					winner = players[winner].getPseudo();
				}
			}
			players[0].getSocket().emit("morpion",{yourTurn:0,tokens: tokens,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
			players[1].getSocket().emit("morpion",{yourTurn:1,tokens: tokens,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
			nextPlayerWhoPlays = players[1];
		});

		players[1].getSocket().on("morpion", function(pos){
			if(!players[1]) return;
			if(nextPlayerWhoPlays != players[1]){
				console.log("Un joueur essaie de jouer mais ce n'est pas à son tour.");
				return;
			}
			addToken(pos,1);

			var winner = getWinner();
			if(winner != -1){
				if(winner != 2) {
					winner = players[winner].getPseudo();
				}
			}
			players[0].getSocket().emit("morpion",{yourTurn:1,tokens: tokens,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
			players[1].getSocket().emit("morpion",{yourTurn:0,tokens: tokens,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
			nextPlayerWhoPlays = players[0];
		});

	}

	var addToken = function(pos, id) {
		tokens[pos[0]][pos[1]] = id;
	}

	var getWinner = function() {
		var full = true;
		for(var i=0; i<SIZE; i++) {
			for(var j=0; j<SIZE; j++) {
				if(tokens[i][j] == -1) {
					full = false;
				}
			}
		}
		if(full) {
			return 2;
		}
		for(var i=0; i<SIZE; i++) {
			if(tokens[i][0] == tokens[i][1] && tokens[i][0] == tokens[i][2] && tokens[i][0] >= 0)
				return tokens[i][0];
			if(tokens[0][i] == tokens[1][i] && tokens[0][i] == tokens[2][i] && tokens[0][i] >= 0)
				return tokens[0][i];
		}
		if(tokens[0][0] == tokens[1][1] && tokens[0][0] == tokens[2][2] && tokens[0][0] >= 0)
			return tokens[0][0];
		if(tokens[0][2] == tokens[1][1] && tokens[0][2] == tokens[2][0] && tokens[0][2] >= 0)
			return tokens[0][2];
		return -1;
	}

	this.getTypeGame = function(){
		return "morpion";
	}
	


}

module.exports = Morpion;