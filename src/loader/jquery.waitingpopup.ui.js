(function(b){var a={init:function(c){var d={ajaxBinding:true,lableText:"Please wait...",sublableText:"loading"};
if(c){b.extend(d,c)
}if(b("#waiting_popup").length<1){b("body").append("<div id='waiting_popup' style='display:none;' class='waitingpopup-content'><div class='waitingpopup-content-lable'>"+d.lableText+"</div><div class='waitingpopup-content-sublable'>"+d.sublableText+"</div></div>");
var e=b.browser.msie?180:100;
b("#waiting_popup").dialog({dialogClass:"waitingpopup",autoOpen:false,width:250,height:e,modal:true,draggable:false,resizable:false,closeOnEscape:false});
b(".waitingpopup .ui-dialog-titlebar").hide()
}
},open:function(){b("#waiting_popup").dialog("open")
},close:function(){b("#waiting_popup").dialog("close")
}};
b.fn.waitingpopup=function(c){if(a[c]){return a[c].apply(this,Array.prototype.slice.call(arguments,1))
}else{if(typeof c==="object"||!c){return a.init.apply(this,arguments)
}else{b.error("Method "+c+" does not exist on jQuery.waitingpopup")
}}}
})(jQuery);
