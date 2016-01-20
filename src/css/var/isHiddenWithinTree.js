define( [
	"../../core",
	"../../selector"

	// css is assumed
], function( jQuery ) {

	// This function differs from the :hidden selector
	// in that it intentionally ignores hidden ancestors (gh-2404)
	return function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem.ownerDocument, elem );
	};
} );
