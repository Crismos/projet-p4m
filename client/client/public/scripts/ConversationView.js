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
	
		TEMPLATE.get("chatUser", function(data) {
			var html = "";
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

	function open(conv) {
		TEMPLATE.get("convHeader", function(data) {
			var html = "";
			var replace = {id: key,name: conv.user.name, status: (conv.user.status == 0 ? "online" : "ongame")};
			html += TEMPLATE.parse(data, replace);
			$("#conversation .header").html(html);
			$("#conversation").attr("data-id", id);
			$('#msg').focus();
		});
	}

	function drawConv(conv) {
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