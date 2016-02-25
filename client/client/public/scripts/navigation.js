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

	function initUser() {
		// créer un identifiant
		if(localStorage.user === undefined) {
			var randomId = Math.floor(Math.random()*99999999999);
			localStorage.user = randomId;
		}
		showLoginPopup();
	}
	function showLoginPopup() {
		var userName = prompt("Username : ");
		if(userName != null) {
			localStorage.name = userName;
			socket.updateName(userName);
			setInfos();
		} else {
			showLoginPopup();
		}
	}

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
				currentPage = pages.home;
				home();
				currentPage.go(user, false);
			break;
		}
	}

	function choice(div) {
		// afficher et cacher les animations
		$(".choice").addClass("hide");
		$(div).removeClass("hide");
		$(div).addClass("selected");
		$(".selector").addClass("selected");
		$("#title").addClass("hide");
		$(".home").addClass("activ");		
	}
	function home() {
		// afficher et cacher les animations
		$(".choice").removeClass("hide");
		$(".choice").removeClass("selected");
		$(".selector").removeClass("selected");
		$("#title").removeClass("hide");
		$(".home").removeClass("activ");

	}
	function setInfos() {
		// met à jour les informations en haut à droite
		$("#infos #pseudo").html(localStorage.name);
		$("#infos #id").html(localStorage.user);
		$("#infos").addClass("filled");
	}
	
	// récuperer l'id de l'utilisateur dans le localStorage
	user.id = localStorage.user;
	user.name = localStorage.name;

	if(user.id && user.name) {
		setInfos();
	} else {
		initUser();
	}
	// initialiser les pages
	initPage();

	$(".choice").click(function() {
		if($(this).attr("class").indexOf("selected") === -1) {
			var goTo = $(this).attr("alt");
			currentPage = pages[goTo];

			currentPage.go(user, true);
			choice($(this));
		} else {
			console.log("> choix deja selectionné");
		}
		
	});

	$(".home").click(function() {
		home();
		currentPage = pages.home;
		currentPage.go(user, false);
	});
	$("#resetUser").click(function() {
		initUser();
	});
});