/**
 * Allow the test suite to run with other libs or jQuery's.
 */
jQuery.noConflict();

// Expose Sizzle for Sizzle's selector tests
// We remove Sizzle's globalization in jQuery
var Sizzle = Sizzle || jQuery.find;

// Allow subprojects to test against their own fixtures
var qunitModule = QUnit.module;
function testSubproject( label, url, risTests ) {
	module( "Subproject: " + label );

	module = QUnit.module = function( name ) {
		return qunitModule.apply( this, [ label + ": " + name ].concat( [].slice.call( arguments, 1 ) ) );
	};

	test( "Copy test fixture", function() {
		expect(3);

		// Don't let subproject tests jump the gun
		QUnit.config.reorder = false;

		stop();
		jQuery.ajax( url, {
			dataType: "html",
			error: function( jqXHR, status ) {
				ok( false, "Retrieved test page: " + status );
			},
			success: function( data ) {
				var page, fixture, fixtureHTML,
					oldFixture = jQuery("#qunit-fixture");

				ok( data, "Retrieved test page" );
				try {
					page = jQuery( jQuery.parseHTML(
						data.replace( /(<\/?)(?:html|head)\b/g, "$1div" ),
						document,
						true
					) );

					// Get the fixture, including content outside of #qunit-fixture
					fixture = page.find("[id='qunit-fixture']");
					fixtureHTML = fixture.html();
					fixture.empty();
					while ( fixture.length && !fixture.prevAll("[id^='qunit-']").length ) {
						fixture = fixture.parent();
					}
					fixture = fixture.add( fixture.nextAll() );
					ok( fixture.html(), "Found test fixture" );

					// Replace the current fixture, again including content outside of #qunit-fixture
					while ( oldFixture.length && !oldFixture.prevAll("[id^='qunit-']").length ) {
						oldFixture = oldFixture.parent();
					}
					oldFixture.nextAll().remove();
					oldFixture.replaceWith( fixture );

					// WARNING: UNDOCUMENTED INTERFACE
					QUnit.config.fixture = fixtureHTML;
					QUnit.reset();
					equal( jQuery("#qunit-fixture").html(), fixtureHTML, "Copied test fixture" );

					// Include subproject tests
					page.find("script[src]").add( page.filter("script[src]") ).filter(function() {
						var src = jQuery( this ).attr("src");
						if ( risTests.test( src ) ) {
							this.src = url + src;
							return true;
						}
					}).appendTo("head:first");
				} catch ( x ) {
					ok( false, "Failed to copy test fixture: " + ( x.message || x ) );
				}
			},
			complete: function() {
				start();
			}
		});
	});
}

/**
 * QUnit hooks
 */
(function() {
	// jQuery-specific QUnit.reset
	var reset = QUnit.reset,
		ajaxSettings = jQuery.ajaxSettings;

	QUnit.reset = function() {
		reset.apply(this, arguments);
		jQuery.event.global = {};
		jQuery.ajaxSettings = jQuery.extend({}, ajaxSettings);
	};
})();

/**
 * QUnit configuration
 */
// Max time for stop() and asyncTest() until it aborts test
// and start()'s the next test.
QUnit.config.testTimeout = 20 * 1000; // 20 seconds

/**
 * Load the TestSwarm listener if swarmURL is in the address.
 */
(function() {
	var url = window.location.search;
	url = decodeURIComponent( url.slice( url.indexOf("swarmURL=") + "swarmURL=".length ) );

	if ( !url || url.indexOf("http") !== 0 ) {
		return;
	}

	// (Temporarily) Disable Ajax tests to reduce network strain
	// isLocal = QUnit.isLocal = true;

	document.write("<scr" + "ipt src='http://swarm.jquery.org/js/inject.js?" + (new Date).getTime() + "'></scr" + "ipt>");
})();
