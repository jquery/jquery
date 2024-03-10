import bodyParser from "body-parser";
import express from "express";
import bodyParserErrorHandler from "express-body-parser-error-handler";
import { readFile } from "node:fs/promises";
import mockServer from "../middleware-mockserver.cjs";

export async function createTestServer( report ) {
	const nameHTML = await readFile( "./test/data/name.html", "utf8" );
	const indexHTML = await readFile( "./test/index.html", "utf8" );
	const app = express();

	// Redirect home to test page
	app.get( "/", ( _req, res ) => {
		res.redirect( "/test/" );
	} );

	// Redirect to trailing slash
	app.use( ( req, res, next ) => {
		if ( req.path === "/test" ) {
			const query = req.url.slice( req.path.length );
			res.redirect( 301, `${ req.path }/${ query }` );
		} else {
			next();
		}
	} );

	// Add a script tag to the index.html to load the QUnit listeners
	app.use( /\/test(?:\/index.html)?\//, ( _req, res ) => {
		res.send(
			indexHTML.replace(
				"</head>",
				"<script src=\"/test/runner/listeners.js\"></script></head>"
			)
		);
	} );

	// Bind the reporter
	app.post(
		"/api/report",
		bodyParser.json( { limit: "50mb" } ),
		async( req, res ) => {
			if ( report ) {
				const response = await report( req.body );
				if ( response ) {
					res.json( response );
					return;
				}
			}
			res.sendStatus( 204 );
		}
	);

	// Handle errors from the body parser
	app.use( bodyParserErrorHandler() );

	// Hook up mock server
	app.use( mockServer() );

	// Serve static files
	app.post( "/test/data/name.html", ( _req, res ) => {
		res.send( nameHTML );
	} );

	app.use( "/dist", express.static( "dist" ) );
	app.use( "/src", express.static( "src" ) );
	app.use( "/test", express.static( "test" ) );
	app.use( "/external", express.static( "external" ) );

	return app;
}
