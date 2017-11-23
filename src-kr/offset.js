define( [
	"./core",
	"./core/access",
	"./var/document",
	"./var/documentElement",
	"./css/var/rnumnonpx",
	"./css/curCSS",
	"./css/addGetHookIf",
	"./css/support",
	"./var/isWindow",
	"./core/init",
	"./css",
	"./selector" // contains
], function( jQuery, access, document, documentElement, rnumnonpx,
             curCSS, addGetHookIf, support, isWindow ) {

"use strict";

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// 정적 인 elem에서도 대문자 / 소문자를 먼저 설정합니다.
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// 어느 쪽인지를 계산할 수 있어야한다.
		// 위쪽 또는 왼쪽은 자동이며 position은 절대 또는 고정입니다.
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// 여기에 jQuery.extend를 사용하여 좌표 인수를 변경할 수 있습니다 (gh-1848).
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset ()은 요소의 테두리 상자를 문서 원본과 관련시킵니다.
	offset: function( options ) {

		// setter에 대한 체이닝 유지
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// 연결이 끊어져 숨겨진 (표시 : 없음) 요소에 대해 0을 반환합니다 (gh-2310).
		// 지원 : IE <= 11 만
		// a에서 getBoundingClientRect 실행하기
		// IE에서 연결이 끊어진 노드가 오류를 발생시킵니다.
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// 뷰포트 상대적인 gBCR에 뷰포트 스크롤을 추가하여 문서 상대 위치 가져 오기
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position ()은 요소의 여백 상자를 오프셋 부모의 안쪽 여백 상자와 관련시킵니다.
	// CSS 절대 위치 지정의 동작에 해당합니다.
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position : 고정 요소는 항상 오프셋이 0 인 뷰포트에서 오프셋됩니다.
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// 위치 추정 : 고정은 getBoundingClientRect의 가용성을 의미합니다.
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// 문서 또는 루트 요소가 될 수있는 *real* 오프셋 부모에 대한 설명
			// 정적으로 배치 된 요소가 식별 될 때
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// 테두리가 내용의 원점을 벗어나 있기 때문에 테두리에 오프셋을 포함시킵니다.
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// 부모 오프셋 및 요소 여백 빼기
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	//이 메서드는 다음과 같은 경우에 documentElement를 반환합니다.
	// 1) offsetParent가없는 iframe 내부의 요소에 대해이 메서드는
	// 부모 윈도우의 documentElement
	// 2) 숨겨진 요소 나 분리 된 요소
	// 3) body 또는 html 요소의 경우, 즉 html 노드의 경우 자체를 반환합니다.
	//
	// 그런 예외는 실제 사용 사례로 제시되지 않았습니다.
	// 더 바람직한 결과로 간주 될 수 있습니다.
	//
	//이 논리는 보장 할 수 없으며 향후 언제든지 변경할 수 있습니다.
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// scrollLeft 및 scrollTop 메서드를 만듭니다.
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// 문서와 창을 통합합니다.
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// 지원 : Safari <= 7 - 9.1, Chrome <= 37 - 49
// jQuery.fn.position을 사용하여 위쪽 / 왼쪽 cssHooks 추가
// Webkit 버그 : https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug : https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle은 top / left / bottom / right에 대해 지정된 경우 백분율을 반환합니다.
// css 모듈이 오프셋 모듈에 의존하도록하기보다는 여기에서 확인하십시오.
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// curCSS가 백분율을 반환하는 경우 오프셋으로 대체
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );

return jQuery;
} );
