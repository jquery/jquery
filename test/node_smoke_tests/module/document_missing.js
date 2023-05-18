import assert from "node:assert";
import { ensureGlobalNotCreated } from "./lib/ensure_global_not_created.js";

import jQueryFactory from "../../../dist/jquery.mjs";

assert.throws( () => {
	jQueryFactory( {} );
}, /jQuery requires a window with a document/ );

ensureGlobalNotCreated();
