# Changelog

https://blog.jquery.com/2026/11/17/jquery-4-1-0-and-3-8-0-released-passing-the-torch/

## Ajax

- Add the `responseURL` field to jqXHR ([#4339](https://github.com/jquery/jquery/issues/4339), [5691e03a](https://github.com/jquery/jquery/commit/5691e03ae26542732a7719d86357f0eabb2d489b))
- Support an alternative completeCallback API for transports ([a05c3d73](https://github.com/jquery/jquery/commit/a05c3d736aef56fbdfde66d8fa56245fb5d7524f))

## Core

- Refactor loops to avoid going behind array bounds ([5f8ed054](https://github.com/jquery/jquery/commit/5f8ed05417525bacc6a597a334a64835e2f9985b))
- Drop getElementsBy{Tag,Class}Name in favor of querySelectorAll ([#3642](https://github.com/jquery/jquery/issues/3642), [53a2bcf9](https://github.com/jquery/jquery/commit/53a2bcf984ec5d1955d35ea9565e847cbeea0200))

## CSS

- Empty the computeTableStyleTests probe table when it might be reused ([#5932](https://github.com/jquery/jquery/issues/5932), [f37226f0](https://github.com/jquery/jquery/commit/f37226f0c7fce6c2411895970127739e3d8a0dc0))
- Use createElementNS to support XML documents ([#4730](https://github.com/jquery/jquery/issues/4730), [dcb31ae8](https://github.com/jquery/jquery/commit/dcb31ae8dd8fcc325a774e3aec0d12d1636f2f9f))

## Data

- Shave off some bytes ([eb9acfe9](https://github.com/jquery/jquery/commit/eb9acfe9debc6ec3aa6f40233f432e1a56801238))

## Docs

- Add a new commercial support vendor: TuxCare ([b75c1fef](https://github.com/jquery/jquery/commit/b75c1fef3af900cb2a202b2ed5a0ad11d731a4e3))
- Fix spelling of XMLHttpRequest in README (#5903) ([71c0dd14](https://github.com/jquery/jquery/commit/71c0dd14927c41d1aab5ce5ef2687d7808a4186b))
- Add guidelines for machine-generated contributions ([51eb576c](https://github.com/jquery/jquery/commit/51eb576cca6ffce252dc152bf8e91d5230a0d887))
- Update the jQuery NES HeroDevs link in README (#5853) ([dd7b28f4](https://github.com/jquery/jquery/commit/dd7b28f450e43ecfa736aaaacee6944435dba1cb))
- Update active version table ([fef45254](https://github.com/jquery/jquery/commit/fef45254c45d65ecdc87f7f2c2d4e62caf4c1730))
- update README with 4.0 release ([#5781](https://github.com/jquery/jquery/issues/5781), [5bffcc1a](https://github.com/jquery/jquery/commit/5bffcc1afa9088e904c742d80e39c380c8d59aef))

## Selector

- Work around a Safari 27 regex interepreter bug ([b557a8c4](https://github.com/jquery/jquery/commit/b557a8c446cc3464fd88741e00916985439e5443))
- Fix the runescape regex in unescapeSelector ([e77f87c8](https://github.com/jquery/jquery/commit/e77f87c89ea78ffa086d0cf2778cdab652507e55))
- Decode invalid escape code points to U+FFFD (#5845) ([7e1efd77](https://github.com/jquery/jquery/commit/7e1efd77598a527c67d2a674a1259787f7e441fd))
- Optimize jQuery.uniqueSort duplicate removal ([35789e76](https://github.com/jquery/jquery/commit/35789e7687d31512072098ce0d826079904938d2))
- Be more strict in quick selection paths ([a104324d](https://github.com/jquery/jquery/commit/a104324d7a9808250bed64e59ecafaaff8de35e4))
- Fix ReDoS in identifier matching ([d41cf7dd](https://github.com/jquery/jquery/commit/d41cf7ddbdd1c48a0a4c577026f83731c451073e))
- Use loose document comparisons everywhere ([74439453](https://github.com/jquery/jquery/commit/74439453991ba9b8f9114a3d4735891e94330135))

## Serialize

- Support form-associated custom elements ([#5245](https://github.com/jquery/jquery/issues/5245), [680c320c](https://github.com/jquery/jquery/commit/680c320c69cba9de68658186f2a6d96ea090b2dc))

## Tests

- Expect reliableTrDimensions to fail in Chrome ([feaa9fcd](https://github.com/jquery/jquery/commit/feaa9fcdb68cdeadf013d97d8fd40848d4618578))
- Make the "jQuery.parseXML - error reporting" test less strict ([5ed303d0](https://github.com/jquery/jquery/commit/5ed303d01568dfad361c4de086d28e04ba0147f5))
- Accept old & new :enabled/:disabled option/optgroup semantics ([99f32901](https://github.com/jquery/jquery/commit/99f32901972d931653927d85ba409f55e8bf1f68))
- Add tests for `jQuery.text` ([3818952f](https://github.com/jquery/jquery/commit/3818952f7aa521fb52eda1f3fbb3a8de6e1fadf5))
- Add unit tests for callback-only animation signatures ([#1738](https://github.com/jquery/jquery/issues/1738), [ac837496](https://github.com/jquery/jquery/commit/ac837496ec136ad120fbbad89d2beb8e2610ad31))
- Re-enable the AJAX binary data tests in IE ([882be391](https://github.com/jquery/jquery/commit/882be3911e410754f0bfdd44ab695dacfc2950d3))
- Add jQuery.ajaxPrefilter & jQuery.ajaxTransport tests ([0872b898](https://github.com/jquery/jquery/commit/0872b898375bd2d2d1761161786706c6e46d14fa))
- Add tests for `.data()` on SVG elements ([d1ff507a](https://github.com/jquery/jquery/commit/d1ff507a6ad9ec99e10f88f1e57cb2ebe49990ec))
- Increase test coverage of the serialize module ([d97d76f1](https://github.com/jquery/jquery/commit/d97d76f10ad2a96ba3f405e825b51bcd99c1d855))
