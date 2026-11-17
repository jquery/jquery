# Changelog

https://blog.jquery.com/2026/11/17/jquery-4-1-0-and-3-8-0-released-passing-the-torch/

## Ajax

- Support an alternative completeCallback API for transports ([43b8652b](https://github.com/jquery/jquery/commit/43b8652b020fb26920d250ca917ee2ecc298cd3f))

## Attributes

- Support the `until-found` value for the `hidden` attribute ([85290c59](https://github.com/jquery/jquery/commit/85290c59724db69a3967885892d4305d76de058f))

## Core

- Formally deprecate push/sort/splice ([50d9a8dc](https://github.com/jquery/jquery/commit/50d9a8dc7fd9e93e09827e4a60772c617d1d5e28))
- Simplify code post browser support reduction ([6fe88690](https://github.com/jquery/jquery/commit/6fe88690a336a883ea310da76762e5a456dc487a))

## CSS

- Empty the computeTableStyleTests probe table when it might be reused (3.x) ([#5932](https://github.com/jquery/jquery/issues/5932), [4bb01875](https://github.com/jquery/jquery/commit/4bb018759ef2c285fba667a63295f67469b68d2f))
- Fix dimensions of table `<col>` elements ([#5628](https://github.com/jquery/jquery/issues/5628), [3f70fbc7](https://github.com/jquery/jquery/commit/3f70fbc76241051e83642de8afc64e0ff381223c))
- Tests: Fix tests & support tests under CSS Zoom (3.x version) ([#5489](https://github.com/jquery/jquery/issues/5489), [29a9030c](https://github.com/jquery/jquery/commit/29a9030c78a02d5c3b41b66283fe7b5325ac11a0))
- Fix reliableTrDimensions test for initially hidden iframes (3.x) ([4e989805](https://github.com/jquery/jquery/commit/4e989805236ce6401bfc7a08913957960bd71887))
- Fix support test results for initially hidden iframes ([ac68b21f](https://github.com/jquery/jquery/commit/ac68b21fa0554bb63e69a81cf635428ec19c5fa8))

## Data

- Shave off some bytes ([000feef3](https://github.com/jquery/jquery/commit/000feef3286760f6959ad8409e3229eb899b6c9e))

## Docs

- Fix some minor issues in comments ([b57c4b51](https://github.com/jquery/jquery/commit/b57c4b51dc0b01085a0686cc3a0f3c5354aba41f))
- Update CONTRIBUTING.md ([d41f0cd9](https://github.com/jquery/jquery/commit/d41f0cd9821126835bfe72dabb21767224cd7ea7))
- Update remaining HTTP URLs to HTTPS ([5d5872bd](https://github.com/jquery/jquery/commit/5d5872bd58ed671ccebbd05ca67d1963bc8a8f45))

## Event

- Increase robustness of an inner native event in leverageNative ([#5459](https://github.com/jquery/jquery/issues/5459), [37bded35](https://github.com/jquery/jquery/commit/37bded35229d4753e2f05290e9304011ea2cbade))

## Manipulation

- Make jQuery.cleanData not skip elements during cleanup ([#5214](https://github.com/jquery/jquery/issues/5214), [752e9119](https://github.com/jquery/jquery/commit/752e9119abea4524d72f48fef03ffda0e255eb33))
- Generalize a test to support IE ([ab0444dd](https://github.com/jquery/jquery/commit/ab0444dd644217786df96a99fc5070c879ce1f9c))
- Support $el.html(selfRemovingScript) ([#5377](https://github.com/jquery/jquery/issues/5377), [cbc15c9c](https://github.com/jquery/jquery/commit/cbc15c9c31fa855304b4b63c13a0c8fb0ef61275))

## Selector

- Work around a Safari 27 regex interepreter bug ([8df0f0d6](https://github.com/jquery/jquery/commit/8df0f0d6bbd0299147b4c8de2aa7396540162133))
- Fix the runescape regex in unescapeSelector ([c4a98588](https://github.com/jquery/jquery/commit/c4a98588f04db3b569b7cff704a104556b39b63d))
- Fix ReDoS in identifier matching ([dd23807d](https://github.com/jquery/jquery/commit/dd23807d7fdd8bdb85e7a486c9ab6f2cd40fd70a))
- Use loose document comparisons everywhere (3.x) ([61bf6c6f](https://github.com/jquery/jquery/commit/61bf6c6f8674518feef20900c8fe54d7e26c121e))
- Properly deprecate `jQuery.expr[ ":" ]`/`jQuery.expr.filters` ([5eab9df7](https://github.com/jquery/jquery/commit/5eab9df7b6a8a64680390b01b495975c22f4bf2d))

## Tests

- Expect reliableTrDimensions to fail in Chrome (3.x) ([ca3e43f1](https://github.com/jquery/jquery/commit/ca3e43f16891a77aa8b8f1584c3417901a196534))
- Make the "jQuery.parseXML - error reporting" test less strict ([f7b68439](https://github.com/jquery/jquery/commit/f7b684390f49fded1f0592c27ad0dca71fb722dd))
- Accept old & new :enabled/:disabled option/optgroup semantics ([7995fa48](https://github.com/jquery/jquery/commit/7995fa487b51d523c7567643cec2f86877c09866))
- Fix jQuery.text tests in IE 9 ([0d9d5f3e](https://github.com/jquery/jquery/commit/0d9d5f3eca012aea99519e21e1f2ec36b50eb864))
- Add tests for `jQuery.text` ([a5ea52de](https://github.com/jquery/jquery/commit/a5ea52deada06dd63d7ad4b99408fc04e67fc9c8))
- Add unit tests for callback-only animation signatures ([#1738](https://github.com/jquery/jquery/issues/1738), [246a8ff0](https://github.com/jquery/jquery/commit/246a8ff0d82b38a4e6af34fcbf245f82d1c7e2dd))
- Add jQuery.ajaxPrefilter & jQuery.ajaxTransport tests ([ef30ce1f](https://github.com/jquery/jquery/commit/ef30ce1f390d4c55b1cb06601d96f2351a48f761))
- Add tests for `.data()` on SVG elements ([664bf36e](https://github.com/jquery/jquery/commit/664bf36e45f77a4c36a04769228dda44852b7e44))
- Increase test coverage of the serialize module ([3f32b169](https://github.com/jquery/jquery/commit/3f32b169a18ca73868b1e8d36c0b698b9dc07673))
- Use allowlist/blocklist instead of whitelist/blacklist ([bc0003e1](https://github.com/jquery/jquery/commit/bc0003e1c0defd6ee4ed26f1c9731357a00df7b6))
- Fix the "outside view position" test in Headless Chrome ([c4c90905](https://github.com/jquery/jquery/commit/c4c90905f086eeca53a75e918b1e78a80e8ac39b))
- Fix selector tests in Chrome 141 ([05891798](https://github.com/jquery/jquery/commit/058917980a559490bb2fd6186816b3b7c61b24c2))
- Fix module/nomodule tests flakiness ([c7ccab20](https://github.com/jquery/jquery/commit/c7ccab20257a9958e0d2c585affd8d43862e3cc2))
- Use releases.jquery.com as external host for AJAX testing ([184f1063](https://github.com/jquery/jquery/commit/184f106395c77704ceb9570c5b8d75d0e778e33a))
- Add tests for `jQuery.get( String, null-ish, null-ish, String )` ([309172f1](https://github.com/jquery/jquery/commit/309172f1d0eb9c59ef1692679accc69d37190e0f))
- migrate test runner to jquery-test-runner ([9b29b10d](https://github.com/jquery/jquery/commit/9b29b10de0f64971fc2f3d4a411fbae74f2da943))
- Stop testing on iOS 10 ([4705858f](https://github.com/jquery/jquery/commit/4705858f0abbffd1a98f06ef264b7b0bc12009cd))
- Switch to an updated fork of promises-aplus-tests ([92a437be](https://github.com/jquery/jquery/commit/92a437bed2e933fac19d1f6c0a23271be6800482))
- Run tests in Edge in IE mode in GitHub Actions ([fb281ca8](https://github.com/jquery/jquery/commit/fb281ca8ca578532f0d1de3161922e330545e520))
- Run tests on both real Firefox ESRs ([6c7f7554](https://github.com/jquery/jquery/commit/6c7f755452e1bbdb5d92cbdcd9efb6b6e6202e03))
- align mock.php with main branch (sans spacing diffs) ([8037b9f5](https://github.com/jquery/jquery/commit/8037b9f53ec4ba2ccd86fca510c8e8f2a0b6dcd2))
- replace dead links in qunit fixture; use https ([ed185765](https://github.com/jquery/jquery/commit/ed18576506689e9f787cf7196595222b94937d6d))
- replace express with basic Node server ([b4ab47af](https://github.com/jquery/jquery/commit/b4ab47afd7465c0037ad16f386d035fd3bbb077e))
- fix supportsScroll feature test in offset ([8eb35e85](https://github.com/jquery/jquery/commit/8eb35e8513b0cb7a19677b6934ddd98ad7b6f16f))
- Make `:has` selector tests not vulnerable to unrelated failures ([b6f53def](https://github.com/jquery/jquery/commit/b6f53def96d31d07e16eb40c290fcf1705d52156))
- revert concurrency group change ([a5bac65e](https://github.com/jquery/jquery/commit/a5bac65e0ccbb4bdb7069bc709f0852fcdbbdddc))
- include github ref in concurrency group ([18adf66b](https://github.com/jquery/jquery/commit/18adf66b44942f2507083987d57b50017828db88))
- Make the beforeunload event tests work regardless of extensions ([5d83fadb](https://github.com/jquery/jquery/commit/5d83fadb6be83bcda54a87c1c0d73534e5aad6fb))
- share queue/browser handling for all worker types ([cc44f768](https://github.com/jquery/jquery/commit/cc44f768344b318109b2f74d6fed28258841470e))
- improve diffing for values of different types ([feb75d30](https://github.com/jquery/jquery/commit/feb75d307299770a9957ed2bbdcb4610ae3b81a6))
- show any and all actual/expected values ([36a43de3](https://github.com/jquery/jquery/commit/36a43de3b7d8a5933c0d0049be297c6ed8e31a97))
- add diffing to test reporter ([8350e5c6](https://github.com/jquery/jquery/commit/8350e5c63fa334f9437b927d72f3c5a2c33a5069))
- add actual and expected messages to test reporter ([f8be4a52](https://github.com/jquery/jquery/commit/f8be4a52c09794ac12eeeade0b33757d42f37a19))
- fix worker restarts for failed browser acknowledgements ([d926cca9](https://github.com/jquery/jquery/commit/d926cca9c6406544dbe776d84331903c1a390493))
- add --hard-retries option to test runner ([2d8208e0](https://github.com/jquery/jquery/commit/2d8208e007a4a6b42015d98db1625b29cd100e27))
- fix cleanup in cases where server doesn't stop ([11f0e633](https://github.com/jquery/jquery/commit/11f0e6335e56aec6e2298f780d4dd0794c589f00))
- fix flakey message logs; ignore delete worker failures ([003c9582](https://github.com/jquery/jquery/commit/003c9582634e657f6f4fffc8234014220b0f95be))
- migrate testing infrastructure to minimal dependencies ([ef434cd8](https://github.com/jquery/jquery/commit/ef434cd8d31f4a75024d3b561abf9ff26793f36e))
- Align `middleware-mockerver.js` with the `main` branch ([164c314f](https://github.com/jquery/jquery/commit/164c314f885d963a89ab25730663de4189c75fc6))
- Workaround a tr width test issue in old iOS ([b5b43ada](https://github.com/jquery/jquery/commit/b5b43adaceea5d21601e9e168a7a620164c1ac79))
