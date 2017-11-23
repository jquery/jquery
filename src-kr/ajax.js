define( [
	"./core",
	"./var/document",
	"./var/rnothtmlwhite",
	"./ajax/var/location",
	"./ajax/var/nonce",
	"./ajax/var/rquery",

	"./core/init",
	"./ajax/parseXML",
	"./event/trigger",
	"./deferred",
	"./serialize" // jQuery.param
], function( jQuery, document, rnothtmlwhite, location, nonce, rquery ) {

"use strict";

var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	*	1) 이것들은 커스텀 datatypes들을 소개할때 유용하다. (ajax/jsonp.js 예제를 보시오.)
	*	2) 이것들이 호출되어집니다:
  	*	 	-이동을 요구하기 전에
  	*		-인자의 직렬화?(param serialization)후에(s.data가 string일때 s.processData는 true입니다.)
	*	3) key는 dataType입니다.
	*	4) 포괄적인 기호 "*"를 사용할수 있습니다.
	*	5) 실행은 transport dataType으로 시작하고 필요한경우 "*"으로 진행할수 있습니다.
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key는 dataType입니다.
	 * 2) 포괄적인 기호 "*"를 사용할수 있습니다.
	 * 3) 선택은 transport dataType으로 시작하고 필요한경우 "*"으로 진행할수 있습니다.
	 */
	transports = {},

	// 주석 - 프롤로그 문자 시퀀스 (# 10098)를 피하십시오. 보풀을 풀어주고 압축을 피해야한다.
	allTypes = "*/".concat( "*" ),

	// 문서의 원점을 파싱하기위한 앵커 태그
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// jQuery.ajaxPrefilter 및 jQuery.ajaxTransport에 대한 기본 "생성자"
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression은 선택 사항이며 기본값은 "*"입니다.
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// dataTypeExpression의 각 dataType에 대해
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// 요청할 경우 앞에 추가하십시오.
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// 그렇지 않으면 추가합니다.
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// 프리 필터 및 전송 장치의 기본 검사 기능
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// Ajax 옵션을위한 특별한 확장
// "flat"옵션을 취한다 (깊이 확장되지 않는다).
// 수정 # 9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* ajax 요청에 대한 응답을 처리합니다.
 * - 올바른 dataType을 찾습니다 (콘텐츠 유형과 예상 데이터 유형 간의 조정).
 * - 해당 응답을 반환합니다.
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// 자동 dataType 제거 및 프로세스에서 content-type 가져 오기
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// 알려진 콘텐츠 유형을 다루고 있는지 확인
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// 예상되는 데이터 유형에 대한 응답이 있는지 확인
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// dataTypes를 전환 시도함
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// 아니면 첫 번째 것을 사용
		finalDataType = finalDataType || firstDataType;
	}

	// dataType을 찾은 경우
	// 필요한 경우 dataType을 목록에 추가합니다.
	// 그리고 해당 응답을 반환합니다.
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* 요청과 원래 응답이 제공된 체인 변환
 * 또한 jqXHR 인스턴스에 responseXXX 필드를 설정합니다.
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// dataTypes 사본으로 작업하여 변환을 위해 수정해야 할 경우에 대비
		dataTypes = s.dataTypes.slice();

	// 소문자 키를 사용하여 변환기 맵 작성
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// 순차적 인 각 dataType으로 변환
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// 제공된 경우 dataFilter 적용
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// ApplyThere는 현재 dataType이 제공되지 않으면 dataFilter가 아닌 경우에만 수행 할 작업
			if ( current === "*" ) {

				current = prev;

			// 이전 dataType이 자동이 아니고 현재와 다른 경우 응답을 변환합니다
			} else if ( prev !== "*" && prev !== current ) {

				// 직접 변환기 찾기
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// 아무 것도 발견되지 않으면, 한 쌍을 찾는다.
				if ( !conv ) {
					for ( conv2 in converters ) {

						// conv2가 current를 출력하면
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// prev를 허용 된 입력으로 변환 할 수있는 경우
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// 응축 등가 변환기
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// 그렇지 않으면, 중간 dataType을 삽입하십시오
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// 변환기 적용 (동등하지 않은 경우)
				if ( conv !== true ) {

					// 오류가 버블 링되지 않으면 catch하고 반환합니다
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// 활성 쿼리 수를 유지하는 카운터
	active: 0,

	// 다음 요청을위한 마지막으로 수정 된 헤더 캐시
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// 데이터 변환기
		// key는 소스 (또는 catchall "*")와 대상 유형을 하나의 공백으로 구분합니다
		converters: {

			// 모든것을 텍스트로 변환합니다.
			"* text": String,

			// 텍스트를 html로 변환합니다 (true = 변환 없음).
			"text html": true,

			// 텍스트를 json 표현식으로 평가
			"text json": JSON.parse,

			// XML로 텍스트 구문 분석
			"text xml": jQuery.parseXML
		},


		// 깊이 확장해서는 안되는 옵션의 경우 :
		// 여기에 사용자 정의 옵션을 추가 할 수 있습니다.
		// 그리고 그렇게해서는 안되는 것을 만들 때
		// 깊이 확장 (ajaxExtend 참조)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// 대상에 본격적인 설정 객체를 생성합니다.
	// ajaxSettings 및 설정 필드를 모두 사용합니다.
	// target이 생략되면 ajaxSettings에 씁니다.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// 설정 객체 만들기
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// ajaxSettings 확장하기
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main 메소드
	ajax: function( url, options ) {

		// url이 객체 인 경우 1.5 이전의 signature을 simulate합니다.
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// 옵션을 객체로 강제 설정
		options = options || {};

		var transport,

			// 안티 캐시 매개 변수가 없는 URL
			cacheURL,

			// 응답 헤더
			responseHeadersString,
			responseHeaders,

			// 핸들 시간초과
			timeoutTimer,

			// URL 정리 var
			urlAnchor,

			// 요청 상태 (전송시 false되고 완료되면 true 됨)
			completed,

			// 글로벌 이벤트가 전달되는지 알아보기
			fireGlobals,

			// 반복문 변수
			i,

			// 캐시되지 않은 부분
			uncached,

			// 최종 옵션 개체 만들기
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// 전역 이벤트의 컨텍스트는 DOM 노드 또는 jQuery 컬렉션 인 경우 callbackContext입니다.
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// 지연
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// 상태 종속 callbacks
			statusCode = s.statusCode || {},

			// Header (한꺼번에 전송 됨)
			requestHeaders = {},
			requestHeadersNames = {},

			// 기본 중단 메시지
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// 필요한 경우 Header 해시 테이블을 작성합니다.
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// 원시 문자열
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Header를 캐시합니다.
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// 응답 내용 유형 Header를 무시합니다.
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// 상태 종속 콜백
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// 적절한 콜백을 실행하십시오.
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// 오래된 콜백을 유지하는 방식으로 새로운 콜백을 추가하십시오.
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// 요청 취소
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// 지연 연기
		deferred.promise( jqXHR );


		// 제공되지 않으면 프로토콜을 추가합니다 (사전 필터가 예상 할 수 있음).
		// 설정 객체에서 위장 된 URL을 처리합니다 (# 10093 : 이전 서명과의 일관성).
		// 사용 가능한 경우 url 매개 변수도 사용합니다.
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// 티켓 # 12004에 따라 입력하는 별칭 메서드 옵션
		s.type = options.method || options.type || s.method || s.type;

		// dataType 형식 목록 추출
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// origin이 현재 origin과 일치하지 않으면 도메인 간 요청이 순서대로 처리됩니다.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// 지원 : IE <= 8 - 11, 가장자리 12 - 15
			// URL이 잘못된 경우 IE에서 href 속성에 액세스 할 때 예외가 발생합니다.
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// 지원 : IE <= 8 - 11 전용
				// s.url이 상대 일 때 Anchor의 호스트 속성이 올바르게 설정되지 않았습니다.
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// URL을 파싱하는 동안 오류가 발생하면 crossDomain이라고 가정하고,
				// 유효하지 않은 경우 전송으로 거부 될 수 있습니다.
				s.crossDomain = true;
			}
		}

		// 문자열이 아닌 경우 데이터 변환
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// 프리 필터 적용
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// 프리 필터에서 요청이 중단 된 경우 중지하십시오.
		if ( completed ) {
			return jqXHR;
		}

		// 요청에 따라 현재 전역 이벤트를 시작할 수 있습니다.
		// jQuery.event가 AMD 사용 시나리오에서 정의되지 않은 경우 이벤트를 발생시키지 않습니다 (# 15118).
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// 유형을 대문자로
		s.type = s.type.toUpperCase();

		// 요청에 내용이 있는지 판별하십시오.
		s.hasContent = !rnoContent.test( s.type );

		// If-Modified-Since 태그로 우리가 놀고있는 경우에 대비하여 URL을 저장하십시오.
		// 및 / 또는 If-None-Match header later on
		// 해시를 제거하여 URL 조작을 간소화합니다.
		cacheURL = s.url.replace( rhash, "" );

		// 내용이없는 요청 처리 옵션 추가
		if ( !s.hasContent ) {

			
			uncached = s.url.slice( cacheURL.length );

			// 데이터를 사용할 수있는 경우 URL에 데이터를 추가하십시오.
			if ( s.data ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// # 9682 : 최종 재 시도에서 사용되지 않도록 데이터를 제거하십시오.
				delete s.data;
			}

			// 필요한 경우 안티 캐시 매개 변수를 추가 또는 업데이트합니다.
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// 요청 된 URL에 해시 및 안티 캐시를 추가합니다 (gh-1732).
			s.url = cacheURL + uncached;

		// 이것이 인코딩 된 본문 내용 인 경우 '% 20'을 (를) '+'로 변경하십시오 (gh-2658).
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// ifModified 모드 인 경우 If-Modified-Since 및 / 또는 If-None-Match 헤더를 설정하십시오.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// 데이터가 전송되는 경우 올바른 헤더 설정
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// dataType에 따라 서버의 Accepts 헤더를 설정하십시오.
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Header 체크 옵션
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// 사용자 정의 Header / MIME 형식 허용 및 초기 중단
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// 이미 완료되지 않은 경우 중단하고 리턴하십시오.
			return jqXHR.abort();
		}

		// 취소는 더 이상 취소되지 않습니다.
		strAbort = "abort";

		// 지연시 callback을 설치합니다.
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// 전송 수단 확보
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// 전송이 없으면 자동 중단됩니다
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// 글로벌 이벤트 보내기
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// 요청이 ajaxSend 내에서 중단 된 경우 거기에서 중지하십시오.
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// 완료 후 예외 재검색
				if ( completed ) {
					throw e;
				}

				// 결과로 다른 사람을 전파하십시오.
				done( -1, e );
			}
		}

		// 모든 것이 완료되면 callback
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// 반복 호출 무시
			if ( completed ) {
				return;
			}

			completed = true;

			// 클리어 타임 아웃이있는 경우
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// 초기 가비지 수집을 위해 비표준 전송
			// (jqXHR 객체의 사용 기간에 관계없이)
			transport = undefined;

			// 응답 header를 캐시하십시오.
			responseHeadersString = headers || "";

			// readyState를 설정합니다.
			jqXHR.readyState = status > 0 ? 4 : 0;

			// 성공 여부 결정
			isSuccess = status >= 200 && status < 300 || status === 304;

			// 응답 데이터를 얻습니다.
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// 무엇이든지간에 변환 (responseXXX 필드가 항상 설정 됨)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// 성공하면 유형 연결을 처리합니다.
			if ( isSuccess ) {

				// ifModified 모드 인 경우 If-Modified-Since 및 / 또는 If-None-Match 헤더를 설정하십시오.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// 내용이없는 경우
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// 수정되지 않은 경우
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// 데이터가있는 경우 변환하십시오.
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// statusText에서 오류 추출 및 비 중단시 정상화
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			//모조 xhr 객체에 대한 데이터 설정
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// 성공시 true 오류 발생시 false
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// 상태 종속 콜백
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// 완료
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// 글로벌 AJAX 카운터를 처리한다.
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// 데이터 인수가 생략 된 경우 인수 전달
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// url은 options 객체가 될 수 있음 (단 .url이 있어야 함)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

return jQuery;
} );
