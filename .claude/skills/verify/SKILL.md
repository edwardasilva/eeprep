---
name: verify
description: Build, serve, and drive the eeprep site in a headless browser to check a change at runtime, with screenshots in both themes at desktop and phone widths. Use after a content, figure, sidebar, or redirect change, before opening or updating a pull request.
---

# Verify the eeprep site at runtime

The recipe that worked in a cloud session on 9 November 2026.

## Build and serve

```bash
npm ci --ignore-scripts
npm run build
node node_modules/astro/bin/astro.mjs preview --port 4399 --ignore-lock &
```

`--ignore-lock` keeps the preview in the foreground of its own shell, which is what lets you stop it later with `pkill -f "astro.mjs preview --port 4399"`.

## Probe redirects and static files with curl

Redirects are HTML stubs, so look for the refresh tag, not a 3xx:

```bash
curl -s http://localhost:4399/about/ | grep -o 'http-equiv="refresh"[^>]*'
curl -s http://localhost:4399/skills/eeprep-resume/SKILL.md | head -5
```

## Screenshots

Playwright is a devDependency, so run the script from the repo root. The pre-installed Chromium is at `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`. If the repo's Playwright wants a newer build, alias it:

```bash
ln -sfn /opt/pw-browsers/chromium-1243 /opt/pw-browsers/chromium-<wanted>
ln -sfn /opt/pw-browsers/chromium_headless_shell-1243 /opt/pw-browsers/chromium_headless_shell-<wanted>
```

Launch with `chromium.launch({ executablePath, args: ['--no-sandbox'] })`, make one context per shot with `viewport` 1280x900 or 390x844 and `colorScheme`, and after `page.goto` set the theme with `document.documentElement.setAttribute('data-theme', 'light' | 'dark')`, because Starlight reads that attribute, not the media query alone. Screenshot a figure with `page.locator('#fig-4-7').screenshot()`.

Collect `pageerror` and console errors per page. The main sidebar is `nav[aria-label="Main"]`, and it is hidden at desktop width on some pages, so do not screenshot it by selector.

## The mobile audit

`npm run check:mobile` needs the Chromium alias above and `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`. It takes about two minutes for 29 pages.

## Worth looking at after a figure change

Every line in a figure must end on a box or a dot at both ends, at both widths. A join drawn with margins inside a grid gap floats, so give it the gap's full height or set the gap to zero in that direction.
