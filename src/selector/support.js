import support from "../var/support.js";

// Support: IE 11+
// IE doesn't support `CSS.supports( "selector(...)" )`; it will throw
// in this support test.
try {
	/* eslint-disable no-undef */

	// Support: Chrome 105+, Firefox <106, Safari 15.4+
	// Make sure forgiving mode is not used in `CSS.supports( "selector(...)" )`.
	//
	// `:is()` uses a forgiving selector list as an argument and is widely
	// implemented, so it's a good one to test against.
	support.cssSupportsSelector = CSS.supports( "selector(*)" ) &&

		// `*` is needed as Safari & newer Chrome implemented something in between
		// for `:has()` - it throws in `qSA` if it only contains an unsupported
		// argument but multiple ones, one of which is supported, are fine.
		// We want to play safe in case `:is()` gets the same treatment.
		!CSS.supports( "selector(:is(*,:jqfake))" );

	/* eslint-enable */
} catch ( e ) {
	support.cssSupportsSelector = false;
}

export default support;
