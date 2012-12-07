<?php
function fix_magic_quotes( &$arr, $topLevel = true ) {
	$clean = array();
	foreach( $arr as $key => $val ) {
		if ( is_array( $val ) ) {
			$cleanKey = $topLevel ? stripslashes( $key ) : $key;
			$clean[$cleanKey] = fix_magic_quotes( $arr[$key], false );
		} else {
			$cleanKey = stripslashes( $key );
			$clean[$cleanKey] = stripslashes( $val );
		}
	}
	$arr = $clean;
	return $arr;
}

/**
 * If magic_quotes_gpc option is on, run the global arrays
 * through fix_magic_quotes to strip out the stupid slashes.
 * WARNING: This should only be done once! Running a second
 * time could damage the values.
 */
if ( function_exists( 'get_magic_quotes_gpc' ) && get_magic_quotes_gpc() ) {
	fix_magic_quotes( $_COOKIE );
	fix_magic_quotes( $_ENV );
	fix_magic_quotes( $_GET );
	fix_magic_quotes( $_POST );
	fix_magic_quotes( $_REQUEST );
	fix_magic_quotes( $_SERVER );
}
