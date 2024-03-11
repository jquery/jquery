import { $ } from "jquery";
import { $ as $slim } from "jquery/slim";

import { jQueryFactory } from "jquery/factory";
import { jQueryFactory as jQueryFactorySlim } from "jquery/factory-slim";

console.assert( /^jQuery/.test( $.expando ),
	"jQuery.expando should be detected on full jQuery" );
console.assert( /^jQuery/.test( $slim.expando ),
	"jQuery.expando should be detected on slim jQuery" );

console.assert( !( "expando" in jQueryFactory ),
	"jQuery.expando should not be attached to the full factory" );
const $fromFactory = jQueryFactory( window );
console.assert( /^jQuery/.test( $fromFactory.expando ),
	"jQuery.expando should be detected on full jQuery from factory" );

console.assert( !( "expando" in jQueryFactorySlim ),
	"jQuery.expando should not be attached to the slim factory" );
const $fromFactorySlim = jQueryFactorySlim( window );
console.assert( /^jQuery/.test( $fromFactorySlim.expando ),
	"jQuery.expando should be detected on slim jQuery from factory" );
