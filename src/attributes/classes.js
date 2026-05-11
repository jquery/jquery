import { jQuery } from "../core.js";
import { stripAndCollapse } from "../core/stripAndCollapse.js";
import { rnothtmlwhite } from "../var/rnothtmlwhite.js";

import "../core/init.js";

function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classNames, cur, curValue, i, finalValue;

		if ( typeof value === "function" ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {
						if ( cur.indexOf( " " + classNames[ i ] + " " ) < 0 ) {
							cur += classNames[ i ] + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, cur, curValue, i, finalValue;

		if ( typeof value === "function" ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {
				curValue = getClass( this );

				// This expression is here for better compressibility (see addClass)
				cur = this.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					for ( i = 0; i < classNames.length; i++ ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + classNames[ i ] + " " ) > -1 ) {
							cur = cur.replace( " " + classNames[ i ] + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						this.setAttribute( "class", finalValue );
					}
				}
			} );
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var classNames, i, self;

		if ( typeof value === "function" ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		if ( typeof stateVal === "boolean" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		classNames = classesToArray( value );

		if ( classNames.length ) {
			return this.each( function() {

				// Toggle individual class names
				self = jQuery( this );

				for ( i = 0; i < classNames.length; i++ ) {

					// Check each className given, space separated list
					if ( self.hasClass( classNames[ i ] ) ) {
						self.removeClass( classNames[ i ] );
					} else {
						self.addClass( classNames[ i ] );
					}
				}
			} );
		}

		return this;
	},

	hasClass: function( selector ) {
		var className, i;

		className = " " + selector + " ";
		for ( i = 0; i < this.length; i++ ) {
			if ( this[ i ].nodeType === 1 &&
				( " " + stripAndCollapse( getClass( this[ i ] ) ) + " " )
					.indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );
