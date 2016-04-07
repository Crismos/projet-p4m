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
* 	getOnlines():user 				get how many users are connected
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

	this.getOnlines = function(id) {
		var id = id || -1;
		var tmp = [];
		for(var key in users) {
			if(id == -1 || key != id) {
				tmp.push(users[key].toObj());
			}
		}
		return tmp;
	}
}

module.exports = UserManager;