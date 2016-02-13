var console = require("./modules/console.js");
var io = require("socket.io")(8080);


console.log("Listening port *: ::green::8080");


var onlines = 0;
var users = {};
var User = require("./modules/User.js");

io.on('connection', function(socket){

	onlines++;

	socket.on('user connection', function(o){

	  	console.log("::green::>>[USER]::white:: user ::green::"+o.id+"("+(o.name || "no name")+")::white:: connected");

	  	socket.user = o.id;
	  	socket.name = o.name;
	  	users[socket.id] = new User(socket);


	  	io.emit("connection infos", {onlines: onlines, onMorpionGame: 0, onPuissanceGame: 0});
	});
	socket.on('user update name', function(o) {
		console.log("::green::>>[USER]::white:: user ::green::"+users[socket.id].getId()+" ::white::update name to ::green::"+o.name+"");

		users[socket.id].updateName(o.name);
	});

	socket.on('disconnect', function(){

		onlines--;

		delete users[socket.user];

		console.log('::green::<<[USER]::white:: user ::green:: '+(users[socket.id].getId()||"undefined")+' ::white::disconnected');
	
		io.emit("connection infos", {onlines: onlines, onMorpionGame: 0, onPuissanceGame: 0});
	});
});