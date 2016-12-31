QUnit.extend( QUnit.assert, {

	/**
	 * Check the sequence/order
	 *
	 * @example test('Example unit test', function(assert) { assert.step(1); setTimeout(function () { assert.step(3); start(); }, 100); assert.step(2); stop(); });
	 * @param Number expected The excepted step within the test()
	 * @param String message (optional)
	 */
	step: function (expected, message) {
		// increment internal step counter.
		QUnit.config.current.step++;
		if (typeof message === "undefined") {
			message = "step " + expected;
		}
		var actual = QUnit.config.current.step;
		QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
	}
});

/**
 * Reset the step counter for every test()
 */
QUnit.testStart(function () {
	QUnit.config.current.step = 0;
});
