"use strict";

const { JSDOM } = require( "jsdom" );

const { ensureJQuery } = require( "./lib/ensure_jquery" );
const { ensureGlobalNotCreated } = require( "./lib/ensure_global_not_created" );
const { getJQueryModuleSpecifier } = require( "./lib/jquery-module-specifier" );

const jQueryModuleSpecifier = getJQueryModuleSpecifier();

const { window } = new JSDOM( "" );

// Set the window global.
global.window = window;

const jQuery = require( jQueryModuleSpecifier );

ensureJQuery( jQuery );
ensureGlobalNotCreated( module.exports, window );
