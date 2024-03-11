import assert from "node:assert/strict";

// Check if the object we got is the jQuery object by invoking a basic API.
export const ensureJQuery = ( jQuery ) => {
	assert( /^jQuery/.test( jQuery.expando ),
		"jQuery.expando was not detected, the jQuery bootstrap process has failed" );
};
