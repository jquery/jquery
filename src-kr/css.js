	define( [
	"./core",
	"./var/pnum",
	"./core/access",
	"./var/document",
	"./var/rcssNum",
	"./css/var/rnumnonpx",
	"./css/var/cssExpand",
	"./css/var/getStyles",
	"./css/var/swap",
	"./css/curCSS",
	"./css/adjustCSS",
	"./css/addGetHookIf",
	"./css/support",

	"./core/init",
	"./core/ready",
	"./selector" // contains
], function( jQuery, pnum, access, document, rcssNum, rnumnonpx, cssExpand,
	getStyles, swap, curCSS, adjustCSS, addGetHookIf, support ) {

"use strict";

var
// display가 none이거나 table로 시작하면 교체 가능
// "table", "table-cell"또는 "table-caption"을 제외하고
// 표시 값은 https://developer.mozilla.org/en-US/docs/CSS/display에서 확인하십시오.
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// 잠재적으로 접두사가 붙은 속성에 매핑 된 css 속성을 반환합니다.
function vendorPropName( name ) {

	// 공급 업체 접두사가 아닌 이름의 바로 가기
	if ( name in emptyStyle ) {
		return name;
	}

	// 접두어 접두사 이름 확인
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// jQuery.cssProps가 제안하거나 따라 매핑 된 속성을 반환합니다.
// 접두어 붙은 속성.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// 상대적인 (+/-) 값은 이미
	// 이 시점에서 정규화 됨
	var matches = rcssNum.exec( value );
	return matches ?

		// cssHooks에서와 같이 사용되는 경우와 같이 정의되지 않은 "빼기"를 방지합니다.
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// 조정이 필요하지 않을 수도 있습니다.
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// 양쪽 상자 모델은 margin을 제외합니다.
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// content-box를 가지고 여기에 "padding"또는 "border"또는 "margin"을 찾으면
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// 그래도 계속 추적합니다.
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// border-box (content + padding + border)를 사용하면 여기에 "content"또는
		// "padding"또는 "margin"
		} else {

			// "content"의 경우, 뺄셈 padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// "content"또는 "padding"의 경우 border를 뺍니다.
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// calculateVal을 제공하여 요청할 때 양수 콘텐츠 상자 스크롤 거터를 고려합니다.
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth / offsetHeight는 내용, 채우기, 스크롤 거터 및 테두리의 반올림 합계입니다.
		// 정수 스크롤 거터를 가정하고, 나머지를 뺀 다음 반올림합니다.
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5
		) );
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// 계산 된 스타일로 시작
	var styles = getStyles( elem ),
		val = curCSS( elem, dimension, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox;

	// 지원 : Firefox <= 54
	// 혼란스럽지 않은 비 - 픽셀 값을 반환하거나, 무지를 가두십시오.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}

	// 신뢰할 수없는 값을 반환하는 브라우저의 경우 스타일을 확인합니다.
	// getComputedStyle에 대해 자동으로 신뢰할 수있는 elem.style로 떨어집니다.
	valueIsBorderBox = valueIsBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ dimension ] );

	// 값이 "auto"이면 offsetWidth / offsetHeight로 다시 떨어집니다.
	// 명시 적 설정이없는 인라인 요소에서 발생합니다 (gh-3571).
	// 지원 : 안드로이드 <= 4.1 - 4.3 전용
	// 잘못보고 된 인라인 크기 (gh-3602)에도 offsetWidth / offsetHeight를 사용합니다.
	if ( val === "auto" ||
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) {

		val = elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ];

		// offsetWidth / offsetHeight는 테두리 상자 값을 제공합니다.
		valueIsBorderBox = true;
	}

	// ""표준화하고 auto
	val = parseFloat( val ) || 0;

	// 요소의 상자 모델에 맞게 조정합니다.
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// 현재 계산 된 크기를 제공하여 스크롤 거터 계산을 요청합니다 (gh-3589).
			val
		)
	) + "px";
}

