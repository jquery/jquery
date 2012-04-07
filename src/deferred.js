(function( jQuery ) {

var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({
	/**
	 * @constructor
	 * @implements {jQuery.Promise}
	 * @param {function(this:jQuery.Deferred,jQuery.Deferred)=} func
	 * @return {jQuery.Deferred}
	 */
	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
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
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( [
							[ deferred.done, fnDone, newDefer.resolve, newDefer.resolveWith ],
							[ deferred.fail, fnFail, newDefer.reject, newDefer.rejectWith ],
							[ deferred.progress, fnProgress, newDefer.notify, newDefer.notifyWith ]
						], function( i, data ) {
							var handler = data[0],
								fn = data[ 1 ],
								action = data[ 2 ],
								actionWith = data[3],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								handler.call(deferred, function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().done( newDefer.resolve ).fail( newDefer.reject ).progress( newDefer.notify );
									} else {
										actionWith.call( newDefer, this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								handler.call( deferred, action );
							}
						});
					}).promise();
				},
				/**
				 * Get a promise for this deferred
				 * If obj is provided, the promise aspect is added to the object
				 * @return {jQuery.Promise}
				 */
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred,
			key;

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		//Construct deferred
		deferred = /** @type {jQuery.Deferred} */ ( promise.promise({}) );

		deferred.resolve = doneList.fire;
		deferred.resolveWith = doneList.fireWith;
		deferred.reject = failList.fire;
		deferred.rejectWith = failList.fireWith;
		deferred.notify = progressList.fire;
		deferred.notifyWith = progressList.fireWith;

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	/**
	 * Deferred helper
	 * @param {...*} firstParam
	 * @return {jQuery.Promise}
	 */
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments ) : value;
				if ( !( --count ) ) {
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
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().done( resolveFunc(i) ).fail( deferred.reject ).progress( progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});

})( jQuery );
