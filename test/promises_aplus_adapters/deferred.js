"use strict";
var JSDOM = require( "jsdom" ).JSDOM;
var window = new JSDOM().window;
var jQuery = require( "../../" )( window );

module.exports.deferred = function() {
	var deferred = jQuery.Deferred();

	return {
		promise: deferred.promise(),
		resolve: deferred.resolve.bind( deferred ),
		reject: deferred.reject.bind( deferred )
	};
};
