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

	var user = {};
	var currentPage;
	var pages;

	var Page = function(id, title, url, real) {
		this.id = id;
		this.url = url;
		this.title = title;
		this.real = real;

		
		this.go = function(user, load) {
			// charge la page
			console.log(currentPage);

			if(push) {
				var state = {"page_id": currentPage.id, "user": user};
				history.pushState(state, currentPage.title, currentPage.url);
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
	user.name = localStorage.name;

	// initialiser les pages
	initPage();

	$("#resetUser").click(function() {
		initUser();
	});

	$("#connect").click(function() {
		$("#login").addClass("hide");
		$("#game-selection").removeClass("hide");
		user.name = $("#pseudo").val();
		localStorage.name = user.name;
		socket.login();
	});

	$("#play").click(function() {
		choice($("#game").val());
		$("#game-selection").addClass("hide");
	});
});