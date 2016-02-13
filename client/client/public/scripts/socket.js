var IO = function() {

	var soc = io.connect('http://127.0.0.1:8080');
	soc.emit('user connection', {id: localStorage.user, name: localStorage.name});

	var params = {
		onlines: 0,
		onMorpionGame: 0,
		onPuissanceGame: 0
	};

	var binded = {
		onlines: {},
		onMorpionGame: {},
		onPuissanceGame: {}
	};
	this.binded = binded;

	var call = function(varName) {
		for(var key in binded[varName]) {
			binded[varName][key](params[varName]);
		}
	}
	this.bind = function(ref, varName, callback) {
		binded[varName][ref] = callback;
		callback(params[varName]);
	}
	this.unbind = function(ref, varName) {
		delete binded[varName][ref];
	}
	this.updateName = function(newName) {
		soc.emit('user update name', {name: newName});
	}

	soc.on("connection infos", function(o) {
		params = o;
		call("onlines");
		call("onPuissanceGame");
		call("onMorpionGame");
	});
}

var socket = new IO();