import express from "express";
import mockServer from "./middleware-mockserver.cjs";
import fs from "fs";

const nameHTML = fs.readFileSync( "./test/data/name.html", "utf8" );
const app = express();

app.use( mockServer() );

app.post( "/test/data/name.html", function( _req, res ) {
	res.send( nameHTML );
} );

app.use( "/dist", express.static( "dist" ) );
app.use( "/src", express.static( "src" ) );
app.use( "/test", express.static( "test" ) );
app.use( "/external", express.static( "external" ) );

app.listen( 3000, function() {
  console.log( "Server is running on port 3000" );
} );
