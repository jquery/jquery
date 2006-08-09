#!/usr/bin/perl

use Data::Dumper;

$Data::Dumper::Pair = ": ";
$Data::Dumper::Sortkeys = 1;
$Data::Dumper::Terse = 1;

open( F, $ARGV[0] || "../jquery-svn.js" );
my $f = join('', <F>);
close( F );

my @c;

while ( $f =~ /\/\*\*\s*(.*?)\s*\*\//gs ) {
  my $c = $1;
  $c =~ s/^\s*\* ?//mg;
  $c .= "!!!";
  my %ret;

  $ret{ 'params' } = [];
  $ret{ 'examples' } = [];

  #while ( $c =~ s/^\@(\S+)\s*<pre>(.*?)<\/pre>\n//ms ) {
    #print "PARAM '$1' '$2'\n";
  #}
  while ( $c =~ s/^\@(\S+) *(.*?)(?=\n\@|!!!)//ms ) {
    my $n = $1;
    my $v = $2;
    $v =~ s/\s*$//g;
    $v =~ s/^\s*//g;
    $v =~ s/&/&amp;/g;
    $v =~ s/(\s\s+)/"&nbsp;" x length($1)/eg;
    $v =~ s/</&lt;/g;
    $v =~ s/>/&gt;/g;
    $v =~ s/\n/<br>/g;
    $v = 1 if ( $v eq '' );

    if ( $n eq 'param' ) {
      my ( $type, $name, @v ) = split( /\s+/, $v );
      $v = { "type" => $type, "name" => $name, "desc" => join(' ', @v) };
      $n = "params";
    } elsif ( $n eq 'example' ) {
      $v = { "code" => $v };
      $n = "examples";
    }

    if ( $n eq 'desc' || $n eq 'before' || $n eq 'after' || $n eq 'result' ) {
      my @e = @{$ret{'examples'}};
      $e[ $#e ]{ $n } = $v;
    } else {

      if ( exists $ret{ $n } ) {
        if ( ref $ret{ $n } eq 'ARRAY' ) {
          push( @{$ret{ $n }}, $v );
        } else {
          $ret{ $n } = [ $ret{ $n }, $v ];
        }
      } else {
        $ret{ $n } = $v;
      }

    }
  }
  
  $c =~ s/\s*!!!$//;
  $c =~ s/\n\n/<br><br>/g;
  $c =~ s/\n/ /g;
  
  $ret{ 'desc' } = $c;

  if ( $c =~ /^(.*?(\.|$))/s ) {
    $ret{ 'short' } = $1;
    #$ret{ 'short' } =~ s/<br>/ /g;
  }

  #print "###\n" . $c . "\n###\n";

  if ( exists $ret{ 'name' } ) {
    push( @c, \%ret );
  }
}

open( F, ">" . ($ARGV[1] || "jquery-docs-json.js") );
print F Dumper( \@c );
close( F );

$Data::Dumper::Indent = 0;

open( F, ">" . ($ARGV[2] || "jquery-docs-jsonp.js") );
print F "docsLoaded(" . Dumper( \@c ) . ")";
close( F );
