# [jQuery](https://jquery.com/) — New Wave JavaScript

Meetings are currently held on the [matrix.org platform](https://matrix.to/#/#jquery_meeting:gitter.im).

Meeting minutes can be found at [meetings.jquery.org](https://meetings.jquery.org/category/core/).

The latest version of jQuery is available at [https://jquery.com/download/](https://jquery.com/download/).

## Version support

| Version | Branch     | Status   |
| ------- | ---------- | -------- |
| 4.x     | main       | Beta     |
| 3.x     | 3.x-stable | Active   |
| 2.x     | 2.x-stable | Inactive |
| 1.x     | 1.x-stable | Inactive |

Once 4.0.0 final is released, the 3.x branch will continue to receive updates for a limited time. The 2.x and 1.x branches are no longer supported.

Commercial support for inactive versions is available from [HeroDevs](https://herodevs.com/support/jquery-nes).

Learn more about our [version support](https://jquery.com/support/).

## Contribution Guides

In the spirit of open source software development, jQuery always encourages community code contribution. To help you get started and before you jump into writing code, be sure to read these important contribution guidelines thoroughly:

1. [Getting Involved](https://contribute.jquery.org/)
2. [Core Style Guide](https://contribute.jquery.org/style-guide/js/)
3. [Writing Code for jQuery Projects](https://contribute.jquery.org/code/)

### References to issues/PRs

GitHub issues/PRs are usually referenced via `gh-NUMBER`, where `NUMBER` is the numerical ID of the issue/PR. You can find such an issue/PR under `https://github.com/jquery/jquery/issues/NUMBER`.

jQuery has used a different bug tracker - based on Trac - in the past, available under [bugs.jquery.com](https://bugs.jquery.com/). It is being kept in read only mode so that referring to past discussions is possible. When jQuery source references one of those issues, it uses the pattern `trac-NUMBER`, where `NUMBER` is the numerical ID of the issue. You can find such an issue under `https://bugs.jquery.com/ticket/NUMBER`.

## Environments in which to use jQuery

- [Browser support](https://jquery.com/browser-support/)
- jQuery also supports Node, browser extensions, and other non-browser environments.

## What you need to build your own jQuery

To build jQuery, you need to have the latest Node.js/npm and git 1.7 or later. Earlier versions might work, but are not supported.

For Windows, you have to download and install [git](https://git-scm.com/downloads) and [Node.js](https://nodejs.org/en/download/).

macOS users should install [Homebrew](https://brew.sh/). Once Homebrew is installed, run `brew install git` to install git,
and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install git and Node.js, or build from source
if you swing that way. Easy-peasy.

## How to build your own jQuery

First, [clone the jQuery git repo](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).

Then, enter the jquery directory, install dependencies, and run the build script:

```bash
cd jquery
npm install
npm run build
```

The built version of jQuery will be placed in the `dist/` directory, along with a minified copy and associated map file.

## Build all jQuery release files

To build all variants of jQuery, run the following command:

```bash
npm run build:all
```

This will create all of the variants that jQuery includes in a release, including `jquery.js`, `jquery.slim.js`, `jquery.module.js`, and `jquery.slim.module.js` along their associated minified files and sourcemaps.

`jquery.module.js` and `jquery.slim.module.js` are [ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) that export `jQuery` and `$` as named exports are placed in the `dist-module/` directory rather than the `dist/` directory.

## Building a Custom jQuery

The build script can be used to create a custom version of jQuery that includes only the modules you need.

Any module may be excluded except for `core`. When excluding `selector`, it is not removed but replaced with a small wrapper around native `querySelectorAll` (see below for more information).

### Build Script Help

To see the full list of available options for the build script, run the following:

```bash
npm run build -- --help
```

### Modules

To exclude a module, pass its path relative to the `src` folder (without the `.js` extension) to the `--exclude` option. When using the `--include` option, the default includes are dropped and a build is created with only those modules.

Some example modules that can be excluded or included are:

- **ajax**: All AJAX functionality: `$.ajax()`, `$.get()`, `$.post()`, `$.ajaxSetup()`, `.load()`, transports, and ajax event shorthands such as `.ajaxStart()`.
- **ajax/xhr**: The XMLHTTPRequest AJAX transport only.
- **ajax/script**: The `<script>` AJAX transport only; used to retrieve scripts.
- **ajax/jsonp**: The JSONP AJAX transport only; depends on the ajax/script transport.
- **css**: The `.css()` method. Also removes **all** modules depending on css (including **effects**, **dimensions**, and **offset**).
- **css/showHide**: Non-animated `.show()`, `.hide()` and `.toggle()`; can be excluded if you use classes or explicit `.css()` calls to set the `display` property. Also removes the **effects** module.
- **deprecated**: Methods documented as deprecated but not yet removed.
- **dimensions**: The `.width()` and `.height()` methods, including `inner-` and `outer-` variations.
- **effects**: The `.animate()` method and its shorthands such as `.slideUp()` or `.hide("slow")`.
- **event**: The `.on()` and `.off()` methods and all event functionality.
- **event/trigger**: The `.trigger()` and `.triggerHandler()` methods.
- **offset**: The `.offset()`, `.position()`, `.offsetParent()`, `.scrollLeft()`, and `.scrollTop()` methods.
- **wrap**: The `.wrap()`, `.wrapAll()`, `.wrapInner()`, and `.unwrap()` methods.
- **core/ready**: Exclude the ready module if you place your scripts at the end of the body. Any ready callbacks bound with `jQuery()` will simply be called immediately. However, `jQuery(document).ready()` will not be a function and `.on("ready", ...)` or similar will not be triggered.
- **deferred**: Exclude jQuery.Deferred. This also excludes all modules that rely on Deferred, including **ajax**, **effects**, and **queue**, but replaces **core/ready** with **core/ready-no-deferred**.
- **exports/global**: Exclude the attachment of global jQuery variables ($ and jQuery) to the window.
- **exports/amd**: Exclude the AMD definition.

- **selector**: The full jQuery selector engine. When this module is excluded, it is replaced with a rudimentary selector engine based on the browser's `querySelectorAll` method that does not support jQuery selector extensions or enhanced semantics. See the [selector-native.js](https://github.com/jquery/jquery/blob/main/src/selector-native.js) file for details.

*Note*: Excluding the full `selector` module will also exclude all jQuery selector extensions (such as `effects/animatedSelector` and `css/hiddenVisibleSelectors`).

##### AMD name

You can set the module name for jQuery's AMD definition. By default, it is set to "jquery", which plays nicely with plugins and third-party libraries, but there may be cases where you'd like to change this. Pass it to the `--amd` parameter:

```bash
npm run build -- --amd="custom-name"
```

Or, to define anonymously, leave the name blank.

```bash
npm run build -- --amd
```

##### File name and directory

The default name for the built jQuery file is `jquery.js`; it is placed under the `dist/` directory. It's possible to change the file name using `--filename` and the directory using `--dir`. `--dir` is relative to the project root.

```bash
npm run build -- --slim --filename="jquery.slim.js" --dir="/tmp"
```

This would create a slim version of jQuery and place it under `tmp/jquery.slim.js`.

##### ECMAScript Module (ESM) mode

By default, jQuery generates a regular script JavaScript file. You can also generate an ECMAScript module exporting `jQuery` as the default export using the `--esm` parameter:

```bash
npm run build -- --filename=jquery.module.js --esm
```

##### Factory mode

By default, jQuery depends on a global `window`. For environments that don't have one, you can generate a factory build that exposes a function accepting `window` as a parameter that you can provide externally (see [`README` of the published package](build/fixtures/README.md) for usage instructions). You can generate such a factory using the `--factory` parameter:

```bash
npm run build -- --filename=jquery.factory.js --factory
```

This option can be mixed with others like `--esm` or `--slim`:

```bash
npm run build -- --filename=jquery.factory.slim.module.js --factory --esm --slim --dir="/dist-module"
```

#### Custom Build Examples

Create a custom build using `npm run build`, listing the modules to be excluded. Excluding a top-level module also excludes its corresponding directory of modules.

Exclude all **ajax** functionality:

```bash
npm run build -- --exclude=ajax
```

Excluding **css** removes modules depending on CSS: **effects**, **offset**, **dimensions**.

```bash
npm run build -- --exclude=css
```

Exclude a bunch of modules (`-e` is an alias for `--exclude`):

```bash
npm run build -- -e ajax/jsonp -e css -e deprecated -e dimensions -e effects -e offset -e wrap
```

There is a special alias to generate a build with the same configuration as the official jQuery Slim build:

```bash
npm run build -- --filename=jquery.slim.js --slim
```

Or, to create the slim build as an esm module:

```bash
npm run build -- --filename=jquery.slim.module.js --slim --esm
```

*Non-official custom builds are not regularly tested. Use them at your own risk.*

## Running the Unit Tests

Make sure you have the necessary dependencies:

```bash
npm install
```

Start `npm start` to auto-build jQuery as you work:

```bash
npm start
```

Run the unit tests with a local server that supports PHP. Ensure that you run the site from the root directory, not the "test" directory. No database is required. Pre-configured php local servers are available for Windows and Mac. Here are some options:

- Windows: [WAMP download](https://www.wampserver.com/en/)
- Mac: [MAMP download](https://www.mamp.info/en/downloads/)
- Linux: [Setting up LAMP](https://www.linux.com/training-tutorials/easy-lamp-server-installation/)
- [Mongoose (most platforms)](https://code.google.com/p/mongoose/)

## Essential Git

As the source code is handled by the Git version control system, it's useful to know some features used.

### Cleaning

If you want to purge your working directory back to the status of upstream, the following commands can be used (remember everything you've worked on is gone after these):

```bash
git reset --hard upstream/main
git clean -fdx
```

### Rebasing

For feature/topic branches, you should always use the `--rebase` flag to `git pull`, or if you are usually handling many temporary "to be in a github pull request" branches, run the following to automate this:

```bash
git config branch.autosetuprebase local
```

(see `man git-config` for more information)

### Handling merge conflicts

If you're getting merge conflicts when merging, instead of editing the conflicted files manually, you can use the feature
`git mergetool`. Even though the default tool `xxdiff` looks awful/old, it's rather useful.

The following are some commands that can be used there:

- `Ctrl + Alt + M` - automerge as much as possible
- `b` - jump to next merge conflict
- `s` - change the order of the conflicted lines
- `u` - undo a merge
- `left mouse button` - mark a block to be the winner
- `middle mouse button` - mark a line to be the winner
- `Ctrl + S` - save
- `Ctrl + Q` - quit

## [QUnit](https://api.qunitjs.com) Reference

### Test methods

```js
expect( numAssertions );
stop();
start();
```

*Note*: QUnit's eventual addition of an argument to stop/start is ignored in this test suite so that start and stop can be passed as callbacks without worrying about their parameters.

### Test assertions

```js
ok( value, [message] );
equal( actual, expected, [message] );
notEqual( actual, expected, [message] );
deepEqual( actual, expected, [message] );
notDeepEqual( actual, expected, [message] );
strictEqual( actual, expected, [message] );
notStrictEqual( actual, expected, [message] );
throws( block, [expected], [message] );
```

## Test Suite Convenience Methods Reference

See [test/data/testinit.js](https://github.com/jquery/jquery/blob/main/test/data/testinit.js).

### Returns an array of elements with the given IDs

```js
q( ... );
```

Example:

```js
q( "main", "foo", "bar" );

=> [ div#main, span#foo, input#bar ]
```

### Asserts that a selection matches the given IDs

```js
t( testName, selector, [ "array", "of", "ids" ] );
```

Example:

```js
t("Check for something", "//[a]", ["foo", "bar"]);
```

### Fires a native DOM event without going through jQuery

```js
fireNative( node, eventType );
```

Example:

```js
fireNative( jQuery( "#elem" )[ 0 ], "click" );
```

### Add random number to url to stop caching

```js
url( "some/url" );
```

Example:

```js
url( "index.html" );

=> "data/index.html?10538358428943"


url( "mock.php?foo=bar" );

=> "data/mock.php?foo=bar&10538358345554"
```

### Run tests in an iframe

Some tests may require a document other than the standard test fixture, and
these can be run in a separate iframe. The actual test code and assertions
remain in jQuery's main test files; only the minimal test fixture markup
and setup code should be placed in the iframe file.

```js
testIframe( testName, fileName,
  function testCallback(
      assert, jQuery, window, document,
	  [ additional args ] ) {
	...
  } );
```

This loads a page, constructing a url with fileName `"./data/" + fileName`.
The iframed page determines when the callback occurs in the test by
including the "/test/data/iframeTest.js" script and calling
`startIframeTest( [ additional args ] )` when appropriate. Often this
will be after either document ready or `window.onload` fires.

The `testCallback` receives the QUnit `assert` object created by `testIframe`
for this test, followed by the global `jQuery`, `window`, and `document` from
the iframe. If the iframe code passes any arguments to `startIframeTest`,
they follow the `document` argument.

## Questions?

If you have any questions, please feel free to ask on the
[Developing jQuery Core forum](https://forum.jquery.com/developing-jquery-core) or in #jquery on [libera](https://web.libera.chat/).
