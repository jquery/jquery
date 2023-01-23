"use strict";

const url = require( "url" );
const fs = require( "fs" );
const getRawBody = require( "raw-body" );

let cspLog = "";

/**
 * Keep in sync with /test/mock.php
 */
function cleanCallback( callback ) {
	return callback.replace( /[^a-z0-9_]/gi, "" );
}

const mocks = {
	contentType: function( req, resp ) {
		resp.writeHead( 200, {
			"content-type": req.query.contentType
		} );
		resp.end( req.query.response );
	},
	wait: function( req, resp ) {
		const wait = Number( req.query.wait ) * 1000;
		setTimeout( function() {
			if ( req.query.script ) {
				resp.writeHead( 200, { "content-type": "text/javascript" } );
			} else {
				resp.writeHead( 200, { "content-type": "text/html" } );
				resp.end( "ERROR <script>QUnit.assert.ok( true, \"mock executed\" );</script>" );
			}
		}, wait );
	},
	name: function( req, resp, next ) {
		resp.writeHead( 200 );
		if ( req.query.name === "foo" ) {
			resp.end( "bar" );
			return;
		}
		getBody( req ).then( function( body ) {
			if ( body === "name=peter" ) {
				resp.end( "pan" );
			} else {
				resp.end( "ERROR" );
			}
		}, next );
	},
	xml: function( req, resp, next ) {
		const content = "<math><calculation>5-2</calculation><result>3</result></math>";
		resp.writeHead( 200, { "content-type": "text/xml" } );

		if ( req.query.cal === "5-2" ) {
			resp.end( content );
			return;
		}
		getBody( req ).then( function( body ) {
			if ( body === "cal=5-2" ) {
				resp.end( content );
			} else {
				resp.end( "<error>ERROR</error>" );
			}
		}, next );
	},
	atom: function( _req, resp ) {
		resp.writeHead( 200, { "content-type": "atom+xml" } );
		resp.end( "<root><element /></root>" );
	},
	script: function( req, resp ) {
		if ( req.query.header === "ecma" ) {
			resp.writeHead( 200, { "content-type": "application/ecmascript" } );
		} else if ( "header" in req.query ) {
			resp.writeHead( 200, { "content-type": "text/javascript" } );
		} else {
			resp.writeHead( 200, { "content-type": "text/html" } );
		}
		resp.end( "QUnit.assert.ok( true, \"mock executed\" );" );
	},
	testbar: function( _req, resp ) {
		resp.writeHead( 200 );
		resp.end(
			"this.testBar = 'bar'; " +
			"jQuery('#ap').html('bar'); " +
			"QUnit.assert.ok( true, 'mock executed');"
		);
	},
	json: function( req, resp ) {
		if ( req.query.header ) {
			resp.writeHead( 200, { "content-type": "application/json" } );
		}
		if ( req.query.array ) {
			resp.end( JSON.stringify(
				[ { name: "John", age: 21 }, { name: "Peter", age: 25 } ]
			) );
		} else {
			resp.end( JSON.stringify(
				{ data: { lang: "en", length: 25 } }
			) );
		}
	},
	jsonp: function( req, resp, next ) {
		let callback;
		if ( Array.isArray( req.query.callback ) ) {
			callback = Promise.resolve( req.query.callback[ req.query.callback.length - 1 ] );
		} else if ( req.query.callback ) {
			callback = Promise.resolve( req.query.callback );
		} else if ( req.method === "GET" ) {
			callback = Promise.resolve( req.url.match( /^.+\/([^\/?]+)\?.+$/ )[ 1 ] );
		} else {
			callback = getBody( req ).then( function( body ) {
				return body.trim().replace( "callback=", "" );
			} );
		}
		const json = req.query.array ?
			JSON.stringify(
				[ { name: "John", age: 21 }, { name: "Peter", age: 25 } ]
			) :
			JSON.stringify(
				{ data: { lang: "en", length: 25 } }
			);
		callback.then( function( cb ) {
			resp.end( `${ cleanCallback( cb ) }(${ json })` );
		}, next );
	},
	xmlOverJsonp: function( req, resp ) {
		const callback = req.query.callback;
		const body = fs.readFileSync( `${ __dirname }/data/with_fries.xml` ).toString();
		resp.writeHead( 200 );
		resp.end( `${ cleanCallback( callback ) }(${ JSON.stringify( body ) })\n` );
	},
	error: function( req, resp ) {
		if ( req.query.json ) {
			resp.writeHead( 400, { "content-type": "application/json" } );
			resp.end( "{ \"code\": 40, \"message\": \"Bad Request\" }" );
		} else {
			resp.writeHead( 400 );
			resp.end( "plain text message" );
		}
	},
	headers: function( req, resp ) {
		resp.writeHead( 200, {
			"Sample-Header": "Hello World",
			"Empty-Header": "",
			"Sample-Header2": "Hello World 2",
			"List-Header": "Item 1",
			"list-header": "Item 2",
			"constructor": "prototype collision (constructor)"
		} );
		req.query.keys.split( "|" ).forEach( function( key ) {
			if ( key.toLowerCase() in req.headers ) {
				resp.write( `${ key }: ${ req.headers[ key.toLowerCase() ] }\n` );
			}
		} );
		resp.end();
	},
	echoData: function( req, resp, next ) {
		getBody( req ).then( function( body ) {
			resp.end( body );
		}, next );
	},
	echoQuery: function( req, resp ) {
		resp.end( req.parsed.search.slice( 1 ) );
	},
	echoMethod: function( req, resp ) {
		resp.end( req.method );
	},
	echoHtml: function( req, resp, next ) {
		resp.writeHead( 200, { "Content-Type": "text/html" } );
		resp.write( `<div id='method'>${ req.method }</div>` );
		resp.write( `<div id='query'>${ req.parsed.search.slice( 1 ) }</div>` );
		getBody( req ).then( function( body ) {
			resp.write( `<div id='data'>${ body }</div>` );
			resp.end( body );
		}, next );
	},
	etag: function( req, resp ) {
		const hash = Number( req.query.ts ).toString( 36 );
		const etag = `W/"${ hash }"`;
		if ( req.headers[ "if-none-match" ] === etag ) {
			resp.writeHead( 304 );
			resp.end();
			return;
		}
		resp.writeHead( 200, {
			"Etag": etag
		} );
		resp.end();
	},
	ims: function( req, resp ) {
		const ts = req.query.ts;
		if ( req.headers[ "if-modified-since" ] === ts ) {
			resp.writeHead( 304 );
			resp.end();
			return;
		}
		resp.writeHead( 200, {
			"Last-Modified": ts
		} );
		resp.end();
	},
	status: function( req, resp ) {
		resp.writeHead( Number( req.query.code ) );
		resp.end();
	},
	testHTML: function( req, resp ) {
		resp.writeHead( 200, { "Content-Type": "text/html" } );
		const body = fs
			.readFileSync( `${ __dirname }/data/test.include.html` )
			.toString()
			.replace( /{{baseURL}}/g, req.query.baseURL );
		resp.end( body );
	},
	cspFrame: function( _req, resp ) {
		resp.writeHead( 200, {
			"Content-Type": "text/html",
			"Content-Security-Policy": "default-src 'self'; " +
				"report-uri /base/test/data/mock.php?action=cspLog"
		} );
		const body = fs.readFileSync( `${ __dirname }/data/csp.include.html` ).toString();
		resp.end( body );
	},
	cspNonce: function( req, resp ) {
		const testParam = req.query.test ? `-${ req.query.test }` : "";
		resp.writeHead( 200, {
			"Content-Type": "text/html",
			"Content-Security-Policy": "script-src 'nonce-jquery+hardcoded+nonce'; " +
				"report-uri /base/test/data/mock.php?action=cspLog"
		} );
		const body = fs.readFileSync(
			`${ __dirname }/data/csp-nonce${ testParam }.html` ).toString();
		resp.end( body );
	},
	cspLog: function( _req, resp ) {
		cspLog = "error";
		resp.writeHead( 200 );
		resp.end();
	},
	cspClean: function( _req, resp ) {
		cspLog = "";
		resp.writeHead( 200 );
		resp.end();
	},
	errorWithScript: function( req, resp ) {
		if ( req.query.withScriptContentType ) {
			resp.writeHead( 404, { "Content-Type": "application/javascript" } );
		} else {
			resp.writeHead( 404, { "Content-Type": "text/html; charset=UTF-8" } );
		}
		if ( req.query.callback ) {
			resp.end( `${ cleanCallback( req.query.callback )
				}( {"status": 404, "msg": "Not Found"} )` );
		} else {
			resp.end( "QUnit.assert.ok( false, \"Mock return erroneously executed\" );" );
		}
	}
};
const handlers = {
	"test/data/mock.php": function( req, resp, next ) {
		if ( !mocks[ req.query.action ] ) {
			resp.writeHead( 400 );
			resp.end( "Invalid action query.\n" );
			console.log( "Invalid action query:", req.method, req.url );
			return;
		}
		mocks[ req.query.action ]( req, resp, next );
	},
	"test/data/support/csp.log": function( _req, resp ) {
		resp.writeHead( 200 );
		resp.end( cspLog );
	},
	"test/data/404.txt": function( _req, resp ) {
		resp.writeHead( 404 );
		resp.end( "" );
	}
};

