function ConversationView(cm) {

	var cm = cm;

	this.event = function() {
		cm.onRmConv("chat view draw", drawUsers);
		cm.onNewConv("chat view draw", drawUsers);
		//um.onMessage("chat view draw", drawUser);
		cm.onUpConv("chat view draw", drawUsers);
		cm.onWelcome("chat view draw", drawWelcome);
	}

	function drawWelcome(convs) {
		console.log(convs);
		var html = "";

		TEMPLATE.get("chatUser", function(data) {
			for(var key in convs) {
				var replace = {id: key,name: convs[key].user.name, status: (convs[key].user.status == 0 ? "online" : "ongame")};

				html += TEMPLATE.parse(data, replace);
			}

			$("#chat #container").html(html);
		});
	}

	function drawUsers() {
		var convs = cm.getConvs();
		drawWelcome(convs);
	}

}

var cv = new ConversationView(cm);