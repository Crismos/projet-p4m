function ErrorManager() {
	var errors = {
		"login": '<div class="error err-%id"><b>Erreur</b> : La <b>pseudalité</b> choisie (%name) est <b>invalide</b> (déjà utilisée ou de trop petit taille)</div>',
		"socket": '<div class="error err-%id"><b>Erreur</b> : <b>connexion</b> au serveur de socket <b>perdue</b>...</div>',
		"noGame": '<div class="error err-%id"><b>Erreur</b> : La partie que vous avez essayé de rejoindre n\'existe pas</div>',
		"gameFull": '<div class="error err-%id"><b>Erreur</b> : La partie que vous avez essayé de rejoindre est pleine</div>'
	}
	var ids = {};
	var id = 0;

	this.login = function(name) {
		addError("login", {name: name});
	}
	this.socket = function() {
		addError("socket", {});
	}
	this.noGame = function() {
		addError("noGame", {});
	};
	this.gameFull = function() {
		addError("gameFull", {});
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