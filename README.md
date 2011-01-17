[jQuery](http://jquery.com/) - New Wave Javascript
==================================================

What you need to build your own jQuery
--------------------------------------

In order to build jQuery, you need to have GNU make 3.8 or later, Node.js 0.2 or later, and git 1.7 or later.
(Earlier versions of GNU make and git might work OK, but are not tested.)

Windows users have two options:

1. Install [msysgit](https://code.google.com/p/msysgit/) and a [binary version of Node.js](http://node-js.prcn.co.cc/).
2. Install [Cygwin](http://cygwin.com/) (remember to also install the git package) and follow the
   [Node.js build instructions](https://github.com/ry/node/wiki/Building-node.js-on-Cygwin-%28Windows%29).

Mac OS users should install XCode (comes on your Mac OS install DVD, or downloadable from
[http://developer.apple.com/technologies/xcode.html](Apple's XCode site)) and
[http://mxcl.github.com/homebrew/](Homebrew). Once Homebrew is installed, run `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install make, git, and node, or build from source
if you swing that way. Easy-peasy.


How to build your own jQuery
----------------------------

First, clone a copy of the main jQuery git repo by running `git clone git@github.com:jquery/jquery.git`.

Then, to get a complete, minified, jslinted version of jQuery, simply `cd` to the `jquery` directory and type
`make`. If you don't have Node installed and/or want to make a basic, uncompressed, unlinted version of jQuery, use
`make jquery` instead of `make`.

The built version of jQuery will be put in the `dist/` subdirectory.

To remove all built files, run `make clean`.


Building to a different directory
---------------------------------

If you want to build jQuery to a directory that is different from the default location, you can specify the PREFIX
directory: `make PREFIX=/home/jquery/test/ [command]`

With this example, the output files would end up in `/home/jquery/test/dist/`.


Questions?
----------

If you have any questions, please feel free to ask on the
[Developing jQuery Core forum](http://forum.jquery.com/developing-jquery-core) or in #jquery on irc.freenode.net.
