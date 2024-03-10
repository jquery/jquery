import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const { window } = new JSDOM( "" );

const { jQueryFactory: factoryImported } = await import( process.argv[ 2 ] );
const { jQueryFactory: factoryRequired } = await import( "../lib/jquery-require-factory.cjs" );

assert( factoryImported === factoryRequired,
	"More than one copy of jQueryFactory exists" );

assert( !( "expando" in factoryImported ),
	"jQuery.expando should not be attached to the factory" );

const $ = factoryImported( window );

assert( /^jQuery/.test( $.expando ), "jQuery.expando should be detected" );
