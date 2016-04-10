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
				if(cm.currentConv.id == this.id)
					this.read();
			}
		}
		$(document.getElementById(""+conv.user.id)).children(".notification").html(""+(conv.conv.notif()<10 ? conv.conv.notif() : "9+"));
		if(conv.conv.notif() > 0)
			$(document.getElementById(""+conv.user.id)).children(".notification").addClass("new");
		else
			$(document.getElementById(""+conv.user.id)).children(".notification").removeClass("new");

		
		console.log(message);
	}
	this.read = function() {
		console.log("== read() ==");
		console.log(conv);

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
		newMsg: {},
		open: {},
		updateGlobalNotif: {}
	};

	var convs = {};

	var dis = this;

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
	this.onOpen = function(id, callback) {
		var fct = callback || function() {};
		callbacks.open[id] = fct;
	}
	this.onUpdateGlobalNotif = function(id, callback) {
		var fct = callback || function() {};
		callbacks.updateGlobalNotif[id] = fct;
	}

	this.open = function(id) {
		console.log("====== open ["+id+"]=====");
		console.log(convs[id]);

		dis.currentConv = convs[id];
		convs[id].read();
		
		call("newMsg", convs[id]);
		call("open", convs[id]);
		call("updateGlobalNotif", getNotif());
	}
	this.close = function() {
		dis.currentConv = null;
		$("#container").removeClass("swap");
		$("#conversation").addClass("swap");
		$("#chat #logo").removeClass("minimize");
		$('#msg').blur();
	}

	function removeConversation(user) {
		var conv = convs[user.id];
		console.log(conv);
		console.log(user);
		console.log(dis.currentConv);
		if(dis.currentConv) {
			if(dis.currentConv.id == conv.id)
				dis.close();
		}
		
		delete convs[user.id];

		call("rmConv", conv);
		call("updateGlobalNotif", getNotif());
	}

	this.getConvs= function() {
		return convs;
	}
	this.getConv = function(id) {
		return convs[id];
	}

	this.message = function(o) {
		var msg = new Message(false, o.text);
		console.log("reçu");
		console.log(o);
		if(convs[o.from]) {
			convs[o.from].addMessage(msg);
		}
		if(dis.currentConv) {
			if(dis.currentConv.user.id == o.from)
				call("newMsg", convs[o.from]);
		}
		call("updateGlobalNotif", getNotif());

	}

	function addConversation(user) {
		convs[user.id] = new Conversation(user);

		call("newConv", convs[user.id]);
		call("updateGlobalNotif", getNotif());
	}

	function updateConversation(user) {
		var msgs = convs[user.id].conv;
		convs[user.id] = new Conversation(user);
		convs[user.id].conv = msgs;

		call("upConv", convs[user.id]);
		call("updateGlobalNotif", getNotif());
	}

	function welcome() {
		var users = um.getUsersByStatus();
		console.log(users);
		for(var key in users) {
			convs[users[key].id] = new Conversation(users[key]);
			console.log(convs[users[key].id]);
		}

		call("welcome", convs);
		call("updateGlobalNotif", getNotif());
	}

	function getNotif() {
		var notif = 0;
		for(var key in convs) {
			notif += (convs[key].conv.notif() > 0 ? 1 : 0);
		}
		return (notif<10 ? notif : "9+");
	}

	function call(event, object) {
		for(var key in callbacks[event]) {
			callbacks[event][key](object);
		}
	}

	this.send = function(id, text) {
		var conv = this.getConv(id);
		conv.addMessage(new Message(true, text));
		socket.send(id, text);

		call("newMsg", conv);
	}

	this.call = call;
	this.addConversation = addConversation;
	this.convs = convs;
}
var cm = new ConversationManager(um);