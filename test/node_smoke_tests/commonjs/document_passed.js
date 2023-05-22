"use strict";

const { JSDOM } = require( "jsdom" );

const { ensureJQuery } = require( "./lib/ensure_jquery.js" );
const { ensureGlobalNotCreated } = require( "./lib/ensure_global_not_created.js" );
const { getJQueryModuleSpecifier } = require( "./lib/jquery-module-specifier.js" );

const { window } = new JSDOM( "" );

const jQueryModuleSpecifier = getJQueryModuleSpecifier();
const jQueryFactory = require( jQueryModuleSpecifier );
const jQuery = jQueryFactory( window );

ensureJQuery( jQuery );
ensureGlobalNotCreated( module.exports );
