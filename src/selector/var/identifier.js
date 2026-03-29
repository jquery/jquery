import { escape } from "./escape.js";

// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
//
// Note: we are not 100% aligned with the spec here; the regex
// below e.g. accepts leading digits. We'll consider increasing
// the alignment in a future major version bump.
export var identifier = "(?:" + escape + "|[\\w-]|[^\\0-\\x7f])+";
