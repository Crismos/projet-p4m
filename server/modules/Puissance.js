function Puissance(id, user) {

	var players = [];
	players.push(user);
	var maxPlayer = 2;
	var id = id;

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
			checkWinner();
			players[0].getSocket().emit("puissance quatre",{yourTurn:0,column:column});
			players[1].getSocket().emit("puissance quatre",{yourTurn:1,column:column});
		});

		players[1].getSocket().on("puissance quatre", function(column){
			if(!nextPlayerWhoPlays == players[1]){
				console.log("Un joueur essaie de jouer mais ce n'est pas à son tour.");
				return;
			}
			addToken(column,1);
			checkWinner();
			players[0].getSocket().emit("puissance quatre",{yourTurn:1,column:column});
			players[1].getSocket().emit("puissance quatre",{yourTurn:0,column:column});
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

	var checkWinner = function(){

		var pileColumn = [];
		var pileLine = [];
		var pileDiagonal = [];


		var i=0, j=0, w=0;
		for(i=0;i<4;i++){
			pileDiagonal[i] = [];
		}
		//lignes & colonnes
		for(i=0;i<7;i++){
			for(j=0;j<7;j++){
				if(tokens[i][j] != null){				

					if(tokens[i][j]!=pileColumn[pileColumn.length-1]){
						pileColumn = [];
						console.log("reset"+pileColumn.length);
						pileColumn.push(tokens[i][j]);
					}else{
						pileColumn.push(tokens[i][j]);
					}
					if(pileColumn.length == 4){
						console.log("Puissance 4 colonne pour joueur "+pileColumn[pileColumn.length-1]);
						return;
					}

				}else{
					pileColumn = [];
				}
				if(tokens[j][i] != null){					

					if(tokens[j][i]!=pileLine[pileLine.length-1]){
						pileLine = [];
						console.log("reset"+pileColumn.length);
						pileLine.push(tokens[j][i]);
					}else{
						pileLine.push(tokens[j][i]);
					}
					if(pileLine.length == 4){
						console.log("Puissance 4 ligne pour joueur "+pileLine[pileLine.length-1]);
						return;
					}	

				}else{
					pileLine = [];
				}				
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
				check(pileDiagonal[i]);
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
					console.log("Puissance 4 diago pour joueur "+pile[pile.length-1]);
				}

			}
		}

	}
			
}

module.exports = Puissance;