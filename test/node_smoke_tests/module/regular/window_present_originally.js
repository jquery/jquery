import { JSDOM } from "jsdom";

import { ensureJQuery } from "../lib/ensure_jquery.js";
import { ensureGlobalNotCreated } from "../lib/ensure_global_not_created.js";
import { getJQueryModuleSpecifier } from "../lib/jquery-module-specifier.js";

const jQueryModuleSpecifier = getJQueryModuleSpecifier();

const { window } = new JSDOM( "" );

// Set the window global.
globalThis.window = window;

const { jQuery } = await import( jQueryModuleSpecifier );

ensureJQuery( jQuery );
ensureGlobalNotCreated( window );
