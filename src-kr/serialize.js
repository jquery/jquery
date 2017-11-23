define( [
	"./core",
	"./manipulation/var/rcheckableType",
	"./core/init",
	"./traversing", // filter
	"./attributes/prop"
], function( jQuery, rcheckableType ) {

"use strict";

var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// 배열 항목을 직렬화합니다.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// 각 배열 항목을 스칼라로 처리합니다.
				add( prefix, v );

			} else {

				// 항목이 스칼라가 아니거나 (배열 또는 객체), 숫자 인덱스를 인코딩합니다.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

		// 객체 항목을 직렬화합니다.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// 스칼라 항목을 serialize합니다.
		add( prefix, obj );
	}
}

// 양식 요소의 배열 또는 일련의 요소를 직렬화합니다.
// key/value을 쿼리 문자열로
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// 값이 함수 인 경우 호출하고 반환 값을 사용합니다.
			var value = jQuery.isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// 배열이 전달 된 경우 폼 요소의 배열이라고 가정합니다.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// 폼 요소를 직렬화한다.
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// 전통적이라면 "전"방식으로 인코딩하십시오 (1.3.2 이상).
		// 그런 경우), 그렇지 않으면 params를 재귀 적으로 인코딩합니다.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// 결과 직렬화를 반환합니다.
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// 폼 요소를 필터링하거나 추가하기 위해 "elements"에 대한 propHook을 추가 할 수 있습니다.
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// .is ( ": disabled")를 사용하여 fieldset [disabled]가 작동하도록합니다.
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );

return jQuery;
} );
