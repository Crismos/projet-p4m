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


var NUMBER_COLUMN = 7;
var canvas = document.getElementById("pcanvas");	
var ctx = canvas.getContext("2d");
var sizeCell = canvas.height/NUMBER_COLUMN;
var yourTurn = false;
var audio = new Audio('app/images/token.wav');
var canvasPosition = {x:0,y:0};
var tokens = [];
var backgroundCell = new Image();
backgroundCell.src = 'app/images/pcell.png';


function initializeGame(){
	resetPuissance();	
	requestAnimationFrame(drawPuissance);
}


function resetPuissance(){
	for(i = 0; i<NUMBER_COLUMN; i++){
		tokens[i] = []
		for(j = 0; j<NUMBER_COLUMN; j++){
			tokens[i][j] = null;
		}
	}
	yourTurn = false;
}


function drawPuissance(timestamp){	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#ecf0f1";
	ctx.fillRect(0,0,canvas.width, canvas.height)
	
	for(i = 0; i<NUMBER_COLUMN; i++){
		for(j = 0; j<NUMBER_COLUMN; j++){
			if(tokens[i][j] !=null){
				tokens[i][j].draw(timestamp);
			}
		}
	}
	for(i = 0; i<NUMBER_COLUMN; i++){
		for(j = 0; j<NUMBER_COLUMN; j++){
			ctx.drawImage(backgroundCell,i*sizeCell+canvasPosition.x,j*sizeCell+canvasPosition.y,sizeCell,sizeCell);
		}
	}
	requestAnimationFrame(drawPuissance);		
};


function playToken(column){
	for(i = 0; i<NUMBER_COLUMN; i++){
		if(tokens[column][i]==null){
			tokens[column][i] = new Token(column, i);
			return;
		}
	}
}


function getColumn(e){
	var rect = canvas.getBoundingClientRect();
	var x = ((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width) - canvasPosition.x;		
	var column = Math.floor(x/sizeCell);
	if(column<0 || column >(NUMBER_COLUMN-1)){
		return false
	}
	return column;
}


function Token(column,line){
	var column = column;
	var line = line;
	var x = column*sizeCell;
	var yStart = -sizeCell;
	var yFinal = sizeCell*NUMBER_COLUMN - line*sizeCell - sizeCell;
	var yTmp = yStart;
	var start = null;
	var progress = null;
	var duration = 800;
	var token = null;

	if(Token.count%2==0){
		token = Token.redToken;
	}else{
		token = Token.yellowToken;
	}
	Token.count++;

	this.draw = function(timestamp){
		if(start === - 1){
			ctx.drawImage(token,x+canvasPosition.x,yFinal+canvasPosition.y,sizeCell,sizeCell);
			return;
		}
		if(start===null) start = timestamp;
		progress = timestamp - start;
		ratio = progress / duration;
		if(progress>duration){
			start = -1;
			ctx.drawImage(token,x+canvasPosition.x,yFinal+canvasPosition.y,sizeCell,sizeCell);
			audio.play();
		}else{
			ctx.drawImage(token,x+canvasPosition.x,yStart+(yFinal-yStart)*ratio+canvasPosition.y,sizeCell,sizeCell);
		}		
	}
}
Token.redToken = new Image();
Token.redToken.src = 'app/images/redToken.png';
Token.yellowToken = new Image();
Token.yellowToken.src = 'app/images/yellowToken.png';
Token.count = 0;


$(document).ready(function() {
	$(document).off("click", "#pcanvas");
	$(document).on("click", "#pcanvas", function(e) {
		if(!yourTurn){
			return;
		}
		var column = getColumn(e);
		yourTurn = false;
		socket.getSocket().emit("puissance quatre",column);	
	});
});


if(!binded) {
	socket.getSocket().removeAllListeners("puissance quatre");

	socket.getSocket().on("puissance quatre", function(data){	
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
			$("#information").html(data.winner+" gagne la partie!");
		}
		if(data.column!=-1){
			playToken(data.column);
		}		
	});

	socket.getSocket().on("votre adversaire de puissance 4 a quitte la partie", function(){
		resetPuissance();
		$("#player2").html("");
		$("#information").html("Votre adversaire a quitté la partie<br /> Vous pouvez re-partager votre lien");
	});
}


initializeGame();
binded = true;