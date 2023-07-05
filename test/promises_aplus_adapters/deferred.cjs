"use strict";

const { JSDOM } = require( "jsdom" );

const { window } = new JSDOM( "" );

const { jQueryFactory } = require( "jquery/factory" );
const jQuery = jQueryFactory( window );

module.exports.deferred = () => {
	const deferred = jQuery.Deferred();

	return {
		promise: deferred.promise(),
		resolve: deferred.resolve.bind( deferred ),
		reject: deferred.reject.bind( deferred )
	};
};
