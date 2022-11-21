import whitespace from "../../var/whitespace.js";

export default new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" +
	whitespace + "*" );
