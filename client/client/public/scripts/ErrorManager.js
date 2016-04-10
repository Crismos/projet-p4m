function ErrorManager() {
	var errors = {
		"login": '<div class="error err-%id"><b>Erreur</b> : La <b>pseudalité</b> choisie (%name) est <b>invalide</b> (déjà utilisée ou de trop petit taille)</div>',
		"socket": '<div class="error err-%id"><b>Erreur</b> : <b>connexion</b> au serveur de socket <b>perdue</b>...</div>'
	}
	var ids = {};
	var id = 0;

	this.login = function(name) {
		addError("login", {name: name});
	}
	this.socket = function() {
		addError("socket", {});
	}

	function addError(type, o) {
		var tmpId = id;
		id++;
		ids[tmpId] = type;

		o.id = tmpId;
		html = TEMPLATE.parse(errors[type], o);
		$("#error").append(html);

		setTimeout(function() {
			kill(tmpId);
		}, 1000*10);
	}

	function kill(id) {
		delete ids[id];
		$(".err-"+id).addClass("removed");
		setTimeout(function() {
			$(".err-"+id).remove();
		},200);
	}

	this.killAll = function(type) {
		for(var key in ids) {
			if(type) {
				if(ids[key] == type)
					kill(key);
			} else {
				kill(key);
			}
		}
	}
}
var ERROR = new ErrorManager();