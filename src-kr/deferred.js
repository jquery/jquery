define( [
	"./core",
	"./var/slice",
	"./callbacks"
], function( jQuery, slice ) {

"use strict";

function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// 동기 동작을 우선적으로 약속하기 위해 약속 측면 확인
		if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// 기타 사항
		} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// 기타 비 주류
		} else {

			// Array # slice가 부울 값``noValue``를 정수로 만들어서`resolve` 인자를 제어합니다 :
			// * false : [value] .slice (0) => resolve (value)
			// * true : [값] .slice (1) => resolve ()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// Promises / A +의 경우 예외를 거부로 변환합니다.
	// jQuery.when가 결과를 언랩하지 않기 때문에, 다음에 나오는 추가 체크를 건너 뛸 수 있습니다.
	// 조건부로 거부를 억제하려면 Deferred # then을 누릅니다.
	} catch ( value ) {

		// 지원 : Android 4.0 전용
		// .call없이 호출되는 엄격한 모드 함수 / .apply 전역 객체 컨텍스트를 얻습니다.
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// 이전 버전과 호환되는 파이프 유지
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// 튜플 (진행, 완료, 실패)을 인수 (완료, 실패, 진행)에 매핑합니다.
							var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress (function () {newDefer 또는 newDefer.notify에 바인딩})
							// deferred.done (function () {newDefer 또는 newDefer.resolve에 바인드})
							// deferred.fail (function () {newDefer 또는 newDefer.reject에 바인드})
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// 지원 : 약속 / A + 섹션 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// 더블 - 해상도 시도 무시
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// 지원 : 약속 / A + 섹션 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// 지원 : Promises / A + 섹션 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// 'then'을 한 번만 검색하십시오.
									then = returned &&

										// 지원 : 약속 / A + 섹션 2.3.4
										// https://promisesaplus.com/#point-64
										// 객체와 함수를 점검하여 객체 가능성을 확인하십시오.
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// 반환 된 이름을 처리합니다.
									if ( jQuery.isFunction( then ) ) {

										// 특별한 프로세서 (알림) 만 해결을 기다린다.
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// 일반 프로세서 (해결)도 진행 상황에 연결합니다.
										} else {

											// ... 이전 해상도 값 무시
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// 다른 모든 반환 값을 처리합니다.
									} else {

										// 컨텍스트를 대체하는 핸들러 만 전달합니다.
										// 및 여러 값 (비표준 비헤이비어)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// 값을 처리합니다.
										// 기본 프로세스가 해결됩니다.
										( special || deferred.resolveWith )( that, args );
									}
								},

								// 정상 프로세서 만 (해결) 예외 캐치 및 거부
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// 지원 : 약속 / A + 섹션 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// post-resolution 예외를 무시합니다.
											if ( depth + 1 >= maxDepth ) {

												// 컨텍스트를 대체하는 핸들러 만 전달합니다.
												// 및 여러 값 (비표준 비헤이비어)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// 지원 : 약속 / A + 섹션 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// 허위의 거절을 피하기 위해 즉시 약속을 재결정하십시오.
							// 후속 오류
							if ( depth ) {
								process();
							} else {

								// 예외가 발생했을 때 스택을 기록하기위한 선택적인 훅을 호출한다.
								// 실행이 비동기가 될 때 손실되기 때문에
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								jQuery.isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				//이 지연에 대한 약속 가져 오기
				// obj가 제공되면 promise aspect가 객체에 추가됩니다.
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// 목록 특정 메서드를 추가합니다.
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (즉, 충족 됨)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// 지연된 약속으로 만듭니다.
		promise.promise( deferred );

		// 주어진 func가 있으면 호출
		if ( func ) {
			func.call( deferred, deferred );
		}

		// 모두 완료되었습니다!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// 완료되지 않은 하위의 개수
			remaining = arguments.length,

			// 처리되지 않은 인자의 개수
			i = remaining,

			// 하위의 이행 데이터
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// 지연된 마스터
			master = jQuery.Deferred(),

			// 하위 콜백 팩토리
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// 단일 인수와 빈 인수는 Promise.resolve처럼 채택됩니다.
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// 보조 어휘를 풀기 위해 .then ()을 사용한다 (cf. gh-3000 참조)
			if ( master.state() === "pending" ||
				jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// 여러 인수는 Promise.all 배열 요소와 같이 집계됩니다.
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );

return jQuery;
} );
