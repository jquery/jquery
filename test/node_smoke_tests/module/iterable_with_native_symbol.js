if ( typeof Symbol === "undefined" ) {
	console.log( "Symbols not supported, skipping the test..." );
	process.exit();
}

import { ensureIterability } from "./lib/ensure_iterability_es6.js";

await ensureIterability();
