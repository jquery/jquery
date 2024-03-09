"use strict";

const assert = require( "node:assert/strict" );

const { ensureGlobalNotCreated } = require( "../lib/ensure_global_not_created.cjs" );
const { getJQueryModuleSpecifier } = require( "../lib/jquery-module-specifier.cjs" );

const jQueryModuleSpecifier = getJQueryModuleSpecifier();
const { jQueryFactory } = require( jQueryModuleSpecifier );

assert.throws( () => {
	jQueryFactory( {} );
}, /jQuery requires a window with a document/ );

ensureGlobalNotCreated( module.exports );
