QUnit.module( "deprecated", { teardown: moduleTeardown } );

QUnit.test( "bind/unbind", function( assert ) {
	assert.expect( 4 );

	var markup = jQuery(
		"<div><p><span><b>b</b></span></p></div>"
	);

	markup
		.find( "b" )
		.bind( "click", { bindData: 19 }, function( e, trig ) {
			assert.equal( e.type, "click", "correct event type" );
			assert.equal( e.data.bindData, 19, "correct trigger data" );
			assert.equal( trig, 42, "correct bind data" );
			assert.equal( e.target.nodeName.toLowerCase(), "b", "correct element" );
		} )
		.trigger( "click", [ 42 ] )
		.unbind( "click" )
		.trigger( "click" )
		.remove();
} );

QUnit.test( "delegate/undelegate", function( assert ) {
	assert.expect( 2 );

	var markup = jQuery(
		"<div><p><span><b>b</b></span></p></div>"
	);

	markup
		.delegate( "b", "click", function( e ) {
			assert.equal( e.type, "click", "correct event type" );
			assert.equal( e.target.nodeName.toLowerCase(), "b", "correct element" );
		} )
		.find( "b" )
			.trigger( "click" )
			.end()
		.undelegate( "b", "click" )
		.remove();
} );
if ( jQuery.fn.size ) {
	QUnit.test("size()", function( assert ) {
		assert.expect( 1 );
		assert.equal( jQuery("#qunit-fixture p").size(), 6, "Get Number of Elements Found" );
	});
}
