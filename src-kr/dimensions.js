define( [
	"./core",
	"./core/access",
	"./var/isWindow",
	"./css"
], function( jQuery, access, isWindow ) {

"use strict";

// innerHeight, innerWidth, height, width, outerHeight 및 outerWidth 메서드를 만듭니다.
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// 여백은 outerHeight, outerWidth에만 해당됩니다
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $ (window) .outerWidth / 스크롤바를 포함한 높이 반환 (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// 문서의 너비 또는 높이 가져 오기
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

				// [Width / Height] 또는 [Width / Height] 오프셋 또는 클라이언트 [Width / Height] 중 하나를 스크롤하거나
				// 둘 중 큰 것
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// parseFloat를 요구하지만 강요하지 않는 요소의 폭이나 높이를 가져옵니다.
					jQuery.css( elem, type, extra ) :

					// 요소의 너비 또는 높이 설정
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );

return jQuery;
} );
