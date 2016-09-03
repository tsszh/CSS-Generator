"use strict";
/***********************************************************************************************/
/**************************                                *************************************/
/**************************        Class StyleForm         *************************************/
/**************************                                *************************************/
/***********************************************************************************************/
var StyleFormUtility = {
	hexToRGBA : function(hexStr,opacity){
		hexStr = StyleFormUtility.parseColor(hexStr);
		if ( !hexStr ) return undefined;
		if ( opacity == 1 ) return hexStr;
		var hex = parseInt(hexStr.slice(1),16);
		return "rgba("+([
			(hex>>16)&0xFF,
			(hex>>8)&0xFF,
			(hex)&0xFF,
			parseFloat(opacity).toFixed(3)
			].join(","))+")";
	},
	rgbaToHexOpacity : function(rgba){
		var numberArray = rgba.match(/[\d.]+/g),
			hex = "#",
			i;
		for ( i = 0; i < 3; i++ ) {
			hex+=(parseInt(numberArray[i])+256).toString(16).slice(1);
		}
		return {
			"hex" : hex,
			"opacity" : parseFloat(numberArray[3]).toFixed(3)
		};
	},
	parseColor : function(hexStr) {
		if ( typeof hexStr === "string" ) {
			if ( hexStr.search(/^#[0-9a-f]{6}$/i) === 0 ) {
				return hexStr.toUpperCase();
			} else if ( hexStr.search(/^#[0-9a-f]{3}$/i) === 0 ) {
				return hexStr.toUpperCase().replace(/([0-9A-F])/g,"$1$1");
			} else {
				return undefined;
			}
		}
		return undefined;
	}
};
var StyleForm = function(form,initialization,linkToDemoMethod){
	this.form = form;
	form.styleValueLog = {};
	form.styleUnitLog = {};
	form.styleLog = {
		"value":form.styleValueLog,
		"unit" :form.styleUnitLog
	};
	form.defaultStyleLog = {
		"value" : null,
		"unit"  : null
	};
	this.linkFormDemoPair(form,initialization,linkToDemoMethod);
};
StyleForm.prototype = (function(){
	// private methods

	// input handlers
	var getInputValue = function(target){
		if ( target.is("input") ) {
			var inputValue = target.val();
			// Form Validation
			switch ( target.attr("type") ) {
				case "text" :
					if ( target.hasClass("hex-color") ) {
						var newColor = StyleFormUtility.parseColor(inputValue);
						if ( newColor && inputValue.length === 7 ) {
							target.val(newColor);
						}
						return newColor;
					}
					return inputValue;
				case "number" :
					var boundValue = parseInt(target.attr("min"));
					if ( inputValue <  boundValue ) {
						return boundValue;
					}
					boundValue = parseInt(target.attr("max"));
					if ( inputValue > boundValue ) {
						return boundValue;
					}
					return inputValue;
				case "checkbox" :
					return target.prop("checked");
				default:
					return inputValue;
			}
		} else if ( target.is("select") ) {
			return target.val();
		} else if ( target.hasClass("color-popup") ) {
			return target.getColor();
		} else {
			return undefined;
		}
	};
	var updateUIValue = function(inputFieldTarget,inputValue){
		var target = $(inputFieldTarget).closest(".input-item").find(".input-ui");
		if ( target.is("input,select") ) {
			switch ( target.attr("type") ) {
				case "checkbox" :
					target.prop("checked",inputValue);
					break;
				case "radio" :
					target.filter("#"+inputFieldTarget.attr("name").replace(/Value$/g,"-")+inputValue)
						.prop("checked","checked");
					break;
				default :
					target.val(inputValue);
			}
		} else if ( target.hasClass("color-popup") ) {
			target.setColor(inputValue);
		}
	};
	var updateUnits = function(form,inputUnitTarget,inputValue){
		var target = $(inputUnitTarget).closest(".input-item").find(".input-ui,.input-field"),
			selectedOption = $(inputUnitTarget).find("option:selected"),
			min = selectedOption.attr("min"),
			max = selectedOption.attr("max"),
			unitName = target.filter(".input-ui").attr("name");
		target.attr({
			"min": min,
			"max": max,
			"step": selectedOption.attr("step")
		});
		form.styleUnitLog[unitName] = inputValue;
		var val = parseFloat(target.filter(".input-field").val());
		if ( val < min ) val = min;
		if ( val > max ) val = max;
		target.val(val);
		return val;
	};
	var inputHandler = function(event){
		event.preventDefault();
		event.stopPropagation();
		var target = $(event.target),
		    inputName = target.attr("name"),
		    inputValue = getInputValue(target);
		if ( inputValue === undefined ) return false;
		if ( target.hasClass("input-ui") ) {
			this.elements[inputName+"Value"].value = inputValue;
		} else if ( target.hasClass("input-field") ){
			inputName = inputName.slice(0,-5);
			updateUIValue(target,inputValue);
		} else { // input-unit
			inputValue = updateUnits(this,target,inputValue);
			inputName = inputName.replace("Unit","");
		}
		this.styleValueLog[inputName] = inputValue;
		updateDemo(this,inputName,inputValue);
	};
	// retrieve style value from input or style log
	var retrieveColorStyleValue = function(form,name) {
		var opacity = $(form.elements[name+"OpacityValue"]).val(),
			value = $(form.elements[name+"Value"]).val();
		if ( value.length === 4 ) {
			value = StyleFormUtility.parseColor(value);
		}
		if ( opacity !== "1" ) {
			value = StyleFormUtility.hexToRGBA(value,opacity);
		}
		return value;
	};
	var updateDemo = function(){
	};
	var updateForm = function(form,name,value) {
		var unit  = form.styleUnitLog[name];
		// Update The Unit
		var inputUnitTarget = form.elements[name+"Unit"];
		if ( inputUnitTarget ) {
			inputUnitTarget = $(inputUnitTarget);
			var currentUnit = inputUnitTarget.val();
			if ( currentUnit === "none" ) currentUnit = "";
			if ( currentUnit !== unit ) { // Unit Changed
				inputUnitTarget.val(unit);
				updateUnits(form,inputUnitTarget,unit);
			}
		}
		// Update The Value
		var inputFieldTarget = $(form.elements[name+"Value"]);
		if ( inputFieldTarget.is("input[type='number']") ) {
			value = parseFloat(value);
		} else if ( name.search("Color") >= 0 ) {
			var opacityTarget = form.elements[name+"OpacityValue"];
			if ( value.charAt(0) === "#" ) {
				$(opacityTarget).val("1");
				updateUIValue(opacityTarget,1);
			} else {
				var hexOpa = StyleFormUtility.rgbaToHexOpacity(value);
				$(opacityTarget).val(hexOpa["opacity"]);
				updateUIValue(opacityTarget,hexOpa["opacity"]);
				value = hexOpa["hex"];
			}
		}
		inputFieldTarget.val(value);
		// Update The UI
		updateUIValue(inputFieldTarget,value);
	};
	var restoreStyleFromLog = function(form,styleLog) {
		// Copy To The StyleLog
		$.extend(true,form.styleValueLog,styleLog["value"]);
		$.extend(true,form.styleUnitLog,styleLog["unit"]);
		// Update The Form
		$.each(form.styleValueLog,function(propName,propValue){
			updateForm(form,propName,propValue);
			updateDemo(form,propName,propValue);
		});
	};
	var setStyleValue = function(name,value,demoNeedUpdate) {
		if ( demoNeedUpdate === undefined ){
			demoNeedUpdate = true;
		}
		if ( value === undefined ) {
			if ( demoNeedUpdate ){
				updateDemo(this,name,this.styleValueLog[name]);
			}
		} else {
			this.styleValueLog[name] = value;
			updateForm(this,name,value);
			if ( demoNeedUpdate ) {
				updateDemo(this,name,value);
			}
		}
	};
	var initializationParse = function(form,initialization) {
		var defaultStyleValueLog = {},
			defaultStyleUnitLog = {};
		$.each(initialization,function(name,setup){
			// 1. Store Default Value
			defaultStyleValueLog[name] = setup["value"];
			// 2. Store Default Unit
			defaultStyleUnitLog[name] = setup["unit"]||"";
			// 3. Update Input Unit UI
			if ( setup["type"] === "range-number" ) {
				var range = setup["range"],
					unitInput,
					defaultUnitName;
				// Create Unit Element ( select || span )
				if ( Object.keys(range).length > 1 ) {
					// For input with multiple units, Create new select list

					// Create <select name=xxxUnit class="input-unit"> tag
					unitInput = $("<select>").attr({
						"name" : name+"Unit",
						"class": "input-unit"
					});
					// Create option item for previous select list
					$.each(range,function(unitName,unitRange){
						unitInput.append(
							$("<option>").attr({
								"value": unitName,
								"min" : unitRange[0],
								"max" : unitRange[1],
								"step": unitRange[2]||Math.min(1,(unitRange[1]-unitRange[0])/100)
							}).text(unitName)
						);
					});
					// Set Default Value For Select List
					defaultUnitName = setup["unit"]||"none";
					unitInput.val(defaultUnitName);
				} else {
					// For input with single unit, Create new span tag
					for ( var unitName in range ) {
						unitInput = $("<span class='input-unit-fixed'>")
							.text(unitName==="none"?"":unitName);
						defaultUnitName = unitName;
					}
				}

				// Add Unit Element After input-field element
				$(form.elements[name+"Value"]).after(unitInput);
				// Adjust The Range Of "input-range" elements
				var currentRange = range[defaultUnitName];
				unitInput.closest(".input-item").find(".input-ui, .input-field").attr({
					"min" : currentRange[0],
					"max" : currentRange[1],
					"step": currentRange[2]||Math.min(1,(currentRange[1]-currentRange[0])/100)
				});
			}
		});
		return {
			"value" : defaultStyleValueLog,
			"unit" : defaultStyleUnitLog
		};
	};
	// public methods
	return {
		constructor : StyleForm,
		exportStyle : function () {
			var ret = {
				"value" : {},
				"unit"  : {}
			};
			$.extend(true,ret["value"],this.form.styleValueLog);
			$.extend(true,ret["unit"] ,this.form.styleUnitLog );
			return ret;
		},
		importStyle : function ( styleLog ) {
			restoreStyleFromLog(this.form,styleLog);
		},
		resetStyle : function ( ) {
			restoreStyleFromLog(this.form,this.form.defaultStyleLog);
		},

		linkFormDemoPair : function(form,initialization,linkToDemoMethod){
		// Connection Between Form And Demo
		updateDemo = linkToDemoMethod;
		form.setStyleValue = setStyleValue;
		form.defaultStyleLog = initializationParse(form,initialization);
		// event handlers
		$(form).on("input change",inputHandler)
			   .on("blur",".hex-color",function(){
			   		var hex = StyleFormUtility.parseColor($(this).val()) ||
			   			$(this).parent().find(".color-popup").getColor();
			   		$(this).val(hex);
			   });
		$(".color-popup").addPopUpColorPicker({
			position : "top-right",
			callback : function(){
				$(this).trigger("input");
			}
		});

		// Initialize the value
		restoreStyleFromLog(form,form.defaultStyleLog);
	}
	};
})();

/***********************************************************************************************/
/**************************                                *************************************/
/**************************     Class StyleFormDataBase    *************************************/
/**************************                                *************************************/
/***********************************************************************************************/
var StyleFormDataBase = function( styleForm ) {
	this.styleForm = styleForm;
	this.storedInfo = [];
};
StyleFormDataBase.prototype = {
	saveCurrentStyle : function(){
		var style = $.extend(true,{},this.styleForm.exportStyle());
		this.storedInfo.push(style);
		return style;
	},
	resetToDefault : function(){
		this.styleForm.resetStyle();
	},
	openStyleLog : function(index) {
		if ( typeof index === "undefined" ) {
			index = 0;
		}
		var log = this.storedInfo[index];
		if ( log ) {
			this.styleForm.importStyle(log);
		}
	},
	deleteStyleLog : function(index) {
		if ( typeof index === "number" ) {
			if ( index < this.storedInfo.length ) {
				this.storedInfo.splice(index,1);
			}
		} else { // clean all
			this.storedInfo = [];
		}
	}
};

window.StyleFormUtility = StyleFormUtility
window.StyleForm = StyleForm
window.StyleFormDataBase = StyleFormDataBase
