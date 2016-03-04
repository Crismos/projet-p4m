function Message(client, message) {
	var client = client;
	var message = message;
	var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

	this.toString = function() {
		return client+" : "+message+" ("+date+")";
	}
}

module.exports = Message;