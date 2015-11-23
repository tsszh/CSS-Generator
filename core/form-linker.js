'use strict';
// The Base Directory of all form-linker related files
var formLinkerRootDir = '../../core/';
(function($){
	var a = false, b = false, c = false;
	$.holdReady(true);
	$.getScript(formLinkerRootDir+'js/form-linker-core.js',function(){
		a = true;
		if ( a && b && c )
			$.holdReady(false);
	});
	$.getScript(formLinkerRootDir+'js/ColorPickerUtility.js',function(){
		b = true;
		if ( a && b && c )
			$.holdReady(false);
	});
	$.getScript(formLinkerRootDir+'js/setDragable.js',function(){
		c = true;
		if ( a && b && c )
			$.holdReady(false);
	});
})(jQuery)

