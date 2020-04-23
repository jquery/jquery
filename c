[33mcommit 90fed4b453a5becdb7f173d9e3c1492390a1441f[m[33m ([m[1;36mHEAD -> [m[1;32mmaster[m[33m, [m[1;31morigin/master[m[33m, [m[1;31morigin/HEAD[m[33m)[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 16 21:49:29 2020 +0100

    Manipulation: Make jQuery.htmlPrefilter an identity function
    
    Closes gh-4642

[33mcommit 5b94a4f847fe2328b1b8f2340b11b6031f95d2d1[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Fri Mar 13 17:16:07 2020 +0100

    Build: Resolve Travis config warnings
    
    Travis reports warnings in our config:
    * root: deprecated key sudo (The key `sudo` has no effect anymore.)
    * root: missing os, using the default linux
    * root: key matrix is an alias for jobs, using jobs
    
    They are all now resolved.
    
    Closes gh-4636

[33mcommit 9d76c0b163675505d1a901e5fe5249a2c55609bc[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 2 23:02:42 2020 +0100

    Data:Event:Manipulation: Prevent collisions with Object.prototype
    
    Make sure events & data keys matching Object.prototype properties work.
    A separate fix for such events on cloned elements was added as well.
    
    Fixes gh-3256
    Closes gh-4603

[33mcommit 358b769a00c3a09a8ec621b8dcb2d5e31b7da69a[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 2 22:42:38 2020 +0100

    Release: Use an in-repository dist README fixture
    
    Use a dist README fixture kept in the jQuery repository instead of modifying
    an existing one. This makes the jQuery repository the single source of truth
    when it comes to jQuery releases and it makes it easier to make changes to
    README without worrying how it will affect older jQuery lines.
    
    The commit also ES6ifies build/release.js & build/release/dist.js
    
    Closes gh-4614

[33mcommit 4a7fc8544e2020c75047456d11979e4e3a517fdf[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 2 22:25:35 2020 +0100

    Build: Enable ESLint one-var rule for var declarations in browser code
    
    Node.js code is written more & more commonly in ES6+ so it doesn't make sense
    to enable it there. There are many violations in test code so it's disabled
    there as well.
    
    Closes gh-4615

[33mcommit 364476c3dc1231603ba61fc08068fa89fb095e1a[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 2 22:15:06 2020 +0100

    Tests: Pass a number of necessary done() calls to assert.async()
    
    It is no longer needed to create `done` wrappers in tests that require
    multiple async operations to complete.
    
    Closes gh-4633

[33mcommit 721744a9fab5b597febea64e466272eabfdb9463[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Feb 24 19:10:32 2020 +0100

    Build: Add Christian Oliff to .mailmap & AUTHORS.txt
    
    Closes gh-4613

[33mcommit 4592595b478be979141ce35c693dbc6b65647173[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Feb 10 19:17:22 2020 +0100

    Core: Fire iframe script in its context, add doc param in globalEval
    
    1. Support passing custom document to jQuery.globalEval; the script will be
       invoked in the context of this document.
    2. Fire external scripts appended to iframe contents in that iframe context;
       this was already supported & tested for inline scripts but not for external
       ones.
    
    Fixes gh-4518
    Closes gh-4601

[33mcommit 18db87172cffbe48b92e30b70249e304863a70f9[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Feb 10 19:13:09 2020 +0100

    Event: remove jQuery.event.global
    
    jQuery.event.global has been write-only in the jQuery source for the past few
    years; reading from it was removed in c2d6847de09a52496f78baebc04f317e11ece6d2
    when fixing the trac-12989 bug.
    
    Closes gh-4602

[33mcommit 3edfa1bcdc50bca41ac58b2642b12f3feee03a3b[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jan 27 19:22:05 2020 +0100

    Docs: Remove a mention of the event/alias.js module from README
    
    The file contents now lie in deprecated/event.js so the README reference
    is no longer correct.
    
    Ref gh-4572
    Closes gh-4599

[33mcommit 338f1fc77483a1bc1456e1f4ba1db2049bb45b45[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jan 27 19:21:23 2020 +0100

    Build: Lint the minified jQuery file as well - a Gruntfile fix
    
    While we have absolutely no style-related expectations to our minified file,
    we do care that it's valid ES 5.1. This is now verified.
    
    Fixes gh-3075
    Ref gh-4594
    Closes gh-4598

[33mcommit 23d53928f383b0e7440bf4b08b7524e6af232fad[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Jan 21 14:12:35 2020 +0100

    Ajax: Deprecate AJAX event aliases, inline event/alias into deprecated
    
    A new `src/deprecated` directory makes it possible to exclude some deprecated
    APIs from a custom build when their respective "parent" module is excluded
    without keeping that module outside of the `src/deprecated` directory or
    the `src/deprecated.js` file.
    
    Closes gh-4572

[33mcommit 865469f5e60f55feb28469bb0a7526dd22f04b4e[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Jan 21 14:11:06 2020 +0100

    CSS: Remove the opacity CSS hook
    
    The consequence is `.css( "opacity" )` will now return an empty string for
    detached elements in standard-compliant browsers and "1" in IE & the legacy
    Edge. That behavior is shared by most other CSS properties which we're not
    normalizing either.
    
    Closes gh-4593

[33mcommit 89a18de64cec73936507ea9feca24d029edea24f[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Jan 21 13:51:03 2020 +0100

    Build: Lint the minified jQuery file as well
    
    While we have absolutely no style-related expectations to our minified file,
    we do care that it's valid ES 5.1. This is now verified.
    
    Fixes gh-3075
    Closes gh-4594

[33mcommit e1fab10911dfe3b93bf8bd5d276e30e6fc69f780[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jan 20 19:19:08 2020 +0100

    Build: Add intuitive names to Travis jobs
    
    Otherwise it's hard to see at a glance that a particular job is running
    on Firefox ESR, for example.
    
    Closes gh-4596

[33mcommit fbc44f52fe76e1b601da76a1d7f8ef27884c06da[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jan 20 18:58:23 2020 +0100

    Core: Exclude callbacks & deferred modules in the slim build as well
    
    So far, the slim build only excluded ajax & effects modules. As many web apps
    right now rely on native Promises, often with a polyfill for legacy browsers,
    deferred & callbacks modules are not that useful for sites that already exclude
    ajax & effects modules.
    
    This decreases the gzipped minified size of the slim module by 1760 bytes,
    to 19706 bytes (below 20k!).
    
    Closes gh-4553

[33mcommit ff2819911da6cbbed5ee42c35d695240f06e65e3[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jan 13 19:25:01 2020 +0100

    Attributes: Refactor val(): don't strip carriage return, isolate IE workarounds
    
    Before this change, `val()` was stripping out carriage return characters from
    the returned value. No test has relied on that. The logic was different for
    option elements as its custom defined hook was omitting this stripping logic.
    
    This commit gets rid of the carriage return removal and isolates the IE-only
    select val getter to be skipped in other browsers.
    
    Closes gh-4585

[33mcommit eb35be528fdea40faab4d89ac859d38dfd024271[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jan 13 19:23:01 2020 +0100

    Tests: Remove obsolete jQuery data tests
    
    The tests relied on `jQuery.cache` so they only ever worked in jQuery 1.x.
    
    Closes gh-4586

[33mcommit 9e66fe9acf0ef27681f5a21149fc61678f791641[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jan 13 19:22:08 2020 +0100

    Attributes: Don't set the type attr hook at all outside of IE
    
    This removes a needless function call in modern browsers.
    
    Closes gh-4587

[33mcommit 437f389a24a6bef213d4df507909e7e69062300b[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed Jan 8 00:35:55 2020 +0100

    Build: Make dev mode work in Karma again, serve source files from disk
    
    PR gh-4550 added support for running ES modules & AMD tests via Karma. This
    required reading the `esmodules` & `amd` props from both `QUnit.config` &
    `QUnit.urlParams`. By picking these two properties manually, the `dev` one
    stopped being respected while ones handled directly by QUnit were fine (like
    `hidepassed`). Instead of maintaining the full list of options, the code now
    iterates over QUnit URL config and handles the fallbacks in a more generic way.
    
    Apart from that, all jQuery source & test files are now read directly from disk
    instead of being cached by Karma so that one can run `grunt karma:chrome-debug`
    & work on a fix without restarting that Karma run after each change. A similar
    effect could have been achieved by setting `autoWatch` to `true` but then the
    main Karma page runs tests in an iframe by default when
    `grunt karma:chrome-debug` is run instead of relying on the current debug flow.
    
    Closes gh-4574
    Ref gh-4550

[33mcommit 0f780ba7cc5968d53bba386bdcb59b8d9410873b[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Jan 7 23:59:08 2020 +0100

    Build:Tests: Fix custom build tests, verify on Travis
    
    This commit fixes unit tests for the following builds:
    
    1. The no-deprecated build: `custom:-deprecated`
    2. The current slim build: `custom:-ajax,-effects`
    3. The future (#4553) slim build: `custom:-ajax,-callbacks,-deferred,-effects`
    
    It also adds separate Travis jobs for the no-deprecated & slim builds.
    
    Closes gh-4577

[33mcommit 1dad1185e0b2ca2a13bf411558eda75fb2d4da88[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Jan 7 23:45:41 2020 +0100

    Docs: Update links to EdgeHTML issues to go through Web Archive
    
    With Microsoft going Chromium with Edge, its old EdgeHTML issues were all
    removed. :(
    
    Closes gh-4584

[33mcommit 9b9ed469b43e9fa6e2c752444470ae4c87d03d57[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Jan 7 16:42:49 2020 +0100

    Build: Create a `grunt custom:slim` alias for the Slim build (#4578)
    
    Closes gh-4578

[33mcommit c1ee33aded44051b8f1288b59d2efdc68d0413cc[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Dec 16 19:43:38 2019 +0100

    Selector: Remove the "a:enabled" workaround for Chrome <=77
    
    Remove the workaround for a broken `:enabled` pseudo-class on anchor elements
    in Chrome <=77. These versions of Chrome considers anchor elements with the
    `href` attribute as matching `:enabled`.
    
    Closes gh-4569

[33mcommit f1c16de29689d2cfaf629f00d682148e99753509[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Mon Dec 16 13:37:16 2019 -0500

    Docs: direct users to GitHub docs for cloning the repo
    
    Ref gh-4556
    Close gh-4571

[33mcommit 341c6d1b5abe4829f59fbc32e93f6a6a1afb900f[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Dec 16 19:33:49 2019 +0100

    Build: Make Karma work in ES modules mode
    
    Also, run such a suite in CI to make sure modules are working as expected
    when used directly.
    
    Closes gh-4550

[33mcommit f37c2e51f36c8f8bab3879064a90e86a685feafc[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Dec 9 20:00:44 2019 +0100

    Build: Auto-convert sources to AMD
    
    jQuery source has been migrated in gh-4541 from AMD to ES modules. To maintain
    support for consumers of our AMD modules, this commits adds a task transpiling
    the ES modules sources in `src/` to AMD in `amd/`.
    
    A "Load with AMD" checkbox was also restored to the QUnit setup. Note that,
    contrary to jQuery 3.x, AMD files need to be generated via `grunt amd` or
    `grunt` as sources are not authored in ECMAScript modules. To achieve a similar
    no-compile experience during jQuery 4.x testing, use the new "Load as modules"
    checkbox which works in all supported browsers except for IE & Edge (the
    legacy, EdgeHTML-based one).
    
    Ref gh-4541
    Closes gh-4554

[33mcommit d5c505e35d8c74ce8e9d99731a1a7eab0e0d911c[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Dec 9 19:50:14 2019 +0100

    Event: Only attach events to objects that accept data - for real
    
    There was a check in jQuery.event.add that was supposed to make it a noop
    for objects that don't accept data like text or comment nodes. The problem was
    the check was incorrect: it assumed `dataPriv.get( elem )` returns a falsy
    value for an `elem` that doesn't accept data but that's not the case - we get
    an empty object then. The check was changed to use `acceptData` directly.
    
    Fixes gh-4397
    Closes gh-4558

[33mcommit 5a3e0664d261422f11a78faaf101d70c73b3a5a8[m
Author: Christian Oliff <christianoliff@pm.me>
Date:   Tue Dec 3 20:35:48 2019 +0900

    Docs: Change OS X to macOS in README
    
    macOS has been around for long enough to update the naming here.
    
    Closes gh-4552

[33mcommit 9fd2fa5388dba5c71129a1d9e3bb8e4fe6e4eb0b[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Dec 2 19:55:19 2019 +0100

    Build: Fix the Windows build
    
    This commit gets rid of rollup-plugin-hypothetical in favor of a simpler
    inline Rollup plugin that fits our need and is compatible with Windows.
    
    Fixes gh-4548
    Closes gh-4549

[33mcommit 44ac8c8529173711b66046ae5cfefa5bd4892461[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Nov 25 20:16:53 2019 +0100

    Build: Require extensions for ES6 imports, prevent import cycles
    
    jQuery source is now authored in ECMAScript modules. Native browser support
    for them requires full file names including extensions. Rollup works even
    if import paths don't specify extensions, though, so one import slipped
    through without such an extension, breaking native browser import of
    src/jquery.js.
    
    A new ESLint rule using eslint-plugin-import prevents us from regressing
    on that front.
    
    Also, eslint-plugin-import's no-cycle rule is used to avoid import cycles.
    
    Closes gh-4544
    Ref gh-4541
    Ref 075320149ae30a5c593c06b2fb015bdf033e0acf

[33mcommit 075320149ae30a5c593c06b2fb015bdf033e0acf[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Nov 19 15:18:27 2019 +0100

    Build: Fix the import path to serialize.js from ajax.js

[33mcommit 05184cc448f4ed7715ddd6a5d724e167882415f1[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Nov 18 22:10:55 2019 +0100

    Selector: Make empty attribute selectors work in IE again
    
    qSA in IE 11/Edge often (but not always) don't find elements with an empty
    name attribute selector (`[name=""]`). Detect that & fall back to Sizzle
    traversal.
    
    Interestingly, IE 10 & older don't seem to have the issue.
    
    Fixes gh-4435
    Closes gh-4510

[33mcommit d0ce00cdfa680f1f0c38460bc51ea14079ae8b07[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Nov 18 21:15:03 2019 +0100

    Core: Migrate from AMD to ES modules 🎉
    
    Migrate all source AMD modules to ECMAScript modules. The final bundle
    is compiled by a custom build process that uses Rollup under the hood.
    
    Test files themselves are still loaded via RequireJS as that has to work in
    IE 11.
    
    Tests can now be run in "Load as modules" mode which replaces the previous
    "Load with AMD" option. That option of running tests doesn't work in IE
    and Edge as it requires support for dynamic imports.
    
    Some of the changes required by the migration:
    * check `typeof` of `noGlobal` instead of using the variable directly
      as it's not available when modules are used
    * change the nonce module to be an object as ECMASscript module exports
      are immutable
    * remove some unused exports
    * import `./core/parseHTML.js` directly in `jquery.js` so that it's not
      being cut out when the `ajax` module is excluded in a custom compilation
    
    Closes gh-4541

[33mcommit a612733be0c68d337647a6fcc8f8e0cabc1fc36b[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Oct 28 20:38:33 2019 +0100

    Tests: Skip a "width/height on a table row with phantom borders" test in Firefox
    
    Firefox 70 & newer fail this test but the issue there is more profound - Firefox
    doesn't subtract borders from table row computed widths.
    
    Closes gh-4537
    Ref jquery/jquery#4529
    Ref https://bugzilla.mozilla.org/show_bug.cgi?id=1590837
    Ref w3c/csswg-drafts#4444
    
    (cherry picked from commit c79e1d5fefc50b1df0a1c2ca3f06b567e79c0f9b)

[33mcommit 323575fb9bb330a852718d89e323f7ec79549100[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Oct 28 20:27:49 2019 +0100

    Tests: Don't test synchronous XHR on unload in Chrome
    
    Chrome 78 dropped support for synchronous XHR requests inside of
    beforeunload, unload, pagehide, and visibilitychange event handlers.
    See https://bugs.chromium.org/p/chromium/issues/detail?id=952452
    
    Closes gh-4536
    
    (cherry picked from commit c5b48c8caa58e7b73164ac033bf726a072903708)

[33mcommit bcbcdd2b2c1bb7075f4f73dc89ca7d65db2a09ed[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Oct 22 20:49:37 2019 +0200

    Build: Run tests on Travis only on browsers defined in the config
    
    The environmental variable BROWSERS was being created but it wasn't read in the
    list of browsers to pass to Karma.
    
    Closes gh-4532

[33mcommit 2d5ad6d23e0f57c733ce4556d3f2ee93ca99cadb[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Oct 22 20:20:53 2019 +0200

    Build: Run tests on Firefox ESR as well
    
    Closes gh-4530
    
    (cherry picked from commit 0a73b94a21d4c30b5598b95923dc73d640e07b99)

[33mcommit 830976e690b5fffeac860e2fdd07986d087ce824[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Oct 22 20:03:36 2019 +0200

    Build: Run tests on Node.js 13 in addition to 8, 10 & 12
    
    Closes gh-4528

[33mcommit 584835e68239ce55d1fc007b284e8ef4ed2817c2[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Oct 21 19:06:39 2019 +0200

    Build: Run tests on Travis on FirefoxHeadless as well
    
    Also, run them on both ChromeHeadless & FirefoxHeadless locally on
    `grunt karma:main`.
    
    Plus, so far, the chrome addons were installed for all the jobs, even
    the ones that weren't used for browser testing. Changing that makes
    those jobs faster.
    
    Closes gh-4524

[33mcommit 15750b0af270da07917b70457cf09bda97d3d935[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Oct 21 19:04:48 2019 +0200

    Selector: Use shallow document comparisons in uniqueSort
    
    IE/Edge sometimes crash when comparing documents between frames using the strict
    equality operator (`===` & `!==`). Funnily enough, shallow comparisons
    (`==` & `!=`) work without crashing.
    
    The change to shallow comparisons in `src/selector.js` was done in gh-4471 but
    relevant changes in `src/selector/uniqueSort.js` were missed. Those changes
    have landed in Sizzle in jquery/sizzle#459.
    
    Fixes gh-4441
    Closes gh-4512
    Ref gh-4471
    Ref jquery/sizzle#459

[33mcommit f09d92100ffff6208211b200ed0cdc39bfd17fc3[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Oct 21 19:03:48 2019 +0200

    Docs: Update most URLs to HTTPS
    
    Closes gh-4511

[33mcommit 6eee5f7f181f9ebf5aa428e96356667e3cf7ddbd[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Oct 21 19:03:03 2019 +0200

    Selector: Add a test for throwing on post-comma invalid selectors
    
    Sizzle's PR jquery/sizzle#456 introduced a test catching not throwing on
    badly-escaped identifiers by Firefox 3.6-5. Unfortunately, it was placed just
    before a test Opera 10-11 failed, making Opera fail quicker and not adding
    a post-comma invalid selector to rbuggyQSA.
    
    The issue was fixed in jquery/sizzle#463. This jQuery commit backports the test
    that Sizzle PR added as no workarounds are needed in browsers jQuery supports.
    
    Closes gh-4516
    Ref jquery/sizzle#456
    Ref jquery/sizzle#463

[33mcommit 1d624c10b4a6b97ac254bcefffa91058556075d2[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Oct 21 19:02:22 2019 +0200

    Tests: Stop using jQuery.find in tests
    
    This prepares us for possibly hiding jQuery.find in jQuery 4.0.
    
    Closes gh-4517

[33mcommit 26415e081b318dbe1d46d2b7c30e05f14c339b75[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Oct 14 18:41:35 2019 +0200

    CSS: Workaround buggy getComputedStyle on table rows in IE/Edge
    
    Fixes gh-4490
    Closes gh-4506

[33mcommit ed66d5a22b37425abf5b63c361f91340de89c994[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Oct 14 18:28:19 2019 +0200

    Selector: Make selectors with leading combinators use qSA again
    
    An optimization added in jquery/sizzle#431 skips the temporary IDs for selectors
    not using child or descendant combinators. For sibling combinators, though, this
    pushes a selector with a leading combinator to qSA directly which crashes and
    falls back to a slower Sizzle route.
    
    This commit makes selectors with leading combinators not skip the selector
    rewriting. Note that after jquery/jquery#4454 & jquery/sizzle#453, all modern
    browsers other than Edge leverage the :scope pseudo-class, avoiding temporary
    id attributes.
    
    Closes gh-4509
    Ref jquery/sizzle#431

[33mcommit bbad821c399da92995a11b88d6684970479d4a9b[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed Oct 9 00:17:55 2019 +0200

    Build: Require strict mode in Node.js scripts via ESLint
    
    So far, only browser-based JS files were required to be in strict mode (in the
    function form). This commit adds such a requirement to Node.js scripts where
    the global form is preferred. All Node.js scripts in sloppy mode were
    converted to strict mode.
    
    Closes gh-4499

[33mcommit 4504fc3d722dd029d861cb47aa65a5edc651c4d3[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Oct 8 22:41:59 2019 +0200

    Manipulation:Selector: Use the nodeName util where possible to save size
    
    Saves 20 bytes.
    
    Closes gh-4504

[33mcommit e0022f23144fd1dc6db86a5d8c18af47bc14f0f3[m
Author: Christian Oliff <christianoliff@yahoo.com>
Date:   Mon Oct 7 15:45:40 2019 +0900

    Docs: Convert link to Homebrew from HTTP to HTTPS
    
    `http://brew.sh/` -> `https://brew.sh/`
    
    Closes gh-4501

[33mcommit d7d0b52bda74486f2351baa9d03ca4534de0d733[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Sat Oct 5 18:48:27 2019 +0200

    Build: Support jquery-release --dry-run flag
    
    Without this change passing `--dry-run` to jquery-release still pushes to the
    jquery-dist repository which is dangerous as one can assume `--dry-run` to be
    safe from external side effects.
    
    Close gh-4498

[33mcommit 9a4d980639dd804ad320685a25b8ff4572e3f595[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Fri Oct 4 16:13:14 2019 +0200

    Build: Stop copying src/core.js to dist on release
    
    File `src/core.js` has started erroneously being copied to `dist/` in gh-2981.
    
    Fixes gh-4489
    Closes gh-4492
    Ref gh-2979
    Ref gh-2981

[33mcommit 1b74660f730d34bf728094c33080ff406427f41e[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Thu Sep 26 21:12:38 2019 +0200

    Release: Update AUTHORS.txt
    
    After recent merging of Sizzle & jQuery AUTHORS.txt, the `grunt authors` task
    doesn't provide meaningful as there's no obvious connection between current
    AUTHORS.txt contents & the desired one. Adding two new entries should make it
    easier (plus, it makes it possible to test jquery-release on current master).
    
    Apart from that, the commit adds a missing .mailmap entry for Shashanka Nataraj.

[33mcommit 50871a5a85cc802421b40cc67e2830601968affe[m
Author: Sean Robinson <sean.robinson@scottsdalecc.edu>
Date:   Fri Apr 26 07:25:08 2019 -0700

    Ajax: Do not execute scripts for unsuccessful HTTP responses
    
    The script transport used to evaluate fetched script sources which is
    undesirable for unsuccessful HTTP responses. This is different to other data
    types where such a convention was fine (e.g. in case of JSON).
    
    Fixes gh-4250
    Closes gh-4379

[33mcommit 9df4f1de12728b44a4b0f91748f12421008d9079[m
Author: Ahmed.S.ElAfifi <ahmed.s.elafifi@gmail.com>
Date:   Mon Aug 19 10:04:01 2019 +0200

    Core: Use Array.prototype.flat where supported
    
    Calling `Array.prototype.concat.apply( [], inputArray )` to flatten `inputArray`
    crashes for large arrays; using `Array.prototype.flat` avoids these issues in
    browsers that support it. In case it's necessary to support these large arrays
    even in older browsers, a polyfill for `Array.prototype.flat` can be loaded.
    This is already being done by many applications.
    
    Fixes gh-4320
    Closes gh-4459

[33mcommit aa6344baf87145ffc807a527d9c1fb03c96b1948[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed Sep 25 00:41:07 2019 +0200

    Selector: Use shallow document comparisons to avoid IE/Edge crashes
    
    IE/Edge sometimes crash when comparing documents between frames using the strict
    equality operator (`===` & `!==`). Funnily enough, shallow comparisons
    (`==` & `!=`) work without crashing.
    
    Fixes gh-4441
    Closes gh-4471

[33mcommit b59107f5d7451ac16a7c8755128719be6ec8bf12[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Sep 24 02:12:36 2019 +0200

    Core: Remove private copies of push, sort & splice from the jQuery prototype
    
    Closes gh-4473

[33mcommit 78420d427cf3734d9264405fcbe08b76be182a95[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Sep 24 02:04:53 2019 +0200

    Core: Implement .even() & .odd() to replace POS :even & :odd
    
    `:even` & `:odd` are deprecated since jQuery 3.4.0 & will be removed in 4.0.0.
    The new `even()` & `odd()` methods will make the migration easier.
    
    Closes gh-4485

[33mcommit f810080e8e92278bb5288cba7cc0169481471780[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Sat Aug 31 01:40:45 2019 +0200

    Deprecated: Fix AMD parameter order
    
    Ref gh-4461

[33mcommit 29a9544a4fb743491a42f827a6cf8627b7b99e0f[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Aug 26 19:15:53 2019 +0200

    Selector: reduce size, simplify setDocument
    
    With new selector code doing less convoluted support tests, it was possible
    to extract a lot of logic out of setDocument & also reduce size.
    
    This commit also backports jquery/sizzle#439 that was reverted by mistake
    during a switch from JSHint + JSCS to ESLint.
    
    Closes gh-4462
    Ref jquery/sizzle#442
    Ref jquery/sizzle#439

[33mcommit abdc89ac2e581392b800c0364e0f5f2b6a82cdc6[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Aug 26 19:01:26 2019 +0200

    Ajax: Simplify jQuery.ajaxSettings.xhr
    
    Previously, jQuery.ajaxSettings.xhr, contents were wrapped in a try-catch
    as we defined jQuery.support.ajax & jQuery.support.cors executed during the
    jQuery load and we didn't want to crash if IE had native XHR disabled (which
    is possible). While jQuery hasn't supported the ActiveX-based XHR since 2.0,
    jQuery with XHR disabled could still be used for its other features in such
    a crippled browser.
    
    Since gh-4347, jQuery.support.ajax & jQuery.support.cors no longer exist, so
    we don't need the try-catch anymore.
    
    Fixes gh-1967
    Closes gh-4467
    Ref gh-4347

[33mcommit d7e64190efc411e3973a79fd027bf1afe359f429[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Aug 26 18:53:54 2019 +0200

    Build: Remove the external directory, read from node_modules directly
    
    Now that Sizzle is gone & we use npm, we can read from node_modules directly
    and skip the setup that copies some files to the external directory.
    
    Closes gh-4466

[33mcommit 5ea5946094784f68437ef26d463dfcfbbbaff1f6[m
Author: Shashanka Nataraj <ShashankaNataraj@users.noreply.github.com>
Date:   Thu Aug 22 05:36:26 2019 +0530

    Core: Deprecate jQuery.trim
    
    Fixes gh-4363
    Closes gh-4461

[33mcommit ac5f7cd8e29ecc7cdf21c13199be5472375ffa0e[m
Author: Richard Gibson <richard.gibson@gmail.com>
Date:   Tue Aug 20 14:05:37 2019 -0400

    Tests: Port changes from Sizzle
    
    Ref https://github.com/jquery/sizzle/pull/450
    Closes gh-4464

[33mcommit df6a7f7f0f615149266b1a51064293b748b29900[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Aug 19 18:41:03 2019 +0200

    Selector: Leverage the :scope pseudo-class where possible
    
    The `:scope` pseudo-class[1] has surprisingly good browser support: Chrome,
    Firefox & Safari have supported if for a long time; only IE & Edge lack support.
    This commit leverages this pseudo-class to get rid of the ID hack in most cases.
    Adding a temporary ID may cause layout thrashing which was reported a few times
    in [the past.
    
    We can't completely eliminate the ID hack in modern browses as sibling selectors
    require us to change context to the parent and then `:scope` stops applying to
    what we'd like. But it'd still improve performance in the vast majority of
    cases.
    
    [1] https://developer.mozilla.org/en-US/docs/Web/CSS/:scope
    
    Fixes gh-4453
    Closes gh-4454
    Ref gh-4332
    Ref jquery/sizzle#405

[33mcommit 7bdf307b51e4d4a891b123a96d4899e31bfba024[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Aug 19 18:36:21 2019 +0200

    Tests: Fix a comment in testinit.js
    
    A copied comment line was accidentally left out above the line defining
    `QUnit.jQuerySelectorsPos`, making the sentence nonsense. This commit removes
    that line.
    
    Closes gh-4458

[33mcommit b334ce7735ae453bd5643b251f36c3cedce4b3de[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Mon Aug 12 12:06:52 2019 -0400

    Tests: update npo.js and include unminified source instead
    
    Close gh-4446
    Ref gh-4445

[33mcommit cef4b73179b8d2a38cfd5e0730111cc80518311a[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Fri Aug 9 12:42:05 2019 +0200

    Selector: Bring back querySelectorAll shortcut usage
    
    Due to a faulty IE 8 workaround removal, the fast path qSA mode was skipped
    when jQuery's find was called on an element node - i.e. in most cases. 😱
    
    Ref gh-4395
    Closes gh-4452

[33mcommit 47835965bd100a3661d8299d8b769ceeb8b6ce48[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jul 29 21:14:46 2019 +0200

    Selector: Inline Sizzle into the selector module
    
    This commit removes Sizzle from jQuery, inlining its code & removing obsolete
    workarounds where applicable.
    
    The selector-native module has been removed. Further work on the selector
    module may decrease the size enough that it will no longer be necessary. If
    it turns out it's still useful, we'll reinstate it but the code will look
    different anyway as we'll want to share as much code as possible with
    the existing selector module.
    
    The Sizzle AUTHORS.txt file has been merged with the jQuery one - people are
    sorted by their first contributions to either of the two repositories.
    
    The commit reduces the gzipped jQuery size by 1460 bytes compared to master.
    
    Closes gh-4395

[33mcommit 79b74e043a4ee737d44a95094ff1184e40bd5b16[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed Jun 26 21:39:10 2019 +0200

    Selector: Port Sizzle tests to jQuery
    
    Apart from porting most Sizzle tests to jQuery (mostly to its selector module),
    this commit fixes selector-native so that a jQuery custom compilation that
    excludes Sizzle passes all tests as well.
    
    Closes gh-4406

[33mcommit 438b1a3e8a52d3e4efd8aba45498477038849c97[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon May 13 22:25:11 2019 +0200

    Build: ESLint: forbid unused function parameters
    
    This commit requires all function parameters to be used, not just the last one.
    In cases where that's not possible as we need to match an external API, there's
    an escape hatch of prefixing an unused argument with `_`.
    
    This change makes it easier to catch unused AMD dependencies and unused
    parameters in internal functions the API of which we may change at will, among
    other things.
    
    Unused AMD dependencies have been removed as part of this commit.
    
    Closes gh-4381

[33mcommit 9ec09c3b4aa5182c2a8b8f51afb861b685a4003c[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon May 13 21:55:45 2019 +0200

    Build: Fix the regex parsing AMD var-modules (#4389)
    
    The previous regex caused the final jQuery binary to have syntax errors for
    var-modules with names starting with "return". For example, the following module
    wouldn't work when the file is named `returnTrue.js`:
    
    ```js
    define( function() {
            "use strict";
            return function returnTrue() {
                    return true;
            };
    } );
    ```
    
    Closes gh-4389

[33mcommit 3527a3840585e6a359cd712591c9c57398357b9b[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon May 13 21:39:56 2019 +0200

    Core: Remove IE-specific support tests, rely on document.documentMode
    
    Also, update some tests to IE-sniff when deciding whether
    to skip a test.
    
    Fixes gh-4386
    Closes gh-4387

[33mcommit ccbd6b93424cbdbf86f07a86c2e55cbab497d7a3[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed May 8 10:12:36 2019 +0200

    Traversing: Fix `contents()` on `<object>`s with children in IE
    
    The original fix didn't account for the fact that in IE `<object>` elements
    with no `data` attribute have an object `contentDocument`. The fix leverages
    the fact that this special object has a null prototype.
    
    Closes gh-4390
    Ref gh-4384
    Ref gh-4385

[33mcommit 4d865d96aa5aae91823c50020b5c19da79566811[m
Author: Pat O'Callaghan <patocallaghan@gmail.com>
Date:   Mon May 6 18:23:00 2019 +0100

    Traversing: Fix `contents()` on `<object>`s with children
    
    Fixes gh-4384
    Closes gh-4385

[33mcommit 110802c7f22b677ef658963aa95ebdf5cb9c5573[m
Author: Wonseop Kim <wonseop.kim@samsung.com>
Date:   Wed May 1 21:57:55 2019 +0900

    Effect: Fix a unnecessary conditional statement in .stop()
    
    Because of the above conditional, the 'type' variable has a value of type
    'string' or undefined. Therefore, boolean comparisons for 'type' variable
    is always unnecessary because it return true. The patch removed the
    unnecessary conditional statement.
    
    Fixes gh-4374
    Closes gh-4375

[33mcommit b220f6df88d34dd908f55d57417fcec377787e5c[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Apr 30 21:21:18 2019 +0200

    Build: Fix AMD dependencies in curCSS
    
    A leftover `rboxStyle` was left in the wrapper parameters but not in the
    dependency array, causing `getStyles` to be undefined in AMD mode.
    
    Since `rboxStyle` is no longer used, it's now removed.
    
    Ref gh-4347
    Closes gh-4380

[33mcommit cf84696fd1d7fe314a11492606529b5a658ee9e3[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Apr 29 22:56:09 2019 +0200

    Core: Drop support for IE <11, iOS <11, Firefox <65, Android Browser & PhantomJS
    
    Also, update support comments format to match format described in:
    https://github.com/jquery/contribute.jquery.org/issues/95#issuecomment-69379197
    with the change from:
    https://github.com/jquery/contribute.jquery.org/issues/95#issuecomment-448998379
    (open-ended ranges end with `+`).
    
    Fixes gh-3950
    Fixes gh-4299
    Closes gh-4347

[33mcommit bde53edcf4bd6c975d068eed4eb16c5ba09c1cff[m
Author: Richard Gibson <richard.gibson@gmail.com>
Date:   Tue Apr 16 00:47:02 2019 -0400

    Tests: Restrict an event test fallback to TestSwarm
    
    Closes gh-4357

[33mcommit 58f0c00bed695f934bb205c6115e5fe99dd5c27b[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Apr 29 22:04:52 2019 +0200

    Core: Remove deprecated jQuery APIs
    
    Fixes gh-4056
    Closes gh-4364

[33mcommit 6f2fae7c410dcb5876814866a03fc819f0502290[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Apr 29 21:40:36 2019 +0200

    Tests: Fix the new focusin/focusout test in IE
    
    In IE, focus & blur events fire asynchronously, the test now accounts for that.
    
    Ref gh-4362

[33mcommit 8a741376937dfacf9f82b2b88f93b239fe267435[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Apr 29 21:13:36 2019 +0200

    Event: Stop shimming focusin & focusout events
    
    Latest versions of all browsers now implement focusin & focusout natively
    and they all converged on a common event order so it doesn't make much sense
    for us to normalize it to a different order anymore.
    
    Note that it means we no longer guarantee that focusin fires before focus
    and focusout before blur.
    
    Fixes gh-4300
    Closes gh-4362

[33mcommit 8fae21200e80647fec4389995c4879948d11ad66[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Apr 29 21:06:53 2019 +0200

    Data: Separate data & css/effects camelCase implementations
    
    The camelCase implementation used by the data module no longer turns `-ms-foo`
    into `msFoo` but to `MsFoo` now. This is because `data` is supposed to be
    a generic utility not specifically bound to CSS use cases.
    
    Fixes gh-3355
    Closes gh-4365

[33mcommit eb6c0a7c97b1b3cf00144de12d945c9c569f935c[m
Author: Richard Gibson <richard.gibson@gmail.com>
Date:   Mon Apr 29 13:26:53 2019 -0400

    Event: Prevent leverageNative from registering duplicate dummy handlers
    
    (cherry-picked from 6c1e7dbf7311ae7c0c31ba335fe216185047ae5f)
    
    Closes gh-4353

[33mcommit ddfa83766478268391bc9da96683fc0d4973fcfe[m
Author: Richard Gibson <richard.gibson@gmail.com>
Date:   Mon Apr 29 13:18:08 2019 -0400

    Event: Fix handling of multiple async focus events
    
    (cherry-picked from 24d71ac70406f522fc1b09bf7c4025251ec3aee6)
    
    Fixes gh-4350
    Closes gh-4354

[33mcommit b8d4712825a26a7f24c2bdb5a71aa3abcd345dfd[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Apr 23 22:44:15 2019 +0200

    Build: Test on Node.js 12, stop testing on Node.js 6 & 11
    
    Closes gh-4369

[33mcommit 874030583c9b94603de467124420e6c7a1c3c8ac[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed Apr 17 19:56:25 2019 +0200

    Build: Fix unresolved jQuery reference in finalPropName
    
    Also, prevent further similar breakages by changing our ESLint configuration
    to disallow relying on a global jQuery object in AMD modules.
    
    Fixes gh-4358
    Closes gh-4361

[33mcommit cf9fe0f6a104a0f527c7c3f441485c19e2b19c69[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Tue Apr 9 17:17:10 2019 -0400

    Release: update AUTHORS.txt

[33mcommit 0b2c36adb4e2c048318659e4196e0925da10ead2[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Apr 9 09:50:45 2019 +0200

    Build: Update Sizzle from 2.3.3 to 2.3.4
    
    Fixes gh-1756
    Fixes gh-4170
    Fixes gh-4249
    Closes gh-4345

[33mcommit 00a9c2e5f4c855382435cec6b3908eb9bd5a53b7[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Apr 23 21:00:14 2018 +0200

    CSS: Don't automatically add "px" to properties with a few exceptions
    
    Fixes gh-2795
    Closes gh-4055
    Ref gh-4009

[33mcommit c4f2fa2fb33d6e52f7c8fad9f687ef970f442179[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Apr 8 18:21:36 2019 +0200

    Build: Update the master version to 4.0.0-pre

[33mcommit 2e4b79ab8f7c43d36537a743c4c1a1a5b17e130e[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Thu Apr 4 23:45:57 2019 +0200

    Tests: Fix the core-js polyfill inclusion method
    
    core-js 3 no longer includes a built file in the bundle but core-js-bundle
    does.
    
    Closes gh-4342
    Ref gh-4341

[33mcommit fea7a2a328f475048b4450c5c02a60832fdcfc3c[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Thu Apr 4 16:53:38 2019 +0200

    Build: Update Sinon from 2.3.7 to 7.3.1, other updates
    
    Closes gh-4341

[33mcommit 9b9fca45f37b32849771685d12d770d5b88435cf[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Tue Apr 2 12:31:43 2019 -0400

    Update README.md

[33mcommit a2a73db99c059cc1dc893c981e87f5e2bbc8b411[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed Mar 27 15:47:33 2019 +0100

    Tests: Make Android Browser 4.0-4.3 dimensions tests green
    
    Android Browser disregards td's box-sizing, treating it like it was content-box.
    Unlike in IE, offsetHeight shares the same issue so there's no easy way to
    workaround the issue without incurring high size penalty. Let's at least check
    we get the size as the browser sees it.
    
    Also, fix the nearby support comment syntax.
    
    Closes gh-4335

[33mcommit 4455f8db4ef8660ca9e26d94d6f943c4d80db1c8[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed Mar 27 15:46:20 2019 +0100

    Tests: Make Android Browser 4.0-4.3 AJAX tests green
    
    Android Browser versions provided by BrowserStack fail the "prototype collision
    (constructor)" test while locally fired emulators don't, even when they connect
    to TestSwarm. Just skip the test there to avoid a red build.
    
    Closes gh-4334

[33mcommit 005040379d8b64aacbe54941d878efa6e86df1cc[m
Author: buddh4 <mail@jharrer.de>
Date:   Tue Mar 19 22:40:30 2019 +0100

    Core: Preserve CSP nonce on scripts with src attribute in DOM manipulation
    
    Fixes gh-4323
    Closes gh-4328

[33mcommit fe5f04de8fde9c69ed48283b99280aa6df3795c7[m
Author: Richard Gibson <richard.gibson@gmail.com>
Date:   Mon Mar 25 13:12:08 2019 -0400

    Event: Prevent leverageNative from double-firing focusin
    
    Also, reduce size.
    
    Closes gh-4329
    Ref gh-4279

[33mcommit 753d591aea698e57d6db58c9f722cd0808619b1b[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 25 17:57:30 2019 +0100

    Core: Prevent Object.prototype pollution for $.extend( true, ... )
    
    Closes gh-4333

[33mcommit 669f720edc4f557dfef986db747c09ebfaa16ef5[m
Author: Richard Gibson <richard.gibson@gmail.com>
Date:   Wed Jan 11 15:19:30 2017 -0700

    Event: Leverage native events for focus/blur/click; propagate additional data
    
    Summary of the changes/fixes:
    1. Trigger checkbox and radio click events identically (cherry-picked from
       b442abacbb8464f0165059e8da734e3143d0721f that was reverted before).
    2. Manually trigger a native event before checkbox/radio handlers.
    3. Add test coverage for triggering namespaced native-backed events.
    4. Propagate extra parameters passed when triggering the click event to
       the handlers.
    5. Intercept and preserve namespaced native-backed events.
    6. Leverage native events for focus and blur.
    7. Accept that focusin handlers may fire more than once for now.
    
    Fixes gh-1741
    Fixes gh-3423
    Fixes gh-3751
    Fixes gh-4139
    Closes gh-4279
    Ref gh-1367
    Ref gh-3494

[33mcommit a0abd15b9e5aa9c1f36a9599e6095304825a7b9f[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 18 18:44:43 2019 +0100

    CSS: Avoid forcing a reflow in width/height getters unless necessary
    
    Fixes gh-4322
    Closes gh-4325
    Ref gh-3991
    Ref gh-4010
    Ref gh-4185
    Ref gh-4187

[33mcommit 0ec25abba212efde462a8abcf3376f50116fd6c4[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 11 20:03:54 2019 +0100

    Build: Run the basic test suite in jsdom
    
    The basic test suite is now run in jsdom on all supported Node.js versions
    (8, 10 & 11 as of now).
    
    Closes gh-4310

[33mcommit 84b6a0beb1de193520bb5541c841cbecc7195a5b[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 11 17:25:48 2019 +0100

    Build: Remove manual QUnit fixture resetting
    
    It was needed when QUnit 1.x one used but we've since upgraded to QUnit 2.x.
    
    Closes gh-4312
    Ref gh-4307

[33mcommit ca9356ecce0d45e80794e4fb1a94f283675526ba[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 11 16:06:17 2019 +0100

    Build: Make Promises/A+ tests use the dot reporter instead of the default
    
    The default reporter is very verbose as it prints all the test names it
    encounters. We already use the dot reporter for Karma tests.
    
    Closes gh-4313

[33mcommit 6ced2639b567ab4a5089f38a8e90efedc12801bf[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 4 20:10:21 2019 +0100

    Build: Update QUnit from 1.23.1 to 2.9.2
    
    Closes gh-4307

[33mcommit 16ad9889f562e730a7f39df8a20938f6a3a04edc[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 4 19:05:09 2019 +0100

    Build: Run Karma browser tests on Node.js 10 instead of 8
    
    Node.js 10 has been in Active LTS since 2018-04-24 and Node.js 8 is now in
    maintenance mode.
    
    See https://github.com/nodejs/Release for more details.
    
    Closes gh-4311

[33mcommit 9cb124ed00aad8ac47690e31ad0bb8c3c365663d[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 4 18:30:51 2019 +0100

    Build: Update jsdom; migrate a test with Symbol polyfill to an iframe test
    
    So far, we've been testing that jQuery element iteration works with polyfilled
    Symbol & transpiled for-of via a Node test with jsdom with the Symbol global
    removed. Unfortunately, jsdom now requires Symbol to be present for its internal
    functionality so such a test is no longer possible. Instead, it's been migrated
    to an iframe test with transpiled JavaScript.
    
    This PR also enables us to use ECMAScript 2017 or newer in Node.js code.
    
    Closes gh-4305

[33mcommit c10945d0e15c5048ae8b5b7e3f8241ad27671a7c[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Feb 19 13:20:57 2019 +0100

    Build: Remove obsolete globals from ESLint configuration
    
    We had quite a few obsolete globals declared in various ESLint config files. We also no longer allow to rely on the `noGlobal` & `jQuery` globals in the built file which is not needed.
    
    Closes gh-4301

[33mcommit 8751e9ef86c007e55c9e4a2fe3c9212fb2cadcca[m
Author: abnud1 <ahmad13932013@hotmail.com>
Date:   Sun Nov 11 06:52:13 2018 +0200

    Build: Update most dependencies
    
    The only packages not fully updated are:
    - qunitjs & karma-qunit as that's a QUnit 2.x update that will require some
    changes and we'll do that later
    - jsdom as we need to first rewrite the test with the Symbol polyfill - newer
    jsdom versions don't work with such a hacked Symbol instance
    - sinon as the v2 -> v7 upgrade requires to update our unit tests
    - uglify-js & grunt-contrib-uglify as latest uglify-js versions slightly worsen
    the minified gzipped size
    
    Closes gh-4227
    Closes gh-4228
    Closes gh-4230
    Closes gh-4232

[33mcommit c3498187421d0a50ee0369163428481137a04b99[m
Author: abnud1 <ahmad13932013@hotmail.com>
Date:   Mon Feb 18 19:02:38 2019 +0100

    Build: Update test code for compatibility with QUnit 2.x (#4297)
    
    Also, run `grunt npmcopy` to sync the "external" directory with dependencies
    from package.json. For example, the Sinon library version didn't match.
    
    Ref gh-4234
    Closes gh-4297

[33mcommit da44ff39c2c3433e32b757b05b5643edb72fe786[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Tue Jan 29 14:13:53 2019 +0100

    Build: Advise to create test cases on JS Bin or CodePen, drop JSFiddle
    
    JSFiddle doesn't support IE (even 11) anymore so we shouldn't advise users
    to use it to create test cases. To make people have a choice, add CodePen
    to the list.
    
    Also, link to specific starter templates so that novices don't need to spend
    time thinking how to set up the basic structure.
    
    Closes gh-4289

[33mcommit 5bdc85b82b84e5459462ddad9002f22d1ce74f21[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jan 21 18:42:39 2019 +0100

    Core: Support passing nonce through jQuery.globalEval
    
    Fixes gh-4278
    Closes gh-4280
    Ref gh-3541
    Ref gh-4269

[33mcommit e4de8b4626f8872a4cb1ee241b60902653567503[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jan 21 18:34:40 2019 +0100

    Manipulation: Respect script nomodule attribute in DOM manipulation
    
    PR #3869 added support for `<script type="module">` & some support for
    the `nomodule` attribute but with no tests for `nomodule` and with the
    attribute only respected on inline scripts. This commit adds support for
    source-based scripts as well. It also adds tests for `nomodule`, including
    making sure legacy browsers execute such scripts as they'd natively do - that's
    the whole point of `nomodule` scripts, after all.
    
    Fixes gh-4281
    Closes gh-4282
    Ref gh-3871
    Ref gh-3869

[33mcommit 543d3d24eaefe09c4012171f30267783d51602dc[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jan 14 19:49:28 2019 +0100

    Tests: Skip nonce tests in old iOS/Android as well
    
    Old iOS & Android Browser versions support script-src but not nonce, making the
    nonce test impossible to run. Browsers not supporting CSP at all are not
    a problem as they'll skip script-src restrictions completely.
    
    Ref gh-3541
    Ref gh-4269
    Ref c7c2855ed13f23322c4064407c1ed84561b95738

[33mcommit c7c2855ed13f23322c4064407c1ed84561b95738[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jan 14 19:29:54 2019 +0100

    Core: Preserve CSP nonce on scripts in DOM manipulation
    
    Fixes gh-3541
    Closes gh-4269

[33mcommit 9cb162f6b62b6d4403060a0f0d2065d3ae96bbcc[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Fri Dec 14 22:06:44 2018 +0100

    Tests: Exclude Android 4.x from repeated header names test
    
    Android Browser only returns the last value for each header so there's no way
    for jQuery get all parts.
    
    Closes gh-4259
    Ref gh-3403
    Ref gh-4173

[33mcommit 13de7c9ede1c49c30344b4347985eac341484b1e[m
Author: Richard Gibson <richard.gibson@gmail.com>
Date:   Thu Dec 13 12:54:39 2018 -0500

    Manipulation: Restore _evalUrl jQuery.ajax calls to dataType: script
    
    IE and iOS <10 XHR transport does not succeed on data: URIs
    Ref gh-4243
    Ref gh-4126
    Closes gh-4258

[33mcommit c2026b117d1ca5b2e42a52c7e2a8ae8988cf0d4b[m
Author: Richard Gibson <richard.gibson@gmail.com>
Date:   Wed Dec 12 11:21:24 2018 -0500

    Manipulation: Only evaluate HTTP-successful script src
    
    Fixes gh-4126
    Closes gh-4243

[33mcommit 4ffb1df8e4738eb86bde429ec20efc7394e5e497[m
Author: Marja Hölttä <marja.holtta@gmail.com>
Date:   Wed Dec 12 17:13:18 2018 +0100

    Core: Tiny efficiency fix to jQuery.extend / jQuery.fn.extend (#4246)
    
    Read target[name] only when it's needed.
    
    In addition to doing the property read-only when needed, this
    avoids a slow path in V8 (see the issue for more details).
    
    Fixes gh-4245
    Closes gh-4246

[33mcommit 13f3cd1611d7905c6fadcf2f8a533096b347a6ad[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Mon Dec 3 12:03:04 2018 -0500

    Tests: fix dimensions tests in testswarm
    
    Close gh-4248

[33mcommit 315199c156c5b822a857ca236bda123f01a2da37[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Sun Nov 11 17:34:43 2018 -0500

    Dimensions: fall back to offsetWidth/Height for border-box in IE
    
    - Use getClientRects() to explicitly detect hidden/disconnected
      elements
    
    Close gh-4223
    Fixes gh-4102

[33mcommit 13d0be101f9441f32a2d8528f4de7667d0ffa44b[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Mon Nov 12 11:49:44 2018 -0500

    Tests: add IE launcher for debugging IE11 on Windows

[33mcommit b8195fb94c59e48c043bae3d10f8b4f1ea0b967c[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Mon Nov 26 12:46:58 2018 -0500

    Tests: fix ajax test failure; add to header instead of replace

[33mcommit e0d941156900a6bff7c098c8ea7290528e468cf8[m
Author: Andrei Fangli <andrei_fangli@outlook.com>
Date:   Mon Nov 26 19:00:41 2018 +0200

    Ajax: Fix getResponseHeader(key) for IE11
    
    - getResponseHeader(key) combines all header values for the provided key into a
    single result where values are concatenated by ', '. This does not happen for
    IE11 since multiple values for the same header are returned on separate lines.
    This makes the function only return the last value of the header for IE11.
    - Updated ajax headers test to better cover Object.prototype collisions
    
    Close gh-4173
    Fixes gh-3403

[33mcommit 3ac907864c4d36b4fcb58826d9cb0e4ed62334b2[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Nov 12 18:55:47 2018 +0100

    Tests: Add Safari 12 & iOS 12 results

[33mcommit bc8aedf04210db9af519cdc1e947ee14f36934d6[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Nov 12 18:54:15 2018 +0100

    Tests: Move latest Firefox before Firefox 60 test results

[33mcommit 9b77def560212d12fef2d0b9c12aa50727e3e5d7[m
Author: Saptak Sengupta <saptak013@gmail.com>
Date:   Fri Nov 9 16:45:31 2018 +0530

    Core: Recognize Shadow DOM in attachment checks
    
    Allow `isAttached` to check Shadow DOM for attachment.
    
    Fixes gh-3504
    Closes gh-3996
    Ref gh-3977

[33mcommit 549b32a05afc42a2d0f450ffa82537c3ec25630f[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed Oct 31 15:50:09 2018 +0100

    Build: Run tests on Node.js 11 as well

[33mcommit 354f6036f251a3ce9b24cd7b228b4c7a79001520[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Oct 8 18:25:15 2018 +0200

    CSS: Don't read styles.position in the width/height cssHook unless necessary
    
    Current width/height cssHook reads the computed position style even if not
    necessary as the browser passes the scrollboxSize support test. That has been
    changed.
    
    This commit also makes the scrollboxSize support test in line with all others
    (i.e. only return true or false) and changes the variable name in the hook
    to make the code clearer.
    
    Fixes gh-4185
    Closes gh-4187

[33mcommit dae5f3ce3d2df27873d01f0d9682f6a91ad66b87[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed Oct 3 12:00:52 2018 +0200

    Tests: Add tests for not auto-appending "px" to CSS Grid properties
    
    Ref gh-4007
    Ref gh-4028
    Closes gh-4165

[33mcommit dfa92ccead70d7dd5735a36c6d0dd1af680271cd[m
Author: Richard Gibson <richard.gibson@gmail.com>
Date:   Fri Sep 7 10:14:01 2018 -0400

    Tests: Allow Karma to load unminfied source
    
    Closes gh-4128

[33mcommit f997241f0011ed728be71002bc703c7a0d3f01e5[m
Author: Bert Zhang <enbo@users.noreply.github.com>
Date:   Wed Aug 29 06:54:27 2018 -0700

    CSS: Don't auto-append "px" to possibly-unitless CSS grid properties
    
    This commit adds some CSS grid-related properties to jQuery.cssNumber.
    
    Fixes gh-4007

[33mcommit 6153eb0fd401cda90bf2007335cd4338093d38f0[m
Author: Jason Bedard <jason+github@jbedard.ca>
Date:   Mon Aug 20 21:13:33 2018 -0700

    Tests: use width style instead of SVG width attribute (#4157)
    
    The SVG width attribute seems to not support border-box in iOS7.
    
    Closes gh-4155

[33mcommit c9aae3565edc840961ecbeee77fb0cb367c46702[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed Aug 1 15:12:30 2018 +0200

    Tests: Account for the iPad with iOS 11.3 user agent
    
    The user agent of the iPad with iOS 11.3 on BrowserStack is missing the "iPhone"
    part in the "iPhone OS 11_3" part. This commit makes the iOS regex accept such
    (probably?) malformed UAs.

[33mcommit ae82e85e64b0a06d585934d8f2d2859ce3e755b6[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jul 30 18:41:08 2018 +0200

    Tests: Skip module tests in Edge
    
    Edge sometimes doesn't execute module scripts. It needs to be investigated why
    but for now, we're skipping the test to make our tests more stable.
    
    Closes gh-4140

[33mcommit 063c1f2ca35eda780d84bb5d9f77ab3f5942f687[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jul 30 18:06:08 2018 +0200

    Tests: Make support tests pass in Firefox 52
    
    jQuery Core now supports Firefox ESR.

[33mcommit 7869f83ddd5a3156a358284cbef6837b5e7a2a62[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Fri Jul 27 13:00:28 2018 -0400

    Docs: add gitter badge to README.md
    
    Close gh-4138

[33mcommit 979809c5a80aaf26bf7e3406a2e361e809f9b132[m
Author: Richard Gibson <richard.gibson@gmail.com>
Date:   Fri Jul 13 00:35:08 2018 -0400

     Manipulation: Properly detect HTML elements with single-character names
    
    Fixes gh-4124
    Closes gh-4125

[33mcommit cc95204589eff52eb4eb543134c56c4a3a84e50a[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jul 9 18:37:52 2018 +0200

    Tests: Add support test results for Firefox 61+
    
    Firefox 61 now passes the reliableMarginLeft test.
    
    Closes gh-4122

[33mcommit e743cbd28553267f955f71ea7248377915613fd9[m
Author: Jason Bedard <jason+github@jbedard.ca>
Date:   Wed Jun 20 22:09:29 2018 -0700

    Dimensions: fix computing outerWidth on SVGs
    
    Fixes gh-3964
    Closes gh-4096

[33mcommit 0645099e027cd0e31a828572169a8c25474e2b5c[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Wed Jun 20 12:07:44 2018 -0400

    Serialize: jQuery.param: return empty string when given null/undefined
    
    Fixes gh-2633
    Close gh-4108

[33mcommit 4f3b8f0d0bd2b02960a42e64be0dcbf8073c94bb[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Wed Jun 20 12:06:45 2018 -0400

    Update node dependencies (sans jsdom, qunit, and sinon)
    
    Close gh-4098

[33mcommit dc05f3c1d5a22d96d9d62c8ec0fde2782c38796b[m
Author: Ed S <ejsanders@gmail.com>
Date:   Mon Jun 18 17:50:16 2018 +0100

    Build: Remove unnecessary ESLint exception
    
    The linked-to issue was fixed 2 years ago.
    
    Closes gh-4095

[33mcommit 81d829b3573e6b3581a7f127040aad84d345a832[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jun 18 18:48:15 2018 +0200

    Test: enable a spec testing CSS whitespace preserving in Edge 17
    
    In Edge 14-16 setting a style property to a whitespace-only value resets it to
    the default, forcing us to skip a relevant CSS test in Edge. Now that Edge 17
    has fixed the issue we can re-enable this test there.
    
    Ref gh-3204
    Closes gh-4101

[33mcommit 2348f3996748fc805903e45dbc598ec570d49bb0[m
Author: Dave Methvin <dave.methvin@gmail.com>
Date:   Tue May 8 16:55:14 2018 -0400

    Misc: Add config for lockbot

[33mcommit 75b77b4873abf9025b6ba60dec80aedd29df2bdd[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Jun 4 18:08:06 2018 +0200

    CSS: Don't auto-append "px" to CSS variables (#4064)
    
    Fixes gh-4063
    Closes gh-4064

[33mcommit 45f085882597016e521436f01a8459daf3e4000e[m
Author: Kris Borchers <kris.borchers@gmail.com>
Date:   Tue May 15 11:12:34 2018 +0200

    README: Add FOSSA license scan status badge

[33mcommit dc48b11e0c6c77e2b96e89a18f34d7b0c4f9a9d4[m
Author: Dave Methvin <dave.methvin@gmail.com>
Date:   Wed Mar 7 20:09:09 2018 -0500

    squash! Set attributes all at once, src last

[33mcommit 1f4375a34227f42570d2b72e190e51bcfb1e8597[m
Author: Dave Methvin <dave.methvin@gmail.com>
Date:   Tue Sep 12 12:40:00 2017 -0400

    Ajax: Allow custom attributes when script transport is used
    
    Fixes gh-3028
    Ref gh-2612
    
    Useful, for example, to add `nonce`, `integrity`, or `crossorigin`.

[33mcommit 29e76e254059f8c2b695f4e41054260b52a6910d[m
Author: Dave Methvin <dave.methvin@gmail.com>
Date:   Tue Apr 17 17:59:04 2018 -0400

    Misc: Update license prolog/epilog to placate Github checker

[33mcommit 0ba8e38d0c4ab4a4fb9054e7a713630be9743aff[m
Author: Luis Emilio Velasco Sanchez <emibloque@gmail.com>
Date:   Mon May 14 13:36:30 2018 -0400

    Traversing: $.fn.contents() support for object
    
    Fixes gh-4045
    Closes gh-4046

[33mcommit 821bf34353a6baf97f7944379a6459afb16badae[m
Author: Richard Gibson <richard.gibson@gmail.com>
Date:   Mon May 7 09:28:18 2018 -0400

    CSS: Correctly detect scrollbox support with non-default zoom
    
    Fixes gh-4029
    Closes gh-4030

[33mcommit f8c1e9020c8fd0f0bb83019bfb12e9a7099599b2[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed May 2 17:08:20 2018 +0200

    CSS: Ensure camel- vs kebab-cased names are not collapsed for CSS vars
    
    Closes gh-4062

[33mcommit f5e36bd8f2c2b28231bbed926c6c3dead94db545[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Apr 30 18:52:39 2018 +0200

    CSS: Skip the px-appending logic for animations of non-element props
    
    Without this change animating properties from jQuery.cssNumber on non-elements
    throws an error.
    
    Ref gh-4055
    Closes gh-4061

[33mcommit 76468365779c2d07c7f25ded141e99bad97f78a7[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Wed Apr 25 09:55:38 2018 +0200

    Build: Test on Node 10, stop testing on Node 4 & 9
    
    Node.js 4 & 9 are ending their life, Node.js 10 has just been released.
    
    Closes gh-4057

[33mcommit 9a5b3b6ed0803d816984718de23d6af451260c89[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Apr 23 14:16:21 2018 +0200

    Tests: ensure support tests are failed by at least one tested browser
    
    A whitelist is available so that some tests can be allowed to always succeed.
    This is used only for ajax for now as it can be manually disabled in IE but
    is enabled by default.
    
    Closes gh-4052

[33mcommit 899c56f6ada26821e8af12d9f35fa039100e838e[m
Author: tmybr11 <tomas.perone@gmail.com>
Date:   Tue Apr 17 18:29:11 2018 -0300

    Event: Add "code" property to Event object
    
    Fixes gh-3978
    Closes gh-3998

[33mcommit 73d7e6259c63ac45f42c6593da8c2796c6ce9281[m
Author: Jason Bedard <jason+github@jbedard.ca>
Date:   Tue Mar 13 23:05:33 2018 -0700

    Dimensions: avoid fetching boxSizing when setting width/height
    - this avoids forcing a reflow in some cases
    
    Fixes #3991

[33mcommit 2b5f5d5e90b37f4a735738a6d0b6f22affbea340[m
Author: Dave Methvin <dave.methvin@gmail.com>
Date:   Sat Feb 24 17:17:24 2018 -0500

    CSS: Avoid filling jQuery.cssProps
    
    Fixes gh-3986
    Closes gh-4005
    
    Avoids filling jQuery.cssProps by introducing a second internal
    prop cache. This allows jQuery Migrate to detect external usage.

[33mcommit b95e0da68e1e3fce59a6a54c209b893f611b0b9c[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Mar 19 18:12:23 2018 +0100

    Build: Don't require sudo on Travis, use sandboxless headless Chrome
    
    The Chrome sandbox doesn't work on Travis unless sudo is enabled. Instead,
    we're disabling the Chrome sandbox.
    
    Closes gh-4011

[33mcommit 365284240429d442c3fbe9f505c7b297425bc3a3[m
Author: Oleg Gaydarenko <markelog@gmail.com>
Date:   Wed Mar 7 11:33:39 2018 +0300

    Build: remove artefact from previous commit
    
    Follow-up for 09684ba3f210594e41ecddf369ac94c688d53ccb

[33mcommit 662083ed7bfea6bad5f9cd4060dab77c1f32aacd[m
Author: Saptak Sengupta <saptak013@gmail.com>
Date:   Mon Mar 5 23:27:03 2018 +0530

    Core: Use isAttached to check for attachment of element
    
    This change replaces the use of contains to check for attachment
    by isAttached function
    
    Closes gh-3977
    Ref gh-3504

[33mcommit 09684ba3f210594e41ecddf369ac94c688d53ccb[m
Author: Oleg Gaydarenko <markelog@gmail.com>
Date:   Fri Mar 2 20:21:33 2018 +0300

    Build: Seasonal update of uglify and its options
    
    raw     gz Compared to last run
     =      = dist/jquery.js
    -294    -88 dist/jquery.min.js
    
    Closes gh-3994

[33mcommit 4a2bcc27f9c3ee24b3effac0fbe1285d1ee23cc5[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Feb 12 20:24:58 2018 +0100

    Tests: Fix Android 4.0 Deferred tests
    
    Closes gh-3967

[33mcommit 56742491bd45650e4c8ac7981a11d4d142c265a9[m
Author: Michał Gołębiowski-Owczarek <m.goleb@gmail.com>
Date:   Mon Feb 12 19:08:36 2018 +0100

    Tests: Disable native abort test in Android 4.0
    
    The test works on its own when checked manually but mysteriously fails in
    TestSwarm only in Android 4.0. Let's just disable it there.
    
    Closes gh-3968

[33mcommit 294a3698811d6aaeabc67d2a77a5ef5fac94165a[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Sat Jan 20 12:27:15 2018 -0500

    Build: Updating the master version to 3.3.2-pre.

[33mcommit f2349aee9b8efc19768177bd73bee3db67d3022e[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Fri Jan 19 14:03:56 2018 -0500

    Build: Updating the master version to 3.3.1-pre.

[33mcommit 9a7cc801f54b67458e44f704a9d5d7dc3e2dcc40[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Fri Jan 19 11:34:51 2018 -0500

    Release: update version to 3.3.0-pre

[33mcommit f4321ecc1ed617f1d7d8d524d52ec211cbfdb9a3[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Fri Jan 19 11:24:43 2018 -0500

    Release: add new authors to AUTHORS.txt

[33mcommit 6483af7ee5b3b0f36fdf66943dd8c66042a9ab5f[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Fri Jan 19 11:13:48 2018 -0500

    Tests: skip test with invalid selector for selector-native tests

[33mcommit 7eec97aab3476ea0094766dec958e2a0372feac3[m
Author: Timo Tijhof <krinklemail@gmail.com>
Date:   Fri Jan 12 18:09:42 2018 +0000

    Build: Add "-debug" suffix to name of karma debug tasks
    
    Ref gh-3922
    Close gh-3936

[33mcommit 4765bb5c7840fc5f725f5bda38afcebc3730fbfc[m
Author: Saptak Sengupta <saptak013@gmail.com>
Date:   Wed Jan 10 11:04:31 2018 +0530

    Filter: Use direct filter in winnow
    
    for both simple and complex selectors
    
    Fixes gh-3272
    Closes gh-3910

[33mcommit 625e19cd9be4898939a7c40dbeb2b17e40df9d54[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Tue Jan 16 15:18:32 2018 -0500

    Tests: ensure that module assertions run on supported browsers
    
    - Also fixes tests for karma, where the URL for the module is different
    
    Ref gh-3871

[33mcommit fa793bee203ac14021188e12a126e195e83f1647[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Tue Jan 16 12:41:40 2018 -0500

    Tests: fix tests in AMD mode

[33mcommit 5d3a968e031ab8dff5c07e1d6bb4f196fb82bfa0[m
Author: basil.belokon <basil.belokon@gmail.com>
Date:   Sun Dec 3 15:58:09 2017 +0600

    Manipulation: Add support for scripts with module type
    
    Fixes gh-3871
    Close gh-3869

[33mcommit 428ee4a62488457a1bc568e7475cbf65b1feaf93[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Tue Jan 16 11:17:33 2018 -0500

    Tests: correctly set sudo in travis config, not karma config

[33mcommit 46ea7a3f0e8893a420e4c3321dc3aca40d96f754[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Tue Jan 16 11:10:30 2018 -0500

    Tests: temporarily require sudo access for karma:main on travis
    
    - This should fix the broken travis build on Node 8
    - See https://github.com/travis-ci/travis-ci/issues/8836

[33mcommit 14e5143b831514edc527817c2cd6bef0294079ed[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Tue Jan 16 10:51:03 2018 -0500

    Tests: fix number of expected assertions in basic core

[33mcommit 1ea092a54b00aa4d902f4e22ada3854d195d4a18[m
Author: Jason Bedard <jason+github@jbedard.ca>
Date:   Sun Jan 14 00:46:20 2018 -0800

    Core: deprecate jQuery.type
    
    Fixes gh-3605
    Close gh-3895

[33mcommit 91fb18190e5ab9821e3c74b6aecbb5d197c6c5f6[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Wed Jan 10 11:42:24 2018 -0500

    Tests: fix weird flaky attributes test in Edge 16
    
    Fixes gh-3867
    Close gh-3931

[33mcommit 5e6deb3999539e6666106a524fe6f067f60a41f1[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Wed Jan 10 11:52:50 2018 -0500

    Tests: fix weird failure in Edge 16 CSS
    
    Fixes gh-3866
    Close gh-3932

[33mcommit c4494d4abc84d368d6597889ab45fc07466f8f26[m
Author: Jason Bedard <jason+github@jbedard.ca>
Date:   Tue Dec 12 21:51:49 2017 -0800

    Core: deprecate jQuery.isNumeric
    
    Fixes gh-2960
    Closes gh-3888

[33mcommit d7237896c79a5a10d85fcdec199c5657a469a92b[m
Author: Dave Methvin <dave.methvin@gmail.com>
Date:   Tue Sep 12 11:24:45 2017 -0400

    Ajax: Don't process non-string data property on no-entity-body requests
    
    Fixes gh-3438
    Closes gh-3781

[33mcommit 022b69a44e42684bdd0029dd456bedb3b495cc24[m
Author: Dave Methvin <dave.methvin@gmail.com>
Date:   Fri Dec 29 16:58:45 2017 -0500

    Event: Move event aliases to deprecated
    
    Fixes gh-3214

[33mcommit 3d732cca6b5076a9d13eee98e2b075b37384cd91[m
Author: Jason Bedard <jason+github@jbedard.ca>
Date:   Tue Dec 12 22:43:30 2017 -0800

    Core: deprecate jQuery.isFunction
    
    Fixes gh-3609

[33mcommit 6c38ebbd47c6b0fa654733819bd5ae36c1ac6c48[m
Author: Dave Methvin <dave.methvin@gmail.com>
Date:   Tue Jan 9 07:50:09 2018 -0800

    Build: Remove CRLF line endings to fix builds on Windows
    
    Close gh-3929

[33mcommit 50b94f47d2b4b40f7b9181e42e83e848efb4c4c9[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Mon Jan 8 11:55:14 2018 -0500

    Tests: fix function reference for unbinding
    
    Ref gh-2958

[33mcommit c9efd11f47c68f0537c8ea535b8d6a9c6d667175[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Wed Jan 3 12:19:37 2018 -0500

    Build: Fix UglifyJS output in Android 4.0; update uglify
    
    - Thanks to @mgol for first pass
    
    Fixes gh-3743
    Close gh-3920

[33mcommit e2f192887cb03400128b975c8cd86d6c4dc1e31e[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Wed Jan 3 11:39:19 2018 -0500

    Tests: only run ontimeout test if ontimeout exists
    
    Fixes gh-3742
    Close gh-3919

[33mcommit 7be448d41fa124474aeee8423d57df11073791fd[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Wed Jan 3 11:01:26 2018 -0500

    Ajax: add unit test for getScript(Object)
    
    Fixes gh-3736
    Close gh-3918

[33mcommit 80f57f8a13debaab87b99f73631669699da3e1a5[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Tue Jan 2 16:45:10 2018 -0500

    Attributes: allow array param in add/remove/toggleClass
    
    +30 bytes instead of +182
    
    Thanks to @faisaliyk for the first pass on this feature.
    
    Fixes gh-3532
    Close gh-3917

[33mcommit a88b48eab1cdbb9dac05679a0d1c0edd7cc4afd7[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Tue Jan 2 15:42:43 2018 -0500

    Manipulation: use `.children` to select tbody elements
    
    - selectors beginning with a child combinator are not valid natively.
      This fixes the tests when using selector-native.js

[33mcommit 3a8e44745c014871bc56e94d91e57c45ae4be208[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Mon Dec 11 12:58:35 2017 -0500

    Core: deprecate jQuery.proxy (not slated for removal)
    
    Fixes gh-2958
    Close gh-3885

[33mcommit 909e0c99251ee56ec35db0e08d5b1e6219ac8fbc[m
Author: Timmy Willison <4timmywil@gmail.com>
Date:   Mon Dec 11 12:39:11 2017 -0500

    Core: deprecate jQuery.now
    
    Fixes gh-2959
    Close gh-3884
