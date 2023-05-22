import { JSDOM } from "jsdom";

import { ensureJQuery } from "./lib/ensure_jquery.mjs";
import { ensureGlobalNotCreated } from "./lib/ensure_global_not_created.mjs";
import { getJQueryModuleSpecifier } from "./lib/jquery-module-specifier.mjs";

const jQueryModuleSpecifier = getJQueryModuleSpecifier();

const { window } = new JSDOM( "" );

// Set the window global.
globalThis.window = window;

const { default: jQuery } = await import( jQueryModuleSpecifier );

ensureJQuery( jQuery );
ensureGlobalNotCreated( window );
