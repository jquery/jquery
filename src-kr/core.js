/* global 심볼 */
//이 환경을 .eslintrc.json으로 정의하면 전역 환경을 사용할 위험이 있습니다.
// 다른 곳에서 보호받지 못하면이 모듈에 대해서만 전역을 정의하는 것이 더 안전합니다.

define( [
	"./var/arr",
	"./var/document",
	"./var/getProto",
	"./var/slice",
	"./var/concat",
	"./var/push",
	"./var/indexOf",
	"./var/class2type",
	"./var/toString",
	"./var/hasOwn",
	"./var/fnToString",
	"./var/ObjectFunctionString",
	"./var/support",
	"./var/isWindow",
	"./core/DOMEval"
], function( arr, document, getProto, slice, concat, push, indexOf,
	class2type, toString, hasOwn, fnToString, ObjectFunctionString,
	support, isWindow, DOMEval ) {

"use strict";

var
	version = "@VERSION",

	// jQuery의 로컬 복사본을 정의한다.
	jQuery = function( selector, context ) {

		// jQuery 객체는 실제로 단지 '향상된'init 생성자입니다.
		// jQuery가 호출되면 init이 필요합니다 (포함되지 않은 경우 오류가 발생합니다)
		return new jQuery.fn.init( selector, context );
	},

	// 지원 : 안드로이드 <= 4.0 전용
	// BOM과 NBSP를 다듬 었는지 확인하십시오.
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// camelizing을 위해 파선으로 일치
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// jQuery.camelCase가 콜백 함수로 사용하여 replace ()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// 사용중인 jQuery의 현재 버전
	jquery: version,

	constructor: jQuery,

	// jQuery 객체의 기본 길이는 0입니다.
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// 일치하는 요소 집합에서 N 번째 요소 가져 오기 OR
	// 일치하는 요소 세트 전체를 깨끗한 배열로 가져옵니다.
	get: function( num ) {

		// 배열의 모든 원소들을 반환한다.
		if ( num == null ) {
			return slice.call( this );
		}

		// 집합에서 하나의 요소 만 반환합니다
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},


	// 요소의 배열을 가져 와서 스택에 밀어
	// (새로운 일치하는 요소 집합을 반환)
	pushStack: function( elems ) {

		// 새로운 jQuery와 일치하는 요소 세트를 빌드한다.
		var ret = jQuery.merge( this.constructor(), elems );

		// 이전 객체를 스택에 추가합니다 (reference).
		ret.prevObject = this;

		// 새로 형성된 요소 집합을 반환합니다.
		return ret;
	},

	// 일치하는 집합의 모든 요소에 대해 callback을 실행합니다.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// 내부 용으로 만 사용됩니다.
	// jQuery 메서드가 아니라 Array의 메서드처럼 작동합니다.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// deep copy 상황 처리
	if ( typeof target === "boolean" ) {
		deep = target;

		//	boolean 및 대상 건너 뛰기
		target = arguments[ i ] || {};
		i++;
	}

	// 대상이 문자열 일 때 대소 문자를 처리합니다 (deep copy에서 가능).
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// 인수가 하나만 전달되면 jQuery 자체를 확장하십시오.
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// null이 아니거나 정의되지 않은 값만 처리합니다.
		if ( ( options = arguments[ i ] ) != null ) {

			// 기본 객체 확장
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// 끊이지 않는 루프 방지
				if ( target === copy ) {
					continue;
				}

				// 일반 객체 나 배열을 병합하는 경우 반복
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// 절대로 원본 개체를 이동하거나 복제하지 마십시오.
					target[ name ] = jQuery.extend( deep, clone, copy );

				// 정의되지 않은 값을 가져 오지 마십시오.
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// 수정 한 오브젝트를 돌려줍니다.
	return target;
};

jQuery.extend( {

	// 페이지의 각 jQuery 사본마다 고유합니다.
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// 준비 모듈없이 jQuery를 사용할 수 있다고 가정합니다.
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {

		// 지원 : Chrome <= 57, Firefox <= 52
		// 일부 브라우저에서 typeof는 HTML <object> 요소에 대해 "function"을 반환합니다.
		// (즉, typeof document.createElement ( "object") === "function"`).
		// 어떤 * DOM 노드도 함수로 분류하고 싶지는 않습니다.
		return typeof obj === "function" && typeof obj.nodeType !== "number";
	},

	isNumeric: function( obj ) {

		// jQuery 3.0부터 isNumeric은 다음으로 제한됩니다.
        // 문자열과 숫자 (프리미티브 또는 객체)
        // 유한 수로 강제 변환 할 수 있습니다 (gh-2662).
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaN 숫자 캐스팅 false positive ( "")
			// ... 그러나 선도 번호 문자열, 특히 16 진수 리터럴 ( "0x ...")을 잘못 해석합니다.
			// NaN에 무한대를 빼는 힘
			!isNaN( obj - parseFloat( obj ) );
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// 명백한 네거티브 감지
		// jQuery.type 대신 toString을 사용하여 호스트 객체를 잡습니다.
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// 프로토 타입이없는 객체 (예 :`Object.create (null)`)는 일반 객체입니다.
		if ( !proto ) {
			return true;
		}

		// 프로토 타입이있는 객체는 전역 객체 함수에 의해 생성 된 경우 일반 객체입니다.
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint는 사용하지 않는 변수를 비활성화하지 않습니다. */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// 지원 : 안드로이드 <= 2.3 전용 (작동하는 RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// 전역 컨텍스트에서 스크립트를 평가합니다.
	globalEval: function( code ) {
		DOMEval( code );
	},

	// 점선을 camelCase로 변환; CSS 및 데이터 모듈에서 사용
	// 지원 : IE <= 9 - 11, 가장자리 12 - 15
	// 마이크로 소프트는 그들의 접두사 접두어를 깜빡 잊어 버렸습니다 (# 9572).
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// 지원 : 안드로이드 <= 4.0 전용
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// 결과는 내부 용으로만 사용됩니다.
	// 결과는 내부 용으로만 사용됩니다.
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// 지원 : Android <= 4.0 전용, PhantomJS 1 전용
	// push.apply (_, arraylike) 고대 Webkit을 던졌습니다.
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// 배열을 살펴보고 항목 만 저장합니다.
		// validator 함수를 전달한다.
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg는 내부 용으로 만 사용됩니다.
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// 배열을 통해 각 항목을 새 값으로 변환합니다.
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// 개체의 모든 키를 살펴 봅니다.
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// 중첩 된 배열을 단순화합니다.
		return concat.apply( [], ret );
	},

	// 객체에 대한 전역 GUID 카운터
	guid: 1,

	// 함수를 컨텍스트에 바인딩하고 선택적으로 부분적으로 적용
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// 대상에서 호출 가능한지를 확인하는 빠른 검사, 스펙에서 확인
		// 이것은 TypeError를 던지지만, undefined를 반환 할 것입니다.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// 시뮬레이트 된 바인딩
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// 고유 핸들러의 GUID를 원래 핸들러와 동일하게 설정하여 제거 할 수 있습니다.
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support는 Core에서는 사용되지 않지만 다른 프로젝트에서는 해당 객체를 연결합니다.
	// 속성이 있어야하므로 필요합니다.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// class2type 맵을 채 웁니다.
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// 지원 : 실제 iOS 8.2 전용 (시뮬레이터에서 재현 불가)
	// 'in` 검사가 JIT 오류를 방지하는 데 사용됩니다 (gh-2145).
	// 가짜 음수 때문에 여기에 hasOwn이 사용되지 않았습니다.
	// IE의 Nodelist 길이 관련
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

return jQuery;
} );
