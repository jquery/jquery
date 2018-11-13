QUnit.module( "exports", { afterEach: moduleTeardown } );

QUnit.test( "amdModule", function( assert ) {
	assert.expect( 1 );

	assert.equal( jQuery, amdDefined, "Make sure defined module matches jQuery" );
} );
