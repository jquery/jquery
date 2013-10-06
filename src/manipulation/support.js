define([
	"../var/support"
], function( support ) {

(function() {
	var input,
		fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) );

	// #11217 - WebKit loses check when the name is after the checked attribute
	div.innerHTML = "<input type='radio' checked='checked' name='t'/>";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
	input = document.createElement("input");
	input.type = "checkbox";
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;
})();

return support;

});
