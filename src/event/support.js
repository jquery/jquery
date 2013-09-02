define([
	"../var/support"
], function( support ) {

(function () {
	var i, eventName,
		div = document.createElement("div" );

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	// Null elements to avoid leaks in IE.
	div = null;
})();

return support;

});
