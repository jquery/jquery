define([
	"../core",
	"./support",
	"../selector",
	"../css"
], function( jQuery, support ) {

jQuery.expr.filters.hidden = function( elem ) {
	return !jQuery.expr.filters.visible( elem );
};

jQuery.expr.filters.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length ) &&
		( support.reliableHiddenOffsets() ||
		( ( elem.style && elem.style.display ) || jQuery.css( elem, "display" ) ) !== "none" );
};

});
