(function( jQuery ) {

var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			tuples = [
				[ "resolve", "done", doneList, "resolved" ],
				[ "reject", "fail", failList, "rejected" ],
				[ "notify", "progress", progressList ]
			],
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
					return obj == null ?
						promise :
						// Extend obj if possible, or an empty object otherwise
						jQuery.extend(obj, {}, promise);
				}
			},
			deferred,
			key;

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Construct deferred
		deferred = promise.promise({});

		jQuery.each( tuples, function( i, tuple ) {

			// deferred[ resolve | reject | notify ] = [ doneList | failList | progressList ].fire
			deferred[ tuple[0] ] = tuple[ 2 ].fire;
			deferred[ tuple[0] + "With" ] = tuple[ 2 ].fireWith;

			if ( i <= 1 ) {
				// deferred[ done | fail ]( state: [ resolved | rejected ], [ failList | doneList].disable, ... )
				deferred[ tuple[1] ]( function() {
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
	when: function( firstParam ) {
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments ) : value;
				if ( !( --remaining ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}

		var args = sliceDeferred.call( arguments ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			remaining = length !== 1 || ( firstParam && jQuery.isFunction( firstParam.promise ) ) ? length : 0,
			deferred = remaining === 1 ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();

		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().done( resolveFunc(i) ).fail( deferred.reject ).progress( progressFunc(i) );
				} else {
					--remaining;
				}
			}
		}

		if ( !remaining ) {
			deferred.resolveWith( deferred, args );
		}

		return promise;
	}
});

})( jQuery );
