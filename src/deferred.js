define([
	"./core",
	"./var/slice",
	"./callbacks"
], function( jQuery, slice ) {

function stdAttach( object, fnDone, fnFail, fnProgress ) {
	if ( object ) {
		if ( jQuery.isFunction( object.promise ) ) {
			return object.promise()
				.progress( fnProgress )
				.done( fnDone )
				.fail( fnFail );
		}

		return object;
	}
}

function stdCallback( defer, callback, defaultCallback ) {
	return function( value ) {
		setTimeout(function() {
			try {
				defer.resolve( ( jQuery.isFunction( callback ) ? callback : defaultCallback )( value ) );
			} catch ( e ) {
				return defer.reject( e );
			}
		});
	};
}

jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
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
				then: function( fnDone, fnFail ) {
					return jQuery.Deferred(function( newDefer ) {
						deferred
							.done( stdCallback( newDefer, fnDone, function(response) {
								return response;
							}))
							.fail( stdCallback( newDefer, fnFail, function(error) {
								throw error;
							}));
					}).promise();
				},
				catch: function( fnFail ) {
					return promise.then( null, fnFail );
				},
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( !stdAttach(
										returned,
										newDefer.resolve,
										newDefer.reject,
										newDefer.notify
									)
								) {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				var valueThen,
					value = arguments[ 0 ],
					context = this === deferred ? promise : this,
					method = tuple[ 0 ];
				if ( method !== "resolve" ||
					( !value || typeof value !== "object" ) && typeof value !== "function" ) {
					deferred[ method + "With" ]( context, arguments );
				} else {
					try {
						valueThen = value.then;
					} catch ( e ) {
						deferred.reject( e );
						return this;
					}
					if (jQuery.isFunction( valueThen )) {
						valueThen.call( value, function ( newValue ) {
							deferred.resolve( newValue );
						}, function ( error ) {
							deferred.reject( error );
						});
					} else {
						deferred[ method + "With" ]( this, arguments );
					}
				}
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if (
					!stdAttach(
						resolveValues[ i ],
						updateFunc( i, resolveContexts, resolveValues ),
						deferred.reject,
						updateFunc( i, progressContexts, progressValues )
					)
				) {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});

return jQuery;
});
