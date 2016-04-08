function Conversation(user) {
	this.id = user.id;
	this.user = user;
	var conv = this;
	this.conv = {
		read: [],
		new: [],
		notif: function() {
			return this.new.length;
		}
	}

	this.addMessage = function(message) {
		this.conv.new.push(message);
		if(cm) {
			if(cm.currentConv) {
				if(cm.currentConv.id = this.id)
					this.read();
			}
		}
		$(document.getElementById(conv.id)).children(".notification").html(""+conv.conv.notif());
		if(conv.conv.notif() > 0)
			$(document.getElementById(conv.id)).children(".notification").addClass("new");
		else
			$(document.getElementById(conv.id)).children(".notification").removeClass("new");
	}
	this.read = function() {
		while(this.conv.new.length > 0) {
			this.conv.read.push(this.conv.new.splice(0,1).pop());
		}
		$(document.getElementById(conv.id)).children(".notification").html("");
		$(document.getElementById(conv.id)).children(".notification").removeClass("new");
	}
}

function Message(me, text) {
	this.me = me;
	this.text = text;
}

function ConversationManager(um) {

	this.currentConv = null;

	var um = um;
	var callbacks = {
		rmConv: {},
		newConv: {},
		upConv: {},
		welcome: {},
		newMsg: {}
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
	this.onNewMsg = function(id, callback) {
		var fct = callback || function() {};
		callbacks.newMsg[id] = fct;
	}

	this.open = function(id) {
		this.currentConv = convs[id];
		convs[id].read();
		$("#conversation").attr("data-id", id);
		call("newMsg", convs[id]);
		$('#msg').focus();
	}
	this.close = function() {
		this.currentConv = null;
		$('#msg').focusout();
	}

	function removeConversation(user) {
		var conv = convs[user.id];
		delete convs[user.id];

		call("rmConv", conv);
	}

	this.getConvs= function() {
		return convs;
	}
	this.getConv = function(id) {
		return convs[id];
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
			convs[users[key].id] = new Conversation(users[key]);
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

	this.send = function(id, text) {
		var conv = this.getConv(id);
		conv.addMessage(new Message(true, text));

		call("newMsg", conv);
	}

	this.call = call;
	this.addConversation = addConversation;
	this.convs = convs;
}
var cm = new ConversationManager(um);