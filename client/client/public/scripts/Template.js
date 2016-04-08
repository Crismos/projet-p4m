var TEMPLATE = {
	get: function(path, callback) {
		var fct = callback || function(){};

		$.ajax({
		  	url: "template/"+path+".html"
		}).done(function(data) {
			callback(data);
		});
	},
	parse: function(html, variables) {
		for(var key in variables) {
			html = html.replace(new RegExp("%"+key, 'g'), variables[key]);
		}
		return html;
	}
};