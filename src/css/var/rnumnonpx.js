import pnum from "../../var/pnum";

export default new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
