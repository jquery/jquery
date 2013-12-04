module("extending", { teardown: moduleTeardown });

test("custom pseudos", function() {
	expect( 6 );

	Sizzle.selectors.filters.foundation = Sizzle.selectors.filters.root;
	deepEqual( Sizzle(":foundation"), [ document.documentElement ], "Copy element filter with new name" );
	delete Sizzle.selectors.filters.foundation;

	Sizzle.selectors.setFilters.primary = Sizzle.selectors.setFilters.first;
	t( "Copy set filter with new name", "div:primary", ["qunit"] );
	delete Sizzle.selectors.setFilters.primary;

	Sizzle.selectors.filters.aristotlean = Sizzle.selectors.createPseudo(function() {
		return function( elem ) {
			return !!elem.id;
		};
	});
	t( "Custom element filter", "#foo :aristotlean", [ "sndp", "en", "yahoo", "sap", "anchor2", "simon" ] );
	delete Sizzle.selectors.filters.aristotlean;

	Sizzle.selectors.filters.endswith = Sizzle.selectors.createPseudo(function( text ) {
		return function( elem ) {
			return Sizzle.getText( elem ).slice( -text.length ) === text;
		};
	});
	t( "Custom element filter with argument", "a:endswith(ogle)", ["google"] );
	delete Sizzle.selectors.filters.endswith;

	Sizzle.selectors.setFilters.second = Sizzle.selectors.createPseudo(function() {
		return Sizzle.selectors.createPseudo(function( seed, matches ) {
			if ( seed[1] ) {
				matches[1] = seed[1];
				seed[1] = false;
			}
		});
	});
	t( "Custom set filter", "#qunit-fixture p:second", ["ap"] );
	delete Sizzle.selectors.filters.second;

	Sizzle.selectors.setFilters.slice = Sizzle.selectors.createPseudo(function( argument ) {
		var bounds = argument.split(":");
		return Sizzle.selectors.createPseudo(function( seed, matches ) {
			var i = bounds[1];

			// Match elements found at the specified indexes
			while ( --i >= bounds[0] ) {
				if ( seed[i] ) {
					matches[i] = seed[i];
					seed[i] = false;
				}
			}
		});
	});
	t( "Custom set filter with argument", "#qunit-fixture p:slice(1:3)", [ "ap", "sndp" ] );
	delete Sizzle.selectors.filters.slice;
});

test("backwards-compatible custom pseudos", function() {
	expect( 3 );

	Sizzle.selectors.filters.icontains = function( elem, i, match ) {
		return Sizzle.getText( elem ).toLowerCase().indexOf( (match[3] || "").toLowerCase() ) > -1;
	};
	t( "Custom element filter with argument", "a:icontains(THIS BLOG ENTRY)", ["simon1"] );
	delete Sizzle.selectors.filters.icontains;

	Sizzle.selectors.setFilters.podium = function( elements, argument ) {
		var count = argument == null || argument === "" ? 3 : +argument;
		return elements.slice( 0, count );
	};
	// Using TAG as the first token here forces this setMatcher into a fail state
	// Where the descendent combinator was lost
	t( "Custom setFilter", "form#form :PODIUM", ["label-for", "text1", "text2"] );
	t( "Custom setFilter with argument", "#form input:Podium(1)", ["text1"] );
	delete Sizzle.selectors.setFilters.podium;
});

test("custom attribute getters", function() {
	expect( 2 );

	var original = Sizzle.selectors.attrHandle.hreflang,
		selector = "a:contains('mark')[hreflang='http://diveintomark.org/en']";

	Sizzle.selectors.attrHandle.hreflang = function( elem, name ) {
		var href = elem.getAttribute("href"),
			lang = elem.getAttribute( name );
		return lang && ( href + lang );
	};

	deepEqual( Sizzle(selector, createWithFriesXML()), [], "Custom attrHandle (preferred document)" );
	t( "Custom attrHandle (preferred document)", selector, ["mark"] );

	Sizzle.selectors.attrHandle.hreflang = original;
});
