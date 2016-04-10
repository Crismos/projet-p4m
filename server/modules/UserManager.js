var _User = require("./User.js");

exports.userManager = function() {	
	var users = {};

	this.addUser = function(socket, callback) {
		var callback = callback || function(){};
		user = new _User(socket);
		users[user.getId()] = user;
		callback(user);
		console.log("::green::[UserManager]::white:: > new User added, socket id : "+ user.getId() +", pseudo : "+user.getPseudo());
	}

	this.removeUser = function(id) {		
		console.log("::green::[UserManager]::white:: > remove User, socket id : "+ users[id].getId() +", pseudo : "+users[id].getPseudo());
		if(users[id].getCurrentGame()){
			users[id].getCurrentGame().removeUser(users[id]);
		}	
		delete users[id];		
	}

	this.getUser = function(id) {
		if(users[id])
			return users[id];
		return null;
	}

	this.getOnlines = function(id) {
		var id = id || -1;
		var tmp = [];
		for(var key in users) {
			if((id == -1 || key != id) && (users[key].getPseudo() != "An unnamed monkey")) {
				tmp.push(users[key].toObj());
			}
		}
		return tmp;
	}

	this.isValidePseudo = function(name) {
		for(var key in users) {
			if(users[key].getPseudo() == name)
				return false;
		}
		return true;
	}
}

