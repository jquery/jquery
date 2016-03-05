/* jshint esnext: true */

"use strict";

var assert = require("assert");

module.exports = function ensureIterability() {
	require("jsdom").env("", function (errors, window) {
		assert.ifError(errors);

		var i, 
		ensureJQuery = require("./ensure_jquery"), 
		jQuery = require("../../../dist/jquery.js")(window), 
		elem = jQuery("<div></div><span></span><a></a>"), 
		result = "";

		ensureJQuery(jQuery);var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

			for (var _iterator = elem[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {i = _step.value;
				result += i.nodeName;}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}


		assert.strictEqual(result, "DIVSPANA", "for-of doesn't work on jQuery objects");});};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuc3VyZV9pdGVyYWJpbGl0eV9lczYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7QUFFQSxJQUFJLFNBQVMsUUFBUyxRQUFULENBQVQ7O0FBRUosT0FBTyxPQUFQLEdBQWlCLFNBQVMsaUJBQVQsR0FBNkI7QUFDN0MsU0FBUyxPQUFULEVBQW1CLEdBQW5CLENBQXdCLEVBQXhCLEVBQTRCLFVBQVUsTUFBVixFQUFrQixNQUFsQixFQUEyQjtBQUN0RCxTQUFPLE9BQVAsQ0FBZ0IsTUFBaEIsRUFEc0Q7O0FBR3RELE1BQUksQ0FBSjtBQUNDLGlCQUFlLFFBQVMsaUJBQVQsQ0FBZjtBQUNBLFdBQVMsUUFBUyx5QkFBVCxFQUFzQyxNQUF0QyxDQUFUO0FBQ0EsU0FBTyxPQUFRLGlDQUFSLENBQVA7QUFDQSxXQUFTLEVBQVQsQ0FQcUQ7O0FBU3RELGVBQWMsTUFBZCxFQVRzRDs7QUFXdEQsd0JBQVcsOEJBQVgsb0dBQWtCLENBQVosZ0JBQVk7QUFDakIsY0FBVSxFQUFFLFFBQUYsQ0FETyxDQUFsQixpTkFYc0Q7OztBQWV0RCxTQUFPLFdBQVAsQ0FBb0IsTUFBcEIsRUFBNEIsVUFBNUIsRUFBd0MsdUNBQXhDLEVBZnNELENBQTNCLENBQTVCLENBRDZDLENBQTdCIiwiZmlsZSI6ImVuc3VyZV9pdGVyYWJpbGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCBcImFzc2VydFwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5zdXJlSXRlcmFiaWxpdHkoKSB7XG5cdHJlcXVpcmUoIFwianNkb21cIiApLmVudiggXCJcIiwgZnVuY3Rpb24oIGVycm9ycywgd2luZG93ICkge1xuXHRcdGFzc2VydC5pZkVycm9yKCBlcnJvcnMgKTtcblxuXHRcdHZhciBpLFxuXHRcdFx0ZW5zdXJlSlF1ZXJ5ID0gcmVxdWlyZSggXCIuL2Vuc3VyZV9qcXVlcnlcIiApLFxuXHRcdFx0alF1ZXJ5ID0gcmVxdWlyZSggXCIuLi8uLi8uLi9kaXN0L2pxdWVyeS5qc1wiICkoIHdpbmRvdyApLFxuXHRcdFx0ZWxlbSA9IGpRdWVyeSggXCI8ZGl2PjwvZGl2PjxzcGFuPjwvc3Bhbj48YT48L2E+XCIgKSxcblx0XHRcdHJlc3VsdCA9IFwiXCI7XG5cblx0XHRlbnN1cmVKUXVlcnkoIGpRdWVyeSApO1xuXG5cdFx0Zm9yICggaSBvZiBlbGVtICkge1xuXHRcdFx0cmVzdWx0ICs9IGkubm9kZU5hbWU7XG5cdFx0fVxuXG5cdFx0YXNzZXJ0LnN0cmljdEVxdWFsKCByZXN1bHQsIFwiRElWU1BBTkFcIiwgXCJmb3Itb2YgZG9lc24ndCB3b3JrIG9uIGpRdWVyeSBvYmplY3RzXCIgKTtcblx0fSApO1xufTtcbiJdfQ==
