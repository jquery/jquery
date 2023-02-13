import document from "../var/document.js";
import support from "../var/support.js";

// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
// Make sure the the `:has()` argument is parsed unforgivingly.
// We include `*` in the test to detect buggy implementations that are
// _selectively_ forgiving (specifically when the list includes at least
// one valid selector).
// Note that we treat complete lack of support for `:has()` as if it were
// spec-compliant support, which is fine because use of `:has()` in such
// environments will fail in the qSA path and fall back to jQuery traversal
// anyway.
try {
	document.querySelector( ":has(*,:jqfake)" );
	support.cssHas = false;
} catch ( e ) {
	support.cssHas = true;
}

export default support;
