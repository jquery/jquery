#Pack (July 2005)
#  Based on "Pack.js" by Dean Edwards <http://dean.edwards.name/>
#  Ported to Perl by Rob Seiler, ELR Software Pty Ltd <http://www.elr.com.au>
#  Copyright 2005. License <http://creativecommons.org/licenses/LGPL/2.1/>

package Pack;
use strict;
use Data::Dumper;

use ParseMaster;

# Package wide variable declarations
use vars qw/$VERSION $PM_VERSION
            $_X_encodePrivate $_JSunpack $_JSdecode %baseLookup
            $_X_encode10 $_X_encode36 $_X_encode62 $_X_encode95
            $_JSencode10 $_JSencode36 $_JSencode62 $_JSencode95
            @_X_parsers
            $_X_script $_X_encoding $_X_fastDecode $_X_specialChars
           /;
$VERSION    = '024';
$PM_VERSION = $ParseMaster::VERSION;

# Package wide constants
my $X_IGNORE  = q{$1};
my $X_ENCODE  = q/\x24encode\(\x24count\)/;  # NB: requires g modifier
my $PERL      = 'perl';     # Flag to indicate whether we need to use one of our "internal" Perl encoding functions
my $JSCRIPT   = 'jscript';  # or embed a pre-build JScript encoding function
########################################

