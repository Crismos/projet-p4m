function ErrorManager() {
	var errors = {
		"login": '<div class="error err-%id"><b>Erreur</b> : La <b>pseudalité</b> choisie (%name) est <b>invalide</b> (déjà utilisée ou de trop petit taille)</div>'
	}
	var ids = {};
	var id = 0;

	this.login = function(name) {
		var thisId = id;
		ids[id] = "login";
		html = TEMPLATE.parse(errors["login"], {id: thisId, name: name});
		$("#error").append(html);
		setTimeout(function() {
			kill(thisId);
		}, 1000*10);
		id++;
	}

	function kill(id) {
		delete ids[id];
		$(".err-"+id).addClass("removed");
		setTimeout(function() {
			$(".err-"+id).remove();
		},200);
	}

	this.killAll = function() {
		for(var key in ids)
			kill(key);
	}
}
var ERROR = new ErrorManager();