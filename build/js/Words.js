
var Words = Collection.extend({
	constructor: function(script) {
		this.base();
		forEach (script.match(WORDS), this.add, this);
		this.encode();
	},
	
	add: function(word) {
		if (!this.exists(word)) this.base(word);
		word = this.fetch(word);
		word.count++;
		return word;
	},
	
	encode: function() {
		// sort by frequency
		this.sort(function(word1, word2) {
			return word2.count - word1.count;
		});
		
		eval("var a=62,e=" + Packer.ENCODE62);
		var encode = e;		
		var encoded = new Collection; // a dictionary of base62 -> base10
		var count = this.count();
		for (var i = 0; i < count; i++) {
			encoded.store(encode(i), i);
		}
		
		var empty = function() {return ""};
		var index = 0;
		forEach (this, function(word) {
			if (encoded.exists(word)) {
				word.index = encoded.fetch(word);
				word.toString = empty;
			} else {
				while (this.exists(encode(index))) index++;
				word.index = index++;
			}
			word.encoded = encode(word.index);
		}, this);
		
		// sort by encoding
		this.sort(function(word1, word2) {
			return word1.index - word2.index;
		});
	},
	
	toString: function() {
		return this.values().join("|");
	}
}, {
	Item: {
		constructor: function(word) {
			this.toString = function() {return word};
		},
		
		count: 0,
		encoded: "",
		index: -1
	}
});
