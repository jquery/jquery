// Limit scope pollution from any deprecated API
(function() {
var browser = {};

//IE特有的条件编译，勿当做注释删除
if(/*@cc_on!@*/0){
	browser.msie = document.documentMode || (document.compatMode == "CSS1Compat" ? "XMLHttpRequest" in window ? 7 : 6 : 5);
	navigator.language = navigator.userLanguage;
} else if ( window.opera ) {
	//Opera
	browser.opera = opera.version();
	navigator.language = navigator.language.replace(/-\w+$/, function(str ) {
		return str.toUpperCase();
	});

} else if ( window.netscape && navigator.product == "Gecko" ) {
	//Firefox
	browser.gecko = true;
} else {
	//WebKit
	browser.webkit = true;

	if(window.chrome){
		//判定为Chrome
		browser.chrome = true;
	} else if(/^apple\s+/i.test(navigator.vendor)) {
		//判定为Safari
		browser.safari = true;
	}

}

jQuery.browser = browser;

})();
