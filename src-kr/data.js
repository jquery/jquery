define( [
	"./core",
	"./core/access",
	"./data/var/dataPriv",
	"./data/var/dataUser"
], function( jQuery, access, dataPriv, dataUser ) {

"use strict";

// 구현 요약
//
// 1. 1.9.x 브랜치와의 API 표면 및 의미 적 호환성 강화
// 2. 저장 공간을 줄임으로써 모듈의 유지 보수성 향상
// 단일 메커니즘에 대한 경로.
// 3. 동일한 단일 메커니즘을 사용하여 "개인"및 "사용자"데이터를 지원합니다.
// 4. _Never_ 사용자 코드에 "개인"데이터 공개 (TODO : Drop _data, _removeData)
// 5. 사용자 객체에 대한 구현 세부 사항 노출 방지 (예 : expando 속성)
// 6. 2014 년 WeakMap으로 구현 업그레이드를위한 명확한 경로 제공

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// 문자열을 변경하지 않는 경우에만 숫자로 변환합니다.
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// 내부적으로 아무 것도 발견되지 않은 경우,
	// HTML5 data- * 속성의 데이터
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// 데이터가 나중에 변경되지 않도록 데이터를 설정했는지 확인하십시오.
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO : 이제 _data 및 _removeData에 대한 모든 호출이 대체되었습니다.
	// dataPriv 메소드에 대한 직접 호출을 사용하면 더 이상 지원되지 않을 수 있습니다.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// 모든 값을 가져옵니다.
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// 지원 : IE 11 만
						// attrs 요소는 null 일 수 있습니다 (# 14894).
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// 여러 값을 설정합니다.
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// 호출하는 jQuery 객체 (요소가 일치 함)가 비어 있지 않습니다.
			// (따라서이 [0]에 요소가 나타나고)
			// 'value` 매개 변수가 정의되지 않았습니다. 빈 jQuery 객체
			// elem = this [0]에 대해`undefined`가됩니다.
			// 데이터 캐시를 읽으려는 시도가 있으면 예외를 throw합니다
			if ( elem && value === undefined ) {

				// 캐시에서 데이터를 가져 오려고 시도합니다.
				// 데이터에서 키가 항상 낙타가됩니다.
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// 데이터를 "검색"하려고 시도합니다.
				// HTML5 사용자 정의 데이터 - * attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// 정말 열심히 노력했지만 데이터가 존재하지 않습니다.
				return;
			}

			// 데이터를 설정합니다 ...
			this.each( function() {

				// 항상 camelCased 키를 저장합니다.
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );

return jQuery;
} );