jQuery.extend( {

	// 기본값을 재정의하기 위해 스타일 속성 훅을 추가합니다.
	// 스타일 속성 가져 오기 및 설정 동작
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// 항상 불투명 한 숫자를 반환해야합니다.
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// 이러한 단위가없는 속성에 "px"를 자동으로 추가하지 않습니다.
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// 이전에 수정하고자하는 이름의 속성을 추가합니다.
	// 값 설정 또는 가져 오기
	cssProps: {},

	// DOM 노드에서 스타일 속성 가져 오기 및 설정
	style: function( elem, name, value, extra ) {

		// 텍스트 및 주석 노드에 스타일을 설정하지 않습니다.
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// 우리가 올바른 이름으로 작업하고 있는지 확인하십시오.
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// 우리가 올바른 이름으로 작업하고 있는지 확인하십시오. 우리는하지 않는다.
		// CSS 사용자 정의 속성 인 경우 값을 쿼리하려고합니다.
		// 그들은 사용자 정의이기 때문에.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// 접두어가 붙은 버전에 대한 후크를 가져온 다음 접미어가없는 버전
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// 값을 설정하는지 확인
		if ( value !== undefined ) {
			type = typeof value;

			// "+ ="또는 "- ="을 상대 번호로 변환합니다 (# 7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// 버그 # 9237 수정
				type = "number";
			}

			// null 및 NaN 값이 설정되지 않았는지 확인합니다 (# 7116).
			if ( value == null || value !== value ) {
				return;
			}

			// 숫자가 전달 된 경우 단위를 추가합니다 (특정 CSS 속성 제외).
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background- * props는 원래 복제본의 값에 영향을줍니다.
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// hook이 제공되면, 그 값을 사용하고, 그렇지 않으면, 지정된 값을 설정한다.
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// hook이 제공되면 거기에서 계산되지 않은 값을 얻는다.
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// 그렇지 않으면 스타일 객체에서 값을 가져옵니다.
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// 우리가 올바른 이름으로 작업하고 있는지 확인하십시오. 우리는하지 않는다.
		// CSS 사용자 정의 속성 인 경우 값을 수정하려고합니다.
		// 그들은 사용자 정의이기 때문에.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// 접두사가 붙은 이름 다음에 접두어가없는 이름이 오는지 시도합니다.
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// hook이 제공되면 거기에서 계산 된 값을 얻는다.
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// 그렇지 않으면 계산 된 값을 가져 오는 방법이 있으면
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// "normal"을 계산 된 값으로 변환합니다.
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// 강제 실행되거나 한정자가 제공되고 val이 숫자로 보이면 숫자로 만듭니다.
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// 보이지 않게 표시하는 경우 특정 요소에 치수 정보가 포함될 수 있습니다.
				// 이점을 얻을 수있는 현재 표시 스타일을 가져야합니다.
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// 지원 : Safari 8 이상
					// Safari의 표 열에 offsetWidth가 0이 아닌 값이 0이됩니다.
					// getBoundingClientRect (). 디스플레이가 변경되지 않는 한 너비.
					// 지원 : IE <= 11 만
					// 연결 해제 된 노드에서 getBoundingClientRect 실행하기
					// IE에서 오류가 발생합니다.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),
				isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra && boxModelAdjustment(
					elem,
					dimension,
					extra,
					isBorderBox,
					styles
				);

			// 옵셋을 계산 된 값과 비교하여 신뢰할 수없는 경계 상자 차원을 계산합니다.
			// 경계 상자와 패딩을 가져 오기 위해 컨텐트 상자 위조 (gh-3699)
			if ( isBorderBox && support.scrollboxSize() === styles.position ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// 값 조정이 필요한 경우 픽셀로 변환
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// 이러한 후크는 animate에서 속성을 확장하는 데 사용됩니다.
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// 문자열이 아닌 경우 하나의 숫자를 가정합니다.
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );

return jQuery;
} );
