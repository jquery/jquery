"use strict";

const $ = require( "jquery" );
const $slim = require( "jquery/slim" );

const { jQueryFactory } = require( "jquery/factory" );
const { jQueryFactory: jQueryFactorySlim } = require( "jquery/factory-slim" );

module.exports.$required = $;
module.exports.$slimRequired = $slim;
module.exports.jQueryFactoryRequired = jQueryFactory;
module.exports.jQueryFactorySlimRequired = jQueryFactorySlim;
