import { JSDOM } from "jsdom";

const { window } = new JSDOM( "" );

import { ensureJQuery } from "./lib/ensure_jquery.js";
import { ensureGlobalNotCreated } from "./lib/ensure_global_not_created.js";

// Set the window global.
global.window = window;

const main = async() => {
	const { default: jQuery } = await import( "../../../dist/jquery.mjs" );

	ensureJQuery( jQuery );
	ensureGlobalNotCreated( window );
};

await main();
