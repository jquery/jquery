define( [
	"../core"
], function( jQuery ) {

function showHide( elements, show ) {
	var elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine whether the element's hidden status needs to be changed
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( elem.getAttribute( "hidden" ) !== "hidden" ) {
			values[ index ] = show === true;
		}
	}

	// Set the hidden status of an element in a second loop to prevent constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			if ( values [ index ] ) {
				elements[ index ].removeAttribute( "hidden" );
			} else {
				elements[ index ].setAttribute( "hidden", "hidden" );
			}
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( this.getAttribute( "hidden" ) !== null ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );

return showHide;
} );
