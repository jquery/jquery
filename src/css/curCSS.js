define([
	"../core",
	"./var/rnumnonpx",
	"./var/rmargin",
	"./var/getStyles",
	"../selector" // contains
], function( jQuery, rnumnonpx, rmargin, getStyles ) {

function curCSS( elem, name, computed ) {
	var ret;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}
	}

	return ret !== undefined ?
		// Support: IE9-11+
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}

return curCSS;
});
