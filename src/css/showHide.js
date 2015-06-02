define([
	"./defaultDisplay"
], function( defaultDisplay ) {

function showHide( elements, show ) {
	var elem,
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];

		// In case there is a non-element node
		if ( elem.style ) {
			elem.style.display = show ? defaultDisplay( elem ) : "none";
		}
	}

	return elements;
}

return showHide;

});
