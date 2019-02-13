(function(factory) {

  // NOTE:
  // All techniques except for the "browser globals" fallback will extend the
  // provided QUnit object but return the isolated API methods

  // For AMD: Register as an anonymous AMD module with a named dependency on "qunit".
  if (typeof define === "function" && define.amd) {
    define(["qunit"], factory);
  }
  // For Node.js
  else if (typeof module !== "undefined" && module && module.exports && typeof require === "function") {
    module.exports = factory(require("qunitjs"));
  }
  // For CommonJS with `exports`, but without `module.exports`, like Rhino
  else if (typeof exports !== "undefined" && exports && typeof require === "function") {
    var qunit = require("qunitjs");
    qunit.extend(exports, factory(qunit));
  }
  // For browser globals
  else {
    factory(QUnit);
  }

}(function(QUnit) {

  /**
   * Find an appropriate `Assert` context to `push` results to.
   * @param * context - An unknown context, possibly `Assert`, `Test`, or neither
   * @private
   */
  function _getPushContext(context) {
    var pushContext;

    if (context && typeof context.push === "function") {
      // `context` is an `Assert` context
      pushContext = context;
    }
    else if (context && context.assert && typeof context.assert.push === "function") {
      // `context` is a `Test` context
      pushContext = context.assert;
    }
    else if (
      QUnit && QUnit.config && QUnit.config.current && QUnit.config.current.assert &&
      typeof QUnit.config.current.assert.push === "function"
    ) {
      // `context` is an unknown context but we can find the `Assert` context via QUnit
      pushContext = QUnit.config.current.assert;
    }
    else if (QUnit && typeof QUnit.push === "function") {
      pushContext = QUnit.push;
    }
    else {
      throw new Error("Could not find the QUnit `Assert` context to push results");
    }

    return pushContext;
  }

  /**
   * Find an appropriate `Test` context to `push` results to.
   * @param * context - An unknown context, possibly `Assert`, `Test`, or neither
   * @private
   */
  function _getTestContext(context) {
    var testContext;

    if (context && typeof context.push === "function" && context.test) {
      // `context` is an `Assert` context
      testContext = context.test;
    }
    else if (context && context.assert && typeof context.assert.push === "function") {
      // `context` is a `Test` context
      testContext = context;
    }
    else if (
      QUnit && QUnit.config && QUnit.config.current && QUnit.config.current.assert &&
      typeof QUnit.config.current.assert.push === "function"
    ) {
      // `context` is an unknown context but we can find the `Test` context via QUnit
      testContext = QUnit.config.current;
    }
    else {
      throw new Error("Could not find the QUnit `Test` context to maintain state");
    }

    return testContext;
  }


  var api = {

    /**
     * Check the sequence/order
     *
     * @example test('Example unit test', function(assert) { assert.step(1); setTimeout(function () { assert.step(3); start(); }, 100); assert.step(2); stop(); });
     * @param Number expected The excepted step within the test()
     * @param String message (optional)
     */
    step: function(expected, message) {
      var actual,
          pushContext = _getPushContext(this),
          testContext = _getTestContext(this);

      if (typeof message === "undefined") {
        message = "step " + expected;
      }

      // If this is the first time that `assert.step` has been called for the
      // current test, set its initial `step` counter to `0`
      if (typeof testContext.step === "undefined") {
        testContext.step = 0;
      }

      // Increment internal step counter
      actual = ++testContext.step;

      pushContext.push(QUnit.equiv(actual, expected), actual, expected, message);
    }

  };


  QUnit.extend(QUnit.assert, api);

  return api;
}));
