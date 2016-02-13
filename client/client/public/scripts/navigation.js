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
		$("#infos div").html("Pseudo : "+localStorage.name+"<br>ID : "+localStorage.user);
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