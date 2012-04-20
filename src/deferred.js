(function( jQuery ) {

var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks("once memory"),
			failList = jQuery.Callbacks("once memory"),
			progressList = jQuery.Callbacks("memory"),
			tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", doneList, "resolved" ],
				[ "reject", "fail", failList, "rejected" ],
				[ "notify", "progress", progressList ]
			],
			state = "pending",
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

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
			deferred = promise.promise({});

		// Keep pipe for back-compat
		deferred.pipe = promise.pipe = promise.then;

		jQuery.each( tuples, function( i, tuple ) {

			// deferred[ resolve | reject | notify ] = [ doneList | failList | progressList ].fire
			deferred[ tuple[0] ] = tuple[ 2 ].fire;
			deferred[ tuple[0] + "With" ] = tuple[ 2 ].fireWith;

			// deferred[ done | fail ]( state: [ resolved | rejected ], [ failList | doneList].disable, ... )
			if ( i <= 1 ) {
				deferred[ tuple[1] ](function() {
					state = tuple[ 3 ];
				}, tuples[ 1 - i ][ 2 ].disable, progressList.lock );
			}
		});

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments ) : value;

				// if this was the last subordinate, resolve the master
				if ( !( --remaining ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				progressValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments ) : value;
				deferred.notifyWith( promise, progressValues );
			};
		}

		var args = sliceDeferred.call( arguments ),
			i = 0,
			length = args.length,
			progressValues = new Array( length ),

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If args consist of only a single Deferred, just use that.
			deferred = remaining === 1 ?
				subordinate :
				jQuery.Deferred(),
			promise = deferred.promise();

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().done( resolveFunc(i) ).fail( deferred.reject ).progress( progressFunc(i) );
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
