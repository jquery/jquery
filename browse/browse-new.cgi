#!/usr/bin/perl

use Pack;
use CGI;
use LWP::Simple;
use Digest::MD5 qw(md5_hex);

chdir("/home/jquery/www/src/");

my $cgi = new CGI();
print $cgi->header('text/javascript');
my $c = $cgi->param('c') || 'compressed';
my $v = $cgi->param('v') || 'latest';
my $live = 0;
#$v = "0.10" if ( $v eq 'latest' );
if ( $v eq 'dev' ) {
  $live = 1;
  $c = 'sane';
  $v = 'latest';
} elsif ( $v eq 'debug' ) {
  $c = 'sane';
  $v = 'latest';
}

my @files = $cgi->param('files') ?
	split(',', join(',', $cgi->param('files')) ):
	("jquery","fx","event","ajax");

if ($cgi->param('custom') && $cgi->param('custom') !~ /-/) {
  $c = $cgi->param('custom');
}

my $md5 = $cgi->param('custom') || join('-',dupe(@files),$v,$c);
my $j = "build/$md5\.js";
my $stamp = "/* Built " . localtime() . " */\n";

if ( !-e $j && !$live ) {
	my $f = getf();
	open( F, ">$j" );
	print F $stamp;
	print F $c eq 'compressed' ? &Pack::pack($f, 62, 1, 0) : $f;
	close( F );

	if ( $c eq 'compressed' ) {
	  my $tj = $j;
	  $tj =~ s/$c\.js$/sane\.js/;
	  open( F, ">$tj" );
	  print F $stamp;
	  print F $f;
	  close( F );
	}
}

if ( $cgi->param('files') ) {
	print $cgi->redirect("/src/$v/$md5/");
} else {
	#print $cgi->header('text/javascript');
	if ( $live ) {
		print getf();
	} else {
		my $t = `cat copyright.txt $j`;
		$v = $v eq 'latest' ? 'Current' : "Version $v";
		$t =~ s/\$VERSION/$v/ig;
		$t =~ s/\$MD5/$md5/ig;
		my $url = $cgi->param('v') . "/";
		$url .= $cgi->param('custom') . "/" if ( $cgi->param('custom') );
		$t =~ s/\$URL/$url/ig;
		print $t;
	}
}

sub getf {
	my $f = '';
	foreach ( @files ) {
		$f .= `cat $_/$_\-$v\.js`;
	}
	$f =~ s/\r//g;
	$f;
}

sub dupe {
  my %check;
  $check{$_} = 1 foreach (@_);
  return sort keys %check;
}
