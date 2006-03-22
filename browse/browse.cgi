#!/usr/bin/perl

use Pack;
use CGI;
use LWP::Simple;
use Digest::MD5 qw(md5_hex);

chdir("/home/jquery/www/src/");

my $cgi = new CGI();
my $c = $cgi->param('c') || 'compressed';
my $v = $cgi->param('v');
#$v = "0.10" if ( $v eq 'latest' );
my @files = $cgi->param('files') ?
	split(',', join(',', $cgi->param('files')) ):
	("jquery","minifx","fx","event");

my $md5 = $cgi->param('custom') || join('-',dupe(@files),$v,$c);
my $j = "build/$md5\.js";

if ( !-e $j ) {
	my $f = '';
	foreach ( @files ) {
		$f .= `cat $_/$_\-$v\.js`;
	}
	$f =~ s/\r//g;
	my $o = $c eq 'compressed' ? &Pack::pack($f, 62, 1, 0) : $f;
	open( F, ">$j" );
	print F $o;
	close( F );
}

if ( $cgi->param('files') ) {
	print $cgi->redirect("/src/$v/$md5/");
} else {
	print $cgi->header('text/javascript');
	my $t = `cat copyright.txt $j`;
	$v = $v eq 'latest' ? 'Current' : "Version $v";
	$t =~ s/\$VERSION/$v/ig;
	$t =~ s/\$MD5/$md5/ig;
	my $url = $cgi->param('v') . "/";
	$url .= $cgi->param('custom') . "/" if ( $cgi->param('custom') );
	$t =~ s/\$URL/$url/ig;
	print $t;
}

sub dupe {
  my %check;
  $check{$_} = 1 foreach (@_);
  return sort keys %check;
}
