define([
	"../var/support"
], function( support ) {

support.createHTMLDocument = (function() {
	var doc = document.implementation.createHTMLDocument( "" );
	doc.body.innerHTML = "<form></form><form></form>";
	return doc.body.childNodes.length === 2;
})();

return support;
});
