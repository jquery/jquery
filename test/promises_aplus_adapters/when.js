"use strict";

const { JSDOM } = require( "jsdom" );

const { window } = new JSDOM( "" );

const jQuery = require( "../../" )( window );

module.exports.deferred = () => {
	let adopted, promised;

	return {
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
};
