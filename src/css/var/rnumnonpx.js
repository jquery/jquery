import { pnum } from "../../var/pnum.js";

export var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
