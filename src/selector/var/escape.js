import { whitespace } from "../../var/whitespace.js";

// https://www.w3.org/TR/css-syntax-3/#escape-diagram
export var escape =
	"\\\\[\\da-fA-F]{1,6}" + whitespace + "?|" +
	"\\\\[^\\da-fA-F\\r\\n\\f]";
