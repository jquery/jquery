<?php

foreach( $_REQUEST as $header => $value ) {
	@header("$header: $value");
}
