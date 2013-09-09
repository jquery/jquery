define(function() {
	function getStyles( elem ) {
		return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
	}
	return getStyles;
});
