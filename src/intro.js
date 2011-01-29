/*!
 * jQuery JavaScript Library v@VERSION
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: @DATE
 */
(function( win, undefined ) {

// Create new instance of jQuery and sets globals
win.jQuery = win.$ = (function newInstance( window ) {

// Use window where the script was initially loaded if none is provided
window = window || win;

// Use the correct document accordingly with window argument (sandbox)
var document = window.document;
