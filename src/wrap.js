import { jQuery } from "./core.js";

import "./core/init.js";
import "./manipulation.js"; // clone
import "./traversing.js"; // parent, contents

jQuery.fn.extend( {
	wrapAll: function( html ) {
		let wrap;

		if ( this[ 0 ] ) {
			if ( typeof html === "function" ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( () => {
				let elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( typeof html === "function" ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( () => {
			let self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		let htmlIsFunction = typeof html === "function";

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( () => {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );

export { jQuery, jQuery as $ };
