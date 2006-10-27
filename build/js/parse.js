function parse( f ) {
	var c = [], bm, m;
	var blockMatch = /\/\*\*\s*((.|\n)*?)\s*\*\//g;
	var paramMatch = /\@(\S+) *((.|\n)*?)(?=\n\@|!!!)/m;
	
	while ( bm = blockMatch.exec(f) ) {
		block = bm[1].replace(/^\s*\* ?/mg,"") + "!!!";
		var ret = { params: [], examples: [], tests: [], options: [] };
	
		while ( m = paramMatch.exec( block ) ) {
			block = block.replace( paramMatch, "" );

			var n = m[1];
			var v = m[2]
				.replace(/\s*$/g,"")
				.replace(/^\s*/g,"")
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				//.replace(/\n/g, "<br/>")
				/*.replace(/(\s\s+)/g, function(a){
					var ret = "";
					for ( var i = 0; i < a.length; i++ )
						ret += "&nbsp;";
					return ret;
				})*/ || 1;
	
			if ( n == 'param' || n == 'option' ) {
				var args = v.split(/\s+/);
				v = args.slice( 2, args.length );
				v = { type: args[0], name: args[1], desc: v.join(' ') };
				n = n + "s";
			} else if ( n == 'example' ) {
				v = { code: v };
				n = "examples";
			} else if ( n == 'test' ) {
				n = "tests";
			}
	
			if ( n == 'desc' || n == 'before' || n == 'after' || n == 'result' ) {
				ret.examples[ ret.examples.length - 1 ][ n ] = v;
			} else {
				if ( ret[ n ] ) {
					if ( ret[ n ].constructor == Array ) {
						ret[ n ].push( v );
					} else {
						ret[ n ] = [ ret[ n ], v ];
					}
				} else {
					ret[ n ] = v;
				}
			}
		}
  	
		ret.desc = block.replace(/\s*!!!$/,"")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;");
				//.replace(/\n\n/g, "<br/><br/>")
				//.replace(/\n/g, " ");
	
		var m = /^((.|\n)*?(\.|$))/.exec( ret.desc );
		if ( m ) ret['short'] = m[1];
	
		if ( ret.name ) c.push( ret );
	}

	return c;
}

function categorize( json ) {
	var obj = { cat: [], method: [] };

	for ( var i = 0; i < json.length; i++ ) {
		if ( !json[i].cat ) json[i].cat = "";

		var cat = json[i].cat.split("/");

		var pos = obj;
		for ( var j = 0; j < cat.length; j++ ) {
			var c = cat[j];
			var curCat = null;

			// Locate current category
			for ( var n = 0; n < pos.cat.length; n++ )
				if ( pos.cat[n].value == c )
					curCat = pos.cat[n];

			// Create current category
			if ( !curCat ) {
				curCat = { value: c, cat: [], method: [] };
				pos.cat.push( curCat )
			}

			// If we're at  the end, add the method
			if ( j == cat.length - 1 )
				curCat.method.push( json[i] );

			// Otherwise, traverse deeper
			else
				pos = curCat;
		}
	}

	return obj;
}
