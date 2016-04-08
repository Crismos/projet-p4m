function Conversation(user) {
	this.id = user.id;
	this.user = user;
	this.conv = {
		read: [],
		new: [],
		notif: function() {
			return this.new.length;
		}
	}

	this.addMessage = function(message) {
		this.conv.new.push(message);
	}
	this.read = function() {
		while(this.conv.new.length > 0) {
			this.conv.read.push(this.conv.new.splice(0,1).pop());
		}
	}
}

function ConversationManager(um) {

	var um = um;
	var callbacks = {
		rmConv: {},
		newConv: {},
		upConv: {},
		welcome: {}
	};

	var convs = {};

	this.event = function() {
		um.onRmUser("chat manger rmConv", removeConversation);
		um.onNewUser("chat manger newConv", addConversation);
		um.onUpUser("chat manger upConv", updateConversation);
		um.onWelcome("chat manager welcome", welcome);
	}

	this.onRmConv = function(id, callback) {
		var fct = callback || function() {};
		callbacks.rmConv[id] = fct;
	}
	this.onUpConv = function(id, callback) {
		var fct = callback || function() {};
		callbacks.upConv[id] = fct;
	}
	this.onNewConv = function(id, callback) {
		var fct = callback || function() {};
		callbacks.newConv[id] = fct;
	}
	this.onWelcome = function(id, callback) {
		var fct = callback || function() {};
		callbacks.welcome[id] = fct;
	}

	function removeConversation(user) {
		var conv = convs[user.id];
		delete convs[user.id];

		call("rmConv", conv);
	}

	this.getConvs= function() {
		return convs;
	}

	function addConversation(user) {
		convs[user.id] = new Conversation(user);

		call("newConv", convs[user.id]);
	}

	function updateConversation(user) {
		var msgs = convs[user.id].conv;
		convs[user.id] = new Conversation(user);
		convs[user.id].conv = msgs;

		call("upConv", convs[user.id]);
	}

	function welcome() {
		var users = um.getUsersByStatus();

		for(var key in users) {
			convs[key] = new Conversation(users[key]);
		}

		call("welcome", convs);
	}

	function call(event, object) {
		console.log("call >> "+event);
		console.log(object);
		for(var key in callbacks[event]) {
			callbacks[event][key](object);
		}
	}
}
var cm = new ConversationManager(um);