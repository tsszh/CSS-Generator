/*global console,StyleForm,StyleFormDataBase,StyleFormUtility*/
"use strict";
var styleFormSetting = {
	"backgroundColor" : {
		"type" : "color-selector",
		"value" : "#AAEFFA",
		"unit" : null,
		"range" : null
	},
	"backgroundColorOpacity" : {
		"type" : "range-number",
		"value" : 1,
		"unit" : null,
		"range" : {
			"none" : [0,1,0.05]
		}
	},
	"width" : {
		"type" : "range-number",
		"value" : "300",
		"unit" : "px",
		"range" : {
			"px" : [0,350]
		}
	},
	"height" : {
		"type" : "range-number",
		"value" : "33",
		"unit" : "px",
		"range" : {
			"px" : [0,200]
		}
	},
	"borderRadius" : {
		"type" : "range-number",
		"value" : "20",
		"unit" : "px",
		"range" : {
			"px" : [0,100],
			"%"  : [0,50,1]
		}
	},
	"borderStyle" : {
		"type" : "select-list",
		"value" : "solid",
		"unit" : null,
		"range" : null
	},
	"borderWidth" : {
		"type" : "range-number",
		"value" : "2",
		"unit" : "px",
		"range" : {
			"px" : [0,30,0.5]
		}
	},
	"borderColor" : {
		"type" : "color-selector",
		"value" : "#000000",
		"unit" : null,
		"range" : null
	},
	"borderColorOpacity" : {
		"type" : "range-number",
		"value" : 1,
		"unit" : null,
		"range" : {
			"none" : [0,1,0.05]
		}
	},
	"shadowHShift" : {
		"type" : "range-number",
		"value" : "0",
		"unit" : "px",
		"range" : {
			"px" : [-250,250]
		}
	},
	"shadowVShift" : {
		"type" : "range-number",
		"value" : "0",
		"unit" : "px",
		"range" : {
			"px" : [-150,150]
		}
	},
	"shadowBlurRadius" : {
		"type" : "range-number",
		"value" : "21",
		"unit" : "px",
		"range" : {
			"px" : [0,100]
		}
	},
	"shadowSpreadRadius" : {
		"type" : "range-number",
		"value" : "0",
		"unit" : "px",
		"range" : {
			"px" : [-150,150]
		}
	},
	"shadowColor" : {
		"type" : "color-selector",
		"value" : "#00063B",
		"unit" : null,
		"range" : null
	},
	"shadowColorOpacity" : {
		"type" : "range-number",
		"value" : 1,
		"unit" : null,
		"range" : {
			"none" : [0,1,0.05]
		}
	},
	"shadowInset" : {
		"type" : "checkbox-input",
		"value": true,
		"unit" : null,
		"range" : null
	}
};
var	styleStorage = [{ // track
		value : {
			backgroundColor: "#AAEFFA",
			backgroundColorOpacity: 1,
			borderColor: "#000000",
			borderColorOpacity: 1,
			borderRadius: "20",
			borderStyle: "solid",
			borderWidth: "2",
			height: "33",
			shadowBlurRadius: "21",
			shadowColor: "#00063B",
			shadowColorOpacity: 1,
			shadowHShift: "0",
			shadowInset: true,
			shadowSpreadRadius: "0",
			shadowVShift: "0",
			width: "300"
		},
		unit : {
			backgroundColor: "",
			backgroundColorOpacity: "",
			borderColor: "",
			borderColorOpacity: "",
			borderRadius: "px",
			borderStyle: "",
			borderWidth: "px",
			height: "px",
			shadowBlurRadius: "px",
			shadowColor: "",
			shadowColorOpacity: "",
			shadowHShift: "px",
			shadowInset: "",
			shadowSpreadRadius: "px",
			shadowVShift: "px",
			width: "px"
		}
		},{ // thumb
		value : {
			backgroundColor: "#008CFF",
			backgroundColorOpacity: "1",
			borderColor: "#000000",
			borderColorOpacity: 1,
			borderRadius: "11",
			borderStyle: "solid",
			borderWidth: "1",
			height: "23",
			shadowBlurRadius: "8",
			shadowColor: "#000000",
			shadowColorOpacity: 1,
			shadowHShift: "0",
			shadowInset: true,
			shadowSpreadRadius: "2",
			shadowVShift: "0",
			width: "48"
		},
		unit : {
			backgroundColor: "",
			backgroundColorOpacity: "",
			borderColor: "",
			borderColorOpacity: "",
			borderRadius: "px",
			borderStyle: "",
			borderWidth: "px",
			height: "px",
			shadowBlurRadius: "px",
			shadowColor: "",
			shadowColorOpacity: "",
			shadowHShift: "px",
			shadowInset: "",
			shadowSpreadRadius: "px",
			shadowVShift: "px",
			width: "px"
		}
	}];
