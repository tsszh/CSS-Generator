"use strict";
(function ($) {
	$.fn.extend({
		draggable : function(option) {
			var setting = $.extend(true, {}, $.fn.draggableDefault, option);
			this.addClass("dragItem");
			this.each(function() {
				$(this).data("drag_setting", $.extend(true, {}, setting) );
			});
			itemRegister(true,this);
			if ( !$("body").data("isDragItemHandlerRegistered") ) {
				$("body")
					.data("isDragItemHandlerRegistered",true)
					.on("mousedown", ".dragItem", mouseDownHandler);
			}
			if ( setting.boundWindow==="body" || !$(setting.boundWindow).data("isDragItemHandlerRegistered") ) {
				$(setting.boundWindow)
					.data("isDragItemHandlerRegistered",true)
					.resize(itemRegister)
					.on("draggable:refresh",itemRegister)
					.mousemove(mouseMoveHandler)
					.mouseup(mouseUpHandler);
				if ( setting.boundWindow !== window ) {
					$(setting.boundWindow).mouseleave(mouseUpHandler);
				}
			}
			return this;
		},
		draggableCleanUp : function() {
			$("body").removeData("isDragItemHandlerRegistered")
				.off("mousedown",".dragItem",mouseDownHandler);
			this.find("dragItem").removeClass("dragItem")
				.each(function(){
					var boundWindow = $(this).data("drag_setting").boundWindow;
					if ( typeof $(boundWindow).data("isDragItemHandlerRegistered") === "boolean" ) {
						$(boundWindow).removeData("isDragItemHandlerRegistered")
							.off("resize",itemRegister)
							.off("draggable:refresh",itemRegister)
							.off("mousemove",mouseMoveHandler)
							.off("mouseup",mouseUpHandler);
						if ( boundWindow !== window ) {
							$(boundWindow).off("mouseleave",mouseUpHandler);
						}
					}
 					$(this).removeData("drag_setting");
				});
		},
		draggableDefault : {
			//"draggable:refresh" force to update the wraper area
			"wraper" : null,
			"boundWindow" : window,
			"overflow" : 0,
			"fixedX" : false,
			"fixedY" : false,
			"isMouseFixedPos": false,
			"clickoffset" : {top:0,left:0},
			"availPos" : {minTop:0,minLeft:0,maxTop:0,maxLeft:0},
			"mousemoveCallBack" : function(){},
			"mouseupCallBack" : function(){}
		}
	});
	// Private Methods
	var mouseMoveHandler = function(event) {
		var dragItem = $("body").data("currentItemToBeDragged");
		if (dragItem) {
			event.preventDefault();
			event.stopPropagation();
			var setting = $(dragItem).data("drag_setting");
			var dragItemBound = setting.availPos;
			var x = event.pageX - setting.clickoffset.left;
			var y = event.pageY - setting.clickoffset.top;
			$(dragItem).offset({
				top: (y < dragItemBound.minTop ? dragItemBound.minTop :
					(y > dragItemBound.maxTop ? dragItemBound.maxTop : y)),
				left: (x < dragItemBound.minLeft ? dragItemBound.minLeft :
					(x > dragItemBound.maxLeft ? dragItemBound.maxLeft : x))
			});
			setting.mousemoveCallBack(dragItem);
		}
	};
	var mouseUpHandler = function() {
		if ( $("body").data("currentItemToBeDragged") ) {
			$("body").data("currentItemToBeDragged",null);
		}
	};
	var mouseDownHandler = function(event) {
		event.stopPropagation();
		event.preventDefault();
		$("body").data("currentItemToBeDragged", this);
		var target = $(this);
		var setting = target.data("drag_setting");
		if ( !setting.isMouseFixedPos ) {
			var offset = target.offset();
			setting.clickoffset.top = event.pageY - offset.top;
			setting.clickoffset.left = event.pageX - offset.left;
		}
		// console.log($(this).data("drag_setting"));
	};
	var itemRegister = function( isPartial,itemsToBeRegistered ) {
		if ( isPartial !== true  )
			itemsToBeRegistered = $(".dragItem");
		itemsToBeRegistered.each(function() {
			var self = $(this);
			var setting = self.data("drag_setting");
			var wraper = null;
			if ( !setting.wraper ) {
				wraper = self.offsetParent();
				if ( setting.boundWindow !== window ) {
					var parent = wraper.closest(setting.boundWindow);
					if ( parent.length === 0 )
						wraper = $(setting.boundWindow);
				}
				setting.wraper = wraper[0];
			} else {
				wraper = $(setting.wraper);
			}

			var wraperOffset = wraper.offset();
			wraperOffset.left += parseFloat(wraper.css("borderLeftWidth"));
			wraperOffset.top += parseFloat(wraper.css("borderTopWidth"));
			var wraperDimension = {
				height : wraper.innerHeight(),
				width : wraper.innerWidth()
			};
			if ( wraper.is("body,html") ) {
				wraperDimension.height = Math.max(wraperDimension.height,$(setting.boundWindow).innerHeight());
				wraperDimension.width = Math.max(wraperDimension.width,$(setting.boundWindow).innerWidth());
			}
			var overflow = setting.overflow,
				position = self.offset();
			setting.availPos = {
				minTop: setting.fixedY?position.top:(wraperOffset.top - self.outerHeight() * overflow),
				minLeft: setting.fixedX?position.left:(wraperOffset.left - self.outerWidth() * overflow),
				maxTop: setting.fixedY?position.top:(wraperOffset.top + wraperDimension.height - self.outerHeight() * (1-overflow)),
				maxLeft: setting.fixedX?position.left:(wraperOffset.left + wraperDimension.width - self.outerWidth() * (1-overflow))
			};
		});
	};
})(jQuery);