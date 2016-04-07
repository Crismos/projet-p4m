function UserManager(socket) {
	
	var users = {};
	var callbacks = {newUser: {},
					rmUser: {},
					upUser: {}};

	function event(socket) {
		var socket = socket.getSocket();

		socket.on("newUser", function(o) {
			modify("newUser", o.id, o.name, o.status);
		});
		socket.on("upUser", function(o) {
			modify("upUser", o.id, o.name, o.status);
		});
		socket.on("rmUser", function(o) {
			modify("rmUser", o.id, null, null);
		});
	}


	function modify(type, id, nom, status) {
		if(!users[id]) {
			users[id] = {};
		}

		users[id].id = id || users[id].id;
		users[id].name = nom || users[id].name;
		users[id].status = status || users[id].status || 0;

		for(var key in callbacks[type]) {
			callbacks[type][key](users[id]);
		}

		if(type == "rmUser") {
			delete users[id];
		}
	}

	this.getUsersByStatus = function() {
		var tab = [];
		var order = Object.keys(users).sort(
				function(a,b){
					// tri par status et par nom
					return (users[a].status - users[b].status)+(users[a].name > users[b].name)*0.25;
				});
		for(var k in order) {
			tab.push(users[order[k]]);
		}
		return tab;
	}

	this.onNewUser = function(id, callback) {
		var fct = callback || function() {};

		callbacks.newUser[id] = fct;
	}

	this.onRmUser = function(id, callback) {
		var fct = callback || function() {};

		callbacks.rmUser[id] = fct;
	}

	this.onUpUser = function(id, callback) {
		var fct = callback || function() {};

		callbacks.upUser[id] = fct;
	}

	event(socket);

}
var um = new UserManager(socket);