/*global*/
"use strict";
$(document).ready(function(){
	$(".left-right-slider").each(function(){
		var demoPool = $(this).find(".visible-window li"),
			count = demoPool.size(),
			stepLen = 0,
			offsetBase = 0;
		function slide () {
			stepLen = demoPool.eq(0).outerWidth();
			demoPool.each(function(i){
				$(this).css("left",(i-offsetBase)*stepLen+"px");
			});
		}
		slide();
		$(window).resize(function(){
			slide(true);
		});
		$(this).find(".left-arrow").click(function(){
			if (offsetBase < count-1) {
				offsetBase = offsetBase + 1; 
				slide();
			}
		});
		$(this).find(".right-arrow").click(function(){
			if ( offsetBase > 0 ) {
				offsetBase = offsetBase - 1; 
				slide();
			}
		});
	});
	$(window).resize((function(){
		var outer = $(".main-section .stage").eq(0),
			inner = outer.find(".shape-container-wrapper").eq(0),
			size = 0;
		return function(){
			size = Math.min(outer.outerWidth(),outer.outerHeight())/2;
			inner.css({
				"width" : size,
				"height": size
			});
		}
	})());
});