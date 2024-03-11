import { $ as $imported } from "jquery";
import { $ as $slimImported } from "jquery/slim";

import { jQueryFactory as jQueryFactoryImported } from "jquery/factory";
import { jQueryFactory as jQueryFactorySlimImported } from "jquery/factory-slim";

import {
	$required,
	$slimRequired,
	jQueryFactoryRequired,
	jQueryFactorySlimRequired
} from "./jquery-require.cjs";

console.assert( $required === $imported,
	"Only one copy of full jQuery should exist" );
console.assert( /^jQuery/.test( $imported.expando ),
	"jQuery.expando should be detected on full jQuery" );

console.assert( $slimRequired === $slimImported,
	"Only one copy of slim jQuery should exist" );
console.assert( /^jQuery/.test( $slimImported.expando ),
	"jQuery.expando should be detected on slim jQuery" );

console.assert( jQueryFactoryImported === jQueryFactoryRequired,
	"Only one copy of full jQueryFactory should exist" );
console.assert( !( "expando" in jQueryFactoryImported ),
	"jQuery.expando should not be attached to the full factory" );
const $fromFactory = jQueryFactoryImported( window );
console.assert( /^jQuery/.test( $fromFactory.expando ),
	"jQuery.expando should be detected on full jQuery from factory" );

console.assert( jQueryFactorySlimImported === jQueryFactorySlimRequired,
	"Only one copy of slim jQueryFactory should exist" );
console.assert( !( "expando" in jQueryFactorySlimImported ),
	"jQuery.expando should not be attached to the slim factory" );
const $fromFactorySlim = jQueryFactorySlimImported( window );
console.assert( /^jQuery/.test( $fromFactorySlim.expando ),
	"jQuery.expando should be detected on slim jQuery from factory" );
