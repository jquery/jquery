/**
 * @fileoverview Exports used by qunit and testinit
 */

/** @suppress {uselessCode} */
(function() {
	/** @expose */
	jQuery.isReady;
})();

jQuery.fn["html"] = jQuery.fn.html;
jQuery.fn["get"] = jQuery.fn.get;
jQuery.fn["css"] = jQuery.fn.css;
jQuery.fn["appendTo"] = jQuery.fn.appendTo;
jQuery["cache"] = jQuery.cache;
jQuery["fragments"] = jQuery.fragments;
jQuery["timers"] = jQuery.timers;
jQuery["active"] = jQuery.active;
jQuery["noConflict"] = jQuery.noConflict;
jQuery["ajaxSettings"] = jQuery.ajaxSettings;
jQuery.event["global"] = jQuery.event.global;
jQuery["event"] = jQuery.event;
jQuery["extend"] = jQuery.extend;
jQuery["isReady"] = jQuery.isReady;
window["jQuery"] = window["$"] = jQuery;

// Redefine the isReady property since it may be eliminated as dead code
// Needed for offset and selector tests
jQuery(function() { jQuery["isReady"] = true; });