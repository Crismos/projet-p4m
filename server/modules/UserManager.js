/*
* Class UserManager
*
*	Manage all connected user
*	
*	Object users
*
*	getUserById(id):user 				get user from connected users by id
* 	getUsersByPseudo(pseudo):user[] 	get users array from connected users by pseudo (useless atm)
* 	addUser(user):void 					add user to the manager
*	removeUser(user):void 				remove user from manager
* 	getOnlines():onlines 				get how many users are connected
*/

function UserManager() {
	var users = {};

	this.getUsersByPseudo = function(pseudo) {
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
		console.log("::green::[UserManager]::white:: > new User added ("+((user) ? user.getPseudo() :"undefined")+")");
		if(user)
			users[user.getId()] = user;
		else
			console.log("::red:: UserManager >> can't add this user undefined");
	}
	this.removeUser = function(user) {
		if(user) {
			console.log("::green::[UserManager]::white:: > remove User ("+((user) ? user.getPseudo() :"undefined")+")");
			delete users[user.getId()];
		}
	}

	this.getOnlines = function() {
		return Object.keys(users).length - 1;
	}
}

module.exports = UserManager;