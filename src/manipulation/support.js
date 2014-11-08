define([
	"../var/support"
], function( support ) {

(function() {
	// Minified: var a,b,c
	var input = document.createElement( "input" ),
		div = document.createElement( "div" ),
		fragment = document.createDocumentFragment();

	// Setup
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName( "tbody" ).length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName( "link" ).length;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone =
		document.createElement( "nav" ).cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	input.type = "checkbox";
	input.checked = true;
	fragment.appendChild( input );
	support.appendChecked = input.checked;

	// Setup div for cloneNode tests, then replace it with a clone
	div.innerHTML = "<textarea>x</textarea><input type='radio' checked='checked' name='t'/>";
	div.test = support;
	div = div.cloneNode( true );

	// Support: IE6-IE11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	support.noCloneChecked = !!div.firstChild.defaultValue;

	// Support: Safari 5.1, iOS 5.1, Android<4.2+
	// WebKit doesn't clone checked state correctly in fragments
	// #11217 - WebKit loses check when the name is after the checked attribute
	fragment.appendChild( div );
	support.checkClone = div.cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Cloning references to object-valued properties causes problems (#15104)
	support.cloneProps = div.test === support;

	// Execute the test only if not already executed in another module.
	if (support.deleteExpando == null) {
		// Support: IE<9
		support.deleteExpando = true;
		try {
			delete div.test;
		} catch ( e ) {
			support.deleteExpando = false;
		}
	}
})();

return support;

});
