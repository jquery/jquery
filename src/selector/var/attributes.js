import whitespace from "../../var/whitespace.js";
import identifier from "./identifier.js";

// Attribute selectors: https://www.w3.org/TR/selectors/#attribute-selectors
export default "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

	// Operator (capture 2)
	"*([*^$|!~]?=)" + whitespace +

	// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
	"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
	whitespace + "*\\]";
