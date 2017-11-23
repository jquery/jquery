define( [
	"./core",
	"./var/rnothtmlwhite"
], function( jQuery, rnothtmlwhite ) {

"use strict";

// String 형식의 옵션을 Object 형식의 옵션으로 변환합니다.
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * 다음 매개 변수를 사용하여 콜백 목록을 만듭니다.
 *
 * options : 공간을 구분하는 옵션 목록으로 옵션을 변경하는 옵션입니다.
 * 콜백리스트가 동작하거나 더 전통적인 옵션 객체
 *
 * 기본적으로 콜백 목록은 이벤트 콜백 목록처럼 작동 할 수 있습니다.
 * "해고"여러 번.
 *
 * 가능한 옵션 :
 *
 * once : 콜백 목록이 한 번만 실행될 수 있도록합니다 (예 : Deferred와 같은).
 *
 * 메모리 : 이전 값을 추적하고 콜백을 추가로 호출합니다.
 * 목록이 최신 "암기 된"
 * 값 (예 : 지연된 값)
 *
 * unique : 콜백을 한 번만 추가 할 수 있습니다 (목록에 중복 없음).
 *
 * stopOnFalse : 콜백이 false를 반환 할 때 호출을 중단합니다.
 *
 */
jQuery.Callbacks = function( options ) {

	// 필요한 경우 String 형식에서 Object 형식으로 옵션 변환
	// (먼저 캐시에 체크 인합니다)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // 현재 실행중인 목록인지 여부를 나타내는 플래그
		firing,

		// 잊지 못할 목록에 대한 마지막 화재 값
		memory,

		// 이미 실행 된 목록인지 여부를 나타내는 플래그
		fired,

		// 발사 방지 플래그
		locked,

		// 실제 콜백 목록
		list = [],

		// 반복 가능 목록에 대한 실행 데이터 대기열
		queue = [],

		// 현재 실행중인 콜백 인덱스 (필요에 따라 추가 / 제거하여 수정 됨)
		firingIndex = -1,

		// 콜백 호출
		fire = function() {

			// 단일 실행 실행
			locked = locked || options.once;

			// 모든 보류중인 실행에 대한 콜백을 실행합니다.
			// firingIndex 재정의 및 런타임 변경 사항 준수
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// 콜백을 실행하고 조기 종료를 확인합니다.
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// 끝으로 건너 뛰고 데이터를 잊어 버리므로 .add가 다시 실행되지 않습니다.
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// 작업이 끝나면 데이터를 잊어 버림
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// 좋은 결과를 위해 해고가 끝나면 정리합니다.
			if ( locked ) {

				// 향후 추가 호출을위한 데이터가있는 경우 비어있는 목록 유지
				if ( memory ) {
					list = [];

				//  그렇지 않으면,이 객체는 소비됩니다.
				} else {
					list = "";
				}
			}
		},

		// 실제 콜백 객체
		self = {

			// 목록에 콜백 또는 콜백 콜렉션을 추가합니다.
			add: function() {
				if ( list ) {

					// 과거 실행으로 인한 메모리가 있으면 추가 한 후에 실행해야합니다.
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// 재귀 적으로 검사
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// 목록에서 콜백을 제거합니다.
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// 실행 색인 처리
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// 지정된 콜백이 목록에 있는지 확인합니다.
			// 인수가 지정되지 않은 경우 list에 콜백이 첨부되었는지 여부를 반환합니다.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// 목록에서 모든 콜백을 제거합니다.
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// .fire 및 .add를 비활성화합니다.
			// 현재 실행 중이거나 보류중인 실행을 중단합니다.
			// 모든 콜백 및 값 지우기
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// .fire를 사용 중지합니다.
			// 우리가 메모리를 가지고 있지 않으면 (또한 효과가 없으므로) .add를 사용하지 않도록 설정하십시오.
			// 보류중인 실행을 중단합니다.
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// 지정된 컨텍스트 및 인수를 사용하여 모든 콜백을 호출합니다.
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// 주어진 인자로 모든 콜백을 호출한다.
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// 콜백이 이미 적어도 한 번 호출되었는지 여부를 알고 싶습니다.
			fired: function() {
				return !!fired;
			}
		};

	return self;
};

return jQuery;
} );
