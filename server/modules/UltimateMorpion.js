function Puissance(id, user) {

	var players = [];
	players.push(user);
	console.log("::green::[UltimateMorpion]::white::La partie "+id+" d'ultimate morpion vient d'être créé par "+players[0].getPseudo()+".");
	var maxPlayer = 2;
	var id = id;

	var matrix = [];
	var matrixGlobal = [];
	var playerWhoStarts;
	var player2;
	var nextPlayerWhoPlays;
	var i = 0;
	var previous = {x:-1,y:-1};
	var v,w,z;


	this.getId = function() {
		return id;
	}

	this.addPlayer = function(user) {
		if(players.length < maxPlayer && user.getCurrentGame()==null){
			players.push(user);
			user.setCurrentGame(this);
			console.log("::green::[UltimateMorpion]::white::"+user.getPseudo()+" viens de rejoindre la partie "+id+" d'ultimateMorpion");
				if(players.length == 2){
					var that=this;
					setTimeout(function(){
			    		that.go();
					}, 200);
					//this.go();
				}
			return true;
		}else{
			console.log("::red::[UltimateMorpion]::white::Impossible de greffer ce joueur à la partie car la partie est pleine ou le joueur qui veut rejoindre appartient déjà à une partie.");
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
			players[0].getSocket().emit("votre adversaire d'ultimate morpion a quitté la partie");
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
		for(i = 0; i<3; i++){
			matrixGlobal[i] = []
			for(j = 0; j<3; j++){
				matrixGlobal[i][j] = 2;
			}
		}
		players[0].getSocket().removeAllListeners('ultimateMorpion');
		players[1].getSocket().removeAllListeners('ultimateMorpion');
		//randomisation du joueur qui commence
		console.log("::green::[ultimateMorpion]::white::La partie "+id+" d'ultimateMorpion commence avec "+players[0].getPseudo()+" et "+players[1].getPseudo()+".");
		if(Math.random()<0.5){
			playerWhoStarts = players[0];
			player2 = players[1];
			nextPlayerWhoPlays = players[0];
		}else{
			playerWhoStarts = players[1];
			player2 = players[0];
			nextPlayerWhoPlays = players[1];
		}

		playerWhoStarts.getSocket().emit("ultimateMorpion",{yourTurn:1,previous:previous,matrix:matrix,matrixGlobal:matrixGlobal,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
		player2.getSocket().emit("ultimateMorpion",{yourTurn:0,previous:previous,matrix:matrix,matrixGlobal:matrixGlobal,winner:-1,player1:players[0].getPseudo(),player2:players[1].getPseudo()});


		players[0].getSocket().on("ultimateMorpion", function(pos){
			if(!players[0]) return;
			if(nextPlayerWhoPlays != players[0]){
				console.log("::red::[UltimateMorpion]::white::Un joueur tente de jouer mais ce n'est pas à son tour.");	
				return;
			}
			if(matrixGlobal[Math.floor(pos.x/3)][Math.floor(pos.y/3)]!=2){
				console.log("::red::[UltimateMorpion]::white::Le joueur ne peut pas jouer à cet endroit (x="+Math.floor(pos.x/3)+",y="+Math.floor(pos.y/3)+"), code erreur : "+matrixGlobal[Math.floor(pos.x/3)][Math.floor(pos.y/3)]);
				return
			}
			if(matrix[pos.x][pos.y]!=null){
				console.log("::red::[UltimateMorpion]::white::La case à déjà été joué");
				return
			}
			play(pos.x, pos.y, 0);
		});

		players[1].getSocket().on("ultimateMorpion", function(pos){
			if(!players[1]) return;
			if(nextPlayerWhoPlays != players[1]){
				console.log("::red::[UltimateMorpion]::white::Un joueur tente de jouer mais ce n'est pas à son tour.");	
				return;
			}
			if(matrixGlobal[Math.floor(pos.x/3)][Math.floor(pos.y/3)]!=2){
				console.log("::red::[UltimateMorpion]::white::Le joueur ne peut pas jouer à cet endroit (x="+Math.floor(pos.x/3)+",y="+Math.floor(pos.y/3)+"), code erreur : "+matrixGlobal[Math.floor(pos.x/3)][Math.floor(pos.y/3)]);
				return
			}	
			if(matrix[pos.x][pos.y]!=null){
				console.log("::red::[UltimateMorpion]::white::La case à déjà été joué");
				return
			}	
			play(pos.x, pos.y,1)
		});
	}

	var play = function(x, y, b){

		var xgrill = Math.floor(x/3);
		var ygrill = Math.floor(y/3);
		
		if(
			previous.x == -1 || //debut de partie
			matrixGlobal[previous.x][previous.y] == -1 || //grille complété mais pas gagné
			matrixGlobal[previous.x][previous.y] == 0  || //grille gagné par 0
			matrixGlobal[previous.x][previous.y] == 1  || //grille gagné par 1
			(Math.floor(x/3) == previous.x && Math.floor(y/3) == previous.y)){		

			previous.x = Math.floor(x%3);
			previous.y = Math.floor(y%3);	
				

			if(b){
				matrix[x][y] = b;
				updateMatrixGlobal(xgrill,ygrill);	
				var winner = getWinner();
				if(winner != -1 && winner != 444){
					winner = players[winner].getPseudo()+" gagne la partie!";	
					console.log("::green::[UltimateMorpion]::white::"+winner);
				}
				if(winner == 444){
					winner = "Match nul!";
					console.log("::green::[UltimateMorpion]::white::Match Nul!");
				}
				players[0].getSocket().emit("ultimateMorpion",{yourTurn:1,matrix:matrix,matrixGlobal:matrixGlobal,previous:previous,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
				players[1].getSocket().emit("ultimateMorpion",{yourTurn:0,matrix:matrix,matrixGlobal:matrixGlobal,previous:previous,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
				nextPlayerWhoPlays = players[0];
			}else{
				matrix[x][y] = 0;
				updateMatrixGlobal(xgrill,ygrill);
				var winner = getWinner();
				if(winner != -1 && winner != 444){
					winner = players[winner].getPseudo()+" gagne la partie";	
					console.log("::green::[UltimateMorpion]::white::"+winner);
				}
				if(winner == 444){
					winner = "Match nul";
					console.log("::green::[UltimateMorpion]::white::Match Nul!");
				}

				players[0].getSocket().emit("ultimateMorpion",{yourTurn:0,matrix:matrix,matrixGlobal:matrixGlobal,previous:previous,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
				players[1].getSocket().emit("ultimateMorpion",{yourTurn:1,matrix:matrix,matrixGlobal:matrixGlobal,previous:previous,winner:winner,player1:players[0].getPseudo(),player2:players[1].getPseudo()});
				nextPlayerWhoPlays = players[1];
				
			}


		}else{
			console.log("::red::[UltimateMorpion]::white::Le joueur ne peut pas jouer à cet endroit");
		}
	}

	var getWinner = function(){
		var joueur0 = 0;
		var joueur1 = 0;
		var canceled = 0;
		var grilleTmp;

		for(z=0;z<3;z++){			
			if(matrixGlobal[z][0] == matrixGlobal[z][1] && matrixGlobal[z][0] == matrixGlobal[z][2] && (matrixGlobal[z][0]==0 || matrixGlobal[z][0]==1)){
				return matrixGlobal[z][0];
			}
			if(matrixGlobal[0][z] == matrixGlobal[1][z] && matrixGlobal[0][z] == matrixGlobal[2][z] && (matrixGlobal[0][z]==0 || matrixGlobal[0][z]==1)){
				return matrixGlobal[0][z];
			}
		}

		if(matrixGlobal[0][0] == matrixGlobal[1][1] && matrixGlobal[0][0] == matrixGlobal[2][2] && (matrixGlobal[0][0] == 0 || matrixGlobal[0][0] == 1)){
			return matrixGlobal[0][0];
		}
		if(matrixGlobal[0][2] == matrixGlobal[1][1] && matrixGlobal[0][2] == matrixGlobal[2][0] && (matrixGlobal[1][1] == 0 || matrixGlobal[1][1] == 1)){			
			return matrixGlobal[1][1];
		}

		for(z=0;z<3;z++){
			for(v=0;v<3;v++){
				if(matrixGlobal[z][v] == 0){
					joueur0++;
				}else if(matrixGlobal[z][v]==1){
					joueur1++;
				}else if(matrixGlobal[z][v]==-1){
					canceled++;
				}
			}
		}
		if(joueur0>(9-canceled)/2){
			return 0
		}
		if(joueur1>(9-canceled)/2){
			return 1
		}

		if(joueur0+joueur1+canceled == 9){
			return 444;
		}

		return -1;

	}

	/*
	return 2 si le joueur peut jouer
	return 1 si le joueur 1 remporte cette mini grille
	return 0 si le joueur 0 remporte cette minu grille
	return -1 si la grille est complète mais sans ligne
	*/
	var updateMatrixGlobal = function(xgrill, ygrill){
		
		var xdepart = 3*xgrill;
		var ydepart = 3*ygrill;

		for(z=0;z<3;z++){
			if(matrix[xdepart+z][ydepart] == matrix[xdepart+z][ydepart+1] && matrix[xdepart+z][ydepart] == matrix[xdepart+z][ydepart+2] && matrix[xdepart+z][ydepart]!=null){
				matrixGlobal[xgrill][ygrill] = matrix[xdepart+z][ydepart];
				return;
			}
			if(matrix[xdepart][ydepart+z] == matrix[xdepart+1][ydepart+z] && matrix[xdepart][ydepart+z] == matrix[xdepart+2][ydepart+z] && matrix[xdepart][ydepart+z]!=null){
				matrixGlobal[xgrill][ygrill] = matrix[xdepart][ydepart+z];
				return;
			}
		}

		if(matrix[xdepart][ydepart] == matrix[xdepart+1][ydepart+1] && matrix[xdepart][ydepart] == matrix[xdepart+2][ydepart+2] && matrix[xdepart][ydepart]!=null){
			matrixGlobal[xgrill][ygrill] = matrix[xdepart][ydepart];
			return;
		}
		if(matrix[xdepart][ydepart+2] == matrix[xdepart+1][ydepart+1] && matrix[xdepart][ydepart+2]  == matrix[xdepart+2][ydepart] && matrix[xdepart][ydepart+2]!=null){
			matrixGlobal[xgrill][ygrill] = matrix[xdepart+1][ydepart+1];
			return;
		}

		for(v=xgrill*3;v<(xgrill+1)*3;v++){
			for(w=ygrill*3;w<(ygrill+1)*3;w++){
				if(matrix[v][w]==null){
					return;
				}
			}
		}

		matrixGlobal[xgrill][ygrill] = -1;
	}
			
}

module.exports = Puissance;