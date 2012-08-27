<?php
	$baseURL = "http://ajax.googleapis.com/ajax/libs/";
	$libraries = array(
		"Dojo" => array(
			"versions" => array( "1.1.1", "1.2.0", "1.2.3", "1.3.0", "1.3.1", "1.3.2", "1.4.0", "1.4.1", "1.4.3", "1.5.0" ),
			"url" => "dojo/XYZ/dojo/dojo.xd.js"
		),
		"ExtCore" => array(
			"versions" => array( "3.0.0", "3.1.0" ),
			"url" => "ext-core/XYZ/ext-core.js"
		),
		"jQuery" => array(
			"versions" => array( "1.2.3", "1.2.6", "1.3.0", "1.3.1", "1.3.2", "1.4.0", "1.4.1", "1.4.2", "1.4.3", "1.4.4", "1.5.0" ),
			"url" => "jquery/XYZ/jquery.min.js"
		),
		"jQueryUI" => array(
			"versions" => array( "1.5.2", "1.5.3", "1.6.0", "1.7.0", "1.7.1", "1.7.2", "1.7.3", "1.8.0", "1.8.1", "1.8.2", "1.8.4", "1.8.5", "1.8.6", "1.8.7", "1.8.8", "1.8.9" ),
			"url" => "jqueryui/XYZ/jquery-ui.min.js"
		),
		"MooTools" => array(
			"versions" => array( "1.1.1", "1.1.2", "1.2.1", "1.2.2", "1.2.3", "1.2.4", "1.2.5", "1.3.0" ),
			"url" => "mootools/XYZ/mootools-yui-compressed.js"
		),
		"Prototype" => array(
			"versions" => array( "1.6.0.2", "1.6.0.3", "1.6.1.0", "1.7.0.0" ),
			"url" => "prototype/XYZ/prototype.js"
		),
		"scriptaculous" => array(
			"versions" => array( "1.8.1", "1.8.2", "1.8.3" ),
			"url" => "scriptaculous/XYZ/scriptaculous.js"
		),
		"SWFObject" => array(
			"versions" => array( "2.1", "2.2" ),
			"url" => "swfobject/XYZ/swfobject.js"
		),
		"YUI" => array(
			"versions" => array( "2.6.0", "2.7.0", "2.8.0r4", "2.8.1", "2.8.2", "3.3.0" ),
			"url" =>    "yui/XYZ/build/yui/yui-min.js"
		)
	);

	if( count($_POST) ) {
		$includes = array();
		foreach( $_POST as $name => $ver ){
			if ( empty( $libraries[ $name ] )) {
				echo "unsupported library ". $name;
				exit;
			}
		
			$url = $libraries[ $name ][ "url" ];
			if( $name == "YUI" && $ver[0] == "2" ) {
				$url = str_replace( "/yui", "/yuiloader", $url);
			}
			
			if ( empty( $libraries[ $name ][ "versions" ][ $ver ] )) {
				echo "library ". $name ." not supported in version ". $ver;
				exit;
			}
			
			$include = "<script src='$baseURL".str_replace("XYZ", $ver, $url)."'></script>\n";
			if( $lib == "prototype" ) { // prototype must be included first
				array_unshift( $includes, $include );
			} else {
				array_push( $includes, $include );
			}
		}

		$includes = implode( "\n", $includes );
		$suite = file_get_contents( "index.html" );
		echo str_replace( "<!-- Includes -->", $includes, $suite );
		exit;
	}
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<title>Run jQuery Test Suite Polluted</title>
	<style type="text/css">
		.otherlibs fieldset {
			width: 400px
		}
		.otherlibs label{
			margin: 5px 0px 5px 20px;
		}
	</style>
</head>

<body id="body">
	<h1 id="header">jQuery Test Suite</h1>
	<h2 id="banner" class="fail"></h2>
	<h2 id="userAgent">Choose other libraries to include</h2>

	<form class="otherlibs" action="./polluted.php" method="POST">
		<?php
			foreach( $libraries as $name => $data ) {
				echo "<fieldset><legend>$name</legend>";
				$i = 0;
				foreach( $data[ "versions" ] as $ver ) {
					$i++;
					echo "<label><input type='radio' name='$name' value='$ver' />$ver</label>";
					if( !($i % 4) ) echo "<br />";
				}
				echo "</fieldset>";
			}
		?>
		<input type="submit" value=" Run " class="submit" />
	</form>
</body>
</html>
