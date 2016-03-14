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

		this.requestName = function() {
			$("#login").removeClass("hide");
			$("#game-selection").addClass("hide");
		}
		this.setName = function(pseudo) {
			localStorage.name = pseudo;
			logged = true;
			socket.login();

			if(idGame == "0") {
				// si l'utilisateur n'a pas été invité
				this.requestGame();
			} else {
				socket.connectTo(idGame);
			}
		}
		this.requestGame = function() {
			$("#login").addClass("hide");
			$("#game-selection").removeClass("hide");
		}
		this.gameChosen = function(game) {
			$("#game-selection").addClass("hide");

			socket.requestGameId(game, function(o) {
				idGame = o.id;
				choice(o.game);
			});
		}
		this.isLogged = function() {
			return logged;
		}
		this.getName = function() {
			return localStorage.name;
		}
	}

	function updateTitle() {
		// change le titre de la page
		document.title = currentPage.title;
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

	$("#connect").click(function() {
		user.setName($("#pseudo").val());
	});

	$("#play").click(function() {
		user.gameChosen($("#game").val());
	});

	$("#opener").click(function() {
		$("#chat").toggleClass("close");
		$(".fa").toggleClass("fa-flip-horizontal");
	})

	function home() {
		currentPage = pages.home;
		currentPage.go();
		if(logged) {
			$("#login").addClass("hide");
			$("#game-selection").removeClass("hide");
		} else {
			$("#login").removeClass("hide");
		}
		$(document).off("click");
		$(document).on("click", "#home", home);
		$(".loader").remove();
	}

	$(document).on("click", "#home", home);
});