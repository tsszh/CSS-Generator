"use strict";
var formLinkerRootDir = "../../core/";
var ColorPickerUtility = {
	// color form utility methods
	colorFormInputHandler : function(event,inputField){
		var inputName = event.target.name,
			inputSet = "",
			inputValue,
			hex;
		switch ( inputName ) {
			case "h":
				inputValue = Number(event.target.value);
				if ( typeof inputValue !== "number" || inputValue < 0 || inputValue > 360 ) break;
			case "s":
			case "v":
				if ( !inputValue ) {
					inputValue = Number(event.target.value);
					if ( typeof inputValue !== "number" || inputValue < 0 || inputValue > 100 ) break;
				}
				hex = ColorPickerUtility.hSVtoHEX({
					h : this.elements["h"].value,
					s : this.elements["s"].value/100,
					v : this.elements["v"].value/100
				});
				inputSet = "f_hsv";
				break;
			case "r":
			case "g":
			case "b":
				inputValue = Number(event.target.value);
				if ( typeof inputValue !== "number" || inputValue < 0 || inputValue > 255 ) break;
				hex = this.elements["r"].value<<16|this.elements["g"].value<<8|this.elements["b"].value;
				inputSet = "f_rgb";
				break;
			case "hex":
				inputValue = event.target.value;
				if ( inputValue.search(/^[0-9a-f]{6}$/i) === 0 ) {
					hex = parseInt(inputValue,16);
				} else if ( inputValue.search(/^[0-9a-f]{3}$/i) === 0 ) {
					hex = parseInt(inputValue.replace(/([0-9a-f])/g,"$1$1"),16);
				}
				inputSet = "f_hex";
				break;
			default:
		}
		if ( typeof hex === "number" ) {
			if ( inputSet !== "f_hsv" ) {
				var hsv = ColorPickerUtility.hEXtoHSV(hex);
				this.elements["h"].value = Math.round(hsv.h);
				this.elements["s"].value = Math.round(hsv.s*100);
				this.elements["v"].value = Math.round(hsv.v*100);
			}
			if ( inputSet !== "f_rgb" ) {
				this.elements["r"].value = hex>>>16&0xff;
				this.elements["g"].value = hex>>>8&0xff;
				this.elements["b"].value = hex&0xff;	
			}
			if ( inputField ) inputSet = inputField;
			if ( inputSet !== "f_colorbar" ) {
				ColorPickerUtility.colorbarUpdateHandler(
					document.getElementById("color_bar_pointer"));
			}
			if ( inputSet !== "f_colormap" ) {
				ColorPickerUtility.colormapUpdateHandler(
					document.getElementById("color_map_pointer"));
				ColorPickerUtility.colormapBackgroundUpdateHandler(
					this.elements["h"].value);
			}
			hex = hex.toString(16).toUpperCase();
			if ( hex.length < 6 ) {
				hex = "000000".slice(hex.length)+hex;
			}
			this.elements["hex"].value = hex;
			document.getElementById("color_demo").style.backgroundColor = "#"+hex;
		}
	},
	// color bar utility methods
	colorbarPointerSetting : function(colorPointer) {
		var self = $(colorPointer),
			parent = self.offsetParent();
		self.data("colorbarPointerSetting",{
			"startOffset" : parent.offset().top+parseFloat(parent.css("borderTopWidth"))-self.outerHeight()/2,
			"maxScale" : parent.innerHeight(),
			"relatedInput" : $("#colorInput")[0].elements["h"]
		});
	},
	colorbarInputHandler : function(colorPointer) {
		var self = $(colorPointer),
			setting = self.data("colorbarPointerSetting");
		setting.relatedInput.value = parseInt((self.offset().top-setting.startOffset)/setting.maxScale*360);
		$(setting.relatedInput).trigger("input","f_colorbar");
	},
	colorbarUpdateHandler : function(colorPointer) {
		var self = $(colorPointer),
			setting = self.data("colorbarPointerSetting");
		self.offset({
			top : setting.startOffset+setting.relatedInput.value/360*setting.maxScale,
			left : self.offset().left
		});

	},
	colorbarClickHandler : function(event){
		var self = $("#color_bar_pointer");
		self.offset({
			top : event.pageY-self.outerHeight()/2,
			left : self.offset().left
		});
		ColorPickerUtility.colorbarInputHandler(self[0]);
	},
	// color map utility methods
	colormapPointerSetting : function(colorPointer) {
		var self = $(colorPointer),
			inputs = $("#colorInput")[0].elements,
			parent = self.offsetParent(),
			parentOffset = parent.offset();
		self.data("colormapPointerSetting",{
				startXOffset : parentOffset.left+parseFloat(parent.css("borderLeftWidth"))-self.outerWidth()/2,
				startYOffset : parentOffset.top+parseFloat(parent.css("borderTopWidth"))-self.outerHeight()/2,
				maxXScale : parent.innerWidth(),
				maxYScale : parent.innerHeight(),
				relatedXInput : inputs["s"],
				relatedYInput : inputs["v"]
			});
	},
	colormapInputHandler : function(colorPointer){
		var self = $(colorPointer),
			position = self.offset(),
			setting = self.data("colormapPointerSetting");
		setting.relatedXInput.value = Math.round((position.left-setting.startXOffset)/setting.maxXScale*100);
		setting.relatedYInput.value = Math.round(100-(position.top-setting.startYOffset)/setting.maxYScale*100);
		$(setting.relatedXInput).trigger("input","f_colormap");
	},
	colormapUpdateHandler : function(colorPointer){
		var self = $(colorPointer),
			setting = self.data("colormapPointerSetting");
		self.offset({
			top : setting.startYOffset+(100-setting.relatedYInput.value)/100*setting.maxYScale,
			left : setting.startXOffset+setting.relatedXInput.value/100*setting.maxXScale
		});
	},
	colormapBackgroundUpdateHandler : function(hValue){
		var hex = ColorPickerUtility.hSVtoHEX({h:hValue,s:1,v:1}).toString(16);
		if ( hex.length < 6 ) {
			hex = "000000".slice(hex.length)+hex;
		}
		$("#color_map_background").css("background","#"+hex);
	},
	colormapClickHandler : function(){
		var self = $("#color_map_pointer");
		self.offset({
			top : event.pageY-self.outerHeight()/2,
			left : event.pageX-self.outerWidth()/2
		});
		ColorPickerUtility.colormapInputHandler(self[0]);
	},
	// color conversion methods
	hSVtoHEX : function(hsv){
		if ( hsv.s === 0 ) {
			var v = Math.round(hsv.v * 255);
			return v<<16|v<<8|v;
		}
		var h = hsv.h;
		if ( h === 6 ) h = 0;
		var c = hsv.v * hsv.s;
		var x = (h/60)%2-1;
		x = c * ( 1 - (x>=0?x:-x) );
		var m = hsv.v - c;
		var r,g,b;
		if      ( h <  60 ) { r = c; g = x; b = 0; }
		else if ( h < 120 ) { r = x; g = c; b = 0; }
		else if ( h < 180 ) { r = 0; g = c; b = x; }
		else if ( h < 240 ) { r = 0; g = x; b = c; }
		else if ( h < 300 ) { r = x; g = 0; b = c; }
		else                { r = c; g = 0; b = x; }
		r = Math.round((r+m)*255);
		g = Math.round((g+m)*255);
		b = Math.round((b+m)*255);
		return r<<16|g<<8|b;
	},
	hEXtoHSV : function(hex){
		var r = (hex>>>16&0xFF)/255,
			g = (hex>>>8&0xFF)/255,
			b = (hex&0xFF)/255,
			cmax = Math.max(r,g,b),
			cmin = Math.min(r,g,b), 
			diff = cmax-cmin,
			hsv = {
				h : 0,
				s : 0,
				v : cmax
			};
			if ( diff ) {
				if ( r >= g && r >= b )
					hsv.h = 60*((g-b) / diff % 6);
				else if ( g >= r && g >= b )
					hsv.h = 60*((b-r)/diff + 2);
				else
					hsv.h = 60*((r-g)/diff + 4);
			}
			if ( hsv.h < 0 ) hsv.h += 360;
			if ( cmax )
				hsv.s = diff/cmax;
			return hsv;
	},
	parseColor : function(initialColor) {
		if ( typeof initialColor === "string" ) {
			if ( initialColor.search(/^#[0-9a-f]{6}$/i) === 0 ) {
				return initialColor.slice(1);
			} else if ( initialColor.search(/^#[0-9a-f]{3}$/i) === 0 ) {
				return initialColor.slice(1).replace(/([0-9a-f])/g,"$1$1");
			} else {
				return null;
			}
		}
		return null;
	}
};

var ColorPicker = (function(){
	// private variables
	var colorpickerHTML =
	'<div id="color_picker_custom" class="color_picker_style_base"> <div id="plane"> <div id="demoContainer"> <div id="color_demo"></div> </div> <div id="formContainer"> <form id="colorInput" action="demo_submit" method="get" accept-charset="utf-8"> <fieldset id="f_hsv"> <!-- <legend>HSV/HSB</legend> --> <label>H : </label><input class="inputValue" type="number" name="h" min=0 max=360 step=30 size=1/>&deg;<br> <label>S : </label><input class="inputValue" type="number" name="s" min=0 max=100 step=10 size=1/>%<br> <label>V : </label><input class="inputValue" type="number" name="v" min=0 max=100 step=10 size=1/>% </fieldset> <fieldset id="f_rgb"> <!-- <legend>RGB</legend> --> <label>R : </label><input class="inputValue" type="number" name="r" min="0" max="255" step="10" size="1"><br> <label>G : </label><input class="inputValue" type="number" name="g" min="0" max="255" step="10" size="1"><br> <label>B : </label><input class="inputValue" type="number" name="b" min="0" max="255" step="10" size="1"> </fieldset> <fieldset id="f_hex"> <!-- <legend>HEX</legend> --> <label># </label><input id="hex_input" type="text" name="hex" maxlength=6 size="6"> </fieldset> </form> </div> <div id="color_map_input"> <div id="color_map_wraper"> <div id="color_map"> <div id="color_map_background"></div> <img src="'+formLinkerRootDir+'img/map-hue.png" alt="color-map-image" style="max-width:256px;max-height:256px"/> </div> <div id="color_map_pointer"></div> </div> </div> <div id="color_bar_input"> <div id="color_bar_wraper"> <div id="color_bar"></div> <div id="color_bar_pointer"></div> </div> </div> </div> </div>';
	var styleCSS = '<link rel="stylesheet" href="'+formLinkerRootDir+'css/colorpicker.css" />';
	return function(container){
		$("<div>").html(colorpickerHTML).prependTo(container||document.body)
			.draggable({
				mousemoveCallBack : this.updateWindow
			}).css("z-index","999");
		$("#formContainer").mousedown(function(event){
			event.stopPropagation();
		});
		$(styleCSS).appendTo("head");
		// color input form
		$("#colorInput").on("input",ColorPickerUtility.colorFormInputHandler);
		// color bar
		(function(colorPointer){
			ColorPickerUtility.colorbarPointerSetting(colorPointer);
			$(colorPointer).draggable({
				wraper : document.getElementById("color_bar_wraper"),
				overflow : 0.5,
				fixedX : true,
				mousemoveCallBack : ColorPickerUtility.colorbarInputHandler
			});
			$(window).resize(function(){
				ColorPickerUtility.colorbarPointerSetting(colorPointer);
				ColorPickerUtility.colorbarUpdateHandler(colorPointer);
			});
			$("#color_bar").mousedown(ColorPickerUtility.colorbarClickHandler);
		})(document.getElementById("color_bar_pointer"));
		// color map
		(function(colorPointer){
			ColorPickerUtility.colormapPointerSetting(colorPointer);
			$(colorPointer).draggable({
				wraper : document.getElementById("color_map_wraper"),
				overflow : 0.5,
				mousemoveCallBack : ColorPickerUtility.colormapInputHandler
			});
			$(window).resize(function(){
				ColorPickerUtility.colormapPointerSetting(colorPointer);
				ColorPickerUtility.colormapUpdateHandler(colorPointer);
			});
			$("#color_map").mousedown(ColorPickerUtility.colormapClickHandler);
		})(document.getElementById("color_map_pointer"));
		this._colorPickerPlane = document.getElementById("color_picker_custom");
		this._colorhex = document.getElementById("hex_input");
	};
})();

ColorPicker.prototype = {
	constructor : ColorPicker,
	color : function(initialColor){
		if ( initialColor ) {
			var hex = initialColor.toString(16);
			if ( hex.length < 6 ) {
				hex = "000000".slice(hex.length)+hex;
			}
			$(this._colorhex).val(hex).trigger("input");
			return this;
		}
		return "#"+$(this._colorhex).val();
	},
	getColorPickerPlane : function(){
		return this._colorPickerPlane;
	},
	updateWindow : function(){ // enable the shift of colorpicker window
		$("#color_map_pointer").trigger("draggable:refresh");
		var colorPointer = document.getElementById("color_map_pointer");
		ColorPickerUtility.colormapPointerSetting(colorPointer);
		ColorPickerUtility.colormapUpdateHandler(colorPointer);
		colorPointer = document.getElementById("color_bar_pointer");
		ColorPickerUtility.colorbarPointerSetting(colorPointer);
		ColorPickerUtility.colorbarUpdateHandler(colorPointer);
	},
	addColorChangeListener : function(listener) {
		$(this._colorPickerPlane).on("input",listener);
	}
};

$.fn.extend({
	addPopUpColorPicker : (function(){
		var popUpColorPicker = null,
			popUpColorPickerPlaneHolder = null, // jquery object
			currentTarget = null;
		function popUpShowHandler(event){
			event.stopPropagation();
			if ( currentTarget ) {
				popUpHideHandler(event);
			}
			currentTarget = this;
			var selfData = $(this).data("PopUpColorPickerData"),
				popUpPos = $(this).offset();
			if ( selfData.position.search("bottom") >= 0 )
				popUpPos.top += $(this).outerHeight();
			if ( selfData.position.search("right") >= 0 )
				popUpPos.left += $(this).outerWidth();

			popUpColorPickerPlaneHolder.css({
				"top" : popUpPos.top,
				"left": popUpPos.left,
			});
			popUpColorPicker.color(selfData.colorHexString);
			popUpColorPickerPlaneHolder.show();
			popUpColorPicker.updateWindow(); // set the position of dragable item
		}
		function popUpHideHandler(event){
			event.stopPropagation();
			updateColor();
			currentTarget = null;
			popUpColorPickerPlaneHolder.hide();
		}
		function updateColor(){
			var color = popUpColorPicker.color(),
				data = $(currentTarget).data("PopUpColorPickerData");
			$(currentTarget).css("backgroundColor",color);
			data.colorHexString = color.slice(1);
			data.callback.call(currentTarget,color);
		}
		return function(setting){
			if ( !popUpColorPicker ) {
				popUpColorPicker = new ColorPicker();
				popUpColorPickerPlaneHolder = $(popUpColorPicker.getColorPickerPlane()).parent();
				popUpColorPickerPlaneHolder.css({
					"position" : "absolute"
				}).click(function(event){
					event.stopPropagation();
				});
			}
			setting = $.extend({
				realTime : true,
				initialColor : null,
				position : null,
				trigger  : "click",
				callback : function(){}
			},setting);
			var initialColor = ColorPickerUtility.parseColor(setting.initialColor);
			popUpColorPickerPlaneHolder.hide();
			this.each(function(){
				var self = $(this),
					position = setting.position;
				self.data("PopUpColorPickerData",{
					"position" : position||"bottom-right",
					"colorHexString" :  initialColor||"00FF00", // Default Initial Color
					"callback" : setting.callback,
				});
			}).on(setting.trigger,popUpShowHandler);
			if ( !$(window).data("colorPickerIsSet") ) {
				$(window).on("click",function(event){
					if ( currentTarget ) {
						popUpHideHandler(event);
					}
				}).data("colorPickerIsSet",true);
			}
			if ( setting.realTime ) {
				popUpColorPicker.addColorChangeListener(function(){
					updateColor();
				});
			}
			return this;			
		};
	})(),
	getColor : function() {
		return "#"+this.eq(0).data("PopUpColorPickerData").colorHexString;
	},
	setColor : function(color) {
		color = ColorPickerUtility.parseColor(color);
		if ( color ) {
			this.css("backgroundColor","#"+color);
			this.each(function(){
				$(this).data("PopUpColorPickerData").colorHexString = color;
			});
		}
	}
});