// We cannot use "node:fs" here as nginx doesn't recognize it.
import fs from "fs";

let cspLog = "";

/**
 * Like `readFileSync`, but on error returns "ERROR"
 * without crashing.
 * @param path
 */
function readFileSync( path ) {
	try {
		return fs.readFileSync( path );
	} catch ( e ) {
		console.error( "fs.readFileSync failed", e );
		return "ERROR";
	}
}

function getDirname( context ) {
	return import.meta.dirname ?? context.dirname;
}

/**
 * Keep in sync with /test/mock.php
 */
function cleanCallback( callback ) {
	return callback.replace( /[^a-z0-9_]/gi, "" );
}

async function getBody( req ) {
	if ( req.method !== "POST" ) {
		return Promise.resolve( "" );
	}
	if ( "requestText" in req ) {
		return req.requestText;
	}
	const { default: getRawBody } = await import( "raw-body" );
	return getRawBody( req, {
		encoding: true
	} );
}

function getMultiPartContent( req ) {
	return new Promise( async function( resolve ) {
		if ( req.method !== "POST" ) {
			resolve( "" );
			return;
		}

		const { default: multiparty } = await import( "multiparty" );
		const form = new multiparty.Form();
		form.parse( req, function( _err, fields, files ) {
			resolve( { fields, files } );
		} );
	} );
}

