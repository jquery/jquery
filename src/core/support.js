define([
	"../var/document",
	"../var/support"
], function( document, support ) {

support.createHTMLDocument = (function() {
	var doc = document.implementation.createHTMLDocument( "" );
	// Support: Node with jsdom<=1.5.0+
	// jsdom's document created via the above method doesn't contain the body
	if ( !doc.body ) {
		return false;
	}
	doc.body.innerHTML = "<form></form><form></form>";
	return doc.body.childNodes.length === 2;
})();

return support;
});
