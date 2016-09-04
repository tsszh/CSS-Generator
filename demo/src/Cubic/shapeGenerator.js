/*global*/
"use strict";
var ShapeGenerator = {
	cubeGenerator : (function(){
		return {
			transformTemplete : [
				"rotateX(0deg) translateZ(200px)",
				"rotateY(180deg) translateZ(200px)",
				"rotateY(-90deg) translateZ(200px)",
				"rotateY(90deg) translateZ(200px)",
				"rotateX(90deg) translateZ(200px)",
				"rotateX(-90deg) translateZ(200px)"
			],
			reset : function(cube,width){
				$(cube).each(function(){
					var self = $(this),
						len = width||self.outerWidth(),
						templete = ShapeGenerator.cubeGenerator.transformTemplete;
					self.find("figure").each(function(i){
						var origin = templete[i];
						$(this).css("transform",
							origin.replace(/translateZ\((.*)\)/g,"translateZ("+(len/2)+"px)")
						);
					});
				});

			}
		}
	})()
}