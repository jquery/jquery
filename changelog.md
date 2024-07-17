# Changelog

https://blog.jquery.com/2024/07/11/second-beta-of-jquery-4-0-0/

## Attributes

- Make `.attr( name, false )` remove for all non-ARIA attrs ([#5388](https://github.com/jquery/jquery/issues/5388), [063831b6](https://github.com/jquery/jquery/commit/063831b6378d518f9870ec5c4f1e7d5d16e04f36))

## Build

- Bump the github-actions group with 2 updates ([3a98ef91](https://github.com/jquery/jquery/commit/3a98ef91dfa0b4897df7562f40bfd1715f5fc30e))
- upgrade dependencies; fix bundler tests on windows ([cb8ab6cc](https://github.com/jquery/jquery/commit/cb8ab6ccdb8a7b843301793d4b7138a5a3750d6b))
- improve specificity of eslint config; add ecma versions ([74970524](https://github.com/jquery/jquery/commit/74970524e5e164c72ec0415267b1e057280c9455))
- Bump the github-actions group with 2 updates ([46b9e480](https://github.com/jquery/jquery/commit/46b9e4803ec3506e830ea6b49541ea29717ed460))
- Group dependabot PRs updating GitHub Actions ([3cac1465](https://github.com/jquery/jquery/commit/3cac1465b4b5539bb679a517fbb52e5419c1866e))
- Bump actions/cache, actions/checkout & github/codeql-action ([df1df950](https://github.com/jquery/jquery/commit/df1df9503afad78bec3ba5217f9a9efce49fe634))
- Bump express from 4.18.3 to 4.19.2 ([691c0aee](https://github.com/jquery/jquery/commit/691c0aeeded5dea1ca2a0c5474c7adfdb1dadffe))
- make compare size cache readable for manual edits ([783c9d69](https://github.com/jquery/jquery/commit/783c9d6958fd20a6a9a199aeecad605a59686992))
- fix size comparison for slim files when the branch is dirty ([8a3a74c4](https://github.com/jquery/jquery/commit/8a3a74c475f92148675af4ee3f77e3d1746e6e88))
- migrate more uses of fs.promises; use node: protocol ([ae7f6139](https://github.com/jquery/jquery/commit/ae7f6139cc8e21a7116e8de30d26ca38426bde0b))
- Bump github/codeql-action from 3.24.0 to 3.24.6 ([ae67ace6](https://github.com/jquery/jquery/commit/ae67ace649fd2ac49eb74709c3d0a5952d0dc3bb))
- Bump actions/cache from 4.0.0 to 4.0.1 ([68f772e0](https://github.com/jquery/jquery/commit/68f772e003ee0f39cf0f755070fb4e9ec9e90973))
- drop support for Node 10 ([5aa7ed88](https://github.com/jquery/jquery/commit/5aa7ed888ddf314fba3c4f8750b891cb6427c9c2))
- add GitHub Actions workflow to update Filestash ([0293d3e3](https://github.com/jquery/jquery/commit/0293d3e30dd68bfe92be1d6d29f9b9200d1ae917))
- update jenkins script to only build ([c21c6f4d](https://github.com/jquery/jquery/commit/c21c6f4ddf96a5928e03bdd2bf0da87899f2ec24))
- Bump actions/cache & github/codeql-action (#5402) ([bf11739f](https://github.com/jquery/jquery/commit/bf11739f6c6926bc9bc1b5a1460505d3b7ef8b01))

## CSS

- Tests: Fix tests & support tests under CSS Zoom ([#5489](https://github.com/jquery/jquery/issues/5489), [071f6dba](https://github.com/jquery/jquery/commit/071f6dba6bd1d8db3f36ce4694aab5ff437b9e36))

## Core

- Fix the exports setup to make bundlers work with ESM & CommonJS ([#5416](https://github.com/jquery/jquery/issues/5416), [60f11b58](https://github.com/jquery/jquery/commit/60f11b58bfeece6b6d0189d7d19b61a4e1e61139))

## Docs

- Update remaining HTTP URLs to HTTPS ([7cdd8374](https://github.com/jquery/jquery/commit/7cdd8374234b77a3c70dd511a1b06066afb146bb))

## Event

- Increase robustness of an inner native event in leverageNative ([#5459](https://github.com/jquery/jquery/issues/5459), [527fb3dc](https://github.com/jquery/jquery/commit/527fb3dcf0dcde69302a741dfc61cbfa58e99eb0))

## Offset

- Increase search depth when finding the 'real' offset parent ([556eaf4a](https://github.com/jquery/jquery/commit/556eaf4a193287c306d163635cbb5f5c95a22a84))

## Release

- ensure builds have the proper version ([3e612aee](https://github.com/jquery/jquery/commit/3e612aeeb3821c657989e67b43c9b715f5cd32e2))
- set preReleaseBase in config file ([1fa8df5d](https://github.com/jquery/jquery/commit/1fa8df5dbd5d84cf55882a38eb6e571abd0aa938))
- fix running pre/post release scripts in windows ([5518b2da](https://github.com/jquery/jquery/commit/5518b2da1816b379b573abc55ba92f02776a3486))
- update AUTHORS.txt ([862e7a18](https://github.com/jquery/jquery/commit/862e7a1882f3f737db7dde1b5ecda9766d61694a))
- migrate release process to release-it ([jquery/jquery-release#114](https://github.com/jquery/jquery-release/issues/114), [2646a8b0](https://github.com/jquery/jquery/commit/2646a8b07fcc2cf7cf384724f622eb0c27f9166c))
- add factory files to release distribution ([#5411](https://github.com/jquery/jquery/issues/5411), [1a324b07](https://github.com/jquery/jquery/commit/1a324b0792ba8d032b89dd8bf78bbf5caa535367))

## Tests

- remove unnecessary scroll feature test ([ea31e4d5](https://github.com/jquery/jquery/commit/ea31e4d57c05a072df98a08df6532b2afb679d30))
- Align `:has` selector tests with `3.x-stable` ([f2d9fde5](https://github.com/jquery/jquery/commit/f2d9fde5f34c83a098fa2074ed808311086d9d23))
- revert concurrency group change ([fa73e2f1](https://github.com/jquery/jquery/commit/fa73e2f1b25304c93006dd45b6cba24f663e2ae7))
- include github ref in concurrency group ([5880e027](https://github.com/jquery/jquery/commit/5880e02707dcefc4ec527bd1c56f64b8b0eba391))
- Make the beforeunload event tests work regardless of extensions ([399a78ee](https://github.com/jquery/jquery/commit/399a78ee9fc5802509df462a2851aef1b60b7fbc))
- share queue/browser handling for all worker types ([284b082e](https://github.com/jquery/jquery/commit/284b082eb86602705519d6ca754c40f6d2f8fcc0))
- improve diffing for values of different types ([b9d333ac](https://github.com/jquery/jquery/commit/b9d333acef65a68d68b169b6acbbf96965414728))
- show any and all actual/expected values ([f80e78ef](https://github.com/jquery/jquery/commit/f80e78ef3e7ded1fc693465d02dfb07510ded0ab))
- add diffing to test reporter ([44fb7fa2](https://github.com/jquery/jquery/commit/44fb7fa220e2dc2780203b128df2181853b3300f))
- add actual and expected messages to test reporter ([1e84908b](https://github.com/jquery/jquery/commit/1e84908baf13da63c33ee66c857e45c2f02eced7))
- fix worker restarts for failed browser acknowledgements ([fedffe74](https://github.com/jquery/jquery/commit/fedffe7448b9e2328b43641158335be18eff5f69))
- add --hard-retries option to test runner ([822362e6](https://github.com/jquery/jquery/commit/822362e6efae90610d7289b46477c7fa22758141))
- fix cleanup in cases where server doesn't stop ([0754d596](https://github.com/jquery/jquery/commit/0754d5966400ff12e216031d68cb25ea314eac55))
- fix flakey message logs; ignore delete worker failures ([02d23478](https://github.com/jquery/jquery/commit/02d23478289e45af3d7f4673b9ffe84591c23472))
- reuse browser workers in BrowserStack tests (#5428) ([95a4c94b](https://github.com/jquery/jquery/commit/95a4c94b8131b737d8f160c582a4acfe2b65e0f8))
- Use allowlist instead of whitelist ([2b97b6bb](https://github.com/jquery/jquery/commit/2b97b6bbcfc67c234b86d41451aac7cdd778e855))
- migrate testing infrastructure to minimal dependencies ([dfc693ea](https://github.com/jquery/jquery/commit/dfc693ea25fe85e5f29da23752b0c7c8d285fbf0))
- Fix Karma tests on Node.js 20 ([d478a1c0](https://github.com/jquery/jquery/commit/d478a1c0226b7825a99718bf605ef9727ee4beca))