const mocks = {
	contentType: async( context ) => {
		return {
			status: 200,
			headers: { "content-type": context.query.contentType },
			body: context.query.response
		};
	},
	wait: async( context ) => {
		const wait = Number( context.query.wait ) * 1000;
		await new Promise( ( resolve ) => setTimeout( resolve, wait ) );
		if ( context.query.script ) {
			return {
				status: 200,
				headers: { "content-type": "text/javascript" },
				body: ""
			};
		} else {
			return {
				status: 200,
				headers: { "content-type": "text/html" },
				body: "ERROR <script>QUnit.assert.ok( true, \"mock executed\" );</script>"
			};
		}
	},
	name: async( context, originalReq ) => {
		if ( context.query.name === "foo" ) {
			return { status: 200, headers: {}, body: "bar" };
		}
		const body = typeof context.body !== "undefined" ?
			context.body : await getBody( originalReq ?? context );
		if ( body === "name=peter" ) {
			return { status: 200, headers: {}, body: "pan" };
		} else {
			return { status: 200, headers: {}, body: "ERROR" };
		}
	},
	xml: async( context, originalReq ) => {
		const content = "<math><calculation>5-2</calculation><result>3</result></math>";
		if ( context.query.cal === "5-2" ) {
			return {
				status: 200,
				headers: { "content-type": "text/xml" },
				body: content
			};
		}
		const body = await getBody( originalReq ?? context );
		if ( body === "cal=5-2" ) {
			return {
				status: 200,
				headers: { "content-type": "text/xml" },
				body: content
			};
		} else {
			return {
				status: 200,
				headers: { "content-type": "text/xml" },
				body: "<error>ERROR</error>"
			};
		}
	},
	atom: async() => {
		return {
			status: 200,
			headers: { "content-type": "atom+xml" },
			body: "<root><element /></root>"
		};
	},
	script: async( context ) => {
		let headers = {};
		if ( context.query.header === "ecma" ) {
			headers[ "content-type" ] = "application/ecmascript";
		} else if ( "header" in context.query ) {
			headers[ "content-type" ] = "text/javascript";
		} else {
			headers[ "content-type" ] = "text/html";
		}
		if ( context.query.cors ) {
			headers[ "access-control-allow-origin" ] = "*";
		}
		if ( context.query.callback ) {
			return {
				status: 200,
				headers,
				body: `${ cleanCallback( context.query.callback ) }( ${
					JSON.stringify( { headers: context.headers } )
				} )`
			};
		} else {
			return {
				status: 200,
				headers,
				body: "QUnit.assert.ok( true, \"mock executed\" );"
			};
		}
	},
	testbar: async() => {
		return {
			status: 200,
			headers: {},
			body: "this.testBar = 'bar'; jQuery('#ap').html('bar'); " +
				"QUnit.assert.ok( true, 'mock executed');"
		};
	},
	json: async( context ) => {
		let headers = {};
		if ( context.query.header ) {
			headers[ "content-type" ] = "application/json";
		}
		if ( context.query.cors ) {
			headers[ "access-control-allow-origin" ] = "*";
		}
		if ( context.query.array ) {
			return {
				status: 200,
				headers,
				body: JSON.stringify( [ { name: "John", age: 21 },
					{ name: "Peter", age: 25 } ] )
			};
		} else {
			return {
				status: 200,
				headers,
				body: JSON.stringify( { data: { lang: "en", length: 25 } } )
			};
		}
	},
	jsonp: async( context, originalReq ) => {
		let callback;
		if ( Object.prototype.toString.call( context.query.callback ) === "[object Array]" ) {
			callback = context.query.callback[ context.query.callback.length - 1 ];
		} else if ( context.query.callback ) {
			callback = context.query.callback;
		} else if ( context.method === "GET" ) {
			const m = context.url.match( /^.+\/([^\/?]+)\?.+$/ );
			callback = m ? m[ 1 ] : "";
		} else {
			const body = await getBody( originalReq ?? context );
			callback = body.trim().replace( "callback=", "" );
		}
		const json = context.query.array ?
			JSON.stringify( [ { name: "John", age: 21 },
				{ name: "Peter", age: 25 } ] ) :
			JSON.stringify( { data: { lang: "en", length: 25 } } );
		return {
			status: 200,
			headers: { "content-type": "text/javascript" },
			body: `${ cleanCallback( callback ) }( ${ json } )`
		};
	},
	xmlOverJsonp: async( context ) => {
		const callback = context.query.callback;
		const body = readFileSync( `${ getDirname( context ) }/data/with_fries.xml` )
			.toString();
		return {
			status: 200,
			headers: {},
			body: `${ cleanCallback( callback ) }( ${ JSON.stringify( body ) } )\n`
		};
	},
	formData: async( context, originalReq ) => {
		if ( !originalReq ) {
			return { status: 404, headers: {}, body: "Not Found" };
		}
		const prefix = "multipart/form-data; boundary=--";
		const contentTypeValue = context.headers[ "content-type" ];
		if ( !contentTypeValue || contentTypeValue.indexOf( prefix ) !== 0 ) {
			return {
				status: 200,
				headers: {},
				body: `Incorrect Content-Type: ${ contentTypeValue }\nExpected prefix: ${ prefix }`
			};
		}
		const result = await getMultiPartContent( originalReq );
		const fields = result.fields || {};
		return {
			status: 200,
			headers: {},
			body: `key1 -> ${ fields.key1 }, key2 -> ${ fields.key2 }`
		};
	},
	error: async( context ) => {
		if ( context.query.json ) {
			return {
				status: 400,
				headers: { "content-type": "application/json" },
				body: "{ \"code\": 40, \"message\": \"Bad Request\" }"
			};
		} else {
			return { status: 400, headers: {}, body: "plain text message" };
		}
	},
	headers: async( context ) => {
		const headers = {
			"Sample-Header": "Hello World",
			"Empty-Header": "",
			"Sample-Header2": "Hello World 2",
			"List-Header": "Item 1",
			"list-header": "Item 2",
			"constructor": "prototype collision (constructor)"
		};
		let body = "";
		const keys = context.query.keys.split( "|" );
		for ( let i = 0; i < keys.length; i++ ) {
			const key = keys[ i ];
			if ( key.toLowerCase() in context.headers ) {
				body += `${ key }: ${ context.headers[ key.toLowerCase() ] }\n`;
			}
		}
		return { status: 200, headers, body };
	},
	echoData: async( context, originalReq ) => {
		const body = await getBody( originalReq ?? context );
		return { status: 200, headers: {}, body };
	},
	echoQuery: async( context ) => {
		return {
			status: 200,
			headers: {},
			body: context.parsed.search ? context.parsed.search.slice( 1 ) : ""
		};
	},
	echoMethod: async( context ) => {
		return { status: 200, headers: {}, body: context.method };
	},
	echoHtml: async( context, originalReq ) => {
		const body = await getBody( originalReq ?? context );
		const responseBody = `<div id='method'>${ context.method }</div>` +
			`<div id='query'>${
				context.parsed.search ? context.parsed.search.slice( 1 ) : ""
			}</div>` +
			`<div id='data'>${ body }</div>`;
		return {
			status: 200,
			headers: { "content-type": "text/html" },
			body: responseBody
		};
	},
	etag: async( context ) => {
		const hash = Number( context.query.ts ).toString( 36 );
		const etag = `W/"${ hash }"`;
		if ( context.headers[ "if-none-match" ] === etag ) {
			return { status: 304, headers: {}, body: "" };
		}
		return { status: 200, headers: { "etag": etag }, body: "" };
	},
	ims: async( context ) => {
		const ts = context.query.ts;
		if ( context.headers[ "if-modified-since" ] === ts ) {
			return { status: 304, headers: {}, body: "" };
		}
		return { status: 200, headers: { "last-modified": ts }, body: "" };
	},
	status: async( context ) => {
		return { status: Number( context.query.code ), headers: {}, body: "" };
	},
	testHTML: async( context ) => {
		const body = readFileSync( `${ getDirname( context ) }/data/test.include.html` )
			.toString().replace( /{{baseURL}}/g, context.query.baseURL );
		return {
			status: 200,
			headers: { "content-type": "text/html" },
			body
		};
	},
	cspFrame: async( context ) => {
		const body = readFileSync( `${ getDirname( context ) }/data/csp.include.html` )
			.toString();
		return {
			status: 200,
			headers: {
				"content-type": "text/html",
				"content-security-policy": "default-src 'self'; " +
					"require-trusted-types-for 'script'; " +
					"report-uri /test/data/mock.php?action=cspLog"
			},
			body
		};
	},
	cspNonce: async( context ) => {
		const testParam = context.query.test ?
			`-${ context.query.test.replace( /[^a-z0-9]/gi, "" ) }` :
			"";
		const body = readFileSync(
			`${ getDirname( context ) }/data/csp-nonce${ testParam }.html` ).toString();
		return {
			status: 200,
			headers: {
				"content-type": "text/html",
				"content-security-policy": "script-src 'nonce-jquery+hardcoded+nonce'; " +
					"report-uri /test/data/mock.php?action=cspLog"
			},
			body
		};
	},
	cspAjaxScript: async( context ) => {
		const body = readFileSync( `${ getDirname( context ) }/data/csp-ajax-script.html` )
			.toString();
		return {
			status: 200,
			headers: {
				"content-type": "text/html",
				"content-security-policy": "script-src 'self'; " +
					"report-uri /test/data/mock.php?action=cspLog"
			},
			body
		};
	},
	cspLog: async() => {
		cspLog = "error";
		return { status: 200, headers: {}, body: "" };
	},
	cspClean: async() => {
		cspLog = "";
		return { status: 200, headers: {}, body: "" };
	},
	trustedHtml: async( context ) => {
		const body = readFileSync( `${ getDirname( context ) }/data/trusted-html.html` )
			.toString();
		return {
			status: 200,
			headers: {
				"content-type": "text/html",
				"content-security-policy": "require-trusted-types-for 'script'; " +
					"report-uri /test/data/mock.php?action=cspLog"
			},
			body
		};
	},
	trustedTypesAttributes: async( context ) => {
		const body = readFileSync( `${ getDirname( context ) }/data/trusted-types-attributes.html` )
			.toString();
		return {
			status: 200,
			headers: {
				"content-type": "text/html",
				"content-security-policy": "require-trusted-types-for 'script'; " +
					"report-uri /test/data/mock.php?action=cspLog"
			},
			body
		};
	},
	errorWithScript: async( context ) => {
		let headers = {};
		if ( context.query.withScriptContentType ) {
			headers[ "content-type" ] = "application/javascript";
		} else {
			headers[ "content-type" ] = "text/html; charset=UTF-8";
		}
		if ( context.query.callback ) {
			return {
				status: 404,
				headers,
				body: `${
					cleanCallback( context.query.callback )
				}( {"status": 404, "msg": "Not Found"} )`
			};
		} else {
			return {
				status: 404,
				headers,
				body: "QUnit.assert.ok( false, \"Mock return erroneously executed\" );"
			};
		}
	}
};

const handlers = {
	"test/data/mock.php": async( context, originalReq ) => {
		if ( !mocks[ context.query.action ] ) {
			console.log( "Invalid action query:", context.method, context.url );
			return { status: 400, headers: {}, body: "Invalid action query.\n" };
		}
		return await mocks[ context.query.action ]( context, originalReq );
	},
	"test/data/support/csp.log": async() => {
		return { status: 200, headers: {}, body: cspLog };
	},
	"test/data/404.txt": async() => {
		return { status: 404, headers: {}, body: "" };
	}
};

export async function coreMockserverHandler( { context, console, originalReq } ) {
	if ( console ) {
		globalThis.console = console;
	}

	const parsed = context.parsed;
	let path = parsed.pathname;
	context.query = parsed.query;

	const subOriginalReq = originalReq && Object.assign( Object.create( originalReq ), {
		query: context.query,
		parsed: context.parsed
	} );

	if ( /^\/?test\/data\/mock.php\/?/.test( path ) ) {

		// Support REST-like Apache PathInfo
		path = "test/data/mock.php";
	}
	if ( !handlers[ path ] ) {
		return null;
	}

	// console.log( "Mock handling", req.method, parsed.href );
	return await handlers[ path ]( context, subOriginalReq );
}
