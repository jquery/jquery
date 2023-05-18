"use strict";

const { JSDOM } = require( "jsdom" );

const { window } = new JSDOM( "" );

// Set the window global.
global.window = window;

const ensureJQuery = require( "./lib/ensure_jquery.js" );
const ensureGlobalNotCreated = require( "./lib/ensure_global_not_created.js" );
const jQuery = require( "../../../dist/jquery.js" );

ensureJQuery( jQuery );
ensureGlobalNotCreated( module.exports, window );
