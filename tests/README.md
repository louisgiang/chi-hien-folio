# Hover regression checks

Run `npm run dev`, then open `/tests/hover-regression.html`. The page drives the
real Sports room in an iframe and reports PASS/FAIL. It checks mouse entry/exit,
all directed pairs of objects, rapid reversals, stable hit areas, popups, touch,
and zero-duration transitions. All three objects must interpolate their transform
and never display their enlarged full-frame image. Opacity is
sampled on animation frames to catch brightness discontinuities. Keep the tab
foreground while running. The zero-duration check injects the rule used by the
stylesheet's reduced-motion media query; it does not emulate an OS preference.

To test a production build, run `npm run build`, copy `tests/hover-regression.html`
to `dist/hover-regression.html`, run `npm run preview`, and open
`/hover-regression.html`. Do not include this test page in a deployment.

The touch and zero-duration checks simulate input/styles within the iframe;
they do not replace testing on physical touch devices. Visual smoothness still
depends on the browser, GPU, and display refresh rate.
