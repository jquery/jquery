# Changelog

https://blog.jquery.com/2025/08/11/jquery-4-0-0-release-candidate-1/

## Build

- Make the sed usage portable across Linux & macOS ([a848611f](https://github.com/jquery/jquery/commit/a848611f9a3ac48b81c5fdcfdc1e8bd8b9de62a6))
- Bump form-data from 4.0.2 to 4.0.4 ([70ee64fc](https://github.com/jquery/jquery/commit/70ee64fc95780799cbc2b78185b05b00268f6377))
- Test on Safari 18 & 17 instead of "latest-1" ([958369f0](https://github.com/jquery/jquery/commit/958369f08815618b02e485bc29fac81cf4f2e1f6))
- Bump github/codeql-action in the github-actions group ([19621e99](https://github.com/jquery/jquery/commit/19621e99443d1a399a627ee535314d65398d1b89))
- Update the jQuery license link in comment headers ([ec9a387e](https://github.com/jquery/jquery/commit/ec9a387ee0c90e057227f44d34f7654fc3d87f1d))
- Try to unpack Firefox ESR via xz, fall back to bzip2 ([dc5d1f7c](https://github.com/jquery/jquery/commit/dc5d1f7c61bea9e415cda89f677355eb8217a057))
- Bump github/codeql-action in the github-actions group ([0ef60202](https://github.com/jquery/jquery/commit/0ef6020295b670ad91fba530c854f863faa97a90))
- Bump undici and release-it ([b668be0f](https://github.com/jquery/jquery/commit/b668be0fdc0d369e779840ef57033ea3fe040cb7))
- Bump the github-actions group with 2 updates ([bd6b453b](https://github.com/jquery/jquery/commit/bd6b453b7effa78b292812dbe218491624994526))
- Bump the github-actions group with 3 updates ([de2ecfc0](https://github.com/jquery/jquery/commit/de2ecfc092fcb6b9d08dc2dc141d389bbfe61c2d))
- ESLint: Remove the `outerIIFEBody` exception to `indent` ([50ca9571](https://github.com/jquery/jquery/commit/50ca957192e891afe37a7080a7c6c08ad1d469e7))
- Bump the github-actions group with 2 updates ([447432f4](https://github.com/jquery/jquery/commit/447432f4a3b182cd6032930fea0685010e7a9d9c))
- upgrade dependencies, including jtr@0.2.5 ([047f8683](https://github.com/jquery/jquery/commit/047f8683cba4efa800436de9fa30e44a32c20947))
- Bump the github-actions group with 2 updates ([667321eb](https://github.com/jquery/jquery/commit/667321eb2d1c4328b993c25fbe2342a01ec4f87f))
- Bump the github-actions group across 1 directory with 2 updates ([098591e6](https://github.com/jquery/jquery/commit/098591e6fd3222e64b59af92c8849f5d8963d43c))
- Test on iOS 18, no longer test on iOS 15 ([75b48e6a](https://github.com/jquery/jquery/commit/75b48e6a2bff1258ca4d85ab7887e78772a67a69))
- Bump github/codeql-action from 3.27.0 to 3.27.5 in the github-actions group ([03e183c4](https://github.com/jquery/jquery/commit/03e183c4ccf22bf4031920c3270c9f113cb72d1d))
- Report Brotli sizes in compareSize ([e4b5e622](https://github.com/jquery/jquery/commit/e4b5e6227717039a9c695b12e40d3f73ffec31b0))
- Fix pre release matching in compare size regex ([041f6e34](https://github.com/jquery/jquery/commit/041f6e347b621227822b900a7a821d341f0c5d53))
- Make middleware-mockserver not crash on reading nonexistent files ([d5ebb464](https://github.com/jquery/jquery/commit/d5ebb464debab6ac39fe065e93c8a7ae1de8547e))
- Bump the github-actions group with 4 updates ([07c9f02b](https://github.com/jquery/jquery/commit/07c9f02bd6cf27c0e1e38345c97f5c3e2718134f))
- Run tests on Node 22 & 23 ([19716254](https://github.com/jquery/jquery/commit/19716254877870ecd649272cadd00a0d0ff8be01))
- Enforce ECMAScript 5 in tests via ESLint ([#5542](https://github.com/jquery/jquery/issues/5542), [d74fc265](https://github.com/jquery/jquery/commit/d74fc265de2bca3060da2e6f5ec00371b16e43ca))
- Bump the github-actions group with 3 updates ([3ebe89f6](https://github.com/jquery/jquery/commit/3ebe89f6be21469702108c85b726a70284adbb91))
- Bump rollup from 4.19.0 to 4.22.4 ([147964e1](https://github.com/jquery/jquery/commit/147964e162f9dd62267f997a81d810ec18f6f9fa))
- Bump webpack from 5.93.0 to 5.94.0 ([3658caf1](https://github.com/jquery/jquery/commit/3658caf129bcf02b39b849dd4040e4fbf53b5d50))
- Bump github/codeql-action from 3.25.15 to 3.26.6 in the github-actions group ([a6feeaa7](https://github.com/jquery/jquery/commit/a6feeaa74050096f22f8df7257c88e31da313875))
- align eslint config with 3.x branch as much as possible ([7e6cee72](https://github.com/jquery/jquery/commit/7e6cee72e2e4d144f4e3fc6d46db9251d38c6fc2))
- Bump the github-actions group with 2 updates ([55bc35bc](https://github.com/jquery/jquery/commit/55bc35bcd453e1aefb9e893e7e6ebc665b3fbb11))
- upgrade dependencies, including requirejs to 2.3.7 ([a7d3383e](https://github.com/jquery/jquery/commit/a7d3383e669ff3eee2d2f5ce5a4bb0b9b79bafb1))
- use --input-type=module in npm scripts ([57ef12e0](https://github.com/jquery/jquery/commit/57ef12e0d19eafea0371800959b7b5f0fba61f6c))

## CSS

- Fix dimensions of table `<col>` elements ([#5628](https://github.com/jquery/jquery/issues/5628), [eca2a564](https://github.com/jquery/jquery/commit/eca2a56457e1c40c071aeb3ac87efeb8bbb8013e))
- Drop the cache in finalPropName ([640d5825](https://github.com/jquery/jquery/commit/640d5825df5ff223560c5690f1a268681c32f9fa))

## Core

- Remove obsolete workarounds, update support comments ([e2fe97b7](https://github.com/jquery/jquery/commit/e2fe97b7f15cf5ee2e44566b381f7bf214e491b1))
- Switch `$.parseHTML` from `document.implementation` to `DOMParser` ([0e123509](https://github.com/jquery/jquery/commit/0e123509d529456ddf130abb97e6266b53f62c50))

## Docs

- Align CONTRIBUTING.md with `3.x-stable` ([d9281061](https://github.com/jquery/jquery/commit/d92810614b53270a8f014db14022887ee3383fd5))
- Update CONTRIBUTING.md ([4ef25b0d](https://github.com/jquery/jquery/commit/4ef25b0de4a847f14ba2f88e309eaf759e035d78))
- add version support section to README ([cbc2bc1f](https://github.com/jquery/jquery/commit/cbc2bc1fd37bb6af5d2c60cf666265c4d438200f))

## Event

- Use `.preventDefault()` in beforeunload ([7c123dec](https://github.com/jquery/jquery/commit/7c123dec4b96e7c3ce5f5a78e828c8aa335bea98))

## Manipulation

- Make jQuery.cleanData not skip elements during cleanup ([#5214](https://github.com/jquery/jquery/issues/5214), [3cad5c43](https://github.com/jquery/jquery/commit/3cad5c435aa2333c39baa55a8bceb2b6bf1e2721))

## Release

- Run `npm publish` in the post-release phase ([ff1f0eaa](https://github.com/jquery/jquery/commit/ff1f0eaafd0dbcd4c063c3c557d9cee0a461f89d))
- Only run browserless tests during the release ([fb5ab0f5](https://github.com/jquery/jquery/commit/fb5ab0f546e0e25ccb5feb3d51ca2ea743b06efc))
- Temporarily disable running tests on release ([3f79644b](https://github.com/jquery/jquery/commit/3f79644b72e928c529febc1aaee081a6c4b96be3))
- publish tmp/release/dist folder when releasing ([#5658](https://github.com/jquery/jquery/issues/5658), [a865212d](https://github.com/jquery/jquery/commit/a865212dea22d44bf2bea3e2c618c4a25c63c6a6))
- correct build date in verification; other improvements ([53ad94f3](https://github.com/jquery/jquery/commit/53ad94f319930a5bf8cb9bd935ebd4e028741903))
- remove dist files from main branch ([be048a02](https://github.com/jquery/jquery/commit/be048a027d0581746f71df7c8eb3ce1d9bd10a40))

## Selector

- Properly deprecate `jQuery.expr[ ":" ]`/`jQuery.expr.filters` ([329661fd](https://github.com/jquery/jquery/commit/329661fd538a07993a2fcfa2a75fdd7f5667f86c))

## Tests

- Use releases.jquery.com as external host for AJAX testing ([f21a6ea6](https://github.com/jquery/jquery/commit/f21a6ea6b5b59fc7fca6a594c353962b23b1fc29))
- Fix tests for `jQuery.get( String, null-ish, null-ish, String )` ([05325801](https://github.com/jquery/jquery/commit/05325801b9453374bf8279f2121829a19b3c09d8))
- Add tests for `jQuery.get( String, null-ish, null-ish, String )` ([76687566](https://github.com/jquery/jquery/commit/76687566f0569dc832f13e901f0d2ce74016cd4d))
- Backport the `hidden="until-found"` attr tests from 3.x-stable ([3a31866b](https://github.com/jquery/jquery/commit/3a31866b80844d8bb06084c70c5b788dd129f7e8))
- migrate test runner to jquery-test-runner ([733e62d2](https://github.com/jquery/jquery/commit/733e62d20328dd3e5b226fd9793b159637d922b8))
- Add custom attribute getter tests to the selector module ([44667709](https://github.com/jquery/jquery/commit/4466770992d5833358169d0248c4deedadea1a96))
- Switch to an updated fork of promises-aplus-tests ([559bc5ac](https://github.com/jquery/jquery/commit/559bc5ac58cb3494ee936c1ee1a14ada75196c6b))
- Run tests in Edge in IE mode in GitHub Actions ([6d78c076](https://github.com/jquery/jquery/commit/6d78c0768d9aa6ba213678724c89af69a1958df6))
- Run tests on both real Firefox ESRs ([4b7ecbad](https://github.com/jquery/jquery/commit/4b7ecbad24463c875f03ef4c7a7d307a091f93fd))
- align mock.php spacing with 3.x-stable branch ([d5ae14f6](https://github.com/jquery/jquery/commit/d5ae14f6fe07e2c2050f029525664cc2d42f9376))
- replace dead links in qunit fixture ([dbc9dac7](https://github.com/jquery/jquery/commit/dbc9dac7aecb106b66050342ff8daf1ecdd4239f))
- replace express with basic Node server ([c85454a8](https://github.com/jquery/jquery/commit/c85454a84306677efda3286a3214419bff945849))
