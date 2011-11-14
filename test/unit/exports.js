module("exports", { teardown: moduleTeardown });

test("amdModule", function() {
	expect(1);

	equal( jQuery, amdDefined, "Make sure defined module matches jQuery" );
});
