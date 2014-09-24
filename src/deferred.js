define([
	"./core",
	"./var/slice",
	"./callbacks"
], function( jQuery, slice ) {

var stdTypes = /^(object|function)$/;

function stdAttach( object, fnDone, fnFail, fnProgress ) {
	var then;
	if ( object ) {
		if ( jQuery.isFunction( object.promise ) ) {
			return object.promise()
				.done( fnDone )
				.fail( fnFail )
				.progress( fnProgress );
		}
		if ( stdTypes.test( typeof object ) ) {
			try {
				if ( jQuery.isFunction(( then = object.then )) ) {
					then.call( object, fnDone, fnFail );
					return true;
				}
			} catch ( e ) {
				fnFail( e );
				return true;
			}
		}
	}
}

function stdCallback( deferred, callback ) {
	return jQuery.isFunction( callback ) && function( value ) {
		setTimeout(function() {
			var returned;
			try {
				returned = callback( value );
				if ( returned === deferred.promise() ) {
					throw new TypeError();
				}
			} catch ( e ) {
				return deferred.reject( e );
			}
			if ( !stdAttach( returned, deferred.resolve, deferred.reject, deferred.notify ) ) {
				deferred.resolve( returned );
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
							.done( stdCallback( newDefer, fnDone ) || newDefer.resolve )
							.fail( stdCallback( newDefer, fnFail ) || newDefer.reject );
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
							deferred[ tuple[ 1 ] ](function() {
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
			deferred = {},
			activatorFactoryFactory = function() {
				var finalized;
				return function( i, indirect ) {
					return function( _self, _args ) {
						var factory,
							self = indirect ? _self : this,
							args = indirect ? _args : arguments;
						if ( !finalized ) {
							finalized = ( i < 2 );
							finalized = !indirect && !!(
								args &&
								args.length === 1 &&
								( factory = activatorFactoryFactory() ) &&
								stdAttach( args[ 0 ], factory( 0 ), factory( 1 ), factory( 2 ) )
							);
							if ( !finalized ) {
								tuples[ i ][ 2 ].fireWith(
									self === deferred ? promise : self,
									args
								);
							}
						}
						return this;
					};
				};
			},
			activatorFactory = activatorFactoryFactory();

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
			deferred[ tuple[ 0 ] ] = activatorFactory( i );
			deferred[ tuple[ 0 ] + "With" ] = activatorFactory( i, true );
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
