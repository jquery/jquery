import process from "node:process";

import { ensureIterability } from "./lib/ensure_iterability_es6.mjs";
import { getJQueryModuleSpecifier } from "./lib/jquery-module-specifier.mjs";

if ( typeof Symbol === "undefined" ) {
	console.log( "Symbols not supported, skipping the test..." );
	process.exit();
}

const jQueryModuleSpecifier = getJQueryModuleSpecifier();
await ensureIterability( jQueryModuleSpecifier );
