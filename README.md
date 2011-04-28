[jQuery](http://jquery.com/) - New Wave JavaScript
==================================================

What you need to build your own jQuery
--------------------------------------

In order to build jQuery, you need to have GNU make 3.8 or later, Node.js 0.2 or later, and git 1.7 or later.
(Earlier versions might work OK, but are not tested.)

Windows users have two options:

1. Install [msysgit](https://code.google.com/p/msysgit/) (Full installer for official Git),
   [GNU make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm), and a
   [binary version of Node.js](http://node-js.prcn.co.cc/). Make sure all three packages are installed to the same
   location (by default, this is C:\Program Files\Git).
2. Install [Cygwin](http://cygwin.com/) (make sure you install the git, make, and which packages), then either follow
   the [Node.js build instructions](https://github.com/ry/node/wiki/Building-node.js-on-Cygwin-%28Windows%29) or install
   the [binary version of Node.js](http://node-js.prcn.co.cc/).

Mac OS users should install Xcode (comes on your Mac OS install DVD, or downloadable from
[Apple's Xcode site](http://developer.apple.com/technologies/xcode.html)) and
[http://mxcl.github.com/homebrew/](Homebrew). Once Homebrew is installed, run `brew install git` to install git,
and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install make, git, and node, or build from source
if you swing that way. Easy-peasy.


How to build your own jQuery
----------------------------

First, clone a copy of the main jQuery git repo by running `git clone git://github.com/jquery/jquery.git`.

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


Troubleshooting
---------------

Sometimes, the various git repositories get into an inconsistent state where builds don't complete properly
(usually this results in the jquery.js or jquery.min.js being 0 bytes). If this happens, run `make clean`, then
run `make` again.

Git for dummies
---------------

As the source code is handled by the version control system Git, it's useful to know some features used.

### Submodules ###

The repository uses submodules, which normally are handled directly by the Makefile, but sometimes you want to
be able to work with them manually.

Following are the steps to manually get the submodules:

1. `git clone https://github.com/jquery/jquery.git`
2. `git submodule init`
3. `git submodule update`

Or:

1. `git clone https://github.com/jquery/jquery.git`
2. `git submodule update --init`

Or:

1. `git clone --recursive https://github.com/jquery/jquery.git`

If you want to work inside a submodule, it is possible, but first you need to checkout a branch:

1. `cd src/sizzle`
2. `git checkout master`

After you've committed your changes to the submodule, you'll update the jquery project to point to the new commit,
but remember to push the submodule changes before pushing the new jquery commit:

1. `cd src/sizzle`
2. `git push origin master`
3. `cd ..`
4. `git add src/sizzle`
5. `git commit`

The makefile has some targets to simplify submodule handling:

#### `make update_submodules` ####

checks out the commit pointed to by jquery, but merges your local changes, if any. This target is executed 
when you are doing a normal `make`.

#### `make pull_submodules` ####

updates the content of the submodules to what is probably the latest upstream code.

#### `make pull` ####

make a `make pull_submodules` and after that a `git pull`. if you have no remote tracking in your master branch, you can
execute this command as `make pull REMOTE=origin BRANCH=master` instead.

### cleaning ###

If you want to purge your working directory back to the status of upstream, following commands can be used (remember everything you've worked on is gone after these):

1. `git reset --hard upstream/master`
2. `git clean -fdx`

### rebasing ###

For feature/topic branches, you should always used the `--rebase` flag to `git pull`, or if you are usually handling many temporary "to be in a github pull request" branches, run following to automate this:

* `git config branch.autosetuprebase local` (see `man git-config` for more information)

### handling merge conflicts ###

If you're getting merge conflicts when merging, instead of editing the conflicted files manually, you can use the feature
`git mergetool`. Even though the default tool `xxdiff` looks awful/old, it's rather useful.

Following are some commands that can be used there:

* `Ctrl + Alt + M` - automerge as much as possible
* `b` - jump to next merge conflict
* `s` - change the order of the conflicted lines
* `u` - undo an merge
* `left mouse button` - mark a block to be the winner
* `middle mouse button` - mark a line to be the winner
* `Ctrl + S` - save
* `Ctrl + Q` - quit

Questions?
----------

If you have any questions, please feel free to ask on the
[Developing jQuery Core forum](http://forum.jquery.com/developing-jquery-core) or in #jquery on irc.freenode.net.
