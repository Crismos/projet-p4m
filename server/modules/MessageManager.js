function MessageManager(client) {
	var client = client;
	var convs = {};

	this.getConvs = function() {
		return convs;
	}
	this.getConv = function(id) {
		return convs[id];
	}
}

module.exports = MessageManager