import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import mockServer from "../middleware-mockserver.cjs";
import getRawBody from "raw-body";

export async function createTestServer( report, { quiet } = {} ) {
	const indexHTML = await readFile( "./test/index.html", "utf8" );

	// Support connect-style middleware
	const middlewares = [];
	function use( middleware ) {
		middlewares.push( middleware );
	}

	function run( req, res ) {
		let i = 0;

		// Log responses unless quiet is set
		if ( !quiet ) {
			const originalEnd = res.end;
			res.end = function( ...args ) {
				console.log( `${ req.method } ${ req.url } ${ this.statusCode }` );
				originalEnd.call( this, ...args );
			};
		}

		req.parsedUrl = new URL( `http://${ process.env.HOST ?? "localhost" }${ req.url }` );

		res.redirect = ( status, location ) => {
			if ( !location ) {
				location = status;
				status = 303;
			}

			res.writeHead( status, { Location: location } );
			res.end();
		};

		const next = () => {
			const middleware = middlewares[ i++ ];
			if ( middleware ) {
				try {
					middleware( req, res, next );
				} catch ( error ) {
					console.error( error );
					res.writeHead( 500, { "Content-Type": "application/json" } );
					res.end( "Internal Server Error" );
				}
			} else {
				res.writeHead( 404 );
				res.end();
			}
		};

		next();
	}

	// Redirect home to test page
	use( ( req, res, next ) => {
		if ( req.parsedUrl.pathname === "/" ) {
			res.redirect( "/test/" );
		} else {
			next();
		}
	} );

	// Redirect to trailing slash
	use( ( req, res, next ) => {
		if ( req.parsedUrl.pathname === "/test" ) {
			res.redirect( 308, `${ req.parsedUrl.pathname }/${ req.parsedUrl.search }` );
		} else {
			next();
		}
	} );

	// Add a script tag to the index.html to load the QUnit listeners
	use( ( req, res, next ) => {
		if (
			( req.method === "GET" || req.method === "HEAD" ) &&
			( req.parsedUrl.pathname === "/test/" || req.parsedUrl.pathname === "/test/index.html" )
		) {
			res.writeHead( 200, { "Content-Type": "text/html" } );
			res.end(
				indexHTML.replace(
					"</head>",
					"<script src=\"/test/runner/listeners.js\"></script></head>"
				)
			);
		} else {
			next();
		}
	} );

	// Bind the reporter
	use( async( req, res, next ) => {
		if ( req.url !== "/api/report" || req.method !== "POST" ) {
			return next();
		}
		let body;
		try {
			body = JSON.parse( await getRawBody( req ) );
		} catch ( error ) {
			if ( error.code === "ECONNABORTED" ) {
				return;
			}
			console.error( error );
			res.writeHead( 400, { "Content-Type": "application/json" } );
			res.end( JSON.stringify( { error: "Invalid JSON" } ) );
			return;
		}
		const response = await report( body );
		if ( response ) {
			res.writeHead( 200, { "Content-Type": "application/json" } );
			res.end( JSON.stringify( response ) );
		} else {
			res.writeHead( 204 );
			res.end();
		}
	} );

	// Hook up mock server
	use( mockServer() );

	// Serve static files
	const validMimeTypes = {
		".js": "application/javascript",
		".css": "text/css",
		".html": "text/html",
		".xml": "application/xml",
		".xhtml": "application/xhtml+xml",
		".jpg": "image/jpeg",
		".png": "image/png",
		".svg": "image/svg+xml",
		".ico": "image/x-icon",
		".map": "application/json",
		".txt": "text/plain",
		".log": "text/plain"
	};
	use( async( req, res, next ) => {
		if (
			req.url.startsWith( "/dist/" ) ||
			req.url.startsWith( "/src/" ) ||
			req.url.startsWith( "/test/" ) ||
			req.url.startsWith( "/external/" )
		) {
			const file = req.parsedUrl.pathname.slice( 1 );
			const ext = file.slice( file.lastIndexOf( "." ) );

			// Allow POST to .html files in tests
			if (
				req.method !== "GET" &&
				req.method !== "HEAD" &&
				( ext !== ".html" || req.method !== "POST" )
			) {
				return next();
			}
			const mimeType = validMimeTypes[ ext ];
			if ( mimeType ) {
				try {
					await stat( file );
				} catch ( error ) {
					res.writeHead( 404 );
					res.end();
					return;
				}
				res.writeHead( 200, { "Content-Type": mimeType } );
				createReadStream( file ).pipe( res ).on( "error", ( error ) => {
					console.error( error );
					res.writeHead( 500 );
					res.end();
				} );
			} else {
				console.error( `Invalid file extension: ${ ext }` );
				res.writeHead( 404 );
				res.end();
			}
		} else {
			next();
		}
	} );

	return http.createServer( run );
}
