module("selector");

test("element", function() {
	expect(8);
	ok( $("*").size() >= 30, "Select all" );
	t( "Element Selector", "div", ["main","foo"] );
	t( "Element Selector", "body", ["body"] );
	t( "Element Selector", "html", ["html"] );
	t( "Parent Element", "div div", ["foo"] );
	ok( $("param", "#object1").length == 2, "Object/param as context" );
	
	ok( $("#length").length, '&lt;input name="length"&gt; cannot be found under IE, see #945' );
	ok( $("#lengthtest input").length, '&lt;input name="length"&gt; cannot be found under IE, see #945' );
});

test("broken", function() {
	expect(7);
	t( "Broken Selector", "[", [] );
	t( "Broken Selector", "(", [] );
	t( "Broken Selector", "{", [] );
	t( "Broken Selector", "<", [] );
	t( "Broken Selector", "()", [] );
	t( "Broken Selector", "<>", [] );
	t( "Broken Selector", "{}", [] );
});

test("id", function() {
	expect(23);
	t( "ID Selector", "#body", ["body"] );
	t( "ID Selector w/ Element", "body#body", ["body"] );
	t( "ID Selector w/ Element", "ul#first", [] );
	t( "ID selector with existing ID descendant", "#firstp #simon1", ["simon1"] );
	t( "ID selector with non-existant descendant", "#firstp #foobar", [] );
	t( "ID selector using UTF8", "#台北Táiběi", ["台北Táiběi"] );
	t( "Multiple ID selectors using UTF8", "#台北Táiběi, #台北", ["台北Táiběi","台北"] );
	t( "Descendant ID selector using UTF8", "div #台北", ["台北"] );
	t( "Child ID selector using UTF8", "form > #台北", ["台北"] );
	
	t( "Escaped ID", "#foo\\:bar", ["foo:bar"] );
	t( "Escaped ID", "#test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Descendant escaped ID", "div #foo\\:bar", ["foo:bar"] );
	t( "Descendant escaped ID", "div #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Child escaped ID", "form > #foo\\:bar", ["foo:bar"] );
	t( "Child escaped ID", "form > #test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	
	t( "ID Selector, child ID present", "#form > #radio1", ["radio1"] );  // bug #267
	t( "ID Selector, not an ancestor ID", "#form  #first", [] );
	t( "ID Selector, not a child ID", "#form > #option1a", [] );
	
	t( "All Children of ID", "#foo/*", ["sndp", "en", "sap"] );
	t( "All Children of ID with no children", "#firstUL/*", [] );
	
	$('<a name="tName1">tName1 A</a><a name="tName2">tName2 A</a><div id="tName1">tName1 Div</div>').appendTo('#main');
	ok( $("#tName1")[0].id == 'tName1', "ID selector with same value for a name attribute" );
	ok( $("#tName2").length == 0, "ID selector non-existing but name attribute on an A tag" );
	
	t( "ID selector with non-existant ancestor", "#asdfasdf #foobar", [] ); // bug #986
});

test("class", function() {
	expect(16);
	t( "Class Selector", ".blog", ["mark","simon"] );
	t( "Class Selector", ".blog.link", ["simon"] );
	t( "Class Selector w/ Element", "a.blog", ["mark","simon"] );
	t( "Parent Class Selector", "p .blog", ["mark","simon"] );
	
	t( "Class selector using UTF8", ".台北Táiběi", ["utf8class1"] );
	t( "Class selector using UTF8", ".台北", ["utf8class1","utf8class2"] );
	t( "Class selector using UTF8", ".台北Táiběi.台北", ["utf8class1"] );
	t( "Class selector using UTF8", ".台北Táiběi, .台北", ["utf8class1","utf8class2"] );
	t( "Descendant class selector using UTF8", "div .台北Táiběi", ["utf8class1"] );
	t( "Child class selector using UTF8", "form > .台北Táiběi", ["utf8class1"] );
	
	t( "Escaped Class", ".foo\\:bar", ["foo:bar"] );
	t( "Escaped Class", ".test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Descendant scaped Class", "div .foo\\:bar", ["foo:bar"] );
	t( "Descendant scaped Class", "div .test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
	t( "Child escaped Class", "form > .foo\\:bar", ["foo:bar"] );
	t( "Child escaped Class", "form > .test\\.foo\\[5\\]bar", ["test.foo[5]bar"] );
});

test("multiple", function() {
	expect(4);
	t( "Comma Support", "a.blog, div", ["mark","simon","main","foo"] );
	t( "Comma Support", "a.blog , div", ["mark","simon","main","foo"] );
	t( "Comma Support", "a.blog ,div", ["mark","simon","main","foo"] );
	t( "Comma Support", "a.blog,div", ["mark","simon","main","foo"] );
});

test("child and adjacent", function() {
	expect(22);
	t( "Child", "p > a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p> a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p >a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child", "p>a", ["simon1","google","groups","mark","yahoo","simon"] );
	t( "Child w/ Class", "p > a.blog", ["mark","simon"] );
	t( "All Children", "code > *", ["anchor1","anchor2"] );
	t( "All Grandchildren", "p > * > *", ["anchor1","anchor2"] );
	t( "Adjacent", "a + a", ["groups"] );
	t( "Adjacent", "a +a", ["groups"] );
	t( "Adjacent", "a+ a", ["groups"] );
	t( "Adjacent", "a+a", ["groups"] );
	t( "Adjacent", "p + p", ["ap","en","sap"] );
	t( "Comma, Child, and Adjacent", "a + a, code > a", ["groups","anchor1","anchor2"] );
	
	t( "First Child", "p:first-child", ["firstp","sndp"] );
	t( "Nth Child", "p:nth-child(1)", ["firstp","sndp"] );
	t( "First Child, XPath", "p[1]", ["firstp","sndp"] );
	
	t( "Last Child", "p:last-child", ["sap"] );
	t( "Last Child, XPath", "p[3]", ["sap"] );
	
	t( "Nth-child", "#main form > *:nth-child(2)", ["text2"] );
	t( "Nth-child, XPath", "#main form > *[2]", ["text2"] );
	t( "Nth-child", "#main form > :nth-child(2)", ["text2"] );
	t( "Nth-child, XPath", "#main form > [2]", ["text2"] );
});

test("attributes", function() {
	expect(20);
	t( "Attribute Exists", "a[@title]", ["google"] );
	t( "Attribute Exists", "*[@title]", ["google"] );
	t( "Attribute Exists", "[@title]", ["google"] );
	
	t( "Attribute Equals", "a[@rel='bookmark']", ["simon1"] );
	t( "Attribute Equals", 'a[@rel="bookmark"]', ["simon1"] );
	t( "Attribute Equals", "a[@rel=bookmark]", ["simon1"] );
	t( "Multiple Attribute Equals", "input[@type='hidden'],input[@type='radio']", ["hidden1","radio1","radio2"] );
	t( "Multiple Attribute Equals", "input[@type=\"hidden\"],input[@type='radio']", ["hidden1","radio1","radio2"] );
	t( "Multiple Attribute Equals", "input[@type=hidden],input[@type=radio]", ["hidden1","radio1","radio2"] );
	
	t( "Attribute selector using UTF8", "span[@lang=中文]", ["台北"] );
	
	t( "Attribute Begins With", "a[@href ^= 'http://www']", ["google","yahoo"] );
	t( "Attribute Ends With", "a[@href $= 'org/']", ["mark"] );
	t( "Attribute Contains", "a[@href *= 'google']", ["google","groups"] );
	
	t("Select options via [@selected]", "#select1 option[@selected]", ["option1a"] );
	t("Select options via [@selected]", "#select2 option[@selected]", ["option2d"] );
	t("Select options via [@selected]", "#select3 option[@selected]", ["option3b", "option3c"] );
	
	t( "Grouped Form Elements", "input[@name='foo[bar]']", ["hidden2"] );
	
	t( ":not() Existing attribute", "select:not([@multiple])", ["select1", "select2"]);
	t( ":not() Equals attribute", "select:not([@name=select1])", ["select2", "select3"]);
	t( ":not() Equals quoted attribute", "select:not([@name='select1'])", ["select2", "select3"]);
});

test("pseudo (:) selectors", function() {
	expect(30);
	t( "First Child", "p:first-child", ["firstp","sndp"] );
	t( "Last Child", "p:last-child", ["sap"] );
	t( "Only Child", "a:only-child", ["simon1","anchor1","yahoo","anchor2"] );
	t( "Empty", "ul:empty", ["firstUL"] );
	t( "Enabled UI Element", "input:enabled", ["text1","radio1","radio2","check1","check2","hidden1","hidden2","name","length"] );
	t( "Disabled UI Element", "input:disabled", ["text2"] );
	t( "Checked UI Element", "input:checked", ["radio2","check1"] );
	t( "Selected Option Element", "option:selected", ["option1a","option2d","option3b","option3c"] );
	t( "Text Contains", "a:contains('Google')", ["google","groups"] );
	t( "Text Contains", "a:contains('Google Groups')", ["groups"] );
	t( "Element Preceded By", "p ~ div", ["foo"] );
	t( "Not", "a.blog:not(.link)", ["mark"] );
	
	t( "nth Element", "p:nth(1)", ["ap"] );
	t( "First Element", "p:first", ["firstp"] );
	t( "Last Element", "p:last", ["first"] );
	t( "Even Elements", "p:even", ["firstp","sndp","sap"] );
	t( "Odd Elements", "p:odd", ["ap","en","first"] );
	t( "Position Equals", "p:eq(1)", ["ap"] );
	t( "Position Greater Than", "p:gt(0)", ["ap","sndp","en","sap","first"] );
	t( "Position Less Than", "p:lt(3)", ["firstp","ap","sndp"] );
	t( "Is A Parent", "p:parent", ["firstp","ap","sndp","en","sap","first"] );
	t( "Is Visible", "input:visible", ["text1","text2","radio1","radio2","check1","check2","name","length"] );
	t( "Is Hidden", "input:hidden", ["hidden1","hidden2"] );
	
	t( "Form element :input", ":input", ["text1", "text2", "radio1", "radio2", "check1", "check2", "hidden1", "hidden2", "name", "button", "area1", "select1", "select2", "select3", "length"] );
	t( "Form element :radio", ":radio", ["radio1", "radio2"] );
	t( "Form element :checkbox", ":checkbox", ["check1", "check2"] );
	t( "Form element :text", ":text", ["text1", "text2", "hidden2", "name", "length"] );
	t( "Form element :radio:checked", ":radio:checked", ["radio2"] );
	t( "Form element :checkbox:checked", ":checkbox:checked", ["check1"] );
	t( "Form element :checkbox:checked, :radio:checked", ":checkbox:checked, :radio:checked", ["check1", "radio2"] );
});

test("basic xpath", function() {
	expect(17);
	ok( jQuery.find("//*").length >= 30, "All Elements (//*)" );
	t( "All Div Elements", "//div", ["main","foo"] );
	t( "Absolute Path", "/html/body", ["body"] );
	t( "Absolute Path w/ *", "/* /body", ["body"] );
	t( "Long Absolute Path", "/html/body/dl/div/div/p", ["sndp","en","sap"] );
	t( "Absolute and Relative Paths", "/html//div", ["main","foo"] );
	t( "All Children, Explicit", "//code/*", ["anchor1","anchor2"] );
	t( "All Children, Implicit", "//code/", ["anchor1","anchor2"] );
	t( "Attribute Exists", "//a[@title]", ["google"] );
	t( "Attribute Equals", "//a[@rel='bookmark']", ["simon1"] );
	t( "Attribute RegExp", "//a[@rel=~/BooKmaRk/i]", ["simon1"] );
	t( "Attribute Inverse RegExp", "//a[@id!~/mon/]", ["google","groups","anchor1","mark","yahoo","anchor2"] );
	t( "Parent Axis", "//p/..", ["main","foo"] );
	t( "Sibling Axis", "//p/../", ["firstp","ap","foo","first","firstUL","empty","form","floatTest","iframe","lengthtest","sndp","en","sap"] );
	t( "Sibling Axis", "//p/../*", ["firstp","ap","foo","first","firstUL","empty","form","floatTest","iframe","lengthtest","sndp","en","sap"] );
	t( "Has Children", "//p[a]", ["firstp","ap","en","sap"] );
	
	$("#foo").each(function() {
		isSet( $("/p", this).get(), q("sndp", "en", "sap"), "Check XPath context" );
	});
});