var binded = false;


function resize(){
	var height = $(document).height();
	var top = (height-$("canvas").height()) / 2;
	var width = $(document).width();
	var left = (width-($("canvas").width()+250))/2;
	$(".loader").css("top", top);

	$("#gameInfos").css("margin-left", $("canvas").width());
	$("canvas").css("left", left);
	$("#gameInfos").css("left", left);
} 
resize();
window.onresize = function() {
 	resize();
};


var i,j;
var NUMBER_CELL = 9;
var canvas = document.getElementById("umcanvas");	
var ctx = canvas.getContext("2d");
var sizeCell = canvas.height/NUMBER_CELL;
var yourTurn = false;
var canvasPosition = {x:0,y:0};
var matrix = [];
var matrixGlobal = [];
var previous = {x:-1,y:-1};
var backgroundCell = new Image();
backgroundCell.src = 'app/images/mcell.png';
var crossToken = new Image();
crossToken.src = 'app/images/crossToken.png';
var circleToken = new Image();
circleToken.src = 'app/images/circleToken.png';


function initializeUltimate(){
	resetUltimate();
	requestAnimationFrame(drawUltimate);	
}


function resetUltimate(){
	for(i = 0; i<NUMBER_CELL; i++){
		matrix[i] = []
		for(j = 0; j<NUMBER_CELL; j++){
			matrix[i][j] = null;
		}
	}
	for(i = 0; i<3; i++){
		matrixGlobal[i] = []
		for(j = 0; j<3; j++){
			matrixGlobal[i][j] = 2;
		}
	}
	previous = {x:-1,y:-1};
	yourTurn = false;
}


function drawUltimate(timestamp){		
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#ecf0f1";
	ctx.fillRect(0,0,canvas.width, canvas.height);

	for(i = 0; i<NUMBER_CELL; i++){
		for(j = 0; j<NUMBER_CELL; j++){
			ctx.drawImage(backgroundCell,i*sizeCell+canvasPosition.x,j*sizeCell+canvasPosition.y,sizeCell,sizeCell);
		}
	}
	for(i = 0; i<NUMBER_CELL; i++){
		if(previous.x != -1 && matrixGlobal[previous.x][previous.y] != 2){
			break;
		}
		for(j = 0; j<NUMBER_CELL; j++){
			if((previous.x != -1 && (Math.floor(i/3) != previous.x || Math.floor(j/3) != previous.y)) && yourTurn){
				ctx.fillStyle = "rgba(0,0,0,0.3)";
				ctx.fillRect(i*sizeCell+canvasPosition.x,j*sizeCell+canvasPosition.y,sizeCell,sizeCell);
			}	
		}
	}
	for(i = 0; i<NUMBER_CELL; i++){
		for(j = 0; j<NUMBER_CELL; j++){
			if(matrix[i][j] === 0){
				ctx.drawImage(crossToken,i*sizeCell+canvasPosition.x,j*sizeCell+canvasPosition.y,sizeCell,sizeCell);
			} else if(matrix[i][j] === 1) {
				ctx.drawImage(circleToken,i*sizeCell+canvasPosition.x,j*sizeCell+canvasPosition.y,sizeCell,sizeCell);
			}
		}
	}
	for(i = 0; i<3; i++){
		for(j = 0; j<3; j++){
			if(matrixGlobal[i][j]==1){
				ctx.fillStyle = "rgba(0,0,0,0.6)";
				ctx.fillRect(i*3*sizeCell+canvasPosition.x,j*3*sizeCell+canvasPosition.y,sizeCell*3,sizeCell*3);
				ctx.drawImage(circleToken,i*3*sizeCell+canvasPosition.x,j*3*sizeCell+canvasPosition.y,sizeCell*3,sizeCell*3);
			}	
			if(matrixGlobal[i][j]==0){
				ctx.fillStyle = "rgba(0,0,0,0.6)";
				ctx.fillRect(i*3*sizeCell+canvasPosition.x,j*3*sizeCell+canvasPosition.y,sizeCell*3,sizeCell*3);
				ctx.drawImage(crossToken,i*3*sizeCell+canvasPosition.x,j*3*sizeCell+canvasPosition.y,sizeCell*3,sizeCell*3);
			}	
			if(matrixGlobal[i][j]==-1){
				ctx.fillStyle = "rgba(0,0,0,0.6)";
				ctx.fillRect(i*3*sizeCell+canvasPosition.x,j*3*sizeCell+canvasPosition.y,sizeCell*3,sizeCell*3);
			}	
		}
	}
	ctx.lineWidth = 3;
	for(j = 1; j<NUMBER_CELL; j++){
		ctx.beginPath();
		ctx.moveTo(j*3*sizeCell+canvasPosition.x,canvasPosition.y);
		ctx.lineTo(j*3*sizeCell+canvasPosition.x,9*sizeCell+canvasPosition.y);
		ctx.stroke();
	}
	for(j = 1; j<NUMBER_CELL; j++){
		ctx.beginPath();
		ctx.moveTo(canvasPosition.x,j*3*sizeCell+canvasPosition.y);
		ctx.lineTo(9*sizeCell+canvasPosition.x,j*3*sizeCell+canvasPosition.y);
		ctx.stroke();
	}	
	requestAnimationFrame(drawUltimate);	
};


function getPosUltimate(e){
	var rect = canvas.getBoundingClientRect();
	var x = ((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width) - canvasPosition.x;	
	var y = ((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height) - canvasPosition.y;		
	var column = Math.floor(x/sizeCell);
	var line = Math.floor(y/sizeCell);

	if(column<0 || column >(NUMBER_CELL-1)){
		return false
	}
	if(line<0 || line >(NUMBER_CELL-1)){
		return false
	}
	var pos = {x:column, y:line};
	return pos;
}


$(document).ready(function() {
	$(document).off("click", "#umcanvas");
	$(document).on("click", "#umcanvas", function(e) {
		
		var pos = getPosUltimate(e);
		socket.getSocket().emit("ultimateMorpion",pos);	
	});

});

if(!binded) {
	socket.getSocket().removeAllListeners("ultimateMorpion");
	socket.getSocket().on("ultimateMorpion", function(data){	

		yourTurn = data.yourTurn;
		if(yourTurn){
			$("#information").html("A vous de joueur !");
		}else{
			$("#information").html("A votre adversaire !");
		}

		$("#player1").html(data.player1);
		$("#player2").html(data.player2);

		if(data.winner!=-1){
			yourTurn = false;
			$("#information").html(data.winner);
		}

		matrix = data.matrix;
		matrixGlobal = data.matrixGlobal;	
		previous = data.previous;	
	});

	socket.getSocket().on("votre adversaire d'ultimate morpion a quitté la partie", function(){
		resetUltimate();
		$("#player2").html("");
		$("#information").html("Votre adversaire a quitté la partie<br /> Vous pouvez re-partager votre lien");
	});
}

initializeUltimate();
binded = true;