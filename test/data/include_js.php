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
if( $version === "min" ) {
	$output = @file_get_contents("../../dist/jquery.min.js");
}elseif( $version === "dist" ) {
	$output = @file_get_contents("../../dist/jquery.js");
}elseif( ctype_digit( substr( $version, 0, 1 )) || $version === "git" ) {
	$output = "document.write('<script src=\"http://code.jquery.com/jquery-" . $version . ".js\"><'+'/script>');";
}

// the concatenated version of the the src files is both the default and the fallback
// because it does not require you to "make" jquery for it to update
if( $output === "" ) {
	$files = array(
		"intro",
		"core",
		"callbacks",
		"deferred",
		"support",
		"data",
		"queue",
		"attributes",
		"event",
		"sizzle/sizzle",
		"sizzle-jquery",
		"traversing",
		"manipulation",
		"css",
		"ajax",
		"ajax/jsonp",
		"ajax/script",
		"ajax/xhr",
		"effects",
		"offset",
		"dimensions",
		"exports",
		"outro"
	);

	foreach ( $files as $file ) {
		$output .= file_get_contents( "../../src/" . $file . ".js" );
	}

	$output = str_replace( "(function( jQuery ) {", "", $output );
	$output = str_replace( "})( jQuery );", "", $output );
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
		"sizzle/sizzle",
		"sizzle-jquery",
		"traversing",
		"manipulation",
		"css",
		"ajax",
		"ajax/jsonp",
		"ajax/script",
		"ajax/xhr",
		"effects",
		"offset",
		"dimensions",
		"exports"
	],
	len = files.length,
	i = 0;

for ( ; i < len; i++ ) {
	document.write("<script src=\"" + baseURL + "src/" + files[ i ] + ".js\"><"+"/script>");
}