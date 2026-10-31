# Production quality performance summary

The build is 65.1% smaller. Non-demo routes download 10.4% less JavaScript body data. These samples show no clear overall CPU or LCP gain. Timing changes are small and mixed, and most observed ranges overlap. Desktop demo LCP increased from 344 to 396 ms. Mobile LCP remains near 1.7 seconds, and CLS medians are unchanged.

## Method and limits

Chromium 154.0.8037.57. Each build has three serial cold navigations for each of four routes at 1440 × 900 and 375 × 900, or 24 samples per build. Each navigation uses a fresh browser context, disabled HTTP cache, and blocked service workers. CPU slowdown is 4× for both profiles. Desktop networking is unthrottled. Mobile networking uses 150 ms latency, 1.6 Mbps download, and 750 Kbps upload. These are viewport and network lab profiles, not measurements from physical mobile devices.

Motion stays enabled for timing samples. Observers start before navigation and collect through five seconds after the load event. TaskDuration is the CDP TaskDuration delta over that full interval. CLS uses the largest session window. Screenshots use reduced motion, wait for document.fonts.ready, scroll the page, and verify that footer canvas ink has painted before returning to the top.

Values below are median [minimum, maximum] across three samples unless stated otherwise. Three local samples cannot establish field performance or statistical significance. INP is unavailable because there are no field interaction measurements. No Lighthouse score or field Core Web Vitals result is inferred.

## Build inventory

| Measure | Before | After |
| --- | ---: | ---: |
| Files | 87 | 55 |
| Total bytes | 6,083,707 | 2,121,367 |
| JavaScript files | 1 | 2 |
| Combined JavaScript bytes | 427,564 | 429,587 |
| Combined JavaScript offline gzip bytes | 129,355 | 130,709 |
| Source maps | 0 | 0 |
| Archives | 1 | 0 |

The gzip values sum an offline gzip of every .js file. They are estimates, not observed HTTP compression. Combined JavaScript grew slightly after splitting the demo into a separate chunk. The smaller initial bundle benefits the three routes that do not load the demo.

## LCP, main thread time, and layout shifts

| Profile | Route | LCP before ms | LCP after ms | TaskDuration before ms | TaskDuration after ms | CLS before | CLS after |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| desktop | / | 364 [268, 444] | 336 [284, 372] | 5275 [5266, 5339] | 5218 [5177, 5238] | 0.000055 [0, 0.000055] | 0.000055 [0.000055, 0.000055] |
| desktop | /demo | 344 [320, 392] | 396 [396, 484] | 1516 [1507, 1597] | 1547 [1546, 1732] | 0 [0, 0] | 0 [0, 0] |
| desktop | /about | 312 [300, 400] | 276 [276, 360] | 1596 [1533, 1643] | 1579 [1420, 1645] | 0 [0, 0] | 0 [0, 0] |
| desktop | /partners | 280 [152, 300] | 276 [276, 368] | 1481 [1381, 1783] | 1536 [1450, 1635] | 0 [0, 0] | 0 [0, 0] |
| mobile | / | 1676 [1676, 1708] | 1708 [1704, 1764] | 5705 [5647, 5929] | 5792 [5576, 5936] | 0.000304 [0.000304, 0.000304] | 0.000304 [0.000304, 0.000304] |
| mobile | /demo | 1732 [1728, 1740] | 1752 [1692, 1752] | 1147 [1142, 1182] | 1135 [1111, 1218] | 0.000038 [0.000038, 0.000038] | 0.000038 [0.000038, 0.000038] |
| mobile | /about | 1720 [1716, 1736] | 1720 [1716, 1748] | 1214 [1121, 1320] | 1198 [1138, 1223] | 0.000324 [0.000324, 0.000324] | 0.000324 [0.000324, 0.000324] |
| mobile | /partners | 1700 [1688, 1712] | 1696 [1684, 1720] | 1121 [1102, 1252] | 1126 [1079, 1440] | 0.012345 [0.012345, 0.012345] | 0.012345 [0.012345, 0.012345] |

The homepage still spends about 5.2 seconds on desktop and 5.8 seconds on mobile in CDP main thread tasks over the observation interval. The desktop homepage TaskDuration reduction is small, while mobile homepage TaskDuration increases. This does not support a general CPU improvement claim.

## Long tasks

