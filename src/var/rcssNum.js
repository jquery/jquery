import pnum from "../var/pnum";

export default new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );
