import pnum from "../var/pnum.js";

export default new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
