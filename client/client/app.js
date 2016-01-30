var express = require("express");

var app = express();

app.use(express.static(__dirname + '/public'));
app.get("/", function(req, res) {
	res.sendFile("main.html", {root: './public'});
});
app.get("/:var", function(req, res) {
	res.sendFile("main.html", {root: './public'});
});

app.listen(3000);