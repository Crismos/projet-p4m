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
	console.log(top);
}
 
resize();
window.onresize = function() {
 	resize();
};

//$("#player1").html(localStorage.name);
var i,j;
var NUMBER_CELL = 9;
var canvas = document.getElementById("umcanvas");	
var ctx = canvas.getContext("2d");
var sizeCell = canvas.height/NUMBER_CELL;
var yourTurn = false;
//var audio = new Audio('token.wav');
var canvasPosition = {x:0,y:0};
var matrix = null;
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
	matrix = [];
	for(i = 0; i<NUMBER_CELL; i++){
		matrix[i] = []
		for(j = 0; j<NUMBER_CELL; j++){
			matrix[i][j] = -1;
		}
	}
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
		for(j = 0; j<NUMBER_CELL; j++){
			if(matrix[i][j] === 0){
				ctx.drawImage(crossToken,i*sizeCell+canvasPosition.x,j*sizeCell+canvasPosition.y,sizeCell,sizeCell);
			} else if(matrix[i][j] === 1) {
				ctx.drawImage(circleToken,i*sizeCell+canvasPosition.x,j*sizeCell+canvasPosition.y,sizeCell,sizeCell);
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
	console.log("position : {x:"+column+", y: "+line+"}");
	if(column<0 || column >(NUMBER_CELL-1)){
		return false
	}
	if(line<0 || line >(NUMBER_CELL-1)){
		return false
	}
	console.log("yep");
	var pos = {x:column, y:line};
	return pos;
}
initializeUltimate();

$(document).ready(function() {
	$(document).off("click", "#umcanvas");
	$(document).on("click", "#umcanvas", function(e) {
		console.log("click");
		//play(e);
		if(!yourTurn){
			return;
		}
		var pos = getPosUltimate(e);
		if(matrix[pos.x][pos.y] != null) {
			console.log('cette case est déjà jouée');
			return;
		}
		yourTurn = false;
		console.log("buonk,lm;ù"+pos);
		socket.getSocket().emit("ultimateMorpion",pos);	
	});
});



if(!binded) {
	socket.getSocket().removeAllListeners("ultimateMorpion");
	socket.getSocket().on("ultimateMorpion", function(data){	
		console.log("reception cote client");
		yourTurn = data.yourTurn;
		if(yourTurn){
			$("#information").html("A vous de joueur !");
		}else{
			$("#information").html("A votre adversaire !");
		}
		$("#player1").html(data.player1);
		$("#player2").html(data.player2);
		console.log("winner ? "+data.winner);
		if(data.winner!=-1){
			yourTurn = false;
			if(data.winner != 2) {
				$("#information").html(data.winner+" gagne la partie.");
			} else {
				$("#information").html("Match nul!");
			}
			
		}
		matrix = data.matrix;		
	});

	socket.getSocket().on("votre adversaire de morpion s'est barré", function(){
		resetUltimate();
		$("#player2").html("");
		$("#information").html("Votre adversaire s'est barré.<br /> Vous pouvez re-partager votre lien.");
	});
}




binded = true;