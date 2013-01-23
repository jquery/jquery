module("serialize", { teardown: moduleTeardown });

test("jQuery.param()", function() {
	expect(22);

	equal( !( jQuery.ajaxSettings && jQuery.ajaxSettings.traditional ), true, "traditional flag, falsy by default" );

	var params = {"foo":"bar", "baz":42, "quux":"All your base are belong to us"};
	equal( jQuery.param(params), "foo=bar&baz=42&quux=All+your+base+are+belong+to+us", "simple" );

	params = {"string":"foo","null":null,"undefined":undefined};
	equal( jQuery.param(params), "string=foo&null=&undefined=", "handle nulls and undefineds properly" );

	params = {"someName": [1, 2, 3], "regularThing": "blah" };
	equal( jQuery.param(params), "someName%5B%5D=1&someName%5B%5D=2&someName%5B%5D=3&regularThing=blah", "with array" );

	params = {"foo": ["a", "b", "c"]};
	equal( jQuery.param(params), "foo%5B%5D=a&foo%5B%5D=b&foo%5B%5D=c", "with array of strings" );

	params = {"foo": ["baz", 42, "All your base are belong to us"] };
	equal( jQuery.param(params), "foo%5B%5D=baz&foo%5B%5D=42&foo%5B%5D=All+your+base+are+belong+to+us", "more array" );

	params = {"foo": { "bar": "baz", "beep": 42, "quux": "All your base are belong to us" } };
	equal( jQuery.param(params), "foo%5Bbar%5D=baz&foo%5Bbeep%5D=42&foo%5Bquux%5D=All+your+base+are+belong+to+us", "even more arrays" );

	params = { a:[1,2], b:{ c:3, d:[4,5], e:{ x:[6], y:7, z:[8,9] }, f:true, g:false, h:undefined }, i:[10,11], j:true, k:false, l:[undefined,0], m:"cowboy hat?" };
	equal( decodeURIComponent( jQuery.param(params) ), "a[]=1&a[]=2&b[c]=3&b[d][]=4&b[d][]=5&b[e][x][]=6&b[e][y]=7&b[e][z][]=8&b[e][z][]=9&b[f]=true&b[g]=false&b[h]=&i[]=10&i[]=11&j=true&k=false&l[]=&l[]=0&m=cowboy+hat?", "huge structure" );

	params = { "a": [ 0, [ 1, 2 ], [ 3, [ 4, 5 ], [ 6 ] ], { "b": [ 7, [ 8, 9 ], [ { "c": 10, "d": 11 } ], [ [ 12 ] ], [ [ [ 13 ] ] ], { "e": { "f": { "g": [ 14, [ 15 ] ] } } }, 16 ] }, 17 ] };
	equal( decodeURIComponent( jQuery.param(params) ), "a[]=0&a[1][]=1&a[1][]=2&a[2][]=3&a[2][1][]=4&a[2][1][]=5&a[2][2][]=6&a[3][b][]=7&a[3][b][1][]=8&a[3][b][1][]=9&a[3][b][2][0][c]=10&a[3][b][2][0][d]=11&a[3][b][3][0][]=12&a[3][b][4][0][0][]=13&a[3][b][5][e][f][g][]=14&a[3][b][5][e][f][g][1][]=15&a[3][b][]=16&a[]=17", "nested arrays" );

	params = { "a":[1,2], "b":{ "c":3, "d":[4,5], "e":{ "x":[6], "y":7, "z":[8,9] }, "f":true, "g":false, "h":undefined }, "i":[10,11], "j":true, "k":false, "l":[undefined,0], "m":"cowboy hat?" };
	equal( jQuery.param(params,true), "a=1&a=2&b=%5Bobject+Object%5D&i=10&i=11&j=true&k=false&l=&l=0&m=cowboy+hat%3F", "huge structure, forced traditional" );

	equal( decodeURIComponent( jQuery.param({ "a": [1,2,3], "b[]": [4,5,6], "c[d]": [7,8,9], "e": { "f": [10], "g": [11,12], "h": 13 } }) ), "a[]=1&a[]=2&a[]=3&b[]=4&b[]=5&b[]=6&c[d][]=7&c[d][]=8&c[d][]=9&e[f][]=10&e[g][]=11&e[g][]=12&e[h]=13", "Make sure params are not double-encoded." );

	// #7945
	equal( jQuery.param({"jquery": "1.4.2"}), "jquery=1.4.2", "Check that object with a jQuery property get serialized correctly" );

	var settings = { traditional: true };

	if ( jQuery.ajaxSettings ) {
		jQuery.ajaxSetup( settings );
	} else {
		jQuery.ajaxSettings = settings;
	}

	params = {"foo":"bar", "baz":42, "quux":"All your base are belong to us"};
	equal( jQuery.param(params), "foo=bar&baz=42&quux=All+your+base+are+belong+to+us", "simple" );

	params = {"someName": [1, 2, 3], "regularThing": "blah" };
	equal( jQuery.param(params), "someName=1&someName=2&someName=3&regularThing=blah", "with array" );

	params = {"foo": ["a", "b", "c"]};
	equal( jQuery.param(params), "foo=a&foo=b&foo=c", "with array of strings" );

	params = {"foo[]":["baz", 42, "All your base are belong to us"]};
	equal( jQuery.param(params), "foo%5B%5D=baz&foo%5B%5D=42&foo%5B%5D=All+your+base+are+belong+to+us", "more array" );

	params = {"foo[bar]":"baz", "foo[beep]":42, "foo[quux]":"All your base are belong to us"};
	equal( jQuery.param(params), "foo%5Bbar%5D=baz&foo%5Bbeep%5D=42&foo%5Bquux%5D=All+your+base+are+belong+to+us", "even more arrays" );

	params = { a:[1,2], b:{ c:3, d:[4,5], e:{ x:[6], y:7, z:[8,9] }, f:true, g:false, h:undefined }, i:[10,11], j:true, k:false, l:[undefined,0], m:"cowboy hat?" };
	equal( jQuery.param(params), "a=1&a=2&b=%5Bobject+Object%5D&i=10&i=11&j=true&k=false&l=&l=0&m=cowboy+hat%3F", "huge structure" );

	params = { "a": [ 0, [ 1, 2 ], [ 3, [ 4, 5 ], [ 6 ] ], { "b": [ 7, [ 8, 9 ], [ { "c": 10, d: 11 } ], [ [ 12 ] ], [ [ [ 13 ] ] ], { "e": { "f": { "g": [ 14, [ 15 ] ] } } }, 16 ] }, 17 ] };
	equal( jQuery.param(params), "a=0&a=1%2C2&a=3%2C4%2C5%2C6&a=%5Bobject+Object%5D&a=17", "nested arrays (not possible when jQuery.param.traditional == true)" );

	params = { a:[1,2], b:{ c:3, d:[4,5], e:{ x:[6], y:7, z:[8,9] }, f:true, g:false, h:undefined }, i:[10,11], j:true, k:false, l:[undefined,0], m:"cowboy hat?" };
	equal( decodeURIComponent( jQuery.param(params,false) ), "a[]=1&a[]=2&b[c]=3&b[d][]=4&b[d][]=5&b[e][x][]=6&b[e][y]=7&b[e][z][]=8&b[e][z][]=9&b[f]=true&b[g]=false&b[h]=&i[]=10&i[]=11&j=true&k=false&l[]=&l[]=0&m=cowboy+hat?", "huge structure, forced not traditional" );

	params = { "param1": null };
	equal( jQuery.param(params,false), "param1=", "Make sure that null params aren't traversed." );

	params = {"test": {"length": 3, "foo": "bar"} };
	equal( jQuery.param( params, false ), "test%5Blength%5D=3&test%5Bfoo%5D=bar", "Sub-object with a length property" );

	if ( jQuery.ajaxSettings === settings ) {
		delete jQuery.ajaxSettings;
	} else {
		jQuery.ajaxSetup({ traditional: false });
	}
});

