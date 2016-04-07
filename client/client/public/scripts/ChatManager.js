function ChatManager(um) {

	var um = um;

	this.event = function() {
		um.onRmUser("chat manger draw", draw);
		um.onNewUser("chat manger draw", draw);
		um.onUpUser("chat manger draw", draw);
		um.onWelcome("chat manager draw", draw);
	}

	function draw() {
		var users = um.getUsersByStatus();
		var html = "";

		$.ajax({
		  	url: "template/chatUser.html"
		}).done(function(data) {
  			var template = data;

			for(var key in users) {
				var id = users[key].id;
				var name = users[key].name;
				var status = (users[key].status == 0 ? "online" : "ongame");

				html += template.replace(new RegExp("%id", 'g'), id).replace(new RegExp("%name", 'g'), name).replace(new RegExp("%status", 'g'), status);
			}

			$("#chat #container").html(html);
		});


	}
	this.draw = draw;
}
var cm = new ChatManager(um);