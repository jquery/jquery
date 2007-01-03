module("selector");

test("expressions - element", function() {
	expect(7);
	ok( $("*").size() >= 30, "Select all" );
	t( "Element Selector", "div", ["main","foo"] );
	t( "Element Selector", "body", ["body"] );
	t( "Element Selector", "html", ["html"] );
	t( "Parent Element", "div div", ["foo"] );
	t( "Object/Param element", "#object1 param", ["param1", "param2"] );
	ok( $("param", $("#object1")[0]).length == 2, "Object/param as context" );
});

test("expressions - id", function() {
	expect(8);
	t( "ID Selector", "#body", ["body"] );
	t( "ID Selector w/ Element", "body#body", ["body"] );
	t( "ID Selector w/ Element", "ul#first", [] );
	
	t( "ID Selector, child ID present", "#form > #radio1", ["radio1"] );  // bug #267
	t( "ID Selector, not an ancestor ID", "#form  #first", [] );
	t( "ID Selector, not a child ID", "#form > #option1a", [] );
	
	t( "All Children of ID", "#foo/*", ["sndp", "en", "sap"]  );
	t( "All Children of ID with no children", "#firstUL/*", []  );
});


test("expressions - class", function() {
	expect(4);
	t( "Class Selector", ".blog", ["mark","simon"] );
	t( "Class Selector", ".blog.link", ["simon"] );
	t( "Class Selector w/ Element", "a.blog", ["mark","simon"] );
	t( "Parent Class Selector", "p .blog", ["mark","simon"] );
});

test("expressions - multiple", function() {
	expect(4);
	t( "Comma Support", "a.blog, div", ["mark","simon","main","foo"] );
	t( "Comma Support", "a.blog , div", ["mark","simon","main","foo"] );
	t( "Comma Support", "a.blog ,div", ["mark","simon","main","foo"] );
	t( "Comma Support", "a.blog,div", ["mark","simon","main","foo"] );
});

test("expressions - child and adjacent", function() {
	expect(14);
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
});

test("expressions - attributes", function() {
	expect(19);
	t( "Attribute Exists", "a[@title]", ["google"] );
	t( "Attribute Exists", "*[@title]", ["google"] );
	t( "Attribute Exists", "[@title]", ["google"] );
	
	t( "Attribute Equals", "a[@rel='bookmark']", ["simon1"] );
	t( "Attribute Equals", 'a[@rel="bookmark"]', ["simon1"] );
	t( "Attribute Equals", "a[@rel=bookmark]", ["simon1"] );
	t( "Multiple Attribute Equals", "input[@type='hidden'],input[@type='radio']", ["hidden1","radio1","radio2"] );
	t( "Multiple Attribute Equals", "input[@type=\"hidden\"],input[@type='radio']", ["hidden1","radio1","radio2"] );
	t( "Multiple Attribute Equals", "input[@type=hidden],input[@type=radio]", ["hidden1","radio1","radio2"] );
	
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

test("expressions - pseudo (:) selctors", function() {
	expect(30);
	t( "First Child", "p:first-child", ["firstp","sndp"] );
	t( "Last Child", "p:last-child", ["sap"] );
	t( "Only Child", "a:only-child", ["simon1","anchor1","yahoo","anchor2"] );
	t( "Empty", "ul:empty", ["firstUL"] );
	t( "Enabled UI Element", "input:enabled", ["text1","radio1","radio2","check1","check2","hidden1","hidden2","name"] );
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
	t( "Is Visible", "input:visible", ["text1","text2","radio1","radio2","check1","check2","name"] );
	t( "Is Hidden", "input:hidden", ["hidden1","hidden2"] );
	
	t( "Form element :input", ":input", ["text1", "text2", "radio1", "radio2", "check1", "check2", "hidden1", "hidden2", "name", "button", "area1", "select1", "select2", "select3"] );
	t( "Form element :radio", ":radio", ["radio1", "radio2"] );
	t( "Form element :checkbox", ":checkbox", ["check1", "check2"] );
	t( "Form element :text", ":text", ["text1", "text2", "hidden2", "name"] );
	t( "Form element :radio:checked", ":radio:checked", ["radio2"] );
	t( "Form element :checkbox:checked", ":checkbox:checked", ["check1"] );
	t( "Form element :checkbox:checked, :radio:checked", ":checkbox:checked, :radio:checked", ["check1", "radio2"] );
});

test("expressions - basic xpath", function() {
	expect(14);
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
	t( "Parent Axis", "//p/..", ["main","foo"] );
	t( "Sibling Axis", "//p/../", ["firstp","ap","foo","first","firstUL","empty","form","floatTest","sndp","en","sap"] );
	t( "Sibling Axis", "//p/../*", ["firstp","ap","foo","first","firstUL","empty","form","floatTest","sndp","en","sap"] );
	t( "Has Children", "//p[a]", ["firstp","ap","en","sap"] );
});