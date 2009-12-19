<?php
error_reporting(0);
$id = isset ( $_REQUEST['id'] ) ? $_REQUEST['id'] : null;
$wait = isset( $_REQUEST['wait'] ) ? $_REQUEST['wait'] : null;

if ( $wait ) sleep( $wait );

if ( $id ) {
	?>
	div#<?= $id ?> { color: red; }
	<?php
}
?>