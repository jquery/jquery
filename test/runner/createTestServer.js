import bodyParser from "body-parser";
import express from "express";
import bodyParserErrorHandler from "express-body-parser-error-handler";
import fs from "fs";
import mockServer from "../middleware-mockserver.cjs";

export async function createTestServer( report ) {
	const nameHTML = await fs.promises.readFile( "./test/data/name.html", "utf8" );
	const indexHTML = await fs.promises.readFile( "./test/index.html", "utf8" );
	const app = express();

	// Redirect home to test page
	app.get( "/", ( _req, res ) => {
		res.redirect( "/test/" );
	} );

	// Add a script tag to the index.html to load the QUnit listeners
	app.use( /\/test(?:\/index.html)?\/?/, ( _req, res ) => {
		res.send( indexHTML.replace(
			"</head>",
			"<script src=\"/test/runner/browserstack/listeners.js\"></script></head>"
		) );
	} );

	// Bind the reporter
	app.post( "/api/report", bodyParser.json( { limit: "50mb" } ), ( req, res ) => {
		if ( report ) {
			report( req.body );
		}
		res.sendStatus( 204 );
	} );

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
