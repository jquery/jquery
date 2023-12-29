import { modules } from "./modules.js";
import { run } from "./run.js";

run( { modules, browsers: [ "chrome" ], headless: true, isolate: false } );
