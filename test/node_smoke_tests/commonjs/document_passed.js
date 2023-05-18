"use strict";

const { JSDOM } = require( "jsdom" );

const { window } = new JSDOM( "" );

const ensureJQuery = require( "./lib/ensure_jquery.js" );
const ensureGlobalNotCreated = require( "./lib/ensure_global_not_created.js" );
const jQuery = require( "../../../dist/jquery.js" )( window );

ensureJQuery( jQuery );
ensureGlobalNotCreated( module.exports );
