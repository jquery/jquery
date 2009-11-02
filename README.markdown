jQuery - New Wave Javascript
http://jquery.com/
================================

What you need to build your own jQuery
---------------------------------------
* Make sure that you have Java installed (if you want to build a minified version of jQuery).
If not, go to this page and download "Java Runtime Environment (JRE) 5.0"  
[http://java.sun.com/javase/downloads/index.jsp](http://java.sun.com/javase/downloads/index.jsp)

* You now have two options for building jQuery, if you have access to common UNIX commands (like `make`, `mkdir`, `rm`, `cat`, and `echo`) then simply type `make` to build all the components.

* The other option is if you have Ant installed (or are on Windows and don't have access to make). You can download Ant from here: [http://ant.apache.org/bindownload.cgi](http://ant.apache.org/bindownload.cgi)
If you do have Ant, everytime (in this README) that I say 'make', do 'ant' instead - it works identically (for all intents and purposes).

How to build your own jQuery
-----------------------------

In the main directory of the distribution (the one that this file is in), type
the following to make all versions of jQuery:

`make`

Here are each of the individual items that are buildable from the Makefile.

`make init`

Pull in all the external dependencies (QUnit, Sizzle) for the project.

`make jquery`

The standard, uncompressed, jQuery code.  
Makes: ./dist/jquery.js

`make min`

A compressed version of jQuery (made the YUI Minifier).  
Makes: ./dist/jquery.min.js

`make selector`

Builds the selector library for jQuery from Sizzle.  
Makes: ./src/selector.js

Finally, you can remove all the built files using the command:
  
`make clean`

Additionally, if you want to install jQuery to a location that is not this
directory, you can specify the PREFIX directory, for example:
  
`make PREFIX=/home/john/test/`

OR

`make PREFIX=~/www/ docs`

If you have any questions, please feel free to ask them on the jQuery
mailing list, which can be found here:  
[http://docs.jquery.com/Discussion](http://docs.jquery.com/Discussion)
