define([
	"./core",
	"./core/init",
	"./traversing" // parent, contents
], function( jQuery ) {

jQuery.fn.extend({
	wrapAll: function( html, clone /* true */ ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i), clone );
			});
		}

		if ( this[ 0 ] ) {

                        // The elements to wrap the target around
                        if (clone === false)
                            wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 );
                        else
                            wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html, clone /* true */ ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i), clone );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html, clone );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html, clone /* true */ ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( (isFunction ? html.call(this, i) : html), clone );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});

return jQuery;
});
