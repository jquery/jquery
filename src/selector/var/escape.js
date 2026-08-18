import { whitespace } from "../../var/whitespace.js";

// https://www.w3.org/TR/css-syntax-3/#escape-diagram
//
// The hex-digit run is matched maximally (a full 6 digits, or fewer only when
// not followed by another hex digit) so it never gives digits back to the
// `[\w-]` branch of the identifier production. Allowing that give-back let a
// chain of hex escapes backtrack exponentially (gh-5807 only removed the
// single-character `\a` ambiguity).
export var escape =
	"\\\\[\\da-fA-F]{6}" + whitespace + "?|" +
	"\\\\[\\da-fA-F]{1,5}(?![\\da-fA-F])" + whitespace + "?|" +
	"\\\\[^\\da-fA-F\\r\\n\\f]";
