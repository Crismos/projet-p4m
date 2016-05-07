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


var DIM = 3;
var canvas = document.getElementById("mcanvas");	
var ctx = canvas.getContext("2d");
var sizeCell = canvas.height/DIM;
var yourTurn = false;
var canvasPosition = {x:0,y:0};
var m_tokens = [];
var backgroundCell = new Image();
backgroundCell.src = 'app/images/mcell.png';
var crossToken = new Image();
crossToken.src = 'app/images/crossToken.png';
var circleToken = new Image();
circleToken.src = 'app/images/circleToken.png';


function initializeGame(){
	resetMorpion();
	requestAnimationFrame(drawMorpion);
}


function resetMorpion(){
	for(i = 0; i<DIM; i++){
		m_tokens[i] = []
		for(j = 0; j<DIM; j++){
			m_tokens[i][j] = -1;
		}
	}
	yourTurn = false;
}


function drawMorpion(timestamp){	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#ecf0f1";
	ctx.fillRect(0,0,canvas.width, canvas.height);

	for(i = 0; i<DIM; i++){
		for(j = 0; j<DIM; j++){
			ctx.drawImage(backgroundCell,i*sizeCell+canvasPosition.x,j*sizeCell+canvasPosition.y,sizeCell,sizeCell);
		}
	}	
	for(i = 0; i<DIM; i++){
		for(j = 0; j<DIM; j++){
			if(m_tokens[i][j] === 0){
				ctx.drawImage(crossToken,i*sizeCell+canvasPosition.x,j*sizeCell+canvasPosition.y,sizeCell,sizeCell);
			} else if(m_tokens[i][j] === 1) {
				ctx.drawImage(circleToken,i*sizeCell+canvasPosition.x,j*sizeCell+canvasPosition.y,sizeCell,sizeCell);
			}
		}
	}
	requestAnimationFrame(drawMorpion);	
};


function getPos(e){
	var rect = canvas.getBoundingClientRect();
	var x = ((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width) - canvasPosition.x;	
	var y = ((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height) - canvasPosition.y;		
	var column = Math.floor(x/sizeCell);
	var line = Math.floor(y/sizeCell);
	if(column<0 || column >(DIM-1)){
		return false
	}
	if(line<0 || line >(DIM-1)){
		return false
	}
	return [column, line];
}


$(document).ready(function() {
	$(document).off("click", "#mcanvas");
	$(document).on("click", "#mcanvas", function(e) {
		if(!yourTurn){
			return;
		}
		var pos = getPos(e);
		if(m_tokens[pos[0]][pos[1]] != -1) {
			return;
		}
		yourTurn = false;
		socket.getSocket().emit("morpion",pos);	
	});
});


if(!binded) {
	socket.getSocket().removeAllListeners("morpion");
	socket.getSocket().on("morpion", function(data){	
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
			if(data.winner != 2) {
				$("#information").html(data.winner+" gagne la partie!");
			} else {
				$("#information").html("Match nul!");
			}			
		}
		m_tokens = data.tokens;		
	});

	socket.getSocket().on("votre adversaire de morpion a quitte la partie", function(){
		resetMorpion();
		$("#player2").html("");
		$("#information").html("Votre adversaire a quitté la partie<br /> Vous pouvez re-partager votre lien");
	});
}


initializeGame();
binded = true;