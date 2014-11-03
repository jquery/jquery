define([
	"../core",
	"./support",
	"../selector",
	"../css"
], function( jQuery, support ) {

jQuery.expr.filters.hidden = function( elem ) {
	// Use OR instead of AND as the element is not visible if either is true
	// See tickets #10406 and #13132
	return !elem.offsetWidth || !elem.offsetHeight ||
		(!support.reliableHiddenOffsets() &&
			((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
};

jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};

});
