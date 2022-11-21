import whitespace from "../../var/whitespace.js";

// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
export default "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
	"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+";
