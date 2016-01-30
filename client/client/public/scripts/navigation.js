$(document).ready(function() {

	var push = true;

	var user;
	var currentPage;
	var pages;

	function initUser() {
		var randomId = Math.floor(Math.random()*99999999999);
		localStorage.user = randomId;
	}

	var Page = function(id, title, url, real) {
		this.id = id;
		this.url = url;
		this.title = title;
		this.real = real;

		this.go = function(user, load) {

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
		}
	}

	function initPage() {
		pages = {
			home: new Page(1, "La pause gaming", "home", "index.html"),
			puissance: new Page(2, "Puissance 4", "puissance", "pages/puissance.html"),
			morpion: new Page(3, "Morpion", "morpion", "pages/morpion.html")};

		var url = window.location.href;
		var p = url.split("/");
		p = p[p.length - 1];
		
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
		$(".choice").addClass("hide");
		$(div).removeClass("hide");
		$(div).addClass("selected");
		$(".selector").addClass("selected");
		$("#title").addClass("hide");
		$(".home").addClass("activ");
	}
	function home() {
		$(".choice").removeClass("hide");
		$(".choice").removeClass("selected");
		$(".selector").removeClass("selected");
		$("#title").removeClass("hide");
		$(".home").removeClass("activ");
	}

	console.log("==== debut du script=====");

	console.log("# Chargement de la config");

	console.log("# Initialisation des pages");
	

	user = localStorage.user;
	if(user) {

	} else {
		initUser();
	}

	initPage();

	$(".choice").click(function() {
		if($(this).attr("class").indexOf("selected") === -1) {
			var goTo = $(this).attr("alt")
			console.log("> navigation vers : "+goTo);
			currentPage = pages[goTo];

			currentPage.go(user, true);
			choice($(this));
		} else {
			console.log("> choix deja selectionné");
		}
		
	});

	$(".home").click(function() {
		home();
		console.log("> navigation vers Home");
		currentPage = pages.home;
		currentPage.go(user, false);
	});
});