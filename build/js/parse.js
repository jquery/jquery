function parse( f ) {
	var c = [], bm, m;
	var blockMatch = /\/\*\*\s*((.|\n)*?)\s*\*\//g;
	var paramMatch = /\@(\S+) *((.|\n)*?)(?=\n\@|!!!)/m;
	
	while ( bm = blockMatch.exec(f) ) {
		block = bm[1].replace(/^\s*\* ?/mg,"") + "!!!";
		var ret = { params: [], examples: [], tests: [] };
	
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
	
			if ( n == 'param' || n == 'any' ) {
				var args = v.split(/\s+/);
				v = args.slice( 2, args.length );
				v = { type: args[0], name: args[1], desc: v.join(' ') };
				if ( n == 'any' ) v.any = 1;
				n = "params";
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
	var obj = { methods: [] };

	for ( var i = 0; i < json.length; i++ ) {
		if ( !json[i].cat ) json[i].cat = "";

		var cat = json[i].cat.split("/");

		var pos = obj;
		for ( var j = 0; j < cat.length; j++ ) {
			var c = cat[j];

			// Create current category
			if ( !pos[c] ) pos[c] = { methods: [] };

			// If we're at  the end, add the method
			if ( j == cat.length - 1 )
				pos[c].methods.push( json[i] );

			// Otherwise, traverse deeper
			else
				pos = pos[c];
		}
	}

	return obj;
}
