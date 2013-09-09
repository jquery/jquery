define(function() {
	// NOTE: we've included the "window" in window.getComputedStyle
	// because jsdom on node.js will break without it.
	return function getStyles( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	};
});
