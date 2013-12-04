module("utilities", { teardown: moduleTeardown });

function testAttr( doc ) {
	expect( 9 );

	var el;
	if ( doc ) {
		// XML
		el = doc.createElement( "input" );
		el.setAttribute( "type", "checkbox" );
	} else {
		// Set checked on creation by creating with a fragment
		// See http://jsfiddle.net/8sVgA/1/show/light in oldIE
		el = jQuery( "<input type='checkbox' checked='checked' />" )[0];
	}

	// Set it again for good measure
	el.setAttribute( "checked", "checked" );
	el.setAttribute( "id", "id" );
	el.setAttribute( "value", "on" );

	strictEqual( Sizzle.attr( el, "nonexistent" ), null, "nonexistent" );
	strictEqual( Sizzle.attr( el, "id" ), "id", "existent" );
	strictEqual( Sizzle.attr( el, "value" ), "on", "value" );
	strictEqual( Sizzle.attr( el, "checked" ), "checked", "boolean" );
	strictEqual( Sizzle.attr( el, "href" ), null, "interpolation risk" );
	strictEqual( Sizzle.attr( el, "constructor" ), null,
		"Object.prototype property \"constructor\" (negative)" );
	strictEqual( Sizzle.attr( el, "watch" ), null,
		"Gecko Object.prototype property \"watch\" (negative)" );
	el.setAttribute( "constructor", "foo" );
	el.setAttribute( "watch", "bar" );
	strictEqual( Sizzle.attr( el, "constructor" ), "foo",
		"Object.prototype property \"constructor\"" );
	strictEqual( Sizzle.attr( el, "watch" ), "bar",
		"Gecko Object.prototype property \"watch\"" );
}

test("Sizzle.attr (HTML)", function() {
	testAttr();
});

test("Sizzle.attr (XML)", function() {
	testAttr( jQuery.parseXML("<root/>") );
});

test("Sizzle.contains", function() {
	expect( 16 );

	var container = document.getElementById("nonnodes"),
		element = container.firstChild,
		text = element.nextSibling,
		nonContained = container.nextSibling,
		detached = document.createElement("a");
	ok( element && element.nodeType === 1, "preliminary: found element" );
	ok( text && text.nodeType === 3, "preliminary: found text" );
	ok( nonContained, "preliminary: found non-descendant" );
	ok( Sizzle.contains(container, element), "child" );
	ok( Sizzle.contains(container.parentNode, element), "grandchild" );
	ok( Sizzle.contains(container, text), "text child" );
	ok( Sizzle.contains(container.parentNode, text), "text grandchild" );
	ok( !Sizzle.contains(container, container), "self" );
	ok( !Sizzle.contains(element, container), "parent" );
	ok( !Sizzle.contains(container, nonContained), "non-descendant" );
	ok( !Sizzle.contains(container, document), "document" );
	ok( !Sizzle.contains(container, document.documentElement), "documentElement (negative)" );
	ok( !Sizzle.contains(container, null), "Passing null does not throw an error" );
	ok( Sizzle.contains(document, document.documentElement), "documentElement (positive)" );
	ok( Sizzle.contains(document, element), "document container (positive)" );
	ok( !Sizzle.contains(document, detached), "document container (negative)" );
});

if ( jQuery("<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='1' width='1'><g/></svg>")[0].firstChild ) {
	test("Sizzle.contains in SVG (jQuery #10832)", function() {
		expect( 4 );

		var svg = jQuery(
			"<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='1' width='1'>" +
				"<g><circle cx='1' cy='1' r='1' /></g>" +
			"</svg>"
		).appendTo("#qunit-fixture")[0];

		ok( Sizzle.contains( svg, svg.firstChild ), "root child" );
		ok( Sizzle.contains( svg.firstChild, svg.firstChild.firstChild ), "element child" );
		ok( Sizzle.contains( svg, svg.firstChild.firstChild ), "root granchild" );
		ok( !Sizzle.contains( svg.firstChild.firstChild, svg.firstChild ), "parent (negative)" );
	});
}

test("Sizzle.uniqueSort", function() {
	expect( 14 );

	function Arrayish( arr ) {
		var i = this.length = arr.length;
		while ( i-- ) {
			this[ i ] = arr[ i ];
		}
	}
	Arrayish.prototype = {
		slice: [].slice,
		sort: [].sort,
		splice: [].splice
	};

	var i, tests,
		detached = [],
		body = document.body,
		fixture = document.getElementById("qunit-fixture"),
		detached1 = document.createElement("p"),
		detached2 = document.createElement("ul"),
		detachedChild = detached1.appendChild( document.createElement("a") ),
		detachedGrandchild = detachedChild.appendChild( document.createElement("b") );

	for ( i = 0; i < 12; i++ ) {
		detached.push( document.createElement("li") );
		detached[i].id = "detached" + i;
		detached2.appendChild( document.createElement("li") ).id = "detachedChild" + i;
	}

	tests = {
		"Empty": {
			input: [],
			expected: []
		},
		"Single-element": {
			input: [ fixture ],
			expected: [ fixture ]
		},
		"No duplicates": {
			input: [ fixture, body ],
			expected: [ body, fixture ]
		},
		"Duplicates": {
			input: [ body, fixture, fixture, body ],
			expected: [ body, fixture ]
		},
		"Detached": {
			input: detached.slice( 0 ),
			expected: detached.slice( 0 )
		},
		"Detached children": {
			input: [
				detached2.childNodes[0],
				detached2.childNodes[1],
				detached2.childNodes[2],
				detached2.childNodes[3]
			],
			expected: [
				detached2.childNodes[0],
				detached2.childNodes[1],
				detached2.childNodes[2],
				detached2.childNodes[3]
			]
		},
		"Attached/detached mixture": {
			input: [ detached1, fixture, detached2, document, detachedChild, body, detachedGrandchild ],
			expected: [ document, body, fixture ],
			length: 3
		}
	};

	jQuery.each( tests, function( label, test ) {
		var length = test.length || test.input.length;
		deepEqual( Sizzle.uniqueSort( test.input ).slice( 0, length ), test.expected, label + " (array)" );
		deepEqual( Sizzle.uniqueSort( new Arrayish(test.input) ).slice( 0, length ), test.expected, label + " (quasi-array)" );
	});
});

testIframeWithCallback( "Sizzle.uniqueSort works cross-window (jQuery #14381)", "mixed_sort.html", deepEqual );
