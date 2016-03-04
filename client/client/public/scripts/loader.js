var preload = ["images/blurredBg/1.jpg"
			, "images/blurredBg/2.jpg"
			, "images/blurredBg/3.jpg"
			, "images/blurredBg/4.jpg"
			, "images/blurredBg/5.jpg"
			, "images/blurredBg/6.jpg"
			, "images/blurredBg/7.jpg"
			, "images/blurredBg/8.jpg"];
var promises = [];
for (var i = 0; i < preload.length; i++) {
	console.log(i);
    (function(url, promise) {
        var img = new Image();
        img.onload = function() {
          promise.resolve();
        };
        img.src = url;
    })(preload[i], promises[i] = $.Deferred());
}
$.when.apply($, promises).done(function() {

	for(var i=1; i<9; i++) {
		$("#img"+i).attr("src","images/blurredBg/"+i+".jpg");
	}
	function swap() {
		var active = $('#background .active');
	  	var next = ($('#background .active').next().length > 0) ? $('#background .active').next() : $('#background img:first');
	  	console.log(next);
	  	$("#background-switcher img").attr("src", next.attr("src"));
	  	active.fadeOut(5000,function(){
	    	active.removeClass('active');
	    	next.fadeIn(5000).addClass('active');
	  	});
	}
	swap();
	setInterval(swap, 10000);
 	
});