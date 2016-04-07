function Puissance(id, user) {

	var players = [];
	players.push(user);
	console.log("::green::[Puissance]::white::La partie "+id+" de p4 vient d'être créé par "+players[0].getPseudo()+".");
	var maxPlayer = 2;
	var id = id;
	var active = true;
	var tokens = [];
	var playerWhoStarts;
	var player2;
	var nextPlayerWhoPlays;
	var i = 0;
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
			user.setCurrentGame(this);
			console.log("::green::[Puissance]::white::"+players[1].getPseudo()+" viens de rejoindre la partie "+id+" de p4/");
			
			return true;
		}else{
			console.log("::red::Impossible de greffer ce joueur à la partie car la partie est pleine ou le joueur qui veut rejoindre appartient déjà à une partie.");
			return false;
		}		
	}

	this.getTypeGame = function(){
		return "p4";
	}
	this.removeUser = function(user){
		active = false;
		var index = players.indexOf(user);
		if(index > -1){
			players.splice(index, 1);
		}
	}

	this.go = function(){
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

		playerWhoStarts.getSocket().emit("puissance quatre",{yourTurn:1,column:-1,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
		player2.getSocket().emit("puissance quatre",{yourTurn:0,column:-1,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});

		players[0].getSocket().on("puissance quatre", function(column){
			if(!active) return;
			if(!nextPlayerWhoPlays == players[0]){
				console.log("Un joueur essaie de jouer mais ce n'est pas à son tour.");
				return;
			}
			addToken(column,0);
			var winner = getWinner();
			if(winner != -1){
				winner = players[winner].getPseudo();
			}
			players[0].getSocket().emit("puissance quatre",{yourTurn:0,column:column,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
			players[1].getSocket().emit("puissance quatre",{yourTurn:1,column:column,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
		});

		players[1].getSocket().on("puissance quatre", function(column){
			if(!active) return;
			if(!nextPlayerWhoPlays == players[1]){
				console.log("Un joueur essaie de jouer mais ce n'est pas à son tour.");
				return;
			}
			addToken(column,1);

			var winner = getWinner();
			if(winner != -1){
				winner = players[winner].getPseudo();
			}
			players[0].getSocket().emit("puissance quatre",{yourTurn:1,column:column,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
			players[1].getSocket().emit("puissance quatre",{yourTurn:0,column:column,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
		});
	}
	//player[0] jeton = 0
	//player[1] jeton = 1
	var addToken = function(column, token){
		var i = 0;
		for(i = 0; i<7; i++){
			if(tokens[column][i]==null){
				tokens[column][i] = token;
				return;
			}
		}
	}

	//-1 partie pas terminée
	//0 joueur 0 qui win
	//1 joueur 1 qui gagne
	var getWinner = function(){
		var i=0, j=0, w=0;
		var pileColumn = [];
		var pileLine = [];
		var pileDiagonal = [];
		var result;
		for(i=0;i<4;i++){
			pileDiagonal[i] = [];
		}

		//lignes & colonnes
		for(i=0;i<7;i++){
			for(j=0;j<7;j++){
				pileColumn.push(tokens[i][j]);
				pileLine.push(tokens[j][i]);				
			}
			result = check(pileColumn)
			if(result!=-1){
				return result;
			}
			result = check(pileLine)
			if(result!=-1){
				return result;
			}
			pileColumn = [];
			pileLine = [];
		}
		//diagonales7
		for(w=1;w<8;w++){
		  	for(i=0;i<w;i++){
		    	for(j=0;j<w;j++){
		      		if((i+j)==(w-1)){
		          		pileDiagonal[0].push(tokens[i][j]);
		          		pileDiagonal[1].push(tokens[6-i][6-j]);
		         		pileDiagonal[2].push(tokens[i][6-j]);
		        		pileDiagonal[3].push(tokens[6-i][j]);
		        	}
		     	}

		    }
		    for(i=0;i<4;i++){	
		    	result = check(pileDiagonal[i])
				if(result!=-1){
					return result;
				}
			}		  		 
			for(i=0;i<4;i++){
				pileDiagonal[i] = [];
			}	  
		}
		function check(pile){
			var p4 = [];
			var i =0;
			for(i=0;i<pile.length;i++){
				if(pile[i]==null){
					p4 = [];
					continue;
				}
				if(p4.length == 0){
					p4.push(pile[i]);
					continue;
				}
				if(pile[i]!=p4[p4.length-1]){
					p4 = [];
					p4.push(pile[i]);
					continue;
				}
				p4.push(pile[i]);
				if(p4.length==4){
					console.log("::green::[Puissance]::white::Puissance 4");
					return p4[p4.length-1];
				}

			}
			return -1;
		}

		return -1;

	}
			
}

module.exports = Puissance;