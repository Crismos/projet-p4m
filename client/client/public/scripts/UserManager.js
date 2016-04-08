function UserManager() {
	
	var users = {};
	var callbacks = {newUser: {},
					rmUser: {},
					upUser: {},
					welcome: {}};

	this.event = function(socket) {
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
		socket.on("welcome", function(o) {
			welcome(o);
		});
	}

	function welcome(o) {
		// first connection getting all clients
		// o = [{user, user, ...}]
		for(var i=0 ;i<o.length; i++) {
			users[o[i].id] = {};
			users[o[i].id] = o[i];
		}

		for(var key in callbacks.welcome) {
			callbacks.welcome[key](o);
		}
	}

	function modify(type, id, nom, status) {
		if(id != socket.id) {
			if(!users[id]) {
				users[id] = {};
			}

			users[id].id = id || users[id].id;
			users[id].name = nom || users[id].name;
			users[id].status = status || users[id].status || 0;

			var tmp = users[id];
			if(type == "rmUser") {
				delete users[id];
			}

			for(var key in callbacks[type]) {
				callbacks[type][key](tmp);
			}
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

	this.onWelcome = function(id, callback) {
		var fct = callback || function() {};

		callbacks.welcome[id] = fct;
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

	this.getUser = function(id) {
		return users[id];
	}


	this.modify = modify;
	this.users = users;

}
var um = new UserManager();