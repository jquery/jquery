/* eslint-env node */
var url = require( "url" );
var fs = require( "fs" );
var getRawBody = require( "raw-body" );

var cspLog = "";
var mocks = {
	"test/data/ajax/content-type.php": function( req, resp ) {
		resp.writeHead( 200, {
			"content-type": req.headers[ "content-type" ]
		} );
		resp.end( req.query.response );
	},
	"test/data/name.php": function( req, resp, next ) {
		resp.writeHead( 200 );
		if ( req.query.name === "foo" ) {
			resp.end( "bar" );
			return;
		}
		getBody( req ).then( function(  body ) {
			if ( body === "name=peter" ) {
				resp.end( "pan" );
			} else {
				resp.end( "ERROR <script type=\"text/javascript\">ok( true, \"name.php executed\" );</script>" );
			}
		}, next );
	},
	"test/data/support/csp.log": function( req, resp, next ) {
		resp.writeHead( 200 );
		resp.end( cspLog );
	},
	"test/data/support/csp-clean.php": function( req, resp, next ) {
		cspLog = "";
		resp.writeHead( 200 );
		resp.end();
	},
	"test/data/support/csp-log.php": function( req, resp, next ) {
		cspLog = "error";
		resp.writeHead( 200 );
		resp.end();
	},
	"test/data/support/csp.php": function( req, resp, next ) {
		resp.writeHead( 200, {
			"Content-Type": "text/html",
			"Content-Security-Policy": "default-src 'self'; report-uri csp-log.php"
		} );
		var body = fs.readFileSync( __dirname + "/data/support/csp.php" ).toString();
		var html = body.replace( /^<\?php[\s\S]*\?>\n/, "" );
		resp.end( html );
	},
	"test/data/testbar.php": function( req, resp, next ) {
		resp.writeHead( 200 );
		var body = fs.readFileSync( __dirname + "/data/testbar.php" ).toString();
		resp.end( body );
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
		var method = req.method,
			parsed = url.parse( req.url, /* parseQuery */ true ),
			path = parsed.pathname.replace( /^\/base\//, "" ),
			query = parsed.query,
			subReq = Object.assign( Object.create( req ), {
				query: query
			} );


		if ( !mocks[ path ] ) {
			next();
			return;
		}

		// console.log( req.method, path, req.url );
		mocks[ path ]( subReq, resp, next );
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
