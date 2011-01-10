[jQuery](http://jquery.com/) - New Wave Javascript
================================

What you need to build your own jQuery
---------------------------------------
* Make sure that you have Node.js 0.2 or later installed (if you want to build a minified version of jQuery or run jslint).
If you don't, go to <http://nodejs.org/#download> and download and build the latest stable version of Node.js.

Build Options
--------------

You have two options for building jQuery:

* **`make`**: If you have access to common UNIX commands (like `make`, `mkdir`, `rm`, `cat`, and `echo`) then simply type `make` to build all the components.

* **`rake`**: If you have Ruby Rake installed (on either Windows or UNIX/Linux), you can simply type `rake` to build all the components.

How to build your own jQuery
-----------------------------

*Note: If you are using `rake`, substitute your chosen method in place of `make` in the examples below. They work identically for all intents and purposes. Quick reference is also available for `rake` by typing `rake -T` in the `jquery` directory.*

In the main directory of the distribution (the one that this file is in), type
the following to make all versions of jQuery:

    make

*Here are the individual items that are buildable from the Makefile:*

    make init

Pull in all the external dependencies (QUnit, Sizzle) for the project.

    make jquery

The standard, uncompressed, jQuery code.  
Makes: `./dist/jquery.js`

    make min

A compressed version of jQuery (made using UglifyJS).  
Makes: `./dist/jquery.min.js`

    make lint

Tests a build of jQuery against JSLint, looking for potential errors or bits of confusing code.

    make selector

Builds the selector library for jQuery from Sizzle.  
Makes: `./src/selector.js`

Finally, you can remove all the built files using the command:
  
    make clean

Building to a different directory
----------------------------------

If you want to build jQuery to a directory that is different from the default location, you can...

**Make only:** Specify the PREFIX directory, for example:
  
    make PREFIX=/home/john/test/ [command]
    
With this example, the output files would be contained in `/home/john/test/dist/`

**Rake only:** Define the DIST_DIR directory, for example:

    rake DIST_DIR=/home/john/test/ [command]
    
With this example, the output files would be contained in `/home/john/test/`

*In both examples, `[command]` is optional.*

Questions?
----------

If you have any questions, please feel free to ask them on the [Developing jQuery Core forum](http://forum.jquery.com/developing-jquery-core) or in #jquery on irc.freenode.net.
