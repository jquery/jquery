var jQuery = this.jQuery || "jQuery", // For testing .noConflict()
	$ = this.$ || "$",
	originaljQuery = jQuery,
	original$ = $,
	amdDefined;

/**
 * Set up a mock AMD define function for testing AMD registration.
 */
function define(name, dependencies, callback) {
	amdDefined = callback();
}

define.amd = {
	jQuery: true
};

/**
 * Returns an array of elements with the given IDs, eg.
 * @example q("main", "foo", "bar")
 * @result [<div id="main">, <span id="foo">, <input id="bar">]
 */
function q() {
	var r = [];

	for ( var i = 0; i < arguments.length; i++ ) {
		r.push( document.getElementById( arguments[i] ) );
	}

	return r;
}

/**
 * Asserts that a select matches the given IDs * @example t("Check for something", "//[a]", ["foo", "baar"]);
 * @result returns true if "//[a]" return two elements with the IDs 'foo' and 'baar'
 */
function t(a,b,c) {
	var f = jQuery(b).get(), s = "";

	for ( var i = 0; i < f.length; i++ ) {
		s += (s && ",") + '"' + f[i].id + '"';
	}

	deepEqual(f, q.apply(q,c), a + " (" + b + ")");
}

var fireNative;
if ( document.createEvent ) {
	fireNative = function( node, type ) {
		var event = document.createEvent('HTMLEvents');
		event.initEvent( type, true, true );
		node.dispatchEvent( event );
	};
} else {
	fireNative = function( node, type ) {
		var event = document.createEventObject();
		node.fireEvent( 'on' + type, event );
	};
}

/**
 * Add random number to url to stop IE from caching
 *
 * @example url("data/test.html")
 * @result "data/test.html?10538358428943"
 *
 * @example url("data/test.php?foo=bar")
 * @result "data/test.php?foo=bar&10538358345554"
 */
function url(value) {
	return value + (/\?/.test(value) ? "&" : "?") + new Date().getTime() + "" + parseInt(Math.random()*100000);
}

(function () {
	// Store the old counts so that we only assert on tests that have actually leaked,
	// instead of asserting every time a test has leaked sometime in the past
	var oldCacheLength = 0,
		oldFragmentsLength = 0,
		oldTimersLength = 0,
		oldActive = 0;

	/**
	 * Ensures that tests have cleaned up properly after themselves. Should be passed as the
	 * teardown function on all modules' lifecycle object.
	 */
	this.moduleTeardown = function () {
		var i, fragmentsLength = 0, cacheLength = 0;

		// Allow QUnit.reset to clean up any attached elements before checking for leaks
		QUnit.reset();

		for ( i in jQuery.cache ) {
			++cacheLength;
		}

		jQuery.fragments = {};

		for ( i in jQuery.fragments ) {
			++fragmentsLength;
		}

		// Because QUnit doesn't have a mechanism for retrieving the number of expected assertions for a test,
		// if we unconditionally assert any of these, the test will fail with too many assertions :|
		if ( cacheLength !== oldCacheLength ) {
			equal( cacheLength, oldCacheLength, "No unit tests leak memory in jQuery.cache" );
			oldCacheLength = cacheLength;
		}
		if ( fragmentsLength !== oldFragmentsLength ) {
			equal( fragmentsLength, oldFragmentsLength, "No unit tests leak memory in jQuery.fragments" );
			oldFragmentsLength = fragmentsLength;
		}
		if ( jQuery.timers.length !== oldTimersLength ) {
			equal( jQuery.timers.length, oldTimersLength, "No timers are still running" );
			oldTimersLength = jQuery.timers.length;
		}
		if ( jQuery.active !== oldActive ) {
			equal( jQuery.active, 0, "No AJAX requests are still active" );
			oldActive = jQuery.active;
		}
	}
}());