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
	window["moduleTeardown"] = function () {
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
	};
	
	t = function(a,b,c) {
		var f = jQuery(b).get(), s = "";

		for ( var i = 0; i < f.length; i++ ) {
			s += (s && ",") + '"' + f[i].id + '"';
		}

		deepEqual(f, q.apply(q,c), a + " (" + b + ")");
	}
}());

jQuery.noConflict(); // Allow the test to run with other libs or jQuery's.

// jQuery-specific QUnit.reset
(function() {
	var reset = QUnit.reset,
		ajaxSettings = jQuery.ajaxSettings;

	QUnit.reset = function() {
		reset.apply(this, arguments);
		jQuery.event.global = {};
		jQuery.ajaxSettings = jQuery.extend({}, ajaxSettings);
	};
})();

// load testswarm agent
(function() {
	var url = window.location.search;
	url = decodeURIComponent( url.slice( url.indexOf("swarmURL=") + 9 ) );
	if ( !url || url.indexOf("http") !== 0 ) {
		return;
	}

	// (Temporarily) Disable Ajax tests to reduce network strain
	// isLocal = QUnit.isLocal = true;

	document.write("<scr" + "ipt src='http://swarm.jquery.org/js/inject.js?" + (new Date).getTime() + "'></scr" + "ipt>");
})();
