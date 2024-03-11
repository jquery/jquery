import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const { window } = new JSDOM( "" );

// Set the window global.
globalThis.window = window;

const { $: $imported } = await import( process.argv[ 2 ] );
const { $: $required } = await import( "../lib/jquery-require.cjs" );

assert( $imported === $required, "More than one copy of jQuery exists" );
assert( /^jQuery/.test( $imported.expando ), "jQuery.expando should be detected" );
