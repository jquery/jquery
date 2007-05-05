/*
	Packer version 3.0 (beta 8) - copyright 2004-2007, Dean Edwards
	http://www.opensource.org/licenses/mit-license
*/

eval(base2.namespace);

var IGNORE = RegGrp.IGNORE;
var REMOVE = "";
var SPACE = " ";
var WORDS = /\w+/g;

var Packer = Base.extend({
	minify: function(script) {
		script = script.replace(Packer.CONTINUE, "");
		script = Packer.data.exec(script);
		script = Packer.whitespace.exec(script);
		script = Packer.clean.exec(script);
		return script;
	},
	
	pack: function(script, base62, shrink) {
		script = this.minify(script + "\n");
		if (shrink) script = this._shrinkVariables(script);
		if (base62) script = this._base62Encode(script);	
		return script;
	},
	
	_base62Encode: function(script) {
		var words = new Words(script);
		var encode = function(word) {
			return words.fetch(word).encoded;
		};
		
		/* build the packed script */
		
		var p = this._escape(script.replace(WORDS, encode));		
		var a = Math.min(Math.max(words.count(), 2), 62);		
		var c = words.count();		
		var k = words;
		var e = Packer["ENCODE" + (a > 10 ? a > 36 ? 62 : 36 : 10)];
		var r = a > 10 ? "e(c)" : "c";
		
		// the whole thing
		return format(Packer.UNPACK, p,a,c,k,e,r);
	},
	
	_escape: function(script) {
		// single quotes wrap the final string so escape them
		// also escape new lines required by conditional comments
		return script.replace(/([\\'])/g, "\\$1").replace(/[\r\n]+/g, "\\n");
	},
	
	_shrinkVariables: function(script) {
		// Windows Scripting Host cannot do regexp.test() on global regexps.
		var global = function(regexp) {
			// This function creates a global version of the passed regexp.
			return new RegExp(regexp.source, "g");
		};
		
		var data = []; // encoded strings and regular expressions
		var REGEXP = /^[^'"]\//;
		var store = function(string) {
			var replacement = "#" + data.length;
			if (REGEXP.test(string)) {
				replacement = string.charAt(0) + replacement;
				string = string.slice(1);
			}
			data.push(string);
			return replacement;
		};
		
		// Base52 encoding (a-Z)
		var encode52 = function(c) {
			return (c < 52 ? '' : arguments.callee(parseInt(c / 52))) +
				((c = c % 52) > 25 ? String.fromCharCode(c + 39) : String.fromCharCode(c + 97));
		};
				
		// identify blocks, particularly identify function blocks (which define scope)
		var BLOCK = /(function\s*[\w$]*\s*\(\s*([^\)]*)\s*\)\s*)?(\{([^{}]*)\})/;
		var VAR_ = /var\s+/g;
		var VAR_NAME = /var\s+[\w$]+/g;
		var COMMA = /\s*,\s*/;
		var blocks = []; // store program blocks (anything between braces {})
		// encoder for program blocks
		var encode = function(block, func, args) {
			if (func) { // the block is a function block
			
				// decode the function block (THIS IS THE IMPORTANT BIT)
				// We are retrieving all sub-blocks and will re-parse them in light
				// of newly shrunk variables
				block = decode(block);
				
				// create the list of variable and argument names 
				var vars = match(block, VAR_NAME).join(",").replace(VAR_, "");
				var ids = Array2.combine(args.split(COMMA).concat(vars.split(COMMA)));
				
				// process each identifier
				var count = 0, shortId;
				forEach (ids, function(id) {
					id = trim(id);
					if (id && id.length > 1) { // > 1 char
						id = rescape(id);
						// find the next free short name (check everything in the current scope)
						do shortId = encode52(count++);
						while (new RegExp("[^\\w$.]" + shortId + "[^\\w$:]").test(block));
						// replace the long name with the short name
						var reg = new RegExp("([^\\w$.])" + id + "([^\\w$:])");
						while (reg.test(block)) block = block.replace(global(reg), "$1" + shortId + "$2");
						var reg = new RegExp("([^{,])" + id + ":", "g");
						block = block.replace(reg, "$1" + shortId + ":");
					}
				});
			}
			var replacement = "~" + blocks.length + "~";
			blocks.push(block);
			return replacement;
		};
		
		// decoder for program blocks
		var ENCODED = /~(\d+)~/;
		var decode = function(script) {
			while (ENCODED.test(script)) {
				script = script.replace(global(ENCODED), function(match, index) {
					return blocks[index];
				});
			}
			return script;
		};
		
		// encode strings and regular expressions
		script = Packer.data.exec(script, store);
		
		// remove closures (this is for base2 namespaces only)
		script = script.replace(/new function\(_\)\s*\{/g, "{;#;");
		
		// encode blocks, as we encode we replace variable and argument names
		while (BLOCK.test(script)) {
			script = script.replace(global(BLOCK), encode);
		}
		
		// put the blocks back
		script = decode(script);
		
		// put back the closure (for base2 namespaces only)
		script = script.replace(/\{;#;/g, "new function(_){");
		
		// put strings and regular expressions back
		script = script.replace(/#(\d+)/g, function(match, index) {		
			return data[index];
		});
		
		return script;
	}
}, {
	CONTINUE: /\\\r?\n/g,
	
	ENCODE10: "String",
	ENCODE36: "function(c){return c.toString(a)}",
	ENCODE62: "function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))}",
	
	UNPACK: "eval(function(p,a,c,k,e,r){e=%5;if(!''.replace(/^/,String)){while(c--)r[%6]=k[c]" +
	        "||%6;k=[function(e){return r[e]}];e=function(){return'\\\\w+'};c=1};while(c--)if(k[c])p=p." +
			"replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c]);return p}('%1',%2,%3,'%4'.split('|'),0,{}))",
	
	init: function() {
		this.data = reduce(this.data, function(data, replacement, expression) {
			data.store(this.javascript.exec(expression), replacement);
			return data;
		}, new RegGrp, this);
		this.clean = this.data.union(this.clean);
		this.whitespace = this.data.union(this.whitespace);
	},
	
	clean: {
		"\\(\\s*;\\s*;\\s*\\)": "(;;)", // for (;;) loops
		"throw[^};]+[};]": IGNORE, // a safari 1.3 bug
		";+\\s*([};])": "$1"
	},
	
	data: {
		// strings
		"STRING1": IGNORE,
		'STRING2': IGNORE,
		"CONDITIONAL": IGNORE, // conditional comments
		"(COMMENT1)\\n\\s*(REGEXP)?": "\n$3",
		"(COMMENT2)\\s*(REGEXP)?": " $3",
		"([\\[(\\^=,{}:;&|!*?])\\s*(REGEXP)": "$1$2"
	},
	
	javascript: new RegGrp({
		COMMENT1:    /(\/\/|;;;)[^\n]*/.source,
		COMMENT2:    /\/\*[^*]*\*+([^\/][^*]*\*+)*\//.source,
		CONDITIONAL: /\/\*@|@\*\/|\/\/@[^\n]*\n/.source,
		REGEXP:      /\/(\\[\/\\]|[^*\/])(\\.|[^\/\n\\])*\/[gim]*/.source,
		STRING1:     /'(\\.|[^'\\])*'/.source,
		STRING2:     /"(\\.|[^"\\])*"/.source
	}),
	
	whitespace: {
		"(\\d)\\s+(\\.\\s*[a-z\\$_\\[(])": "$1 $2", // http://dean.edwards.name/weblog/2007/04/packer3/#comment84066
		"([+-])\\s+([+-])": "$1 $2", // c = a++ +b;
		"\\b\\s+\\$\\s+\\b": " $ ", // var $ in
		"\\$\\s+\\b": "$ ", // object$ in
		"\\b\\s+\\$": " $", // return $object
		"\\b\\s+\\b": SPACE,
		"\\s+": REMOVE
	}
});
