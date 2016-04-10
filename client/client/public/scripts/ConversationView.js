function ConversationView(cm) {

	var cm = cm;

	this.event = function() {
		// event user
		cm.onRmConv("chat view draw", drawUsers);
		cm.onNewConv("chat view draw", drawUsers);
		cm.onUpConv("chat view draw", drawUsers);
		cm.onWelcome("chat view draw", drawWelcome);
		cm.onOpen("chat open conv view", open);
		//event message
		cm.onNewMsg("chat message", drawConv);
	}

	function drawWelcome(convs) {
		console.log("VIEW :: Conversation.welcome");
		var tab = [];
		var order = Object.keys(convs).sort(
				function(a,b){
					// tri par status et par nom
					return (convs[a].conv.notif() - convs[b].conv.notif())*2+(convs[b].user.status - convs[a].user.status)+(convs[a].user.name > convs[b].user.name)*0.25;
				});
		for(var k in order) {
			tab.push(convs[order[k]]);
		}
	
		TEMPLATE.get("chatUser", function(data) {
			var html = "";
			for(var key in tab) {
				var replace = {id: tab[key].user.id,name: tab[key].user.name, status: (tab[key].user.status == 0 ? "online" : "ongame")};

				html += TEMPLATE.parse(data, replace);
			}
			$("#chat #container").html(html);
		});
	}

	function drawUsers() {
		console.log("VIEW :: Conversation.user");
		var convs = cm.getConvs();
		drawWelcome(convs);
	}

	function open(conv) {
		console.log("VIEW :: Conversation.open");

		TEMPLATE.get("convHeader", function(data) {
			var html = "";
			var replace = {id: conv.user.id,name: conv.user.name, status: (conv.user.status == 0 ? "online" : "ongame")};
			html += TEMPLATE.parse(data, replace);
			$("#conversation .header").html(html);
			$("#conversation").attr("data-id", conv.user.id);
			$('#msg').focus();
		});
	}

	function drawConv(conv) {
		console.log("VIEW :: Conversation.conv");
		var messages = conv.conv.read;
		TEMPLATE.get("message", function(data) {
			var html = "";
			for(var key in messages) {
				var me = messages[key].me;
				
				var replace = {text: messages[key].text, me: (me ? "me" : "other")};
				html += TEMPLATE.parse(data, replace);
			}
			$("#conversation .container .messages").html(html);
		});
	}

}

var cv = new ConversationView(cm);