module("deprecated", { teardown: moduleTeardown });

test("size()", function() {
	expect(1);
	equal( jQuery("#qunit-fixture p").size(), 6, "Get Number of Elements Found" );
});

