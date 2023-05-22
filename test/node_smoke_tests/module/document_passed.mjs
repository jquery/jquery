import { JSDOM } from "jsdom";

import { ensureJQuery } from "./lib/ensure_jquery.mjs";
import { ensureGlobalNotCreated } from "./lib/ensure_global_not_created.mjs";
import { getJQueryModuleSpecifier } from "./lib/jquery-module-specifier.mjs";

const { window } = new JSDOM( "" );

const jQueryModuleSpecifier = getJQueryModuleSpecifier();
const { default: jQueryFactory } = await import( jQueryModuleSpecifier );
const jQuery = jQueryFactory( window );

ensureJQuery( jQuery );
ensureGlobalNotCreated();
