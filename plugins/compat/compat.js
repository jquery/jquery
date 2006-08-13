	// Since we're using Prototype's $ function,
	// be nice and have backwards compatability
	if ( typeof Prototype != "undefined" ) {
		if ( $a.constructor == String ) {
			var re = new RegExp( "[^a-zA-Z0-9_-]" );
			if ( !re.test($a) ) {
				$c = $c && $c.documentElement || document;
				if ( $c.getElementsByTagName($a).length === 0 ) {
					var obj = $c.getElementById($a);
					if ( obj ) { return obj; }
				}
			}
		} else if ( $a.constructor == Array ) {
			return $.map( $a, function(b){
				if ( b.constructor == String ) {
					return document.getElementById(b);
				}
				return b;
			});
		}
	}

// TODO: Remove need to return this
	for ( var i in $.fn ) {
		if ( self[i] !== null )
			self["_"+i] = self[i];
		self[i] = $.fn[i];
	}

	if ( typeof Prototype != "undefined" && $a.constructor != String ) {
		if ( $c ) $a = self.get();
		for ( var k in self ) {(function(j){
			try {
				if ( !$a[j] )
					$a[j] = function() {
						return $.apply(self,self[j],arguments);
					};
			} catch(e) {}
		})(k);}
		return $a;
	}
