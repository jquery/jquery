/*
    packer, version 2.0.2 (2005-08-19)
    Copyright 2004-2005, Dean Edwards
    License: http://creativecommons.org/licenses/LGPL/2.1/
*/

function pack(_script, _encoding, _fastDecode, _specialChars) {
    // constants
    var $IGNORE = "$1";

    // validate parameters
    _script += "\n";
    _encoding = Math.min(parseInt(_encoding), 95);

    // apply all parsing routines
    function _pack($script) {
        var i, $parse;
        for (i = 0; ($parse = _parsers[i]); i++) {
            $script = $parse($script);
        }
        return $script;
    };

    // unpacking function - this is the boot strap function
    //  data extracted from this packing routine is passed to
    //  this function when decoded in the target
    var _unpack = function($packed, $ascii, $count, $keywords, $encode, $decode) {
        while ($count--)
            if ($keywords[$count])
                $packed = $packed.replace(new RegExp('\\b' + $encode($count) + '\\b', 'g'), $keywords[$count]);
        return $packed;
    };

    // code-snippet inserted into the unpacker to speed up decoding
    var _decode = function() {
        // does the browser support String.replace where the
        //  replacement value is a function?
        if (!''.replace(/^/, String)) {
            // decode all the values we need
            while ($count--) $decode[$encode($count)] = $keywords[$count] || $encode($count);
            // global replacement function
            $keywords = [function($encoded){return $decode[$encoded]}];
            // generic match
            $encode = function(){return'\\w+'};
            // reset the loop counter -  we are now doing a global replace
            $count = 1;
        }
    };

    // keep a list of parsing functions, they'll be executed all at once
    var _parsers = [];
    function _addParser($parser) {
        _parsers[_parsers.length] = $parser;
    };

    // zero encoding - just removal of white space and comments
    function _basicCompression($script) {
        var $parser = new ParseMaster;
        // make safe
        $parser.escapeChar = "\\";
        // protect strings
        $parser.add(/'[^'\n\r]*'/, $IGNORE);
        $parser.add(/"[^"\n\r]*"/, $IGNORE);
        // remove comments
        $parser.add(/\/\/[^\n\r]*[\n\r]/, " ");
        $parser.add(/\/\*[^*]*\*+([^\/][^*]*\*+)*\//, " ");
        // protect regular expressions
        $parser.add(/\s+(\/[^\/\n\r\*][^\/\n\r]*\/g?i?)/, "$2"); // IGNORE
        $parser.add(/[^\w\x24\/'"*)\?:]\/[^\/\n\r\*][^\/\n\r]*\/g?i?/, $IGNORE);
        // remove: ;;; doSomething();
        if (_specialChars) $parser.add(/;;;[^\n\r]+[\n\r]/);
        // remove redundant semi-colons
        $parser.add(/\(;;\)/, $IGNORE); // protect for (;;) loops
        $parser.add(/;+\s*([};])/, "$2");
        // apply the above
        $script = $parser.exec($script);

        // remove white-space
        $parser.add(/(\b|\x24)\s+(\b|\x24)/, "$2 $3");
        $parser.add(/([+\-])\s+([+\-])/, "$2 $3");
        $parser.add(/\s+/, "");
        // done
        return $parser.exec($script);
    };

    function _encodeSpecialChars($script) {
        var $parser = new ParseMaster;
        // replace: $name -> n, $$name -> na
        $parser.add(/((\x24+)([a-zA-Z$_]+))(\d*)/, function($match, $offset) {
            var $length = $match[$offset + 2].length;
            var $start = $length - Math.max($length - $match[$offset + 3].length, 0);
            return $match[$offset + 1].substr($start, $length) + $match[$offset + 4];
        });
        // replace: _name -> _0, double-underscore (__name) is ignored
        var $regexp = /\b_[A-Za-z\d]\w*/;
        // build the word list
        var $keywords = _analyze($script, _globalize($regexp), _encodePrivate);
        // quick ref
        var $encoded = $keywords.$encoded;
        $parser.add($regexp, function($match, $offset) {
            return $encoded[$match[$offset]];
        });
        return $parser.exec($script);
    };

    function _encodeKeywords($script) {
        // escape high-ascii values already in the script (i.e. in strings)
        if (_encoding > 62) $script = _escape95($script);
        // create the parser
        var $parser = new ParseMaster;
        var $encode = _getEncoder(_encoding);
        // for high-ascii, don't encode single character low-ascii
        var $regexp = (_encoding > 62) ? /\w\w+/ : /\w+/;
        // build the word list
        $keywords = _analyze($script, _globalize($regexp), $encode);
        var $encoded = $keywords.$encoded;
        // encode
        $parser.add($regexp, function($match, $offset) {
        return $encoded[$match[$offset]];
        });
        // if encoded, wrap the script in a decoding function
        return $script && _bootStrap($parser.exec($script), $keywords);
    };

    function _analyze($script, $regexp, $encode) {
        // analyse
        // retreive all words in the script
        var $all = $script.match($regexp);
        var $$sorted = []; // list of words sorted by frequency
        var $$encoded = {}; // dictionary of word->encoding
        var $$protected = {}; // instances of "protected" words
        if ($all) {
            var $unsorted = []; // same list, not sorted
            var $protected = {}; // "protected" words (dictionary of word->"word")
            var $values = {}; // dictionary of charCode->encoding (eg. 256->ff)
            var $count = {}; // word->count
            var i = $all.length, j = 0, $word;
            // count the occurrences - used for sorting later
            do {
                $word = "$" + $all[--i];
                if (!$count[$word]) {
                    $count[$word] = 0;
                    $unsorted[j] = $word;
                    // make a dictionary of all of the protected words in this script
                    //  these are words that might be mistaken for encoding
                    $protected["$" + ($values[j] = $encode(j))] = j++;
                }
                // increment the word counter
                $count[$word]++;
            } while (i);
            // prepare to sort the word list, first we must protect
            //  words that are also used as codes. we assign them a code
            //  equivalent to the word itself.
            // e.g. if "do" falls within our encoding range
            //      then we store keywords["do"] = "do";
            // this avoids problems when decoding
            i = $unsorted.length;
            do {
                $word = $unsorted[--i];
                if ($protected[$word] != null) {
                    $$sorted[$protected[$word]] = $word.slice(1);
                    $$protected[$protected[$word]] = true;
                    $count[$word] = 0;
                }
            } while (i);
            // sort the words by frequency
            $unsorted.sort(function($match1, $match2) {
                return $count[$match2] - $count[$match1];
            });
            j = 0;
            // because there are "protected" words in the list
            //  we must add the sorted words around them
            do {
                if ($$sorted[i] == null) $$sorted[i] = $unsorted[j++].slice(1);
                $$encoded[$$sorted[i]] = $values[i];
            } while (++i < $unsorted.length);
        }
        return {$sorted: $$sorted, $encoded: $$encoded, $protected: $$protected};
    };

    // build the boot function used for loading and decoding
    function _bootStrap($packed, $keywords) {
        var $ENCODE = _safeRegExp("$encode\\($count\\)", "g");

        // $packed: the packed script
        $packed = "'" + _escape($packed) + "'";

        // $ascii: base for encoding
        var $ascii = Math.min($keywords.$sorted.length, _encoding) || 1;

        // $count: number of words contained in the script
        var $count = $keywords.$sorted.length;

        // $keywords: list of words contained in the script
        for (var i in $keywords.$protected) $keywords.$sorted[i] = "";
        // convert from a string to an array
        $keywords = "'" + $keywords.$sorted.join("|") + "'.split('|')";

        // $encode: encoding function (used for decoding the script)
        var $encode = _encoding > 62 ? _encode95 : _getEncoder($ascii);
        $encode = String($encode).replace(/_encoding/g, "$ascii").replace(/arguments\.callee/g, "$encode");
        var $inline = "$count" + ($ascii > 10 ? ".toString($ascii)" : "");

        // $decode: code snippet to speed up decoding
        if (_fastDecode) {
            // create the decoder
            var $decode = _getFunctionBody(_decode);
            if (_encoding > 62) $decode = $decode.replace(/\\\\w/g, "[\\xa1-\\xff]");
            // perform the encoding inline for lower ascii values
            else if ($ascii < 36) $decode = $decode.replace($ENCODE, $inline);
            // special case: when $count==0 there are no keywords. I want to keep
            //  the basic shape of the unpacking funcion so i'll frig the code...
            if (!$count) $decode = $decode.replace(_safeRegExp("($count)\\s*=\\s*1"), "$1=0");
        }

        // boot function
        var $unpack = String(_unpack);
        if (_fastDecode) {
            // insert the decoder
            $unpack = $unpack.replace(/\{/, "{" + $decode + ";");
        }
        $unpack = $unpack.replace(/"/g, "'");
        if (_encoding > 62) { // high-ascii
            // get rid of the word-boundaries for regexp matches
            $unpack = $unpack.replace(/'\\\\b'\s*\+|\+\s*'\\\\b'/g, "");
        }
        if ($ascii > 36 || _encoding > 62 || _fastDecode) {
            // insert the encode function
            $unpack = $unpack.replace(/\{/, "{$encode=" + $encode + ";");
        } else {
            // perform the encoding inline
            $unpack = $unpack.replace($ENCODE, $inline);
        }
        // pack the boot function too
        $unpack = pack($unpack, 0, false, true);

        // arguments
        var $params = [$packed, $ascii, $count, $keywords];
        if (_fastDecode) {
            // insert placeholders for the decoder
            $params = $params.concat(0, "{}");
        }

        // the whole thing
        return "eval(" + $unpack + "(" + $params + "))\n";
    };

    // mmm.. ..which one do i need ??
    function _getEncoder($ascii) {
        return $ascii > 10 ? $ascii > 36 ? $ascii > 62 ? _encode95 : _encode62 : _encode36 : _encode10;
    };

    // zero encoding
    // characters: 0123456789
    var _encode10 = function($charCode) {
        return $charCode;
    };

    // inherent base36 support
    // characters: 0123456789abcdefghijklmnopqrstuvwxyz
    var _encode36 = function($charCode) {
        return $charCode.toString(36);
    };

    // hitch a ride on base36 and add the upper case alpha characters
    // characters: 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
    var _encode62 = function($charCode) {
        return ($charCode < _encoding ? '' : arguments.callee(parseInt($charCode / _encoding))) +
            (($charCode = $charCode % _encoding) > 35 ? String.fromCharCode($charCode + 29) : $charCode.toString(36));
    };

    // use high-ascii values
    var _encode95 = function($charCode) {
        return ($charCode < _encoding ? '' : arguments.callee($charCode / _encoding)) +
            String.fromCharCode($charCode % _encoding + 161);
    };

    // special _chars
    var _encodePrivate = function($charCode) {
        return "_" + $charCode;
    };

    // protect characters used by the parser
    function _escape($script) {
        return $script.replace(/([\\'])/g, "\\$1");
    };

    // protect high-ascii characters already in the script
    function _escape95($script) {
        return $script.replace(/[\xa1-\xff]/g, function($match) {
            return "\\x" + $match.charCodeAt(0).toString(16);
        });
    };

    function _safeRegExp($string, $flags) {
        return new RegExp($string.replace(/\$/g, "\\$"), $flags);
    };

    // extract the body of a function
    function _getFunctionBody($function) {
        with (String($function)) return slice(indexOf("{") + 1, lastIndexOf("}"));
    };

    // set the global flag on a RegExp (you have to create a new one)
    function _globalize($regexp) {
        return new RegExp(String($regexp).slice(1, -1), "g");
    };

    // build the parsing routine
    _addParser(_basicCompression);
    if (_specialChars) _addParser(_encodeSpecialChars);
    if (_encoding) _addParser(_encodeKeywords);

    // go!
    return _pack(_script);
};
