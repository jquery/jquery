module("deprecated", { teardown: moduleTeardown });

if ( jQuery.fn.size ) {
	test("size()", function() {
		expect(1);
		equal( jQuery("#qunit-fixture p").size(), 6, "Get Number of Elements Found" );
	});
}
