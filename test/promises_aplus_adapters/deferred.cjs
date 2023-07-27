"use strict";

const { JSDOM } = require( "jsdom" );

const { window } = new JSDOM( "" );

const jQuery = require( "../../" )( window );

module.exports.deferred = () => {
	const deferred = jQuery.Deferred();

	return {
		promise: deferred.promise(),
		resolve: deferred.resolve.bind( deferred ),
		reject: deferred.reject.bind( deferred )
	};
};
