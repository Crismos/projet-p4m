var express = require("express");

var app = express();

// ajout du dossier publique
app.use(express.static(__dirname + '/public'));

// routes
	// sans url
app.get("/", function(req, res) {
	res.sendFile("main.html", {root: './public'});
});
	// avec url
app.get("/:var", function(req, res) {
	res.sendFile("main.html", {root: './public'});
});

app.listen(3000);
console.log("running > 127.0.0.1:3000");