/**
 * Connect-compatible middleware factory for mocking server responses.
 * Used by Ajax unit tests when run via Karma.
 *
 * Despite Karma using Express, it uses Connect to deal with custom middleware,
 * which passes the raw Node Request and Response objects instead of the
 * Express versions of these (e.g. no req.path, req.query, resp.set).
 */
function MockserverMiddlewareFactory() {

	/**
	 * @param {http.IncomingMessage} req
	 * @param {http.ServerResponse} resp
	 * @param {Function} next Continue request handling
	 */
	return function( req, resp, next ) {
		const parsed = url.parse( req.url, /* parseQuery */ true );
		let path = parsed.pathname.replace( /^\/base\//, "" );
		const query = parsed.query;
		const subReq = Object.assign( Object.create( req ), {
			query: query,
			parsed: parsed
		} );

		if ( /^test\/data\/mock.php\//.test( path ) ) {

			// Support REST-like Apache PathInfo
			path = "test\/data\/mock.php";
		}

		if ( !handlers[ path ] ) {
			next();
			return;
		}

		handlers[ path ]( subReq, resp, next );
	};
}

function getBody( req ) {
	return req.method !== "POST" ?
		Promise.resolve( "" ) :
		getRawBody( req, {
			encoding: true
		} );
}

module.exports = MockserverMiddlewareFactory;
