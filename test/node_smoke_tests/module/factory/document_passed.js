import { JSDOM } from "jsdom";

import { ensureJQuery } from "../lib/ensure_jquery.js";
import { ensureGlobalNotCreated } from "../lib/ensure_global_not_created.js";
import { getJQueryModuleSpecifier } from "../lib/jquery-module-specifier.js";

const { window } = new JSDOM( "" );

const jQueryModuleSpecifier = getJQueryModuleSpecifier();
const { jQueryFactory } = await import( jQueryModuleSpecifier );
const jQuery = jQueryFactory( window );

ensureJQuery( jQuery );
ensureGlobalNotCreated();
