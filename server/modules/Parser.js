var Parser = function() {

	var innerColor = {
		"!red": "<span style='color:#d53232'>",
		"!green": "<span style='color:#45d532'>",
		"!blue": "<span style='color:#3268d5'>",
		"!yellow": "<span style='color:#e0c73c'>",
		"-!": "</span>"
	}

	this.parse = function(data) {
		var html = data;
		var regex = /(<([^>]+)>)/ig;
		html = html.replace(regex, "");

		for(var key in innerColor) {
			html = html.replace(new RegExp(key, "g"), innerColor[key]);
		}

		return html;
	}
}
module.exports = new Parser();