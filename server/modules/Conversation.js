function Conversation(client) {
	var id = Math.floor(Math.random()*99999999999);
	var client = client;
	var other = [];

	var currentMessageId = -1;
	var Messages = {};

	this.getMessages = function() {
		return Messages;
	}

	this.addMessage = function(Message) {
		currentMessageId++;
		Messages[currentMessageId] = Message;
	}

	this.addClient = function(client) {
		other.push(client);
	}

	function pushNotif() {
		for(var id in other) {
			other[id].getSocket().emit("onNotifPushed", {convId: id, message: Messages[currentMessageId].toString()});
		}
	}
}

module.exports = Conversation;