| Profile | Route | Count before | Count after | Total duration before ms | Total duration after ms |
| --- | --- | ---: | ---: | ---: | ---: |
| desktop | / | 6 [4, 7] | 4 [4, 5] | 584 [452, 596] | 411 [391, 422] |
| desktop | /demo | 6 [6, 8] | 8 [6, 8] | 949 [928, 1096] | 1057 [939, 1140] |
| desktop | /about | 6 [6, 8] | 6 [6, 8] | 976 [889, 1158] | 992 [864, 1043] |
| desktop | /partners | 8 [6, 8] | 7 [6, 8] | 1104 [852, 1197] | 944 [880, 1147] |
| mobile | / | 4 [4, 4] | 4 [4, 4] | 374 [370, 447] | 373 [359, 390] |
| mobile | /demo | 4 [4, 4] | 4 [4, 5] | 440 [417, 446] | 414 [354, 431] |
| mobile | /about | 4 [4, 5] | 4 [4, 4] | 466 [380, 556] | 456 [453, 476] |
| mobile | /partners | 4 [4, 4] | 4 [4, 5] | 447 [418, 488] | 431 [414, 598] |

## Network requests and bytes

All request and byte values in this table are identical across the three samples, so their minimum, median, and maximum are equal. Wire bytes come from CDP loadingFinished and include the document, scripts, styles, fonts, images, and response overhead. JavaScript body bytes come from Resource Timing encodedBodySize and exclude response overhead.

| Profile | Route | Requests before | Requests after | Wire bytes before | Wire bytes after | JS body bytes before | JS body bytes after |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| desktop | / | 11 | 11 | 875,934 | 831,421 | 427,564 | 382,980 |
| desktop | /demo | 12 | 13 | 888,151 | 890,572 | 427,564 | 429,587 |
| desktop | /about | 12 | 12 | 875,622 | 831,108 | 427,564 | 382,980 |
| desktop | /partners | 11 | 11 | 874,411 | 829,896 | 427,564 | 382,980 |
| mobile | / | 11 | 11 | 875,934 | 831,421 | 427,564 | 382,980 |
| mobile | /demo | 12 | 13 | 888,151 | 890,572 | 427,564 | 429,587 |
| mobile | /about | 12 | 12 | 875,622 | 831,108 | 427,564 | 382,980 |
| mobile | /partners | 11 | 11 | 874,411 | 829,896 | 427,564 | 382,980 |

The non-demo routes transfer about 44.5 KB less per cold navigation. Demo adds one chunk request and 2,421 wire bytes. Each JavaScript resource adds 300 bytes in Resource Timing transferSize above its encoded body size: the initial bundle transfer is 427,864 before and 383,280 after; demo transfers 430,187 across two chunks after. Full resource body/transfer totals and navigation timings are recorded in the linked JSON.

## Coverage and validation

| Check | Before | After |
| --- | ---: | ---: |
| Cold navigation samples | 24 | 24 |
| Measurement errors | 0 | 0 |
| Metric page/console/request/HTTP errors | 0 | 0 |
| Route/width captures | 28 | 28 |
| Screenshot states | 49 | 49 |
| Capture errors | 0 | 0 |
| Capture page/console/request/HTTP errors | 0 | 0 |
| States with horizontal overflow | 0 | 0 |
| Unsuppressed axe scans | 49 | 49 |
| Axe violations across scans | 7 | 0 |

Each capture set has 49 PNG files at 320, 375, 390, 430, 768, 1024, and 1440 px: four initial routes plus contact dialog, drawn rectangle, and extruded solid states. The seven baseline axe violations are the same missing role on the labelled sketch SVG group, repeated at each width. The final build has zero automated axe violations across all 49 checks. Axe incomplete results remain recorded for review; no rules or findings were suppressed.

## Raw results and reproduction

- [Before performance samples](before/performance.json)
- [After performance samples](after/performance.json)
- [Before/after medians, ranges, and individual values](after/comparison.json)
- [Before build inventory](before/build.json) and [after build inventory](after/build.json)
- [Before responsive diagnostics](before/responsive.json) and [after responsive diagnostics](after/responsive.json)
- [Before accessibility results](before/accessibility.json) and [after accessibility results](after/accessibility.json)

Run from the repository root after starting the matching production server. Use AUDIT_DIST to select a frozen build when its path differs. Run metrics while other browser tests and builds are idle.

```sh
AUDIT_ORIGIN=http://127.0.0.1:4351 AUDIT_LABEL=before AUDIT_PHASE=capture node scripts/audit-production-quality.mjs
AUDIT_ORIGIN=http://127.0.0.1:4351 AUDIT_LABEL=before AUDIT_PHASE=metrics node scripts/audit-production-quality.mjs
AUDIT_ORIGIN=http://127.0.0.1:4173 AUDIT_LABEL=after AUDIT_PHASE=capture node scripts/audit-production-quality.mjs
AUDIT_ORIGIN=http://127.0.0.1:4173 AUDIT_LABEL=after AUDIT_PHASE=metrics node scripts/audit-production-quality.mjs
```
