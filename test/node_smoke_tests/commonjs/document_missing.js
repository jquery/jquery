"use strict";

const assert = require( "node:assert" );

const { ensureGlobalNotCreated } = require( "./lib/ensure_global_not_created.js" );
const { getJQueryModuleSpecifier } = require( "./lib/jquery-module-specifier.js" );

const jQueryModuleSpecifier = getJQueryModuleSpecifier();
const jQueryFactory = require( jQueryModuleSpecifier );

assert.throws( () => {
	jQueryFactory( {} );
}, /jQuery requires a window with a document/ );

ensureGlobalNotCreated( module.exports );
