import assert from "node:assert";

import { ensureGlobalNotCreated } from "./lib/ensure_global_not_created.mjs";
import { getJQueryModuleSpecifier } from "./lib/jquery-module-specifier.mjs";

const jQueryModuleSpecifier = getJQueryModuleSpecifier();
const { default: jQueryFactory } = await import( jQueryModuleSpecifier );

assert.throws( () => {
	jQueryFactory( {} );
}, /jQuery requires a window with a document/ );

ensureGlobalNotCreated();
