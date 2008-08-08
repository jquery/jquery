<?php
	if( count($_POST) ){ // second call
		$includes = array();
		foreach( $_POST as $lib=>$ver ){
			if( !$ver )
				continue;
			$include = "<script type='text/javascript' src='otherlibs/$lib/$ver/$lib.js'></script>\n";
			if( $lib == 'prototype' ) // prototype must be included first
				array_unshift( $includes, $include );
			else
				array_push( $includes, $include );
		}

		$includes = implode( "\n", $includes );
		$suite = file_get_contents('index.html');
		echo str_replace( '<!-- Includes -->', $includes, $suite );
		exit;
	}	
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" dir="ltr" id="html">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>jQuery Test Suite</title>
	<link rel="Stylesheet" media="screen" href="qunit/testsuite.css" />
	<link rel="Stylesheet" media="screen" href="data/otherlibs.css" />
	<style type="text/css">
		form.otherlibs{
			margin: 20px 0 0 30px;
		}
		form.otherlibs label{
			display:block;
			margin: 5px 0 5px 30px;
		}
		form.otherlibs input.submit{
			margin:30px 0 0 0;
		}
	</style>
</head>

<body id="body">
	<h1 id="header">jQuery Test Suite</h1>
	<h2 id="banner" class="fail"></h2>
	<h2 id="userAgent">Choose other libraries to include</h2>
	
	<form class="otherlibs" action="" method="post">
		<?php
			$libs = scandir('otherlibs');
			foreach( $libs as $lib ){
				if( $lib[0] == '.' )
					continue;
				echo "<h3>$lib</h3>";
				$vers = scandir( "otherlibs/$lib");
				foreach( $vers as $ver ){
					if( $ver[0] != '.' )
						echo "<label><input type='checkbox' name='$lib' value='$ver'>$ver</label>";
				}
			}
		?>
		<input type="submit" value="Run" class="submit" />
	</form>
</body>
</html>
