<?php

/**
 * Keep in sync with /test/middleware-mockserver.js
 */
function cleanCallback( $callback ) {
	return preg_replace( '/[^a-z0-9_]/i', '', $callback );
}

class MockServer {
	protected function contentType( $req ) {
		$type = $req->query['contentType'];
		header("Content-type: $type");
		echo $req->query['response'];
	}

	protected function wait( $req ) {
		$wait = (int) $req->query['wait'];
		sleep( $wait );
		if ( isset( $req->query['script'] ) ) {
			header( 'Content-type: text/javascript' );
		} else {
			header( 'Content-type: text/html' );
			echo 'ERROR <script>QUnit.assert.ok( true, "mock executed" );</script>';
		}
	}

	protected function name( $req ) {
		if ( $req->query['name'] === 'foo' ) {
			echo 'bar';
		} elseif ( $_POST['name'] === 'peter' ) {
			echo 'pan';
		} else {
			echo 'ERROR';
		}
	}

	protected function xml( $req ) {
		header( 'Content-type: text/xml' );
		if ( $req->query['cal'] !== '5-2' && $_POST['cal'] !== '5-2' ) {
			echo '<error>ERROR</error>';
			return;
		}
		echo "<math><calculation>5-2</calculation><result>3</result></math>\n";
	}

	protected function atom( $req ) {
		header( 'Content-type: atom+xml' );
		echo '<root><element /></root>';
	}

	protected function script( $req ) {
		if ( isset( $req->query['header'] ) ) {
			if ( $req->query['header'] === 'ecma' ) {
				header( 'Content-type: application/ecmascript' );
			} else {
				header( 'Content-type: text/javascript' );
			}
		} else {
			header( 'Content-type: text/html' );
		}

		if ( !empty( $req->query['cors'] ) ) {
			header( "Access-Control-Allow-Origin: *" );
		}

		if ( !empty( $req->query['callback'] ) ) {
			$headers = array_combine(
				array_map( 'strtolower', array_keys( $req->headers ) ),
				array_values( $req->headers )
			);

			echo cleanCallback( $req->query['callback'] ) .
				"(" . json_encode( [ 'headers' => $headers ] ) . ")";
		} else {
			echo 'QUnit.assert.ok( true, "mock executed" );';
		}
	}

	// Used to be in test.js, but was renamed to testbar.php
	// https://github.com/jquery/jquery/commit/d89c278a33#commitcomment-23423165
	protected function testbar( $req ) {
		echo 'this.testBar = "bar";
jQuery("#ap").html("bar");
QUnit.assert.ok( true, "mock executed");';
	}

	protected function json( $req ) {
		if ( isset( $req->query['header'] ) ) {
			header( 'Content-type: application/json' );
		}

		if ( isset( $req->query['cors'] ) ) {
			header( 'Access-Control-Allow-Origin: *' );
		}

		if ( isset( $req->query['array'] ) ) {
			echo '[ {"name": "John", "age": 21}, {"name": "Peter", "age": 25 } ]';
		} else {
			echo '{ "data": {"lang": "en", "length": 25} }';
		}
	}

	protected function jsonp( $req ) {
		if ( isset( $req->query['callback'] ) ) {
			$callback = $req->query['callback'];
		} elseif ( $req->method === 'GET' ) {
			// Try REST-like path
			preg_match( '/\/([^\/?]+)\?.+$/', $req->url, $m );
			$callback = $m[1];
		} else {
			$callback = $_POST['callback'];
		}
		$json = isset( $req->query['array'] ) ?
			'[ { "name": "John", "age": 21 }, { "name": "Peter", "age": 25 } ]' :
			'{ "data": { "lang": "en", "length": 25 } }';
		echo cleanCallback( $callback ) . '(' . $json . ')';
	}

	protected function xmlOverJsonp( $req ) {
		$callback = $_REQUEST['callback'];
		$cleanCallback = cleanCallback( $callback );
		$text = json_encode( file_get_contents( __DIR__ . '/with_fries.xml' ) );
		echo "$cleanCallback($text)\n";
	}

	protected function error( $req ) {
		header( 'HTTP/1.0 400 Bad Request' );
		if ( isset( $req->query['json'] ) ) {
			header( 'Content-Type: application/json' );
			echo '{ "code": 40, "message": "Bad Request" }';
		} else {
			echo 'plain text message';
		}
	}

	protected function headers( $req ) {
		header( 'Sample-Header: Hello World' );
		header( 'Empty-Header: ' );
		header( 'Sample-Header2: Hello World 2' );
		header( 'List-Header: Item 1' );
		header( 'list-header: Item 2', FALSE );
		header( 'constructor: prototype collision (constructor)' );

		foreach ( explode( '|' , $req->query[ 'keys' ] ) as $key ) {
			// Only echo if key exists in the header
			if ( isset( $req->headers[ strtoupper( $key ) ] ) ) {
				echo "$key: " . $req->headers[ strtoupper( $key ) ] . "\n";
			}
		}

	}

	protected function echoData( $req ) {
		echo file_get_contents('php://input');
	}

	protected function echoQuery( $req ) {
		echo $_SERVER['QUERY_STRING'];
	}

	protected function echoMethod( $req ) {
		echo $req->method;
	}

