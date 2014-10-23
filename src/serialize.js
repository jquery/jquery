define([
	"./core",
	"./manipulation/var/rcheckableType",
	"./core/init",
	"./traversing", // filter
	"./attributes/prop"
], function( jQuery, rcheckableType ) {

var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	},
    serializeJSON: function(options) {
        var serializedObject = {},
            opts = jQuery.extend({
                forceArray: true,
                forceNumber: true
            }, options),
            $form = this,
            isObject = function(obj) {
                var type = typeof obj;
                return type === "function" || type === "object" && !!obj;
            },
            isSimpleType = function(obj) {
                var type = typeof obj;
                return type !== "function" && type !== "object";
            },
            isNumber = function(val) { return /^\d+(\.\d+)?$/.test(val); },
            isUndefined = function(obj) { return obj === void 0; },
            isValidArrayIndex = function(val) { return /^[0-9]+$/.test(String(val));},
            valueFor = function(el) {
                if (el.value === "on" || el.value === "off") {
                    if ($form.find("input[type=checkbox][name='" + el.name + "']")) {
                        return el.value === "on";
                    } else {
                        return el.value;
                    }
                } else {
                    return opts.forceNumber && isNumber(el.value) ? +el.value : el.value;
                }
            },
            doAssign = function(target, keys, value) {
                var key, nextKey, oldValue, lastIndex, lastValue, currentValue;
                if (isUndefined(target)) {
                    throw new Error("ArgumentError: param 'target' expected to be " +
                        "an object or array, found undefined");
                }
                if (!keys || keys.length === 0) {
                    throw new Error("ArgumentError: param 'keys' expected to be an " +
                        "array with least one element");
                }
                key = keys[0];
                if (keys.length === 1) {
                    if (key === "") {
                        target.push(value);
                    } else {
                        oldValue = target[key];
                        if (oldValue && oldValue.push) { // Handle the same name
                            oldValue.push(value);
                        } else if (oldValue) {
                            target[key] = [ oldValue, value ];
                        } else {
                            target[key] = value;
                        }
                    }
                } else {
                    nextKey = keys[1];
                    if (key === "") {
                        lastIndex = target.length - 1; //target must be an array
                        lastValue = target[lastIndex];
                        if (isObject(lastValue) &&
                            (isUndefined(lastValue[nextKey]) || keys.length > 2)) {
                            key = lastIndex;
                        } else {
                            key = lastIndex + 1;
                        }
                    }
                    currentValue = target[key];
                    if (isUndefined(currentValue)) {
                        target[key] = (nextKey === "" ||
                            opts.forceArray && isValidArrayIndex(nextKey)) ? [] : {};
                    } else if (isSimpleType(currentValue)) {
                        target[key] = opts.forceArray ? [ currentValue ] : { "": currentValue };
                    }

                    doAssign(target[key], keys.slice(1), value);
                }
            };

        jQuery.each(this.serializeArray(), function(i, e) {
            var keys;
            if ( e.value && e.name ) {
                keys = jQuery.map(e.name.split("["), function( key ) { return key.replace(/\]/g, ""); });
                doAssign( serializedObject, keys, valueFor( e ) );
            }
        });
        return serializedObject;
    }
});

return jQuery;
});
