define([
	"../var/support"
], function( support ) {

support.createHTMLDocument = (function() {
	if ( !document.implementation.createHTMLDocument ) {
		return false;
	}
	var doc = document.implementation.createHTMLDocument( "" );
	doc.body.innerHTML = "<form></form><form></form>";
	return doc.body.childNodes.length === 2;
})();

return support;
});