var	demoIndex = 0; // 0 for Track 1 for Thumb
var updateDemo = (function(){
	var convertToString = (function(){
		var trackTemplate = [
				"#demo::-webkit-slider-runnable-track{cursor:pointer;",
				"1 ----- width height shadow background border -----",
				";}#demo:focus::-webkit-slider-runnable-track{",
				"3 ----- background -----",
				";}#demo::-moz-range-track{cursor:pointer;",
				"5 ----- width height shadow background border -----",
				";}#demo::-ms-track{width:100%;cursor:pointer;background:transparent;border-color:transparent;color:transparent;",
				"7 ----- height -----",
				";}#demo::-ms-fill-lower{",
				"9 ----- shadow background border -----",
				";}#demo::-ms-fill-upper{",
				"11 ----- shadow background border -----",
				";}#demo:focus::-ms-fill-lower{",
				"13 ----- background -----",
				";}#demo:focus::-ms-fill-lower{",
				"15 ----- background -----",
				";}"
			],
			thumbTemplate = [
				"#demo::-webkit-slider-thumb{cursor:pointer;-webkit-appearance:none;",
				"1 ----- width height shadow background border -----",
				";}#demo::-moz-range-thumb{cursor: pointer;",
				"3 ----- width height shadow background border -----",
				";}#demo::-ms-thumb{cursor: pointer;",
				"5 ----- width height shadow background border -----",
				";}"
			];
		return function ( demoIndex ) {
			var strPool = styleLogToStringBuilder(styleStorage[demoIndex]);
			if ( demoIndex === 0 ) {
				trackTemplate[1] = strPool.join(";");
				trackTemplate[3] = strPool[2];
				trackTemplate[5] = trackTemplate[1];
				trackTemplate[7] = strPool[1];
				trackTemplate[9] = strPool.slice(2).join(";");
				trackTemplate[11] = trackTemplate[9];
				trackTemplate[13] = strPool[2];
				trackTemplate[15] = strPool[2];
				return trackTemplate.join("");
			} else {
				thumbTemplate[1] = strPool.join(";");
				thumbTemplate[3] = thumbTemplate[1];
				thumbTemplate[5] = thumbTemplate[1];
				return thumbTemplate.join("");
			}
		};
	})();
	function styleLogToStringBuilder ( styleLog ) {
		var values = styleLog["value"],
			units  = styleLog["unit"];
		return [
			"width:"+values["width"]+"px",
			"height:"+values["height"]+"px",
			"background:"+StyleFormUtility.hexToRGBA( values["backgroundColor"], values["backgroundColorOpacity"] ),
			[   "box-shadow:",
				values["shadowInset"]?"inset":"",
				values["shadowHShift"]+"px",
				values["shadowVShift"]+"px",
				values["shadowBlurRadius"]+"px",
				values["shadowSpreadRadius"]+"px",
				StyleFormUtility.hexToRGBA( values["shadowColor"], values["shadowColorOpacity"] )
			].join(" "),
			[   "border:",
				values["borderWidth"]+"px",
				values["borderStyle"],
				StyleFormUtility.hexToRGBA( values["borderColor"], values["borderColorOpacity"] )
			].join(" "),
			"border-radius:"+values["borderRadius"]+units["borderRadius"]
		];
	}
	var demo = $("#demo"),
		// demoIndex = 0, // 0 for Track 1 for Thumb
		demoStorage = [$("#slider-track-style"),$("#slider-thumb-style"),$("#thubm-center-style")];
	return function(form,name,value){
		// Update The Demo
		if ( name === "width" && demoIndex === 0 )
			demo.css("width",value+"px");
		else {
			if ( name === "borderRadius" )
				styleStorage[demoIndex]["unit"]["borderRadius"] = form.styleUnitLog["borderRadius"];
			// Align Thumb At Middle For Chrome
			if ( name === "height" || name === "borderWidth" || name === "borderStyle") {
				var trackH = styleStorage[0]["value"]["height"],
					thumbH = styleStorage[1]["value"]["height"],
					borderH= styleStorage[0]["value"]["borderStyle"]==="none"?0:styleStorage[0]["value"]["borderWidth"];
				$(demo).css("height",Math.max(trackH,thumbH));
				demoStorage[2].html("#demo::-webkit-slider-thumb{margin-top:"+((trackH-2*borderH-thumbH)/2)+"px;}");
			}
			styleStorage[demoIndex]["value"][name] = value;
			demoStorage[demoIndex].html(convertToString(demoIndex));
		}
	};
})();
var generateCSS = (function(){
	function copyToClipboard(element) {
	    var $temp = $("<textarea>")
	    $("body").append($temp);
	    $temp.val($(element).text()).select();
	    document.execCommand("copy");
	    $temp.remove();
	}
	var output = $("#output-container"),
		demo = $("#demo");
	return function(){
		var template = [
			"#demo {-webkit-appearance:none;background:inherit;",
			"width:"+demo.css("width"),
			";height:"+demo.css("height"),
			";}#demo:focus{outline:none;}",
			$("#slider-track-style").html(),
			$("#slider-thumb-style").html(),
			$("#thubm-center-style").html()
		];
		output.text(template.join("").replace(/([\{;])/g,"$1\n    ").replace(/    }/g,"}\n"));
		copyToClipboard(output);
	};
})();
$(document).ready(function(){
	$(".style-nav .switch-tabs").on("click",".switch-tab",function(event){
		$(".selected-style-panel").removeClass("selected-style-panel");
		$(event.delegateTarget).children().removeClass("selected-tab");
		$(this).addClass("selected-tab");
		$($(this).attr("target")).addClass("selected-style-panel");
	});
	var styleForm = new StyleForm($("form").get(0), styleFormSetting, updateDemo);
	(function(){
		var trackStyle = $("#target-track"),
			thumbStyle = $("#target-thumb"),
			label = $(".trackOrThumb");
		trackStyle.click(function(){
			if ( !trackStyle.hasClass("selected-tab") ) {
				thumbStyle.removeClass("selected-tab");
				trackStyle.addClass("selected-tab");
			}
			demoIndex = 0;
			styleForm.importStyle(styleStorage[0]);
			label.text("Track ");
		});
		thumbStyle.click(function(){
			if ( !thumbStyle.hasClass("selected-tab") ) {
				trackStyle.removeClass("selected-tab");
				thumbStyle.addClass("selected-tab");
			}
			demoIndex = 1;
			styleForm.importStyle(styleStorage[1]);
			label.text("Thumb ");
		});
		thumbStyle.trigger("click");
		trackStyle.trigger("click");
	})();
	(function(){ // Allow Demo Container To Change Color
		var demoContainer = $(".demoContainer").get(0);
		$(demoContainer).addPopUpColorPicker({
			initialColor : "#FAFAFA",
			position : "bottom-left",
			callback : function(color) {
				$(demoContainer).css("background-color",color);
			}
		}).setColor("#FAFAFA");
	})();
	$("#output").click(generateCSS);
	$("#demo").click(function(event){
		event.stopPropagation();
	});
});