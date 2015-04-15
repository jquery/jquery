define([
	"../core",
	"../selector"
], function( jQuery ) {

jQuery.expr.filters.hidden = function( elem ) {
	// Use OR instead of AND as the element is not visible if either is true
	// See tickets #10406 and #13132
	var rect = elem.getBoundingClientRect();
	return !rect.height || !rect.width;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};

});
