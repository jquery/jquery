"use strict";

var JSDOM = require( "jsdom" ).JSDOM;
var window = new JSDOM().window;

// Pretend the window is a global.
global.window = window;

var ensureJQuery = require( "./lib/ensure_jquery" ),
	ensureGlobalNotCreated = require( "./lib/ensure_global_not_created" ),
	jQuery = require( "../../dist/jquery.js" );

ensureJQuery( jQuery );
ensureGlobalNotCreated( module.exports, window );
