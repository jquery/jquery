# Contributing to jQuery

1. [Getting Involved](#getting-involved)
2. [Discussion](#discussion)
3. [How To Report Bugs](#how-to-report-bugs)
4. [Core Style Guide](#jquery-core-style-guide)
5. [Tips For Bug Patching](#tips-for-jquery-bug-patching)



## Getting Involved

There are a number of ways to get involved with the development of jQuery core. Even if you've never contributed code to an Open Source project before, we're always looking for help identifying bugs, writing and reducing test cases and documentation.

This is the best way to contribute to jQuery core. Please read through the full guide detailing [How to Report Bugs](#How-to-Report-Bugs).

## Discussion

### Forum and IRC

The jQuery core development team frequently tracks posts on the [jQuery Development Forum](http://forum.jquery.com/developing-jquery-core). If you have longer posts or questions please feel free to post them there. If you think you've found a bug please [file it in the bug tracker](#How-to-Report-Bugs).

Additionally most of the jQuery core development team can be found in the [#jquery-dev](http://webchat.freenode.net/?channels=jquery-dev) IRC channel on irc.freenode.net.

### Weekly Status Meetings

Every week (unless otherwise noted) the jQuery core dev team has a meeting to discuss the progress of current work and to bring forward possible new blocker bugs for discussion.

The meeting is held in the [#jquery-meeting](http://webchat.freenode.net/?channels=jquery-meeting) IRC channel on irc.freenode.net at [Noon EST](http://www.timeanddate.com/worldclock/fixedtime.html?month=1&day=17&year=2011&hour=12&min=0&sec=0&p1=43) on Mondays.

[Past Meeting Notes](https://docs.google.com/document/d/1MrLFvoxW7GMlH9KK-bwypn77cC98jUnz7sMW1rg_TP4/edit?hl=en)


## How to Report Bugs

### Make sure it is a jQuery bug

Many bugs reported to our bug tracker are actually bugs in user code, not in jQuery code. Keep in mind that just because your code throws an error and the console points to a line number inside of jQuery, this does *not* mean the bug is a jQuery bug; more often than not, these errors result from providing incorrect arguments when calling a jQuery function.

If you are new to jQuery, it is usually a much better idea to ask for help first in the [Using jQuery Forum](http://forum.jquery.com/using-jquery) or the [jQuery IRC channel](http://webchat.freenode.net/?channels=%23jquery). You will get much quicker support, and you will help avoid tying up the jQuery team with invalid bug reports. These same resources can also be useful if you want to confirm that your bug is indeed a bug in jQuery before filing any tickets.


### Disable any browser extensions

Make sure you have reproduced the bug with all browser extensions and add-ons disabled, as these can sometimes cause things to break in interesting and unpredictable ways. Try using incognito, stealth or anonymous browsing modes.


### Try the latest version of jQuery

Bugs in old versions of jQuery may have already been fixed. In order to avoid reporting known issues, make sure you are always testing against the [latest build](http://code.jquery.com/jquery.js).

### Try an older version of jQuery

Sometimes, bugs are introduced in newer versions of jQuery that do not exist in previous versions. When possible, it can be useful to try testing with an older release.

### Reduce, reduce, reduce!

When you are experiencing a problem, the most useful thing you can possibly do is to [reduce your code](http://webkit.org/quality/reduction.html) to the bare minimum required to reproduce the issue. This makes it *much* easier to isolate and fix the offending code. Bugs that are reported without reduced test cases take on average 9001% longer to fix than bugs that are submitted with them, so you really should try to do this if at all possible.

## jQuery Core Style Guide

See: [jQuery Core Style Guide](http://docs.jquery.com/JQuery_Core_Style_Guidelines)

## Tips For Bug Patching


### Environment: localhost w/ PHP, Node & Grunt

Starting in jQuery 1.8, a newly overhauled development workflow has been introduced. In this new system, we rely on node & gruntjs to automate the building and validation of source code—while you write code.

The Ajax tests still depend on PHP running locally*, so make sure you have the following installed:

* Some kind of localhost server program that supports PHP (any will do)
* Node.js
* NPM (comes with the latest version of Node.js)
* Grunt (install with: `npm install grunt -g`


Maintaining a list of platform specific instructions is outside of the scope of this document and there is plenty of existing documentation for the above technologies.

* The PHP dependency will soon be shed in favor of an all-node solution.


### Build a Local Copy of jQuery

Create a fork of the jQuery repo on github at http://github.com/jquery/jquery

Change directory to your web root directory, whatever that might be:

```bash
$ cd /path/to/your/www/root/
```

Clone your jQuery fork to work locally

```bash
$ git clone git@github.com:username/jquery.git
```

Change directory to the newly created dir jquery/

```bash
$ cd jquery
```

Add the jQuery master as a remote. I label mine "upstream"

```bash
$ git remote add upstream git://github.com/jquery/jquery.git
```

Get in the habit of pulling in the "upstream" master to stay up to date as jQuery receives new commits

```bash
$ git pull upstream master
```

Run the Grunt tools:

```bash
$ grunt && grunt watch
```

Now open the jQuery test suite in a browser at http://localhost/test. If there is a port, be sure to include it.

Success! You just built and tested jQuery!


### Fix a bug from a ticket filed at bugs.jquery.com:

**NEVER write your patches to the master branch** - it gets messy (I say this from experience!)

**ALWAYS USE A "TOPIC" BRANCH!** Like so (#### = the ticket #)...

Make sure you start with your up-to-date master:

```bash
$ git checkout master
```

Create and checkout a new branch that includes the ticket #

```bash
$ git checkout -b bug_####

# ( Explanation: this useful command will:
# "checkout" a "-b" (branch) by the name of "bug_####"
# or create it if it doesn't exist )
```

Now you're on branch: bug_####

Determine the module/file you'll be working in...

Open up the corresponding /test/unit/?????.js and add the initial failing unit tests. This may seem awkward at first, but in the long run it will make sense. To truly and efficiently patch a bug, you need to be working against that bug.

Next, open the module files and make your changes

Run http://localhost/test --> **ALL TESTS MUST PASS**

Once you're satisfied with your patch...

Stage the files to be tracked:

```bash
$ git add filename
# (you can use "git status" to list the files you've changed)
```


( I recommend NEVER, EVER using "git add . " )

Once you've staged all of your changed files, go ahead and commit them

```bash
$ git commit -m "Brief description of fix. Fixes #0000"
```

For a multiple line commit message, leave off the `-m "description"`.

You will then be led into vi (or the text editor that you have set up) to complete your commit message.

Then, push your branch with the bug fix commits to your github fork

```bash
$ git push origin -u bug_####
```

Before you tackle your next bug patch, return to the master:

```bash
$ git checkout master
```



### Test Suite Tips...

During the process of writing your patch, you will run the test suite MANY times. You can speed up the process by narrowing the running test suite down to the module you are testing by either double clicking the title of the test or appending it to the url. The following examples assume you're working on a local repo, hosted on your localhost server.

Example:

http://localhost/test/?filter=css

This will only run the "css" module tests. This will significantly speed up your development and debugging.

**ALWAYS RUN THE FULL SUITE BEFORE COMMITTING AND PUSHING A PATCH!**


### jQuery supports the following browsers:

* Chrome Current-1
* Safari Current-1
* Firefox Current-1
* IE 6+
* Opera Current-1
