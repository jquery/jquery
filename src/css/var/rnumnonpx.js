import pnum from "../../var/pnum.js";

export default new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
