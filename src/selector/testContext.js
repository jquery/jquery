/**
 * Checks a node for validity as a jQuery selector context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
export function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}
