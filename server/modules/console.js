var getColor = function(string) {
  colors = {};
  colors.black = "\x1b[30m";
  colors.red = "\x1b[31m";
  colors.green = "\x1b[32m";
  colors.yellow = "\x1b[33m";
  colors.blue = "\x1b[34m";
  colors.magenta = "\x1b[35m";
  colors.cyan = "\x1b[36m";
  colors.white = "\x1b[37m";

  colors.Reset = "\x1b[0m"

  return colors[string];
}

var changeString = function(string) {
  strings = string.split("::");
  var finale = "";
  var i = 0;
  for(key in strings) {
    if(i%2 == 0) {
      //text
      finale += strings[key];
    } else {
      //couleur
      finale += getColor(strings[key]);
    }
    i++;
  }
  return finale+getColor("Reset");
}


console.log=(function() {
  var orig=console.log;
  return function() {
    try {
      var now = new Date();
      var heure   = now.getHours();
      var minute  = now.getMinutes();
      var seconde = now.getSeconds();
      if(heure<10) heure = "0"+heure;
      if(minute<10) minute = "0"+minute;
      if(seconde<10) seconde = "0"+seconde;
      var tmp=process.stdout;
      process.stdout=process.stderr;
      arguments[0] = changeString("["+heure+":"+minute+":"+seconde+"] > "+(arguments[1]||"")+arguments[0]);
      arguments[1] = "";
      orig.apply(console, arguments);
    } finally {
      process.stdout=tmp;
    }
  };
})(); 

module.exports = console;