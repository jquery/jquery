import document from "../var/document.js";
import support from "../var/support.js";

// Support: Chrome 105 - 110+, Safari 15.4 - 16.3+
// Make sure forgiving mode is not used in `:has()`.
// `*` is needed as Safari & newer Chrome implemented something in between
// for `:has()` - it throws in `qSA` if it only contains an unsupported
// argument but multiple ones, one of which is supported, are fine.
// We want to play safe in case `:is()` gets the same treatment.
//
// Note that we don't need to detect the complete lack of support for `:has()`
// as then the `qSA` path will throw and fall back to jQuery traversal anyway.
try {
	document.querySelector( ":has(*,:jqfake)" );
	support.cssHas = false;
} catch ( e ) {
	support.cssHas = true;
}

export default support;
