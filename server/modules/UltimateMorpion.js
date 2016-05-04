function Puissance(id, user) {

	var players = [];
	players.push(user);
	console.log("::green::[Puissance]::white::La partie "+id+" d'ultimate morpion vient d'être créé par "+players[0].getPseudo()+".");
	var maxPlayer = 2;
	var id = id;

	var matrix = [];
	var playerWhoStarts;
	var player2;
	var nextPlayerWhoPlays;
	var i = 0;



	this.getId = function() {
		return id;
	}

	this.addPlayer = function(user) {
		if(players.length < maxPlayer && user.getCurrentGame()==null){
			players.push(user);
			user.setCurrentGame(this);
			console.log("::green::[Puissance]::white::"+players[1].getPseudo()+" viens de rejoindre la partie "+id+" d'ultimateMorpion");
				if(players.length == 2){
					var that=this;
					setTimeout(function(){
			    		that.go();
					}, 200);
					//this.go();
				}
			return true;
		}else{
			console.log("::red::Impossible de greffer ce joueur à la partie car la partie est pleine ou le joueur qui veut rejoindre appartient déjà à une partie.");
			return false;
		}		
	}

	this.getTypeGame = function(){
		return "ultimateMorpion";
	}
	this.removeUser = function(user){
		var index = players.indexOf(user);
		if(index > -1){
			players.splice(index, 1);
		}
		if(players.length == 1){
			//on le préviens que son adversaire s'est barré
			players[0].getSocket().emit("votre adversaire de puissance 4 s'est barré");
		}
	}

	this.go = function(){
		
		//initialisation de la grille du morpion
		for(i = 0; i<9; i++){
			matrix[i] = []
			for(j = 0; j<9; j++){
				matrix[i][j] = null;
			}
		}
		players[0].getSocket().removeAllListeners('ultimateMorpion');
		players[1].getSocket().removeAllListeners('ultimateMorpion');
		//randomisation du joueur qui commence
		console.log("::green::[Puissance]::white::La partie "+id+" de p4 commence avec "+players[0].getPseudo()+" et "+players[1].getPseudo()+".");
		if(Math.random()<0.5){
			playerWhoStarts = players[0];
			player2 = players[1];
			nextPlayerWhoPlays = players[0];
		}else{
			playerWhoStarts = players[1];
			player2 = players[0];
			nextPlayerWhoPlays = players[1];
		}

		playerWhoStarts.getSocket().emit("ultimateMorpion",{yourTurn:1,matrix:matrix,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
		player2.getSocket().emit("ultimateMorpion",{yourTurn:0,matrix:matrix,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});


		players[0].getSocket().on("ultimateMorpion", function(pos){
			if(!players[0]) return;
			if(!nextPlayerWhoPlays == players[0]){
				console.log("Un joueur essaie de jouer mais ce n'est pas à son tour.");
				return;
			}
			play(pos.x, pos.y, 0);
			//var winner = getWinner();
			/*if(winner != -1){
				winner = players[winner].getPseudo();
			}*/
			players[0].getSocket().emit("ultimateMorpion",{yourTurn:0,matrix:matrix,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
			players[1].getSocket().emit("ultimateMorpion",{yourTurn:1,matrix:matrix,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
		});

		players[1].getSocket().on("ultimateMorpion", function(pos){
			if(!players[1]) return;
			if(!nextPlayerWhoPlays == players[1]){
				console.log("Un joueur essaie de jouer mais ce n'est pas à son tour.");
				return;
			}
			play(pos.x, pos.y,1)

			/*var winner = getWinner();
			if(winner != -1){
				winner = players[winner].getPseudo();
			}*/
			players[0].getSocket().emit("ultimateMorpion",{yourTurn:1,matrix:matrix,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
			players[1].getSocket().emit("ultimateMorpion",{yourTurn:0,matrix:matrix,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
		});
	}

	var play = function(x, y, b){
		if(b){
			matrix[x][y] = b;
		}else{
			matrix[x][y] = 0;
		}
	}

	var getWinner = function(){
		

	}
			
}

module.exports = Puissance;