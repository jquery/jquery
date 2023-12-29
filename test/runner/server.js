import { createTestServer } from "./createTestServer.js";

const port = process.env.PORT || 3000;

async function runServer() {
	const app = await createTestServer();

	app.listen( { port, host: "0.0.0.0" }, function() {
		console.log( `Open tests at http://localhost:${ port }/test/` );
	} );
}

runServer();
