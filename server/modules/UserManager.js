function UserManager() {
	var users = {};

	this.getUserByPseudo = function(pseudo) {
		var user = [];
		for(var key in users) {
			if(users[key].getPseudo() == pseudo)
				user.push(users[key]);
		}
		if(user.length > 0)
			return user;
		else
			console.log("::red:: UserManager >> no user for pseudo '"+(pseudo ||"undefined")+"'");
		return null;
	}
	this.getUserById = function(id) {
		if(users[id])
			return users[id];
		else
			console.log("::red:: UserManager >> can't get undefined user ("+(id ||"undefined")+")");
		return null;
	}
	this.addUser = function(user) {
		console.log("::green::[UserManager]::white:: > new User added ("+(user.getPseudo() ||"undefined")+")");
		if(user)
			users[user.getId()] = user;
		else
			console.log("::red:: UserManager >> can't add this user undefined");
	}
	this.removeUser = function(user) {
		console.log("::green::[UserManager]::white:: > remove User ("+(user.getPseudo() ||"undefined")+")");
		if(user)
			delete users[user.getId()];
		else
			console.log("::red:: UserManager >> can't remove this user undefined");
	}

	this.getOnlines = function() {
		return Object.keys(users).length - 1;
	}
}

module.exports = UserManager;