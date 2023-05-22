"use strict";

const { JSDOM } = require( "jsdom" );

const { ensureJQuery } = require( "./lib/ensure_jquery.js" );
const { ensureGlobalNotCreated } = require( "./lib/ensure_global_not_created.js" );
const { getJQueryModuleSpecifier } = require( "./lib/jquery-module-specifier.js" );

const jQueryModuleSpecifier = getJQueryModuleSpecifier();

const { window } = new JSDOM( "" );

// Set the window global.
globalThis.window = window;

const jQuery = require( jQueryModuleSpecifier );

ensureJQuery( jQuery );
ensureGlobalNotCreated( module.exports, window );
