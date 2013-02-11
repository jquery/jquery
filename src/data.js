/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var data_user, data_priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data() {
	// Data objects. Keys correspond to the
	// unlocker that is accessible via "locker" method
	this.cache = {};
}

Data.uid = 1;

Data.prototype = {
	locker: function( owner ) {
		var ovalueOf,
		// Check if the owner object has already been outfitted with a valueOf
		// "locker". They "key" is the "Data" constructor itself, which is scoped
		// to the IIFE that wraps jQuery. This prevents outside tampering with the
		// "valueOf" locker.
		unlock = owner.valueOf( Data );

		// If no "unlock" string exists, then create a valueOf "locker"
		// for storing the unlocker key. Since valueOf normally does not accept any
		// arguments, extant calls to valueOf will still behave as expected.
		if ( typeof unlock !== "string" ) {
			unlock = jQuery.expando + Data.uid++;
			ovalueOf = owner.valueOf;

			Object.defineProperty( owner, "valueOf", {
				value: function( pick ) {
					if ( pick === Data ) {
						return unlock;
					}
					return ovalueOf.apply( owner );
				}
				// By omitting explicit [ enumerable, writable, configurable ]
				// they will default to "false"
			});
		}

		// If private or user data already create a valueOf locker
		// then we'll reuse the unlock key, but still need to create
		// a cache object for this instance (could be private or user)
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop, cache, unlock;

		// There may be an unlock assigned to this node,
		// if there is no entry for this "owner", create one inline
		// and set the unlock as though an owner entry had always existed
		unlock = this.locker( owner );
		cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// [*] In the case where there was actually no "owner" entry and
			// this.locker( owner ) was called to create one, there will be
			// a corresponding empty plain object in the cache.
			//
			// Note, this will kill the reference between
			// "this.cache[ unlock ]" and "cache"
			if ( jQuery.isEmptyObject( cache ) ) {
				cache = data;
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}

		// [*] This is required to support an expectation made possible by the old
		// data system where plain objects used to initialize would be
		// set to the cache by reference, instead of having properties and
		// values copied.
		this.cache[ unlock ] = cache;

		return this;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object.
		var cache = this.cache[ this.locker( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		if ( value === undefined && (key && typeof key !== "object") ) {
			// Assume this is a request to read the cached data
			return this.get( owner, key );
		} else {

			// If only an owner was specified, return the entire
			// cache object.
			if ( key === undefined ) {
				return this.get( owner );
			}

			// Allow setting or extending (existing objects) with an
			// object of properties, or a key and val
			this.set( owner, key, value );
			return value !== undefined ? value : key;
		}
		// Otherwise, this is a read request.
		return this.get( owner, key );
	},
	remove: function( owner, key ) {
		var i, l, name,
				unlock = this.locker( owner ),
				cache = this.cache[ unlock ];

		if ( key === undefined ) {
			cache = {};
		} else {
			if ( cache ) {
				// Support array or space separated string of keys
				if ( !Array.isArray( key ) ) {
					// Try the string as a key before any manipulation
					if ( key in cache ) {
						name = [ key ];
					} else {
						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = jQuery.camelCase( key );
						name = name in cache ?
							[ name ] : ( name.match( core_rnotwhite ) || [] );
					}
				} else {
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat( key.map( jQuery.camelCase ) );
				}
				i = 0;
				l = name.length;

				for ( ; i < l; i++ ) {
					delete cache[ name[i] ];
				}
			}
		}
		this.cache[ unlock ] = cache;
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ this.locker( owner ) ]
		);
	},
	discard: function( owner ) {
		delete this.cache[ this.locker( owner ) ];
	}
};

// This will be used by remove()/cleanData() in manipulation to sever
// remaining references to node objects. One day we'll replace the dual
// arrays with a WeakMap and this won't be an issue.
// (Splices the data objects out of the internal cache arrays)
function data_discard( owner ) {
	data_user.discard( owner );
	data_priv.discard( owner );
}

// These may be used throughout the jQuery core codebase
data_user = new Data();
data_priv = new Data();


jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// This is no longer relevant to jQuery core, but must remain
	// supported for the sake of jQuery 1.9.x API surface compatibility.
	acceptData: function() {
		return true;
	},

	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		return data_user.remove( elem, name );
	},

	// TODO: Replace all calls to _data and _removeData with direct
	// calls to
	//
	// data_priv.access( elem, name, data );
	//
	// data_priv.remove( elem, name );
	//
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		return data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );
							dataAttr( elem, name, data[ name ] );
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return jQuery.access( this, function( value ) {
			var data,
					camelKey = jQuery.camelCase( key );

			// Get the Data...
			if ( value === undefined ) {

				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}
				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// As a last resort, attempt to find
				// the data by checking AGAIN, but with
				// a camelCased key.
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return undefined;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might ACTUALLY
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( /-/.test( key ) && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				// Only convert to a number if it doesn't change the string
				+data + "" === data ? +data :
				rbrace.test( data ) ?
					JSON.parse( data ) : data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
