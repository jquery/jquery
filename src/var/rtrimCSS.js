import { whitespace } from "./whitespace.js";

// Leading and non-escaped trailing whitespace. Escape sequences are captured so
// they can be preserved via a `$1` replacement, which keeps an escaped trailing
// whitespace from being trimmed. Consuming each escape as a single unit (rather
// than re-scanning a `(?:\\.)*` run from every offset) keeps matching linear and
// avoids quadratic backtracking on long escape-heavy input.
export var rtrimCSS = new RegExp(
	"^" + whitespace + "+|" + whitespace + "+$|(\\\\[\\s\\S])",
	"g"
);
