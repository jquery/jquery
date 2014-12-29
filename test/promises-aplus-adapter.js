/*jshint es3:false, node:true */
"use strict";

require( "jsdom" ).env( "", function ( errors, window ) {
	if ( errors ) {
		console.error( errors );
		return;
	}

	var jQuery = require( ".." )( window );

	exports.deferred = function () {
		var deferred = jQuery.Deferred();

		return {
			get promise() {
				return deferred.promise();
			},
			resolve: deferred.resolve.bind( deferred ),
			reject: deferred.reject.bind( deferred )
		};
	};
});
