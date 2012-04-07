/*
<?php
// if php is available, close the comment so PHP can echo the appropriate JS
echo "*" . "/";

// initialize vars
$output = "";
$version = "";

// extract vars from referrer to determine version
if(isset($_SERVER['HTTP_REFERER'])){
	$referrer = $_SERVER['HTTP_REFERER'];
	$referrer_query_string = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY );
	parse_str($referrer_query_string, $referrer_params);

	if(isset($referrer_params['jquery'])){
		$version = $referrer_params['jquery'];
	}
}

// load up built versions of jquery
if( $version === "compiled" ) {
	$output = @file_get_contents("../closure-compiler/build/unittests_compiled.js");
}

// the concatenated version of the the src files is both the default and the fallback
// because it does not require you to "make" jquery for it to update
if( $output === "" ) {
	$output = @file_get_contents("testrunner.js");
	
	$files = array(
		"core",
		"callbacks",
		"deferred",
		"support",
		"data",
		"queue",
		"attributes",
		"event",
		//"../src/sizzle/test/unit/selector",
		"selector",
		"traversing",
		"manipulation",
		"css",
		"ajax",
		"effects",
		"offset",
		"dimensions",
		"exports"
	);

	foreach ( $files as $file ) {
		$file_path = "../unit/";		
		if ( strpos( $file, "../") === 0 ) {
			$file_path = "";
		}
		$output .= file_get_contents( $file_path . $file . ".js" );
	}
}

echo $output;
die();
?>
*/

hasPHP = false;

// javascript fallback using src files in case this is not run on a PHP server!
// please note that this fallback is for convenience only, and is not fully supported
// i.e. don't expect all of the tests to work properly
var baseURL = document.location.href.replace( /\/test\/.+/, "/"),
	files = [
		"core",
		"callbacks",
		"deferred",
		"support",
		"data",
		"queue",
		"attributes",
		"event",
		"../src/sizzle/test/unit/selector",
		"selector",
		"traversing",
		"manipulation",
		"css",
		"ajax",
		"effects",
		"offset",
		"dimensions",
		"exports"
	],
	len = files.length,
	i = 0;

document.write("<script src=\"data/testrunner.js\"><"+"/script>");

for ( ; i < len; i++ ) {
	var file_path = "unit/";
		if( file_path.indexOf( "../" ) == 0 ) {
			file_path = "";
		}
	document.write("<script src=\"" + file_path + files[ i ] + ".js\"><"+"/script>");
}
