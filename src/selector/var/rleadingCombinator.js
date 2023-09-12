import { whitespace } from "../../var/whitespace.js";

export var rleadingCombinator = new RegExp( "^" + whitespace + "*([>+~]|" +
	whitespace + ")" + whitespace + "*" );