test("jQuery.param() Constructed prop values", function() {
	expect( 4 );

	/** @constructor */
	function Record() {
		this["prop"] = "val";
	}

	var MyString = String,
			MyNumber = Number,
			params = { "test": new MyString("foo") };

	equal( jQuery.param( params, false ), "test=foo", "Do not mistake new String() for a plain object" );

	params = { "test": new MyNumber(5) };
	equal( jQuery.param( params, false ), "test=5", "Do not mistake new Number() for a plain object" );

	params = { "test": new Date() };
	ok( jQuery.param( params, false ), "(Non empty string returned) Do not mistake new Date() for a plain object" );

	// should allow non-native constructed objects
	params = { "test": new Record() };
	equal( jQuery.param( params, false ), jQuery.param({ "test": { "prop": "val" } }), "Allow non-native constructed objects" );
});

test("serialize()", function() {
	expect(5);

	// Add html5 elements only for serialize because selector can't yet find them on non-html5 browsers
	jQuery("#search").after(
		"<input type='email' id='html5email' name='email' value='dave@jquery.com' />" +
		"<input type='number' id='html5number' name='number' value='43' />" +
		"<input type='file' name='fileupload' />"
	);

	equal( jQuery("#form").serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&select5=3",
		"Check form serialization as query string");

	equal( jQuery("#form :input").serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&select5=3",
		"Check input serialization as query string");

	equal( jQuery("#testForm").serialize(),
		"T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=",
		"Check form serialization as query string");

	equal( jQuery("#testForm :input").serialize(),
		"T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=",
		"Check input serialization as query string");

	equal( jQuery("#form, #testForm").serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&select5=3&T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=",
		"Multiple form serialization as query string");

	/* Temporarily disabled. Opera 10 has problems with form serialization.
	equal( jQuery("#form, #testForm :input").serialize(),
		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search&email=dave%40jquery.com&number=43&select1=&select2=3&select3=1&select3=2&T3=%3F%0D%0AZ&H1=x&H2=&PWD=&T1=&T2=YES&My+Name=me&S1=abc&S3=YES&S4=",
		"Mixed form/input serialization as query string");
	*/
	jQuery("#html5email, #html5number").remove();
});
