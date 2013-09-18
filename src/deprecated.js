define([
	"./core",
	"./traversing"
], function( jQuery ) {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

var ie = document.documentMode,
	nav = navigator,
	ua = nav.userAgent,
	result = {},
	opera;

function getver(name, split) {
	return new RegExp("\\b" + name + (split || "/") + "([\\w.]+)\\b").test(ua) ? RegExp.$1 : true;
}

if ( window.opera && jQuery.isFunction(opera = window.opera.version) ) {
	//Opera lte 12, Opera 15+ is Chrome core
	result.opera = opera();
} else if( ie || !document.querySelector ){
	//IE core
	result.ie = ie || (document.compatMode === "CSS1Compat" ? "XMLHttpRequest" in window ? 7 : 6 : 5);
} else if ( window.netscape ) {
	//gecko core
	result.gecko = getver("rv", ":");
} else {
	//user appVersion, not userAnget
	ua = nav.appVersion;

	//webkit core
	result.webkit = getver("\\w*WebKit");

	if( window.chrome ){
		//Chrome
		result.chrome = getver("Chrome");
	} else if ( /^Apple/.test(nav.vendor) ){
		//Safari
		result.safari = getver("Version");
	}
}
jQuery.browser = result;

});
