// timestamp: Tue, 01 May 2007 19:13:00
/*
	base2.js - copyright 2007, Dean Edwards
	http://www.opensource.org/licenses/mit-license
*/

var base2 = {};

// You know, writing a javascript library is awfully time consuming.

new function(_) { ////////////////////  BEGIN: CLOSURE  ////////////////////

// =========================================================================
// base2/Base.js
// =========================================================================

// version 1.1

var Base = function() {
	// call this method from any other method to invoke that method's ancestor
};

Base.prototype = {	
	extend: function(source) {
		if (arguments.length > 1) { // extending with a name/value pair
			var ancestor = this[source];
			var value = arguments[1];
			if (typeof value == "function" && ancestor && /\bbase\b/.test(value)) {
				var method = value;				
				value = function() { // override
					var previous = this.base;
					this.base = ancestor;
					var returnValue = method.apply(this, arguments);
					this.base = previous;
					return returnValue;
				};
				value.method = method;
				value.ancestor = ancestor;
			}
			this[source] = value;
		} else if (source) { // extending with an object literal
			var extend = Base.prototype.extend;
			if (Base._prototyping) {
				var key, i = 0, members = ["constructor", "toString", "valueOf"];
				while (key = members[i++]) if (source[key] != Object.prototype[key]) {
					extend.call(this, key, source[key]);
				}
			} else if (typeof this != "function") {
				// if the object has a customised extend() method then use it
				extend = this.extend || extend;
			}			
			// copy each of the source object's properties to this object
			for (key in source) if (!Object.prototype[key]) {
				extend.call(this, key, source[key]);
			}
		}
		return this;
	},

	base: Base
};

Base.extend = function(_instance, _static) { // subclass
	var extend = Base.prototype.extend;
	
	// build the prototype
	Base._prototyping = true;
	var proto = new this;
	extend.call(proto, _instance);
	delete Base._prototyping;
	
	// create the wrapper for the constructor function
	var constructor = proto.constructor;
	var klass = proto.constructor = function() {
		if (!Base._prototyping) {
			if (this._constructing || this.constructor == klass) { // instantiation
				this._constructing = true;
				constructor.apply(this, arguments);
				delete this._constructing;
			} else { // casting
				var object = arguments[0];
				if (object != null) {
					(object.extend || extend).call(object, proto);
				}
				return object;
			}
		}
	};
	
	// build the class interface
	for (var i in Base) klass[i] = this[i];
	klass.ancestor = this;
	klass.base = Base.base;
	klass.prototype = proto;
	klass.toString = this.toString;
	extend.call(klass, _static);
	// class initialisation
	if (typeof klass.init == "function") klass.init();
	return klass;
};

// initialise
Base = Base.extend({
	constructor: function() {
		this.extend(arguments[0]);
	}
}, {
	ancestor: Object,
	base: Base,
	
	implement: function(_interface) {
		if (typeof _interface == "function") {
			// if it's a function, call it
			_interface(this.prototype);
		} else {
			// add the interface using the extend() method
			this.prototype.extend(_interface);
		}
		return this;
	}
});

// =========================================================================
// lang/main.js
// =========================================================================

var Legacy = typeof $Legacy == "undefined" ? {} : $Legacy;

var K = function(k) {return k};

var assert = function(condition, message, Err) {
	if (!condition) {
		throw new (Err || Error)(message || "Assertion failed.");
	}
};

var assertType = function(object, type, message) {
	if (type) {
		var condition = typeof type == "function" ? instanceOf(object, type) : typeof object == type;
		assert(condition, message || "Invalid type.", TypeError);
	}
};

var copy = function(object) {
	var fn = new Function;
	fn.prototype = object;
	return new fn;
};

var format = function(string) {
	// replace %n with arguments[n]
	// e.g. format("%1 %2%3 %2a %1%3", "she", "se", "lls");
	// ==> "she sells sea shells"
	// only supports nine replacements: %1 - %9
	var args = arguments;
	return String(string).replace(/%([1-9])/g, function(match, index) {
		return index < args.length ? args[index] : match;
	});
};

var $instanceOf = Legacy.instanceOf || new Function("o,k", "return o instanceof k");
var instanceOf = function(object, klass) {
	assertType(klass, "function", "Invalid 'instanceOf' operand.");
	if ($instanceOf(object, klass)) return true;
	// handle exceptions where the target object originates from another frame
	//  this is handy for JSON parsing (amongst other things)
	if (object != null) switch (klass) {
		case Object:
			return true;
		case Number:
		case Boolean:
		case Function:
		case String:
			return typeof object == typeof klass.prototype.valueOf();
		case Array:
			// this is the only troublesome one
			return !!(object.join && object.splice && !arguments.callee(object, Function));
		case Date:
			return !!object.getTimezoneOffset;
		case RegExp:
			return String(object.constructor.prototype) == String(new RegExp);
	}
	return false;
};
	
var match = function(string, expression) {
	// same as String.match() except that this function will return an empty 
	// array if there is no match
	return String(string).match(expression) || [];
};

var RESCAPE = /([\/()[\]{}|*+-.,^$?\\])/g;
var rescape = function(string) {
	// make a string safe for creating a RegExp
	return String(string).replace(RESCAPE, "\\$1");
};

var $slice = Array.prototype.slice;
var slice = function(object) {
	// slice an array-like object
	return $slice.apply(object, $slice.call(arguments, 1));
};

var TRIM = /^\s+|\s+$/g;
var trim = function(string) {
	return String(string).replace(TRIM, "");	
};

// =========================================================================
// lang/extend.js
// =========================================================================

var base = function(object, args) {
	// invoke the base method with all supplied arguments
	return object.base.apply(object, args);
};

var extend = function(object) {
	assert(object != Object.prototype, "Object.prototype is verboten!");
	return Base.prototype.extend.apply(object, slice(arguments, 1));
};

// =========================================================================
// lang/assignID.js
// =========================================================================

var $ID = 1;
var assignID = function(object) {
	// assign a unique id
	if (!object.base2ID) object.base2ID = "b2_" + $ID++;
	return object.base2ID;
};

// =========================================================================
// lang/forEach.js
// =========================================================================

if (typeof StopIteration == "undefined") {
	StopIteration = new Error("StopIteration");
}

var forEach = function(object, block, context) {
	if (object == null) return;
	if (typeof object == "function") {
		// functions are a special case
		var fn = Function;
	} else if (typeof object.forEach == "function" && object.forEach != arguments.callee) {
		// the object implements a custom forEach method
		object.forEach(block, context);
		return;
	} else if (typeof object.length == "number") {
		// the object is array-like
		forEach.Array(object, block, context);
		return;
	}
	forEach.Function(fn || Object, object, block, context);
};

// these are the two core enumeration methods. all other forEach methods
//  eventually call one of these two.

forEach.Array = function(array, block, context) {
	var i, length = array.length; // preserve
	if (typeof array == "string") {
		for (i = 0; i < length; i++) {
			block.call(context, array.charAt(i), i, array);
		}
	} else {
		for (i = 0; i < length; i++) {
			block.call(context, array[i], i, array);
		}
	}
};

forEach.Function = Legacy.forEach || function(fn, object, block, context) {
	// enumerate an object and compare its keys with fn's prototype
	for (var key in object) {
		if (fn.prototype[key] === undefined) {
			block.call(context, object[key], key, object);
		}
	}
};

// =========================================================================
// base2/Base/forEach.js
// =========================================================================

Base.forEach = function(object, block, context) {
	forEach.Function(this, object, block, context);
};

// =========================================================================
// base2/../Function.js
// =========================================================================

// some browsers don't define this

Function.prototype.prototype = {};


// =========================================================================
// base2/../String.js
// =========================================================================

// fix String.replace (Safari/IE5.0)

if ("".replace(/^/, String)) {
	extend(String.prototype, "replace", function(expression, replacement) {
		if (typeof replacement == "function") { // Safari doesn't like functions
			if (instanceOf(expression, RegExp)) {
				var regexp = expression;
				var global = regexp.global;
				if (global == null) global = /(g|gi)$/.test(regexp);
				// we have to convert global RexpExps for exec() to work consistently
				if (global) regexp = new RegExp(regexp.source); // non-global
			} else {
				regexp = new RegExp(rescape(expression));
			}
			var match, string = this, result = "";
			while (string && (match = regexp.exec(string))) {
				result += string.slice(0, match.index) + replacement.apply(this, match);
				string = string.slice(match.index + match[0].length);
				if (!global) break;
			}
			return result + string;
		} else {
			return base(this, arguments);
		}
	});
}

// =========================================================================
// base2/Abstract.js
// =========================================================================

var Abstract = Base.extend({
	constructor: function() {
		throw new TypeError("Class cannot be instantiated.");
	}
});

// =========================================================================
// base2/Module.js
// =========================================================================

// based on ruby's Module class and Mozilla's Array generics:
//   http://www.ruby-doc.org/core/classes/Module.html
//   http://developer.mozilla.org/en/docs/New_in_JavaScript_1.6#Array_and_String_generics

// A Module is used as the basis for creating interfaces that can be
// applied to other classes. *All* properties and methods are static.
// When a module is used as a mixin, methods defined on what would normally be
// the instance interface become instance methods of the target object.

// Modules cannot be instantiated. Static properties and methods are inherited.

var Module = Abstract.extend(null, {
	extend: function(_interface, _static) {
		// extend a module to create a new module
		var module = this.base();
		// inherit static methods
		forEach (this, function(property, name) {
			if (!Module[name] && name != "init") {
				extend(module, name, property);
			}
		});
		// implement module (instance AND static) methods
		module.implement(_interface);
		// implement static properties and methods
		extend(module, _static);
		// Make the submarine noises Larry!
		if (typeof module.init == "function") module.init();
		return module;
	},
	
	implement: function(_interface) {
		// implement an interface on BOTH the instance and static interfaces
		var module = this;
		if (typeof _interface == "function") {
			module.base(_interface);
			forEach (_interface, function(property, name) {
				if (!Module[name] && name != "init") {
					extend(module, name, property);
				}
			});
		} else {
			// create the instance interface
			Base.forEach (extend({}, _interface), function(property, name) {
				// instance methods call the equivalent static method
				if (typeof property == "function") {
					property = function() {
						base; // force inheritance
						return module[name].apply(module, [this].concat(slice(arguments)));
					};
				}
				if (!Module[name]) extend(this, name, property);
			}, module.prototype);
			// add the static interface
			extend(module, _interface);
		}
		return module;
	}
});


// =========================================================================
// base2/Enumerable.js
// =========================================================================

var Enumerable = Module.extend({
	every: function(object, test, context) {
		var result = true;
		try {
			this.forEach (object, function(value, key) {
				result = test.call(context, value, key, object);
				if (!result) throw StopIteration;
			});
		} catch (error) {
			if (error != StopIteration) throw error;
		}
		return !!result; // cast to boolean
	},
	
	filter: function(object, test, context) {
		return this.reduce(object, function(result, value, key) {
			if (test.call(context, value, key, object)) {
				result[result.length] = value;
			}
			return result;
		}, new Array2);
	},

	invoke: function(object, method) {
		// apply a method to each item in the enumerated object
		var args = slice(arguments, 2);
		return this.map(object, (typeof method == "function") ? function(item) {
			if (item != null) return method.apply(item, args);
		} : function(item) {
			if (item != null) return item[method].apply(item, args);
		});
	},
	
	map: function(object, block, context) {
		var result = new Array2;
		this.forEach (object, function(value, key) {
			result[result.length] = block.call(context, value, key, object);
		});
		return result;
	},
	
	pluck: function(object, key) {
		return this.map(object, function(item) {
			if (item != null) return item[key];
		});
	},
	
	reduce: function(object, block, result, context) {
		this.forEach (object, function(value, key) {
			result = block.call(context, result, value, key, object);
		});
		return result;
	},
	
	some: function(object, test, context) {
		return !this.every(object, function(value, key) {
			return !test.call(context, value, key, object);
		});
	}
}, {
	forEach: forEach
});

// =========================================================================
// base2/Array2.js
// =========================================================================

// The IArray module implements all Array methods.
// This module is not public but its methods are accessible through the Array2 object (below). 

var IArray = Module.extend({
	combine: function(keys, values) {
		// combine two arrays to make a hash
		if (!values) values = keys;
		return this.reduce(keys, function(object, key, index) {
			object[key] = values[index];
			return object;
		}, {});
	},
	
	copy: function(array) {
		return this.concat(array);
	},
	
	contains: function(array, item) {
		return this.indexOf(array, item) != -1;
	},
	
	forEach: forEach.Array,
	
	indexOf: function(array, item, fromIndex) {
		var length = array.length;
		if (fromIndex == null) {
			fromIndex = 0;
		} else if (fromIndex < 0) {
			fromIndex = Math.max(0, length + fromIndex);
		}
		for (var i = fromIndex; i < length; i++) {
			if (array[i] === item) return i;
		}
		return -1;
	},
	
	insertAt: function(array, item, index) {
		this.splice(array, index, 0, item);
		return item;
	},
	
	insertBefore: function(array, item, before) {
		var index = this.indexOf(array, before);
		if (index == -1) this.push(array, item);
		else this.splice(array, index, 0, item);
		return item;
	},
	
	lastIndexOf: function(array, item, fromIndex) {
		var length = array.length;
		if (fromIndex == null) {
			fromIndex = length - 1;
		} else if (from < 0) {
			fromIndex = Math.max(0, length + fromIndex);
		}
		for (var i = fromIndex; i >= 0; i--) {
			if (array[i] === item) return i;
		}
		return -1;
	},
	
	remove: function(array, item) {
		var index = this.indexOf(array, item);
		if (index != -1) this.removeAt(array, index);
		return item;
	},
	
	removeAt: function(array, index) {
		var item = array[index];
		this.splice(array, index, 1);
		return item;
	}
});

IArray.prototype.forEach = function(block, context) {
	forEach.Array(this, block, context);
};

IArray.implement(Enumerable);

forEach ("concat,join,pop,push,reverse,shift,slice,sort,splice,unshift".split(","), function(name) {
	IArray[name] = function(array) {
		return Array.prototype[name].apply(array, slice(arguments, 1));
	};
});

// create a faux constructor that augments the built-in Array object
var Array2 = function() {
	return IArray(this.constructor == IArray ? Array.apply(null, arguments) : arguments[0]);
};
// expose IArray.prototype so that it can be extended
Array2.prototype = IArray.prototype;

forEach (IArray, function(method, name, proto) {
	if (Array[name]) {
		IArray[name] = Array[name];
		delete IArray.prototype[name];
	}
	Array2[name] = IArray[name];
});

// =========================================================================
// base2/Hash.js
// =========================================================================

var HASH = "#" + Number(new Date);
var KEYS = HASH + "keys";
var VALUES = HASH + "values";

var Hash = Base.extend({
	constructor: function(values) {
		this[KEYS] = new Array2;
		this[VALUES] = {};
		this.merge(values);
	},

	copy: function() {
		var copy = new this.constructor(this);
		Base.forEach (this, function(property, name) {
			if (typeof property != "function" && name.charAt(0) != "#") {
				copy[name] = property;
			}
		});
		return copy;
	},

	// ancient browsers throw an error when we use "in" as an operator 
	//  so we must create the function dynamically
	exists: Legacy.exists || new Function("k", format("return('%1'+k)in this['%2']", HASH, VALUES)),

	fetch: function(key) {
		return this[VALUES][HASH + key];
	},

	forEach: function(block, context) {
		forEach (this[KEYS], function(key) {
			block.call(context, this.fetch(key), key, this);
		}, this);
	},

	keys: function(index, length) {
		var keys = this[KEYS] || new Array2;
		switch (arguments.length) {
			case 0: return keys.copy();
			case 1: return keys[index];
			default: return keys.slice(index, length);
		}
	},

	merge: function(values) {
		forEach (arguments, function(values) {
			forEach (values, function(value, key) {
				this.store(key, value);
			}, this);
		}, this);
		return this;
	},

	remove: function(key) {
		var value = this.fetch(key);
		this[KEYS].remove(String(key));
		delete this[VALUES][HASH + key];
		return value;
	},

	store: function(key, value) {
		if (arguments.length == 1) value = key;
		// only store the key for a new entry
		if (!this.exists(key)) {
			this[KEYS].push(String(key));
		}
		// create the new entry (or overwrite the old entry)
		this[VALUES][HASH + key] = value;
		return value;
	},

	toString: function() {
		return String(this[KEYS]);
	},

	union: function(values) {
		return this.merge.apply(this.copy(), arguments);
	},

	values: function(index, length) {
		var values = this.map(K);
		switch (arguments.length) {
			case 0: return values;
			case 1: return values[index];
			default: return values.slice(index, length);
		}
	}
});

Hash.implement(Enumerable);

// =========================================================================
// base2/Collection.js
// =========================================================================

// A Hash that is more array-like (accessible by index).

// Collection classes have a special (optional) property: Item
// The Item property points to a constructor function.
// Members of the collection must be an instance of Item.
// e.g.
//     var Dates = Collection.extend();                 // create a collection class
//     Dates.Item = Date;                               // only JavaScript Date objects allowed as members
//     var appointments = new Dates();                  // instantiate the class
//     appointments.add(appointmentId, new Date);       // add a date
//     appointments.add(appointmentId, "tomorrow");     // ERROR!

// The static create() method is responsible for all construction of collection items.
// Instance methods that add new items (add, store, insertAt, replaceAt) pass *all* of their arguments
// to the static create() method. If you want to modify the way collection items are 
// created then you only need to override this method for custom collections.

var Collection = Hash.extend({
	add: function(key, item) {
		// Duplicates not allowed using add().
		//  - but you can still overwrite entries using store()
		assert(!this.exists(key), "Duplicate key.");
		return this.store.apply(this, arguments);
	},

	count: function() {
		return this[KEYS].length;
	},

	indexOf: function(key) {
		return this[KEYS].indexOf(String(key));
	},

	insertAt: function(index, key, item) {
		assert(!this.exists(key), "Duplicate key.");
		this[KEYS].insertAt(index, String(key));
		return this.store.apply(this, slice(arguments, 1));
	},

	item: function(index) {
		return this.fetch(this[KEYS][index]);
	},

	removeAt: function(index) {
		return this.remove(this[KEYS][index]);
	},

	reverse: function() {
		this[KEYS].reverse();
		return this;
	},

	sort: function(compare) {
		if (compare) {
			var self = this;
			this[KEYS].sort(function(key1, key2) {
				return compare(self.fetch(key1), self.fetch(key2), key1, key2);
			});
		} else this[KEYS].sort();
		return this;
	},

	store: function(key, item) {
		if (arguments.length == 1) item = key;
		item = this.constructor.create.apply(this.constructor, arguments);
		return this.base(key, item);
	},

	storeAt: function(index, item) {
		//-dean: get rid of this?
		assert(index < this.count(), "Index out of bounds.");
		arguments[0] = this[KEYS][index];
		return this.store.apply(this, arguments);
	}
}, {
	Item: null, // if specified, all members of the Collection must be instances of Item
	
	create: function(key, item) {
		if (this.Item && !instanceOf(item, this.Item)) {
			item = new this.Item(key, item);
		}
		return item;
	},
	
	extend: function(_instance, _static) {
		var klass = this.base(_instance);
		klass.create = this.create;
		extend(klass, _static);
		if (!klass.Item) {
			klass.Item = this.Item;
		} else if (typeof klass.Item != "function") {
			klass.Item = (this.Item || Base).extend(klass.Item);
		}
		if (typeof klass.init == "function") klass.init();
		return klass;
	}
});

// =========================================================================
// base2/RegGrp.js
// =========================================================================

var RegGrp = Collection.extend({
	constructor: function(values, flags) {
		this.base(values);
		if (typeof flags == "string") {
			this.global = /g/.test(flags);
			this.ignoreCase = /i/.test(flags);
		}
	},

	global: true, // global is the default setting
	ignoreCase: false,

	exec: function(string, replacement) {
		if (arguments.length == 1) {
			var keys = this[KEYS];
			var values = this[VALUES];
			replacement = function(match) {
				if (!match) return "";
				var offset = 1, i = 0;
				// loop through the values
				while (match = values[HASH + keys[i++]]) {
					// do we have a result?
					if (arguments[offset]) {
						var replacement = match.replacement;
						switch (typeof replacement) {
							case "function":
								return replacement.apply(null, slice(arguments, offset));
							case "number":
								return arguments[offset + replacement];
							default:
								return replacement;
						}
					// no? then skip over references to sub-expressions
					} else offset += match.length + 1;
				}
			};
		}
		var flags = (this.global ? "g" : "") + (this.ignoreCase ? "i" : "");
		return String(string).replace(new RegExp(this, flags), replacement);
	},

	test: function(string) {
		return this.exec(string) != string;
	},
	
	toString: function() {
		var length = 0;
		return "(" + this.map(function(item) {
			// fix back references
			var expression = String(item).replace(/\\(\d+)/g, function($, index) {
				return "\\" + (1 + Number(index) + length);
			});
			length += item.length + 1;
			return expression;
		}).join(")|(") + ")";
	}
}, {
	IGNORE: "$0",
	
	init: function() {
		forEach ("add,exists,fetch,remove,store".split(","), function(name) {
			extend(this, name, function(expression) {
				if (instanceOf(expression, RegExp)) {
					expression = expression.source;
				}
				return base(this, arguments);
			});
		}, this.prototype);
	}
});

// =========================================================================
// base2/RegGrp/Item.js
// =========================================================================

RegGrp.Item = Base.extend({
	constructor: function(expression, replacement) {
		var ESCAPE = /\\./g;
		var STRING = /(['"])\1\+(.*)\+\1\1$/;
	
		expression = instanceOf(expression, RegExp) ? expression.source : String(expression);
		
		if (typeof replacement == "number") replacement = String(replacement);
		else if (replacement == null) replacement = "";
		
		// count the number of sub-expressions
		//  - add one because each pattern is itself a sub-expression
		this.length = match(expression.replace(ESCAPE, "").replace(/\[[^\]]+\]/g, ""), /\(/g).length;
		
		// does the pattern use sub-expressions?
		if (typeof replacement == "string" && /\$(\d+)/.test(replacement)) {
			// a simple lookup? (e.g. "$2")
			if (/^\$\d+$/.test(replacement)) {
				// store the index (used for fast retrieval of matched strings)
				replacement = parseInt(replacement.slice(1));
			} else { // a complicated lookup (e.g. "Hello $2 $1")
				// build a function to do the lookup
				var i = this.length + 1;
				var Q = /'/.test(replacement.replace(ESCAPE, "")) ? '"' : "'";
				replacement = replacement.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\$(\d+)/g, Q +
					"+(arguments[$1]||" + Q+Q + ")+" + Q);
				replacement = new Function("return " + Q + replacement.replace(STRING, "$1") + Q);
			}
		}
		this.replacement = replacement;
		this.toString = function() {
			return expression || "";
		};
	},
	
	length: 0,
	replacement: ""
});

// =========================================================================
// base2/Namespace.js
// =========================================================================

var Namespace = Base.extend({
	constructor: function(_private, _public) {
		this.extend(_public);
		this.toString = function() {
			return format("[base2.%1]", this.name);
		};
		
		// initialise
		if (typeof this.init == "function") this.init();
		
		if (this.name != "base2") {
			this.namespace = format("var %1=base2.%1;", this.name);
		}
		
		var namespace = "var base=" + base + ";";
		var imports = ("base2,lang," + this.imports).split(",");
		_private.imports = Enumerable.reduce(imports, function(namespace, name) {
			if (base2[name]) namespace += base2[name].namespace;
			return namespace;
		}, namespace);
		
		var namespace = format("base2.%1=%1;", this.name);
		var exports = this.exports.split(",");
		_private.exports = Enumerable.reduce(exports, function(namespace, name) {
			if (name) {
				this.namespace += format("var %2=%1.%2;", this.name, name);
				namespace += format("if(!%1.%2)%1.%2=%2;base2.%2=%1.%2;", this.name, name);
			}
			return namespace;
		}, namespace, this);
		
		if (this.name != "base2") {
			base2.namespace += format("var %1=base2.%1;", this.name);
		}
	},

	exports: "",
	imports: "",
	namespace: "",
	name: ""
});

base2 = new Namespace(this, {
	name:    "base2",
	version: "0.8 (alpha)",
	exports: "Base,Abstract,Module,Enumerable,Array2,Hash,Collection,RegGrp,Namespace"
});

base2.toString = function() {
	return "[base2]";
};

eval(this.exports);

// =========================================================================
// base2/lang/namespace.js
// =========================================================================

var lang = new Namespace(this, {
	name:    "lang",
	version: base2.version,
	exports: "K,assert,assertType,assignID,copy,instanceOf,extend,format,forEach,match,rescape,slice,trim",
	
	init: function() {
		this.extend = extend;
		// add the Enumerable methods to the lang object
		forEach (Enumerable.prototype, function(method, name) {
			if (!Module[name]) {
				this[name] = function() {
					return Enumerable[name].apply(Enumerable, arguments);
				};
				this.exports += "," + name;
			}
		}, this);
	}
});

eval(this.exports);

base2.namespace += lang.namespace;

}; ////////////////////  END: CLOSURE  /////////////////////////////////////
