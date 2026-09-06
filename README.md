# [jQuery](https://jquery.com/) — New Wave JavaScript

Meetings are currently held on the [matrix.org platform](https://matrix.to/#/#jquery_meeting:gitter.im).

Meeting minutes can be found at [meetings.jquery.org](https://meetings.jquery.org/category/core/).

The latest version of jQuery is available at [https://jquery.com/download/](https://jquery.com/download/).

## Version support

| Version | Branch     | Support       |
| ------- | ---------- | ------------- |
| 4.x     | main       | Full          |
| 3.x     | 3.x-stable | Critical-only |
| 2.x     | 2.x-stable | None          |
| 1.x     | 1.x-stable | None          |

[jQuery 4.0.0 has been released!](https://blog.jquery.com/2026/01/17/jquery-4-0-0/)

The 3.x branch will now only receive critical updates. The 2.x and 1.x branches are no longer supported. We recommend that all users upgrade to the latest version of jQuery to ensure that they have the best performance, security, and features.

Commercial support for previous versions is available from [HeroDevs](https://www.herodevs.com/support/jquery-nes?utm_source=jQuery&utm_medium=link&utm_campaign=eol_support_jQuery).

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
- **ajax/xhr**: The XMLHttpRequest AJAX transport only.
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


## 🌐 Web Resources & Interactive Index
- [HERO TRANSFORM RACE](https://studyplayings.web.app/hero-transform-race.html)
- [BRAINROT CLEANING](https://thelearnquesters.pages.dev/brainrot-cleaning.html)
- [CATEGORY BRAIN260](https://studyplaying.github.io/category-brain260.html)
- [CHILL GIRL CLICKER](https://iskillplay.web.app/chill-girl-clicker.html)
- [CATEGORY MAHJONG GAMES](https://studyplaying.github.io/category-mahjong-games.html)
- [CONSTRUCTION SET 3D BUILDER](https://studyplaying.github.io/construction-set-3d-builder.html)
- [CATEGORY MATCH 3 2](https://studyplayings.pages.dev/category-match-3-2.html)
- [CATEGORY ARMY40](https://studyplaying.github.io/category-army40.html)
- [LABUBA MERGE](https://studyplayings.web.app/labuba-merge.html)
- [CATEGORY QUIZ](https://studyplaying.github.io/category-quiz.html)
- [HIDDEN OBJECTS LOST ISLAND 2](https://studyplayings.pages.dev/hidden-objects-lost-island-2.html)
- [ITALIAN BRAINROT QUIZ](https://studyplaying.github.io/italian-brainrot-quiz.html)
- [INDEX11](https://studyplayings.web.app/index11.html)
- [CATEGORY RACING DRIVING](https://studyplayings.pages.dev/category-racing-driving.html)
- [CATEGORY RPG80](https://studyplaying.github.io/category-rpg80.html)
- [CATEGORY RPG](https://studyplaying.github.io/category-rpg.html)
- [CATEGORY MEME BLOXY24](https://studyplayings.web.app/category-meme-bloxy24.html)
- [CATEGORY SCRATCH](https://studyplaying.github.io/category-scratch.html)
- [2048 MATCH BALLS](https://studyplayings.web.app/2048-match-balls.html)
- [CATEGORY PIXEL313](https://studyplaying.github.io/category-pixel313.html)
- [CATEGORY OBSTACLE299](https://studyplaying.github.io/category-obstacle299.html)
- [GRANNY PILLS DEFEND CACTUSES](https://studyquests.pages.dev/granny-pills-defend-cactuses.html)
- [STICKMAN DOORS AND ISLAND](https://studyquests.pages.dev/stickman-doors-and-island.html)
- [EQ TEST PUZZLE](https://studyplayings.pages.dev/eq-test-puzzle.html)
- [COUNT AND BOUNCE](https://studyplayings.pages.dev/count-and-bounce.html)
- [BUBBLE SKY](https://studyquests.pages.dev/bubble-sky.html)
- [CHAMPIONS FC](https://studyplaying.github.io/champions-fc.html)
- [CATEGORY MONSTER206](https://studyquests.pages.dev/category-monster206.html)
- [CATEGORY PUZZLE 10](https://studyplaying.github.io/category-puzzle-10.html)
- [CARS WITH GUNS WASTELAND SHOWDOWN](https://studyquests.pages.dev/cars-with-guns-wasteland-showdown.html)
- [ARCHERY MASTER](https://studyquests.pages.dev/archery-master.html)
- [FEET DOCTOR URGENCY CARE](https://studyplayings.web.app/feet-doctor-urgency-care.html)
- [CRAZY VAN](https://studyplayings.pages.dev/crazy-van.html)
- [PASSENGER SORT](https://studyquests.pages.dev/passenger-sort.html)
- [CATEGORY POOL](https://studyplaying.github.io/category-pool.html)
- [IDLE LANDMARK BUILDER](https://studyplayings.web.app/idle-landmark-builder.html)
- [TAPKO](https://studyplayings.web.app/tapko.html)
- [TROPICAL MATCH 2](https://studyplayings.pages.dev/tropical-match-2.html)
- [JUMP MAN](https://studyplayings.pages.dev/jump-man.html)
- [BELL MADNESS](https://studyplayings.web.app/bell-madness.html)
- [HEAD SOCCER ARENA](https://learnquesters.pages.dev/head-soccer-arena.html)
- [GEOMETRY WAVE HERO](https://thelearnquesters.pages.dev/geometry-wave-hero.html)
- [SAVAGE DEFENDERS](https://learnquesters.pages.dev/savage-defenders.html)
- [CATEGORY TOP DOWN248](https://thelearnquesters.pages.dev/category-top-down248.html)
- [CATEGORY PUZZLE 7](https://studyplaying.github.io/category-puzzle-7.html)
- [LUCKY BRAINROT BLOCKS ONLINE](https://learnquester.github.io/lucky-brainrot-blocks-online.html)
- [FLAG PUZZLE JAM COLLECT FLAGS](https://studyplayings.pages.dev/flag-puzzle-jam-collect-flags.html)
- [TURNFIGHT COM UAP](https://studyplayings.pages.dev/turnfight-com-uap.html)
- [MY CITY HOSPITAL](https://theskillquest.pages.dev/my-city-hospital.html)
- [ROBYBOX SPACE STATION WAREHOUSE](https://thelearnquester.web.app/robybox-space-station-warehouse.html)
- [COUNT AND BOUNCE](https://thequizzone.pages.dev/count-and-bounce.html)
- [PATO VS COPS](https://learnquester.github.io/pato-vs-cops.html)
- [STRIKE BREAKOUT](https://studyplaying.github.io/strike-breakout.html)
- [CUBE STACK 2048](https://studyplaying.github.io/cube-stack-2048.html)
- [ROCK CRAWLING](https://themindzone.pages.dev/rock-crawling.html)
- [SWAT CATS SHOOTER](https://thelearnquesters.pages.dev/swat-cats-shooter.html)
- [PORTAL TD TOWER DEFENSE](https://learnquester.pages.dev/portal-td-tower-defense.html)
- [OFFICE SPIDER SOLITAIRE](https://studyplayings.pages.dev/office-spider-solitaire.html)
- [EXCAVATOR SIMULATOR 3D](https://learnquester.pages.dev/excavator-simulator-3d.html)
- [FAMILY IDLE FARM BUILD HARVEST](https://studyplayings.web.app/family-idle-farm-build-harvest.html)
- [CATEGORY BOXING](https://themindzone.pages.dev/category-boxing.html)
- [HOTEL FEVER TYCOON](https://learnquester.github.io/hotel-fever-tycoon.html)
- [PACXON NEW REALMS](https://learnquester.github.io/pacxon-new-realms.html)
- [ROAD RACE 3D](https://thelearnquesters.pages.dev/road-race-3d.html)
- [HOME ISLAND](https://learnquester.github.io/home-island.html)
- [HAWAII MATCH 6](https://quizverses-9d2f2.web.app/hawaii-match-6.html)
- [CATEGORY FLASH 2](https://studyquests.github.io/category-flash-2.html)
- [OCEAN KIDS BACK TO SCHOOL](https://quizverses.pages.dev/ocean-kids-back-to-school.html)
- [HARD ROCK ZOMBIE TRUCK](https://learnquesters.pages.dev/hard-rock-zombie-truck.html)
- [2248 BLOCK MERGE](https://theskillquest.pages.dev/2248-block-merge.html)
- [HAPPY TOWN](https://quizverses.github.io/happy-town.html)
- [STUDENT AND TEACHER](https://studyquests.pages.dev/student-and-teacher.html)
- [MINI GRAND THEFT CITY](https://quizverses.pages.dev/mini-grand-theft-city.html)
- [CATEGORY NETSUPPORT](https://studyplaying.github.io/category-netsupport.html)
- [SCROLL AND SPOT](https://learnquesters.pages.dev/scroll-and-spot.html)
- [TATTOO MASTER](https://learnquester.github.io/tattoo-master.html)
- [BREAKTHROUGH TEAM](https://thelearnquester.web.app/breakthrough-team.html)
- [LAST PLAY RAGDOLL SANDBOX KQB](https://thelearnquesters.pages.dev/last-play-ragdoll-sandbox-kqb.html)
- [DRAGON YEAR JIGSAW](https://studyplaying.github.io/dragon-year-jigsaw.html)
- [DAILY WORDLER](https://theskillquest.pages.dev/daily-wordler.html)
- [SAVE THE BEAUTY](https://quizverses-9d2f2.web.app/save-the-beauty.html)
- [CATEGORY DRESS UP GAMES](https://themindzone.pages.dev/category-dress-up-games.html)
- [CRAFT OF WARS](https://iskillquest.pages.dev/craft-of-wars.html)
- [FALLING PARTY](https://themindzone.pages.dev/falling-party.html)
- [WOODS OF NEVIA FOREST SURVIVAL](https://thelearnquesters.pages.dev/woods-of-nevia-forest-survival.html)
- [CATEGORY AGILITY 2](https://thelearnquester.web.app/category-agility-2.html)
- [US ARMY CAR GAMES TRUCK DRIVING](https://thelearnquesters.pages.dev/us-army-car-games-truck-driving.html)
- [FRUIT GOALS MATCH](https://studyplaying.github.io/fruit-goals-match.html)
- [TOILET ROLL](https://thelearnquesters.pages.dev/toilet-roll.html)
- [CATEGORY HERO72](https://thelearnquesters.pages.dev/category-hero72.html)
- [CATEGORY PREMIUM PERKS74](https://studyplaying.github.io/category-premium-perks74.html)
- [MINI SHOOTERS](https://quizverses-9d2f2.web.app/mini-shooters.html)
- [CATEGORY SOLITAIRE](https://thelearnquesters.pages.dev/category-solitaire.html)
- [K POP HUNTER HALLOWEEN FASHION](https://theskillquest.pages.dev/k-pop-hunter-halloween-fashion.html)
- [UGC MATH RACE](https://quizverses-9d2f2.web.app/ugc-math-race.html)
- [BUBBLE BLITZ GALAXY](https://thelearnquester.web.app/bubble-blitz-galaxy.html)
- [CAPYBARA JUMP](https://learnquesters.pages.dev/capybara-jump.html)
- [PRESS A TO PARTY](https://thelearnquesters.pages.dev/press-a-to-party.html)
- [CATEGORY DRAWING GAMES](https://thequizzone.pages.dev/category-drawing-games.html)
- [CATEGORY BRAIN260](https://iskillquest.pages.dev/category-brain260.html)
- [PUZZLEJAM](https://thequizzone.pages.dev/puzzlejam.html)
- [WORDS FROM WORDS SEA](https://studyplayings.pages.dev/words-from-words-sea.html)
- [JUMP IN TO THE PLANE](https://studyplaying.github.io/jump-in-to-the-plane.html)
- [HIDDEN OBJECTS CRIME SCENE](https://thelearnquester.web.app/hidden-objects-crime-scene.html)
- [FIND THE VAMPIRE](https://studyquests.pages.dev/find-the-vampire.html)
- [HYPERSPACE   QUANTUM FRACTURE FEZ](https://learnquesters.pages.dev/hyperspace---quantum-fracture-fez.html)
- [CATEGORY ADVENTURE 2](https://thelearnquesters.pages.dev/category-adventure-2.html)
- [2 PLAYER GAMES KIDS KITCHEN](https://learnquesters.pages.dev/2-player-games-kids-kitchen.html)
- [PUSH PUSH CAT](https://studyquesthub.web.app/push-push-cat.html)
- [INDEX7](https://themindzone.pages.dev/index7.html)
- [ZINDEX](https://quizverses-9d2f2.web.app/zindex.html)
- [FENNEC THE FOX CLICK ADVENTURE](https://quizverses-9d2f2.web.app/fennec-the-fox-click-adventure.html)
- [BARREL ROLLER AMAZING RUNNER](https://quizverses.pages.dev/barrel-roller-amazing-runner.html)
- [UPHILL RUSH 13](https://quizverses.pages.dev/uphill-rush-13.html)
- [SOFT GIRLS WINTER AESTHETICS](https://iskillquest.pages.dev/soft-girls-winter-aesthetics.html)
- [SWAT PLANTS VS ZOMBIES](https://studyquests.pages.dev/swat-plants-vs-zombies.html)
- [HIDDEN OBJECT MY HOTEL](https://studyplayings.web.app/hidden-object-my-hotel.html)
- [CATEGORY SANDBOX40](https://themindzone.pages.dev/category-sandbox40.html)
- [MR THROW](https://themindzone.pages.dev/mr-throw.html)
- [CANDY POP MANIA](https://learnquesters.pages.dev/candy-pop-mania.html)
- [RESTAURANT VIP MASTERCHEF](https://themindzone.pages.dev/restaurant-vip-masterchef.html)
- [INDEX8](https://thelearnquesters.pages.dev/index8.html)
- [EVONY THE KINGS RETURN](https://iskillquest.pages.dev/evony-the-kings-return.html)
- [MURDER CASE CLUE 3D](https://studyplayings.web.app/murder-case-clue-3d.html)
- [BOMBER BATTLE ARENA](https://studyplaying.github.io/bomber-battle-arena.html)
- [SPECIAL HOLIDAY SOLITAIRE](https://thelearnquester.web.app/special-holiday-solitaire.html)
- [FISH EAT GROW MEGA](https://theskillquest.pages.dev/fish-eat-grow-mega.html)
- [VEGAMIX DA VINCI PUZZLES](https://studyplayings.web.app/vegamix-da-vinci-puzzles.html)
- [IDLE BASEBALL TYCOON](https://theskillquest.pages.dev/idle-baseball-tycoon.html)
- [CATEGORY ZOMBIE](https://quizverses-9d2f2.web.app/category-zombie.html)
