/* jshint node: true */

"use strict";

require( "jsdom" ).env( "", function( errors, window ) {
	if ( errors ) {
		console.error( errors );
		return;
	}

	var jQuery = require( ".." )( window );

	exports.deferred = function() {
		var adopted, promised,
			obj = {
				resolve: function() {
					if ( !adopted ) {
						adopted = jQuery.when.apply( jQuery, arguments );
						if ( promised ) {
							adopted.then( promised.resolve, promised.reject );
						}
					}
					return adopted;
				},
				reject: function( value ) {
					if ( !adopted ) {
						adopted = jQuery.when( jQuery.Deferred().reject( value ) );
						if ( promised ) {
							adopted.then( promised.resolve, promised.reject );
						}
					}
					return adopted;
				},

				// A manually-constructed thenable that works even if calls precede resolve/reject
				promise: {
					then: function() {
						if ( !adopted ) {
							if ( !promised ) {
								promised = jQuery.Deferred();
							}
							return promised.then.apply( promised, arguments );
						}
						return adopted.then.apply( adopted, arguments );
					}
				}
			};

		return obj;
	};
} );
