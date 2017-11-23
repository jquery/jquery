/* eslint-disable no-unused-vars*/
/*!
 * jQuery JavaScript Library v@VERSION
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: @DATE
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// CommonJS 및 CommonJS와 유사한 환경에서 적절한 'window'
		// 가 존재하면, 팩토리를 실행하고 jQuery를 얻는다.
		//`document`가있는`window`가없는 환경
		// (예 : Node.js), factory를 module.exports로 노출합니다.
		// 이것은 실제 '창'생성의 필요성을 강조합니다.
		// 예 : var jQuery = require ( "jquery") (window);
		// 자세한 정보는 티켓 # 14549를 참조하십시오.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// 윈도우가 아직 정의되지 않은 경우 이것을 넘겨 준다.
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <= 18 - 45+, IE 10 - 11, Safari 5.1 - 9 이상, iOS 6 - 9.1
// 비 엄격한 코드 (예 : ASP.NET 4.5)가 엄격 모드에 액세스 할 때 예외를 throw합니다.
// arguments.callee.caller (trac-13335). 그러나 jQuery 3.0 (2016)부터 엄격 모드가 일반적입니다.
// try 블록에서 그러한 모든 시도가 보호 될 정도로 충분합니다.
"use strict";

// @CODE
// build.js는 컴파일 된 jQuery를 여기에 삽입합니다.

return jQuery;
} );
