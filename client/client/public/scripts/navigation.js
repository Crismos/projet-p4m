/*
* Ce fichier permet de gérer la navigation du site web
*
* Composition :
*
** initUser() > créer un utilisateur
** showLoginPopup() > permet à l'utilisateur de choisir un pseudo
*
** class Page(id, title, url, real)
**** go() > navigue vers cette page
*
** updateTitle() > met à jour le titre de la page
** initPage() > Permet de créer les différentes pages de navigation
*
** choice() > gère le choix de l'utilisateur au moment du click sur le menu
** home() > permet à l'utilisateur de revenir sur la page d'accueil
*
** setInfos() > met à jours les informations de l'utilisateur (pseudi/id) de manière visuelle
*/

$(document).ready(function() {



	var push = true;

	var currentPage;
	var pages;

	var logged = false;

	var Page = function(id, title, url, real) {
		this.id = id;
		this.url = url;
		this.title = title;
		this.real = real;

		
		this.go = function(user, load) {
			// charge la page
			console.log(currentPage);

			if(push) {
				var state = {"page_id": currentPage.id, "user": user.getName()};
				history.pushState(state, currentPage.title, (idGame != "0" ? idGame : "home"));
			}

			$("body").append("<div class='loader hide'></div>");
			if(load) {
				$(".loader").load(currentPage.real, function() {
					$(this).removeClass("hide");
				});
			}
			else {
				$(".loader").remove();
			}

			updateTitle();
			//draw();
		}
	}

	var User = function() {
		var logged = false;
		var id = -1

		this.requestName = function() {
			$("#login").removeClass("hide");
			$("#game-selection").addClass("hide");
		}
		this.setName = function(pseudo) {
			localStorage.name = pseudo;
			logged = true;
			
			socket.login(function(o) {
				id = o.id;
				socket.id = id;
				// l'utilisateur se connecte
				um.event(socket);
				cm.event();
				cv.event(cm);

				socket.onMessage(cm.message);

				$("#chat").removeClass("none");
				$("#pseudo").blur();
			});

			if(idGame == "0") {
				// si l'utilisateur n'a pas été invité
				this.requestGame();
			} else {
				$("#login").addClass("hide");
				$("#game-selection").removeClass("hide");
				$("#game-selection").addClass("hide");
				console.log("On alerte le serveur que l'on veut rejoindre la partie "+idGame);
				socket.joinGame(idGame, function(o){
					console.log("Création de la salle de jeux puissance 4, id : "+o.id+", game : "+o.typeGame);
					idGame = o.id;
					choice(o.typeGame);
				});
			}
		}
		this.requestGame = function() {
			$("#login").addClass("hide");
			$("#game-selection").removeClass("hide");
		}
		this.gameChosen = function(nameGame) {
			$("#game-selection").addClass("hide");
			if(nameGame = "p4"){
				socket.requestPuissanceQuatre(function(link_id) {
					console.log("Création de la salle de jeux puissance 4, id : "+link_id+", game : "+nameGame);
					idGame = link_id;
					choice(nameGame);
				});
			}else if(nameGame = "morpion"){

			}

		}
		this.isLogged = function() {
			return logged;
		}
		this.getName = function() {
			return localStorage.name;
		}
		this.getId = function() {
			return id;
		}
	}

	/*
	* modifier l'emplacement de ce code
	*
	*/
	var Chat = function() {
		var users = {};
		var chat = this;

		socket.connectChat(function(o) {
			chat.updateUsers(o.users);
		});

		this.updateUsers = function(u) {
			//console.log(u);
			users = u;
			_updateChatPanel();
		}
		var openChat = function(id) {

		}
		this.addUser = function(id, user) {
			users[id] = user;
			_updateChatPanel();
		}
		this.removeUser = function(id) {
			delete users[id];
			_updateChatPanel();
		}
		this.updateUserStatus = function(id, status) {
			users[id].status = status;
			var status = (status == 0 ? "online" : "ongame");
			$("#"+id+" .status").html(status);
			$("#"+id+" .status").removeClass("ongame");
			$("#"+id+" .status").removeClass("online");
			$("#"+id+" .status").addClass(status);
		}
		this.getUserName = function(id) {
			console.log("<<users + "+id+">>");
			console.log(users);
			return users[id].name;
		}

		function _updateChatPanel() {
			$("#panel .user").remove();
			var html = "";

			for(var key in users) {
				if(key != user.getId()) {
					html += "<div class='user' id='"+key+"'>";

					html += "<span class='name'>"+users[key].name+"</span>";
					html += "<span class='status "+(users[key].status == 0 ? "online" : "ongame")+"'>"+(users[key].status == 0 ? "online" : "ongame")+"</span>";

					html += "</div>";
				}
			}

			$("#panel").append(html);
		}

		socket.onUserConnection(this.addUser);
		socket.onUserDisconnect(this.removeUser);
	}
	

	function updateTitle() {
		// change le titre de la page
		document.title = currentPage.title;
	}

	function send(e) {
	    if (e.keyCode == 13) {
	        // envoi message
	        convs.send($("#sendMessage").parent().parent()[0].children[0].id);
	    }
	}

	function initPage() {
		// creation des différentes pages
		pages = {
			home: new Page(1, "La pause geek", "home", "index.html"),
			puissance: new Page(2, "Puissance 4", "puissance", "pages/puissance.html"),
			morpion: new Page(3, "Morpion", "morpion", "pages/morpion.html")};

		var url = window.location.href;
		var p = url.split("/");
		p = p[p.length - 1];
		
		// initialisation de la navigation
		switch(p) {
			case "puissance": 
				currentPage = pages[p];
				choice($(".choice").get(0));
				currentPage.go(user, true);
			break;
			case "morpion": 
				currentPage = pages[p];
				choice($(".choice").get(1));
				currentPage.go(user, true);
			break;
			default: 
				$("#login").removeClass("hide");
				currentPage = pages.home;
				currentPage.go(user, false);
			break;
		}

		
	}

	function choice(id) {
		// afficher et cacher les animations
		switch(id) {
			default : break;
			case "p4": 
				var goTo = "puissance";
				currentPage = pages[goTo];
				currentPage.go(user, true);
				break;
			case "morpion" :
				var goTo = "morpion";
				currentPage = pages[goTo];
				currentPage.go(user, true);
				break;
		}		
	}

	
	// récuperer l'id de l'utilisateur dans le localStorage
	//user.name = localStorage.name;

	var user = new User();

	user.requestName();

	// initialiser les pages
	initPage();

	$("#resetUser").click(function() {
		initUser();
	});
	$("#pseudo").keypress(function(e) {
		if(e.keyCode == 13)
			$("#connect").click();
	});

	$("#connect").click(function() {
		user.setName($("#pseudo").val());
	});

	$("#play").click(function() {
		user.gameChosen($("#game").val());
	});

	$("#opener").click(function() {
		$("#chat").toggleClass("close");
		$(".fa").toggleClass("fa-flip-horizontal");
	});

	$(document).on("click", "#chat #header, #chat #logo,#conversation .header", function(event) {
		$("#chat").toggleClass("disabled");
	});
	$(document).on("click", "#chat .user", function(event) {
		$("#container").addClass("swap");
		$("#conversation").removeClass("swap");
		$("#chat #logo").addClass("minimize");
		
		cm.open($(this).attr("id"));
	});
	$(document).on("click", "#conversationBack", function(event) {
		
		cm.close();
		event.stopPropagation();
	});

	var forceScroll = true;

	$(".container").scroll(function() {
		if(($(".container").prop("scrollHeight")-$(".container").height()-30) < $(".container").scrollTop()) {
			forceScroll = true;
		} else {
			forceScroll = false;
		}
		console.log(forceScroll);
	});

	$('#msg').bind("enterKey",function(e){
   		var id = $("#msg").parent().parent().attr("data-id");
   		cm.send(id, $("#msg").val());
   		$("#msg").val("");

   		setTimeout(function() {
   			if(forceScroll) {
   				$(".container").scrollTop($(".container").prop("scrollHeight")+$(".container").height());
   			}
   		},100);
   		
	});
	$('#msg').keyup(function(e){
	    if(e.keyCode == 13)
	    {
	        $(this).trigger("enterKey");
	    }
	});


	function home() {
		currentPage = pages.home;
		currentPage.go();
		if(logged) {
			$("#login").addClass("hide");
			$("#game-selection").removeClass("hide");
		} else {
			$("#login").removeClass("hide");
		}
		$(document).off("click", "#home");
		$(document).on("click", "#home", home);
		$(".loader").remove();
	}

	$(document).on("click", "#home", home);

});