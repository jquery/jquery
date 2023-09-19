import process from "node:process";

import { ensureIterability } from "../lib/ensure_iterability_es6.js";
import { getJQueryModuleSpecifier } from "../lib/jquery-module-specifier.js";

if ( typeof Symbol === "undefined" ) {
	console.log( "Symbols not supported, skipping the test..." );
	process.exit();
}

const jQueryModuleSpecifier = getJQueryModuleSpecifier();
await ensureIterability( jQueryModuleSpecifier );
