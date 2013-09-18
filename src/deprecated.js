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
	result = {};

function getver(name, split) {
	return new RegExp("\\b" + name + (split || "/") + "([\\w.]+)\\b").test(ua) ? RegExp.$1 : true;
}

if( ie || !document.querySelector ){
	result.ie = ie || (document.compatMode == "CSS1Compat" ? "XMLHttpRequest" in window ? 7 : 6 : 5);
} else if ( window.opera && opera.version ) {
	//老版本Opera(<=12)，>=15以后采用Chrome内核
	result.opera = opera.version();
} else if ( window.netscape ) {
	result.gecko = getver("rv", ":");
} else {
	ua = nav.appVersion;
	result.webkit = getver("\\w*WebKit");
	if( window.chrome ){
		//判定为Chrome
		result.chrome = getver("Chrome");
	} else if ( /^Apple/.test(nav.vendor) ){
		//判定为Safari
		result.safari = getver("Version");
	}
}
jQuery.browser = result;

});
