# ⚡ LegacyFix Report

**Repository:** `jquery/jquery`
**Generated:** 2026-05-02 14:37 UTC
**Total lines modernized:** 1322
**Files changed:** 101

## Changes

| File | Lines Changed | Modernization | Security Notes |
|------|--------------|---------------|----------------|
| `src/ajax.js` | 16 | ⚡ JS Modernize | — |
| `src/ajax/jsonp.js` | 7 | ⚡ JS Modernize | — |
| `src/ajax/load.js` | 2 | ⚡ JS Modernize | — |
| `src/ajax/script.js` | 2 | ⚡ JS Modernize | — |
| `src/ajax/xhr.js` | 6 | ⚡ JS Modernize | — |
| `src/attributes/attr.js` | 4 | ⚡ JS Modernize | — |
| `src/attributes/classes.js` | 7 | ⚡ JS Modernize | — |
| `src/attributes/prop.js` | 7 | ⚡ JS Modernize | — |
| `src/attributes/val.js` | 6 | ⚡ JS Modernize | — |
| `src/callbacks.js` | 12 | ⚡ JS Modernize | — |
| `src/core.js` | 23 | ⚡ JS Modernize | Math.random() is not cryptographically secure |
| `src/core/DOMEval.js` | 2 | ⚡ JS Modernize | — |
| `src/core/access.js` | 1 | ⚡ JS Modernize | — |
| `src/core/camelCase.js` | 1 | ⚡ JS Modernize | — |
| `src/core/init.js` | 2 | ⚡ JS Modernize | — |
| `src/core/isArrayLike.js` | 1 | ⚡ JS Modernize | — |
| `src/core/isAttached.js` | 1 | ⚡ JS Modernize | — |
| `src/core/parseHTML.js` | 1 | ⚡ JS Modernize | — |
| `src/core/parseXML.js` | 1 | ⚡ JS Modernize | — |
| `src/core/ready-no-deferred.js` | 2 | ⚡ JS Modernize | — |
| `src/core/ready.js` | 1 | ⚡ JS Modernize | — |
| `src/core/readyException.js` | 1 | ⚡ JS Modernize | — |
| `src/core/stripAndCollapse.js` | 1 | ⚡ JS Modernize | — |
| `src/css.js` | 10 | ⚡ JS Modernize | — |
| `src/css/adjustCSS.js` | 3 | ⚡ JS Modernize | — |
| `src/css/cssCamelCase.js` | 1 | ⚡ JS Modernize | — |
| `src/css/curCSS.js` | 1 | ⚡ JS Modernize | — |
| `src/css/finalPropName.js` | 2 | ⚡ JS Modernize | — |
| `src/css/isAutoPx.js` | 1 | ⚡ JS Modernize | — |
| `src/css/showHide.js` | 6 | ⚡ JS Modernize | — |
| `src/css/support.js` | 4 | ⚡ JS Modernize | — |
| `src/css/var/getStyles.js` | 1 | ⚡ JS Modernize | — |
| `src/css/var/swap.js` | 1 | ⚡ JS Modernize | — |
| `src/data.js` | 6 | ⚡ JS Modernize | — |
| `src/data/Data.js` | 4 | ⚡ JS Modernize | — |
| `src/deferred.js` | 23 | ⚡ JS Modernize | — |
| `src/deferred/exceptionHook.js` | 1 | ⚡ JS Modernize | — |
| `src/deprecated.js` | 2 | ⚡ JS Modernize | — |
| `src/dimensions.js` | 2 | ⚡ JS Modernize | — |
| `src/effects.js` | 35 | ⚡ JS Modernize | — |
| `src/effects/Tween.js` | 4 | ⚡ JS Modernize | — |
| `src/event.js` | 26 | ⚡ JS Modernize | — |
| `src/event/trigger.js` | 5 | ⚡ JS Modernize | — |
| `src/exports/amd.js` | 1 | ⚡ JS Modernize | — |
| `src/manipulation.js` | 19 | ⚡ JS Modernize | innerHTML assignment can lead to XSS |
| `src/manipulation/_evalUrl.js` | 1 | ⚡ JS Modernize | — |
| `src/manipulation/buildFragment.js` | 2 | ⚡ JS Modernize | innerHTML assignment can lead to XSS |
| `src/manipulation/domManip.js` | 2 | ⚡ JS Modernize | — |
| `src/manipulation/getAll.js` | 1 | ⚡ JS Modernize | — |
| `src/manipulation/setGlobalEval.js` | 1 | ⚡ JS Modernize | — |
| `src/offset.js` | 9 | ⚡ JS Modernize | — |
| `src/queue.js` | 11 | ⚡ JS Modernize | — |
| `src/queue/delay.js` | 2 | ⚡ JS Modernize | — |
| `src/selector-native.js` | 2 | ⚡ JS Modernize | — |
| `src/selector.js` | 35 | ⚡ JS Modernize | Math.random() is not cryptographically secure |
| `src/selector/createCache.js` | 1 | ⚡ JS Modernize | — |
| `src/selector/escapeSelector.js` | 1 | ⚡ JS Modernize | — |
| `src/selector/preFilter.js` | 1 | ⚡ JS Modernize | — |
| `src/selector/toSelector.js` | 1 | ⚡ JS Modernize | — |
| `src/selector/tokenize.js` | 2 | ⚡ JS Modernize | — |
| `src/selector/unescapeSelector.js` | 2 | ⚡ JS Modernize | — |
| `src/selector/uniqueSort.js` | 4 | ⚡ JS Modernize | — |
| `src/serialize.js` | 11 | ⚡ JS Modernize | — |
| `src/traversing.js` | 7 | ⚡ JS Modernize | — |
| `src/traversing/findFilter.js` | 3 | ⚡ JS Modernize | — |
| `src/traversing/var/dir.js` | 1 | ⚡ JS Modernize | — |
| `src/traversing/var/siblings.js` | 1 | ⚡ JS Modernize | — |
| `src/wrap.js` | 7 | ⚡ JS Modernize | — |
| `src/wrapper-esm.js` | 1 | ⚡ JS Modernize | — |
| `src/wrapper-factory.js` | 2 | ⚡ JS Modernize | — |
| `src/wrapper.js` | 2 | ⚡ JS Modernize | — |
| `test/data/core/jquery-iterability-transpiled-es6.js` | 5 | ⚡ JS Modernize | — |
| `test/data/csp-ajax-script.js` | 3 | ⚡ JS Modernize | — |
| `test/data/csp-nonce-external.js` | 1 | ⚡ JS Modernize | — |
| `test/data/csp-nonce-globaleval.js` | 1 | ⚡ JS Modernize | — |
| `test/data/csp-nonce.js` | 2 | ⚡ JS Modernize | innerHTML assignment can lead to XSS |
| `test/data/iframeTest.js` | 2 | ⚡ JS Modernize | — |
| `test/data/support/csp.js` | 1 | ⚡ JS Modernize | — |
| `test/data/support/getComputedSupport.js` | 1 | ⚡ JS Modernize | — |
| `test/data/testinit.js` | 33 | ⚡ JS Modernize | Math.random() is not cryptographically secure; document.write() is deprecated and can cause XSS |
| `test/data/testrunner.js` | 9 | ⚡ JS Modernize | — |
| `test/integration/data/gh-1764-fullscreen.js` | 2 | ⚡ JS Modernize | — |
| `test/jquery.js` | 3 | ⚡ JS Modernize | eval() is dangerous — XSS and code injection risk; document.write() is deprecated and can cause XSS |
| `test/unit/animation.js` | 14 | ⚡ JS Modernize | — |
| `test/unit/attributes.js` | 62 | ⚡ JS Modernize | — |
| `test/unit/basic.js` | 17 | ⚡ JS Modernize | — |
| `test/unit/callbacks.js` | 29 | ⚡ JS Modernize | — |
| `test/unit/core.js` | 69 | ⚡ JS Modernize | eval() is dangerous — XSS and code injection risk |
| `test/unit/css.js` | 86 | ⚡ JS Modernize | innerHTML assignment can lead to XSS; innerHTML assignment can lead to XSS |
| `test/unit/data.js` | 38 | ⚡ JS Modernize | — |
| `test/unit/deferred.js` | 114 | ⚡ JS Modernize | — |
| `test/unit/deprecated.js` | 17 | ⚡ JS Modernize | — |
| `test/unit/dimensions.js` | 14 | ⚡ JS Modernize | — |
| `test/unit/effects.js` | 237 | ⚡ JS Modernize | innerHTML assignment can lead to XSS |
| `test/unit/offset.js` | 41 | ⚡ JS Modernize | — |
| `test/unit/queue.js` | 49 | ⚡ JS Modernize | — |
| `test/unit/ready.js` | 18 | ⚡ JS Modernize | — |
| `test/unit/serialize.js` | 7 | ⚡ JS Modernize | eval() is dangerous — XSS and code injection risk |
| `test/unit/support.js` | 8 | ⚡ JS Modernize | — |
| `test/unit/traversing.js` | 49 | ⚡ JS Modernize | — |
| `test/unit/tween.js` | 12 | ⚡ JS Modernize | — |

## What LegacyFix does

| Fix Type | Description |
|----------|-------------|
| 🐍 Python 2→3 | Converts print statements, exception syntax, dict methods, string formatting |
| ⚡ JS Modernize | Replaces `var` with `const`/`let`, converts callbacks to arrow functions |
| 🔒 Security | Flags MD5, SHA1, eval(), Math.random(), SQL injection patterns |

## Review Checklist

- [ ] Review each file diff before merging
- [ ] Run your test suite
- [ ] Check security flagged lines manually
- [ ] Merge when confident ✅

---
*Generated by LegacyFix — Replit's 10th Birthday Hackathon 🎂*