##################
sub pack($$$$) { # require 4 arguments
##################
#print Dumper(@_);
  ($_X_script, $_X_encoding, $_X_fastDecode, $_X_specialChars) = @_;
  # validate parameters (sort of!)
  $_X_script  .= "\n";
  $_X_encoding = ($_X_encoding > 95) ? 95 : $_X_encoding;

  @_X_parsers = (); # Reset parsers

####################
  sub _X_pack($) { # require 1 argument
####################
  # apply all parsing routines
    my $X_script = shift;
    for (my $i = 0; $i<scalar(@_X_parsers); $i++) {
      my $X_parse = $_X_parsers[$i];
       $X_script = &$X_parse($X_script);
    }
    return $X_script;
  };

######################
  sub _X_addParser { #
######################
  # keep a list of parsing functions, they'll be executed all at once
    my $X_parser = shift;
    push (@_X_parsers,$X_parser);
  }

#############################
  sub _X_basicCompression { #
#############################
    # zero encoding - just removal of white space and comments
    my $X_script = shift;
    my $parser = ParseMaster->new();
    # make safe
    $parser->escapeChar("\\");
    # protect strings
    $parser->add(q/'[^'\n\r]*'/, $X_IGNORE);
    $parser->add(q/"[^"\n\r]*"/, $X_IGNORE);
    # remove comments
    $parser->add(q/\/\/[^\n\r]*[\n\r]/);
    $parser->add(q/\/\*[^*]*\*+([^\/][^*]*\*+)*\//);
    # protect regular expressions
    $parser->add(q/\s+(\/[^\/\n\r\*][^\/\n\r]*\/g?i?)/, q{$2}); # IGNORE
    $parser->add(q/[^\w\x24\/'"*)\?:]\/[^\/\n\r\*][^\/\n\r]*\/g?i?/, $X_IGNORE);
    # remove: ;;; doSomething();
    $parser->add(q/;;[^\n\r]+[\n\r]/) if ($_X_specialChars);
    # remove redundant semi-colons
    $parser->add(q/;+\s*([};])/, q{$2});
    # remove white-space
    $parser->add(q/(\b|\x24)\s+(\b|\x24)/, q{$2 $3});
    $parser->add(q/([+\-])\s+([+\-])/, q{$2 $3});
    $parser->add(q/\s+/, '');
    # done
    return $parser->exec($X_script);
  }

###############################
  sub _X_encodeSpecialChars { #
###############################
    my $X_script = shift;
    my $parser = ParseMaster->new();
    # replace: $name -> n, $$name -> $$na
    $parser->add(q/((\x24+)([a-zA-Z\x24_]+))(\d*)/,
      sub {
        my $X_offset   = pop;
        my @X_match    = @_;
        my $X_length   = length($X_match[$X_offset+2]);
        my $lengthnext = length($X_match[$X_offset+3]);
        my $X_start = $X_length - ((($X_length - $lengthnext) > 0) ? ($X_length - $lengthnext) : 0);
        my $str = $X_match[$X_offset+1];
        $str = substr($str,$X_start,$X_length) . $X_match[$X_offset+4];
        return "$str";
      });
     # replace: _name -> _0, double-underscore (__name) is ignored
     my $X_regexp = q/\b_[A-Za-z\d]\w*/;
     # build the word list
     my %X_keywords = &_X_analyze($X_script, $X_regexp, $_X_encodePrivate);
#print Dumper(%X_keywords);
     # quick ref
     my $X_encoded = \$X_keywords{X_encoded}; # eg _private1 => '_0',_private2 => '_1';
#print Dumper($X_encoded);
     $parser->add($X_regexp, sub {my $X_offset = pop; my @X_match = @_; return ${$X_encoded}->{$X_match[$X_offset]};});

     return $parser->exec($X_script);
  };

###########################
  sub _X_encodeKeywords { #
###########################
    my $X_script = shift;
    # escape high-ascii values already in the script (i.e. in strings)
    if ($_X_encoding > 62) {$X_script = &_X_escape95($X_script)};
    # create the parser
    my $parser = ParseMaster->new();
    my $X_encode = &_X_getEncoder($_X_encoding,$PERL);
    # for high-ascii, don't encode single character low-ascii
    my $X_regexp = ($_X_encoding > 62) ? q/\w\w+/ : q/\w+/;
    # build the word list
    my %X_keywords = &_X_analyze($X_script, $X_regexp, $X_encode);
#print Dumper(%X_keywords);
    my $X_encoded = \$X_keywords{X_encoded}; # eg alert => 2, function => 10 etc
    # encode
    $parser->add($X_regexp, sub {my $X_offset = pop; my @X_match = @_; return ${$X_encoded}->{$X_match[$X_offset]};});
    # if encoded, wrap the script in a decoding function

    return $X_script && _X_bootStrap(\$parser->exec($X_script), \%X_keywords);
  }

####################
  sub _X_analyze { #
####################
#print Dumper(@_);
    my ($X_script, $X_regexp, $X_encode) = @_;
    # analyse
    # retreive all words in the script
    my @X_all = $X_script =~ m/$X_regexp/g; # Save all captures in a list context
    my %XX_sorted    = ();  # list of words sorted by frequency
    my %XX_encoded   = ();  # dictionary of word->encoding
    my %XX_protected = ();  # instances of "protected" words
    if (@X_all) {
      my @X_unsorted  = (); # same list, not sorted
      my %X_protected = (); # "protected" words (dictionary of word->"word")
      my %X_values    = (); # dictionary of charCode->encoding (eg. 256->ff)
      my %X_count     = (); # word->count
      my $i = scalar(@X_all); my $j = 0; my $X_word = '';
      # count the occurrences - used for sorting later
      do {
        $X_word = '$' . $X_all[--$i];
        if (!exists($X_count{$X_word})) {
          $X_count{$X_word}   = [0,$i]; # Store both the usage count and original array position (ie a secondary sort key)
          $X_unsorted[$j]   = $X_word;
          # make a dictionary of all of the protected words in this script
          #   these are words that might be mistaken for encoding
          $X_values{$j}     = &$X_encode($j);
          my $v           = '$'.$X_values{$j};
          $X_protected{$v}  = $j++;
        }
        # increment the word counter
        $X_count{$X_word}[0]++;
      } while ($i);
#print Dumper (%X_values);
#print Dumper (@X_unsorted);
#print Dumper (%X_protected);
      # prepare to sort the word list, first we must protect
      #  words that are also used as codes. we assign them a code
      #  equivalent to the word itself.
      # e.g. if "do" falls within our encoding range
      #       then we store keywords["do"] = "do";
      # this avoids problems when decoding
       $i = scalar(@X_unsorted);
      do {
        $X_word = $X_unsorted[--$i];
        if (exists($X_protected{$X_word})) {
          $XX_sorted{$X_protected{$X_word}} = substr($X_word,1);
          $XX_protected{$X_protected{$X_word}} = 1; # true
          $X_count{$X_word}[0] = 0;
        }
      } while ($i);
#print Dumper (%XX_protected);
#print Dumper (%XX_sorted);
#print Dumper (%X_count);
      # sort the words by frequency
      # Sort with count a primary key and original array order as secondary key - which is apparently the default in javascript!
      @X_unsorted = sort ({($X_count{$b}[0] - $X_count{$a}[0]) or ($X_count{$b}[1] <=> $X_count{$a}[1])} @X_unsorted);
#print Dumper (@X_unsorted) . "\n";

      $j = 0;
      # because there are "protected" words in the list
      # we must add the sorted words around them
      do {
        if (!exists($XX_sorted{$i})) {$XX_sorted{$i} = substr($X_unsorted[$j++],1)}
        $XX_encoded{$XX_sorted{$i}} = $X_values{$i};
      } while (++$i < scalar(@X_unsorted));
    }
#print Dumper(X_sorted => \%XX_sorted, X_encoded => \%XX_encoded, X_protected => \%XX_protected);
    return (X_sorted => \%XX_sorted, X_encoded => \%XX_encoded, X_protected => \%XX_protected);
  }

######################
  sub _X_bootStrap { #
######################
    # build the boot function used for loading and decoding
    my ($X_packed, $X_keywords) = @_; # Reference arguments!
#print Dumper ($X_keywords) . "\n";

    # $packed: the packed script - dereference and escape
    $X_packed = "'" . &_X_escape($$X_packed) ."'";

    my %sorted    = %{$$X_keywords{X_sorted}};    # Dereference to local variables
    my %protected = %{$$X_keywords{X_protected}}; # for simplicity

    my @sorted    = ();
    foreach my $key (keys %sorted) {$sorted[$key] = $sorted{$key}}; # Convert hash to a standard list

    # ascii: base for encoding
    my $X_ascii = ((scalar(@sorted) > $_X_encoding) ? $_X_encoding : scalar(@sorted)) || 1;

    # count: number of (unique {RS}) words contained in the script
    my $X_count = scalar(@sorted); # Use $X_count for assigning $X_ascii

    # keywords: list of words contained in the script
    foreach my $i (keys %protected) {$sorted[$i] = ''}; # Blank out protected words
#print Dumper(@sorted) . "\n";

    # convert from a string to an array - prepare keywords as a JScript string->array {RS}
    $X_keywords = "'" . join('|',@sorted) . "'.split('|')";

    # encode: encoding function (used for decoding the script)
    my $X_encode = $_X_encoding > 62 ? $_JSencode95 : &_X_getEncoder($X_ascii,$JSCRIPT); # This is a JScript function (as a string)
       $X_encode =~ s/_encoding/\x24ascii/g; $X_encode =~ s/arguments\.callee/\x24encode/g;
    my $X_inline = '$count' . ($X_ascii > 10 ? '.toString($ascii)' : '');

    # decode: code snippet to speed up decoding
    my $X_decode = '';
    if ($_X_fastDecode) {
      # create the decoder
      $X_decode = &_X_getFunctionBody($_JSdecode); # ie from the Javascript literal function
      if ($_X_encoding > 62) {$X_decode =~ s/\\\\w/[\\xa1-\\xff]/g}
      # perform the encoding inline for lower ascii values
      elsif ($X_ascii < 36) {$X_decode =~ s/$X_ENCODE/$X_inline/g}
      # special case: when $X_count==0 there ar no keywords. i want to keep
      # the basic shape of the unpacking funcion so i'll frig the code...
      if (!$X_count) {$X_decode =~ s/(\x24count)\s*=\s*1/$1=0/}
    }

    # boot function
    my $X_unpack = $_JSunpack;
    if ($_X_fastDecode) {
      # insert the decoder
      $X_unpack =~ s/\{/\{$X_decode;/;
    }
    $X_unpack =~ s/"/'/g;
    if ($_X_encoding > 62) { # high-ascii
      # get rid of the word-boundaries for regexp matches
      $X_unpack =~ s/'\\\\b'\s*\+|\+\s*'\\\\b'//g; # Not checked! {RS}
    }
    if ($X_ascii > 36 || $_X_encoding > 62 || $_X_fastDecode) {
    # insert the encode function
    $X_unpack =~ s/\{/\{\$encode=$X_encode;/;
    } else {
      # perform the encoding inline
      $X_unpack =~ s/$X_ENCODE/$X_inline/;
    }

    # arguments   {RS} Do this before using &pack because &pack changes the pack parameters (eg $fastDecode) in Perl!!
    my $X_params = "$X_packed,$X_ascii,$X_count,$X_keywords"; # Interpolate to comma separated string
    if ($_X_fastDecode) {
      # insert placeholders for the decoder
      $X_params .= ',0,{}';
    }

    # pack the boot function too
    $X_unpack = &pack($X_unpack,0,0,1);

    # the whole thing
    return "eval(" . $X_unpack . "(" . $X_params . "))\n";
  };

#######################
  sub _X_getEncoder { #
#######################
  # mmm.. ..which one do i need ?? ({RS} Perl or JScript ??)
    my ($X_ascii,$language) = @_;
    my $perl_encoder    = ($X_ascii > 10) ? ($X_ascii > 36) ? ($X_ascii > 62) ? $_X_encode95 : $_X_encode62 : $_X_encode36 : $_X_encode10;
    my $jscript_encoder = ($X_ascii > 10) ? ($X_ascii > 36) ? ($X_ascii > 62) ? $_JSencode95 : $_JSencode62 : $_JSencode36 : $_JSencode10;
    return ($language eq $JSCRIPT) ? $jscript_encoder : $perl_encoder;
  };

#############################
# Perl versions of encoders #
#############################
  # base10 zero encoding - characters: 0123456789
  $_X_encode10 = sub {return &_encodeBase(shift,10)};
  # base36               - characters: 0123456789abcdefghijklmnopqrstuvwxyz
  $_X_encode36 = sub {return &_encodeBase(shift,36)};
  # base62               - characters: 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
  $_X_encode62 = sub {return &_encodeBase(shift,62)};
  # high-ascii values    - characters: ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ
  $_X_encode95 = sub {return &_encodeBase(shift,95)};
  # Lookup character sets for baseN encoding
     $baseLookup{10} = [(0..9)[0..9]];                    # base 10
     $baseLookup{36} = [(0..9,'a'..'z')[0..35]];          # base 36
     $baseLookup{62} = [(0..9,'a'..'z','A'..'Z')[0..61]]; # base 62
     $baseLookup{95} = (); for (my $i=0; $i<95; $i++) {$baseLookup{95}[$i] = chr($i+161)}; # base95 (high ascii)
#print Dumper(%baseLookup);
#####################
  sub _encodeBase { #
#####################
  # Generic base conversion function using defined lookup arrays (perl version only)
    my ($X_charCode, $base) = @_;
    my $X_encoded = '';
    # Do we know this encoding?
    if (exists ($baseLookup{$base})) {
      if ($X_charCode == 0) {$X_encoded = $baseLookup{$base}[0]}
      while($X_charCode > 0) {
        $X_encoded  = $baseLookup{$base}[$X_charCode % $base] . $X_encoded;
        $X_charCode = int($X_charCode / $base);
      }
    }
    else {$X_encoded = "$X_charCode"} # default is to return unchanged (ie as for base 10) if no baselookup is available
    return $X_encoded;
  };

#############################
  $_X_encodePrivate = sub { #
#############################
  # special _chars
    my $X_charCode = shift;
    return '_' . $X_charCode;
  };

############################
  sub _X_escape($script) { #
############################
  # protect characters used by the parser
    my $X_script = shift;
    $X_script =~ s/([\\'])/\\$1/g;
    return $X_script;
  };

#####################
  sub _X_escape95 { #
#####################
  # protect high-ascii characters already in the script
    my $X_script = shift;
    $X_script =~ s/([\xa1-\xff])/sprintf("\\x%1x",ord($1))/eg;
    return $X_script;
  };

############################
  sub _X_getFunctionBody { #
############################
  # extract the body of a function (ie between opening/closing {}) - consistent with Dean Edwards approach
    my $X_function = shift;
    $X_function =~ m/^.*\{(.*)\}*$/sg; # Multiline, global (greedy)
    my $start = index($X_function,'{');
    my $end   = rindex($X_function,'}');
    $X_function = substr($X_function,($start+1),($end-1-$start));
    return $X_function;
  };

######################
  sub _X_globalize { #
######################
  # set the global flag on a RegExp (you have to create a new one) !!! Unused in perl version
    # my $X_regexp = shift;
  };

  # build the parsing routine
  &_X_addParser(\&_X_basicCompression);
  &_X_addParser(\&_X_encodeSpecialChars) if ($_X_specialChars);
  &_X_addParser(\&_X_encodeKeywords)     if ($_X_encoding);

  # go!
  return &_X_pack($_X_script);
}

########################
# Javascript Literals  #
########################

# JScript function "_unpack" - from DeanEdwards pack.js (NB: No ";" after final "}")
($_JSunpack) = <<'END_JSCRIPT_UNPACK';
/* unpacking function - this is the boot strap function   */
/* data extracted from this packing routine is passed to  */
/* this function when decoded in the target               */
function($packed, $ascii, $count, $keywords, $encode, $decode) {
  while ($count--)
    if ($keywords[$count])
     $packed = $packed.replace(new RegExp('\\b' + $encode($count) + '\\b', 'g'), $keywords[$count]);
  /* RS_Debug = $packed; */  /* {RS} !!!!!!!!! */
  return $packed;
}
END_JSCRIPT_UNPACK

# JScript function "_decode" - from DeanEdwards pack.js
($_JSdecode) = <<'END_JSCRIPT_DECODE';
  /* code-snippet inserted into the unpacker to speed up decoding */
  function() {
    /* does the browser support String.replace where the */
    /*  replacement value is a function? */
    if (!''.replace(/^/, String)) {
      /* decode all the values we need */
          while ($count--) $decode[$encode($count)] = $keywords[$count] || $encode($count);
          /* global replacement function */
          $keywords = [function($encoded){return $decode[$encoded]}];
          /* generic match */
          $encode = function(){return'\\w+'};
          /* reset the loop counter -  we are now doing a global replace */
          $count = 1;
      }
  };
END_JSCRIPT_DECODE

# JScript versions of encoders
($_JSencode10) = <<'END_JSCRIPT_ENCODE10';
  /* zero encoding */
  /* characters: 0123456789 */
  function($charCode) {
    return $charCode;
  };
END_JSCRIPT_ENCODE10

($_JSencode36) = <<'END_JSCRIPT_ENCODE36';
  /* inherent base36 support */
  /* characters: 0123456789abcdefghijklmnopqrstuvwxyz */
  function($charCode) {
    return $charCode.toString(36);
  };
END_JSCRIPT_ENCODE36

($_JSencode62) = <<'END_JSCRIPT_ENCODE62';
  /* hitch a ride on base36 and add the upper case alpha characters */
  /* characters: 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ */
  function($charCode) {
    return ($charCode < _encoding ? '' : arguments.callee(parseInt($charCode / _encoding))) +
    (($charCode = $charCode % _encoding) > 35 ? String.fromCharCode($charCode + 29) : $charCode.toString(36));
   };
END_JSCRIPT_ENCODE62

($_JSencode95) = <<'END_JSCRIPT_ENCODE95';
 /* use high-ascii values */
 /* characters: ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ */
 function($charCode) {
   return ($charCode < _encoding ? '' : arguments.callee($charCode / _encoding)) +
     String.fromCharCode($charCode % _encoding + 161);
 };
END_JSCRIPT_ENCODE95

###########
# END     #
###########
1; # Pack #
###########
