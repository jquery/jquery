var start = new Date();

testIframe(
	"holdReady test needs to be a standalone test since it deals with DOM ready",
	"readywait.html",
	function( assert, jQuery, window, document, delayedMessage ) {
		assert.expect( 2 );
		var now = new Date();
		assert.ok( now - start >= 2000, "Must have waited 2 seconds" );
		assert.equal( delayedMessage, "It worked!" );
	}
);
