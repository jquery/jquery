(function( jQuery ) {

var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks("once memory"),
			failList = jQuery.Callbacks("once memory"),
			progressList = jQuery.Callbacks("memory"),
			tuples = [
				// action, add listener, listener list
				[ "resolve", "done", doneList ],
				[ "reject", "fail", failList ],
				[ "notify", "progress", progressList ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				then: function( fnDone, fnFail, fnProgress ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
								function() {
									var returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().done( newDefer.resolve ).fail( newDefer.reject ).progress( newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								} :
								newDefer[ action ]
							);
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						return promise;
					}
					for ( var key in promise ) {
						obj[ key ] = promise[ key ];
					}
					return obj;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// deferred[ resolve | reject | notify ] = list.fire
			deferred[ tuple[0] ] = list.fire;
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Add promise aspect and state handlers
		deferred = promise.promise( deferred ).done(function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail(function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

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
			args = sliceDeferred.call( arguments ),
			length = args.length,
			progressValues = new Array( length ),

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If args consist of only a single Deferred, just use that.
			deferred = remaining === 1 ?
				subordinate :
				jQuery.Deferred(),
			promise = deferred.promise(),
			updateFunc = function( i, arr ) {
				return function( value ) {
					arr[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments ) : value;
					// if this is an update, notify the master
					if ( arr === progressValues ) {
						deferred.notifyWith( promise, arr );

					// if this was the last subordinate, resolve the master
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( promise, arr );
					}
				};
			};

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().done( updateFunc( i, args ) ).fail( deferred.reject ).progress( updateFunc( i, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( deferred, args );
		}

		return promise;
	}
});

})( jQuery );
