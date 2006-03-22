#ParseMaster (July 25 2005)
#  Based on "ParseMaster.js" by Dean Edwards <http://dean.edwards.name/>
#  Ported to Perl by Rob Seiler, ELR Software Pty Ltd <http://www.elr.com.au>
#  Copyright 2005. License <http://creativecommons.org/licenses/LGPL/2.1/>

package ParseMaster;
use strict;
use Data::Dumper;

# Package wide variable declarations
use vars qw/$VERSION
            @_X_escaped @_X_patterns
           /;

$VERSION    = '017';

# constants
my $X_EXPRESSION  = 0;
my $X_REPLACEMENT = 1;
my $X_LENGTH      = 2;

# re's used to determine nesting levels
my $X_GROUPS      = qr/\(/o;                # NB: Requires g modifier!
my $X_SUB_REPLACE = qr/\$\d/o;
my $X_INDEXED     = qr/^\$\d+$/o;
my $XX_ESCAPE     = qr/\\./o;               # NB: Requires g modifier!
my $XX_DELETED    = qr/\001[^\001]*\001/o;  # NB: Requires g modifier!
my $DIGIT         = qr/[^\D]/o;             # Yep - this is a digit - contains no non-digits

# Constructor
sub new {
  my $class = shift;
  my $self  = {};
  @_X_escaped  = ();  # Re-initialize global for each instance
  @_X_patterns = ();  # Re-initialize global for each instance
  # Instance variables - access by similarly named set/get functions
  $self->{_ignoreCase_} = 0;
  $self->{_escapeChar_} = '';
  bless ($self, $class);
  return $self;
}

sub ignoreCase {
  my ($self, $value) = @_;
  if (defined($value)) {
    $self->{_ignoreCase_} = $value;
  }
  return $self->{_ignoreCase_};
}

sub escapeChar{
  my ($self, $value) = @_;
  if (defined($value)) {
    $self->{_escapeChar_} = $value;
  }
  return $self->{_escapeChar_};
}

#######################
# Public Parsemaster functions

my $X_DELETE = sub(@$) {
  my $X_offset = pop;
  my @X_match = @_;
  return (chr(001) . $X_match[$X_offset] . chr(001));
}; # NB semicolon required for closure!

# create and add a new pattern to the patterns collection
sub add {
  my ($self, $expression, $X_replacement) = @_;
  if (!$X_replacement) {$X_replacement = $X_DELETE};

  # count the number of sub-expressions
  my $temp = &_X_internalEscape($expression);
  my $length  = 1; # Always at least one because each pattern is itself a sub-expression
     $length += $temp =~ s/$X_GROUPS//g; # One way to count the left capturing parentheses in the regexp string

  # does the pattern deal with sub-expressions?
  if ((ref($X_replacement) ne "CODE") && ($X_replacement =~ m/$X_SUB_REPLACE/)) {
    if ($X_replacement =~ m/$X_INDEXED/) { # a simple lookup? (eg "$2")
      # store the index (used for fast retrieval of matched strings)
      $X_replacement = substr($X_replacement,1) - 1;
    }
    else { # a complicated lookup (eg "Hello $2 $1")
      my $i = $length;
      while ($i) { # Had difficulty getting Perl to do Dean's splitting and joining of strings containing $'s
        my $str = '$a[$o+' . ($i-1) . ']'; # eg $a[$o+1]
        $X_replacement =~ s/\$$i/$str/;      # eg $2 $3 -> $a[$o+1] $a[$o+2]
        $i--;
      }
      # build a function to do the lookup - returns interpolated string of array lookups
      $X_replacement = eval('sub {my $o=pop; my @a=@_; return "' . $X_replacement . '"};');
    }
  }
  else {}
  # pass the modified arguments
  &_X_add($expression || q/^$/, $X_replacement, $length);
}

# execute the global replacement
sub exec {
#print Dumper(@_X_patterns);
  my ($self, $X_string) = @_;
  my $escChar    = $self->escapeChar();
  my $ignoreCase = $self->ignoreCase();
  my ($regexp,$captures) = &_getPatterns();  # Concatenated and parenthesized regexp eg '(regex1)|(regex2)|(regex3)' etc
  $X_string = &_X_escape($X_string, $escChar);
  if ($ignoreCase) {$X_string =~ s/$regexp/{&_X_replacement(&_matchVars($captures,\$X_string))}/gie} # Pass $X_String as a
    else           {$X_string =~ s/$regexp/{&_X_replacement(&_matchVars($captures,\$X_string))}/ge}  # reference for speed

  $X_string = &_X_unescape($X_string, $escChar);
  $X_string =~ s/$XX_DELETED//g;
  return $X_string;
}

sub _X_add {
  push (@_X_patterns, [@_]); # Save each argument set as is into an array of arrays
}

# this is the global replace function (it's quite complicated)
sub _X_replacement {
  my (@arguments) = @_;
#print Dumper (@arguments);
  if ($arguments[0] le '') {return ''}
  # Dereference last index (source String) here - faster than in _matchVars (maybe not needed at all?)
  $arguments[$#arguments] = ${$arguments[$#arguments]};
  my $i = 1;
  # loop through the patterns
  for (my $j=0; $j<scalar(@_X_patterns); $j++) { # Loop through global all @_X_patterns
    my @X_pattern = @{$_X_patterns[$j]};
    # do we have a result? NB: "if ($arguments[$i])" as in Dean's Javascript is false for the value 0!!!
    if ((defined $arguments[$i]) && ($arguments[$i] gt '')) {
      my $X_replacement = $X_pattern[$X_REPLACEMENT];
      # switch on type of $replacement
      if (ref($X_replacement) eq "CODE") {     # function
        return &$X_replacement(@arguments,$i);
      }
      elsif ($X_replacement =~ m/$DIGIT/) {    # number (contains no non-digits)
        return $arguments[$X_replacement + $i];
      }
      else { # default
        return $X_replacement;                 # default
      }
    } # skip over references to sub-expressions
    else {$i += $X_pattern[$X_LENGTH]}
  }
}

#######################
# Private functions
#######################

# encode escaped characters
sub _X_escape {
  my ($X_string, $X_escapeChar) = @_;
  if ($X_escapeChar) {
    my $re = '\\'.$X_escapeChar.'(.)';
    $X_string =~ s/$re/{push(@_X_escaped,$1); $X_escapeChar}/ge;
  }
  return $X_string;
}

# decode escaped characters
sub _X_unescape {
  my ($X_string, $X_escapeChar) = @_;
  if ($X_escapeChar) { # We'll only do this if there is an $X_escapeChar!
    my $re = '\\'.$X_escapeChar;
    $X_string =~ s/$re/{$X_escapeChar . (shift(@_X_escaped))}/ge; # Don't use Dean Edwards as below 'or' here - because zero will return ''!
  # $X_string =~ s/$re/{$X_escapeChar . (shift(@_X_escaped) || '')}/ge;
  }
  return $X_string;
}

sub _X_internalEscape {
  my ($string) = shift;
  $string =~ s/$XX_ESCAPE//g;
  return $string;
}

# Builds an array of match variables to (approximately) emulate that available in Javascript String.replace()
sub _matchVars {
  my ($m,$sref) = @_;
  my @args = (1..$m);                # establish the number potential memory variables
  my @mv = map {eval("\$$_")} @args; # matchvarv[1..m] = the memory variables $1 .. $m
  unshift (@mv, $&);                 # matchvar[0]     = the substring that matched
  push    (@mv, length($`));         # matchvar[m+1]   =  offset within the source string where the match occurred (= length of prematch string)
  push    (@mv, $sref);              # matchvar[m+2]   = reference to full source string (dereference in caller if/when needed)
#print Dumper (@mv);
  return @mv;
}

sub _getPatterns {
  my @Patterns = ();
  my $lcp = 0;
  for (my $i=0; $i<scalar(@_X_patterns); $i++) {       # Loop through global all @_patterns
    push (@Patterns, $_X_patterns[$i][$X_EXPRESSION]); # accumulate the expressions
    $lcp += $_X_patterns[$i][$X_LENGTH];               # sum the left capturing parenthesis counts
  }
  my $str = "(" . join(')|(',@Patterns). ")";          # enclose each pattern in () separated by "|"
  return ($str, $lcp);
}

##################
# END            #
##################
1; # ParseMaster #
##################
