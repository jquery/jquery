define([
	"../core",
	"../var/strundefined",
	"../selector"
], function( jQuery, strundefined ) {

jQuery.expr.filters.hidden = function( elem ) {
	// Support: BlackBerry 5, iOS 3 (original iPhone)
	// If we don't have gBCR, just use 0,0 rather than error
	if ( typeof elem.getBoundingClientRect !== strundefined ) {
		var rect = elem.getBoundingClientRect();
		return rect.height === 0 || rect.width === 0;
	}

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};

});