	protected function echoHtml( $req ) {
		header( 'Content-type: text/html' );
		echo '<div id="method">' . $req->method . '</div>';
		echo '<div id="query">' . $_SERVER['QUERY_STRING'] . '</div>';
		echo '<div id="data">' . file_get_contents('php://input') . '</div>';
	}

	protected function etag( $req ) {
		$hash = md5( $req->query['ts'] );
		$etag = 'W/"' . $hash . '"';

		$ifNoneMatch = isset( $req->headers['IF-NONE-MATCH'] ) ? $req->headers['IF-NONE-MATCH'] : '';
		if ($ifNoneMatch === $etag) {
			header('HTTP/1.0 304 Not Modified');
			return;
		}

		header("Etag: $etag");
		echo "ETag: $etag\n";
		if ( $ifNoneMatch ) {
			echo "If-None-Match: $ifNoneMatch\n";
		}
	}

	protected function ims( $req ) {
		$ts = $req->query['ts'];

		$ims = isset( $req->headers['IF-MODIFIED-SINCE'] ) ? $req->headers['IF-MODIFIED-SINCE'] : '';
		if ($ims === $ts) {
			header('HTTP/1.0 304 Not Modified');
			return;
		}

		header("Last-Modified: $ts");
		echo "Last-Modified: $ts\n";
		if ( $ims ) {
			echo "If-Modified-Since: $ims\n";
		}
	}

	protected function status( $req ) {
		header( "HTTP/1.0 {$req->query['code']} {$req->query['text']}" );
	}

	protected function testHTML( $req ) {
		header( 'Content-type: text/html' );
		$html = file_get_contents( __DIR__ . '/test.include.html' );
		$html = str_replace( '{{baseURL}}', $req->query['baseURL'], $html );
		echo $html;
	}

	protected function cspFrame( $req ) {
		header( "Content-Security-Policy: default-src 'self'; require-trusted-types-for 'script'; report-uri ./mock.php?action=cspLog" );
		header( 'Content-type: text/html' );
		echo file_get_contents( __DIR__ . '/csp.include.html' );
	}

	protected function cspNonce( $req ) {
		$test = $req->query['test'] ? '-' . $req->query['test'] : '';
		header( "Content-Security-Policy: script-src 'nonce-jquery+hardcoded+nonce'; report-uri ./mock.php?action=cspLog" );
		header( 'Content-type: text/html' );
		echo file_get_contents( __DIR__ . '/csp-nonce' . $test . '.html' );
	}

	protected function cspAjaxScript( $req ) {
		header( "Content-Security-Policy: script-src 'self'; report-uri ./mock.php?action=cspLog" );
		header( 'Content-type: text/html' );
		echo file_get_contents( __DIR__ . '/csp-ajax-script.html' );
	}

	protected function cspLog( $req ) {
		file_put_contents( $this->cspFile, 'error' );
	}

	protected function cspClean( $req ) {
		file_put_contents( $this->cspFile, '' );
	}

	protected function trustedHtml( $req ) {
		header( "Content-Security-Policy: require-trusted-types-for 'script'; report-uri ./mock.php?action=cspLog" );
		header( 'Content-type: text/html' );
		echo file_get_contents( __DIR__ . '/trusted-html.html' );
	}

	protected function trustedTypesAttributes( $req ) {
		header( "Content-Security-Policy: require-trusted-types-for 'script'; report-uri ./mock.php?action=cspLog" );
		header( 'Content-type: text/html' );
		echo file_get_contents( __DIR__ . '/trusted-types-attributes.html' );
	}

	protected function errorWithScript( $req ) {
		header( 'HTTP/1.0 404 Not Found' );
		if ( isset( $req->query['withScriptContentType'] ) ) {
			header( 'Content-Type: application/javascript' );
		}
		if ( isset( $req->query['callback'] ) ) {
			$callback = $req->query['callback'];
			echo cleanCallback( $callback ) . '( {"status": 404, "msg": "Not Found"} )';
		} else {
			echo 'QUnit.assert.ok( false, "Mock return erroneously executed" );';
		}
	}

	public function __construct() {
		$this->cspFile = __DIR__ . '/support/csp.log';
	}

	public function respond( stdClass $req ) {
		if ( !isset( $req->query['action'] ) || !method_exists( $this, $req->query['action'] ) ) {
			header( "HTTP/1.0 400 Bad Request" );
			echo "Invalid action query.\n";
			return;
		}
		$this->{$req->query['action']}( $req );
	}
}

// Don't include PHP errors in http response
error_reporting( 0 );

// Collect headers
$headers = array();
foreach ( $_SERVER as $name => $value ) {
	if ( substr( $name, 0, 5 ) === 'HTTP_' ) {
		$name = str_replace( '_', '-', substr( $name, 5 ) );
		$headers[$name] = $value;
	} elseif ( $name === 'CONTENT_LENGTH' ) {
		$headers['CONTENT-LENGTH'] = $value;
	} elseif ( $name === 'CONTENT_TYPE' ) {
		$headers['CONTENT-TYPE'] = $value;
	}
}

$mock = new MockServer();
$req = (object) array(
	'query' => $_GET,
	'headers' => $headers,
	'method' => $_SERVER['REQUEST_METHOD'],
	'url' => $_SERVER['REQUEST_URI'],
);
$mock->respond( $req );
