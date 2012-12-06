<?php
require_once( '../../_fix_magic_quotes.php' );

foreach( $_GET as $key => $value ) {
	header( "$key: $value" );
}
