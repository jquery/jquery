define( [
	"../core",
	"../data/var/dataPriv",
	"../css/var/isHidden"
], function( jQuery, dataPriv, isHidden ) {

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {
			if ( display === "none" ) {

				// Restore a pre-hide() value if we have one
				values[ index ] = dataPriv.get( elem, "display" ) || "";
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember the value we're replacing
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
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
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );

return showHide;
} );
