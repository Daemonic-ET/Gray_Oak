# Gray Oak Advisory — Website Starter & Setup Guide

This folder contains a working starter homepage for grayoakadvisory.com: dark
slate + gold brand palette (Gray Oak, Slate, Deep Green, Steel Blue, Warm Taupe,
Gold Leaf), Playfair Display for headings/accents, Inter for body text — this is
the direction you confirmed.

**All five main pages are built.** The homepage (`index.html`), About
(`about.html`), Services (`services.html`), Who We Help (`who-we-help.html`),
and Insights (`insights.html`) are all built and linked together — the nav
and footer Quick Links on every page point to each dedicated page. Contact
isn't a separate page — it's the footer, which appears at the bottom of
every page and the nav's Contact button scrolls to it.

You do not need to know how to code to use this guide. Every step below is a
click, a typed command, or copy/paste.

---

## What's in this folder

```
gray-oak-site/
├── index.html         ← the homepage
├── about.html         ← the About page
├── services.html      ← the Services page
├── who-we-help.html   ← the Who We Help page
├── insights.html      ← the Insights page
├── page-template.html  ← blank starting point for the next new page
├── css/
│   ├── style.css     ← layout/structure
│   └── theme.css      ← brand colors + fonts (Playfair Display + Inter)
├── js/
│   └── main.js         ← mobile menu button + the scroll-grown tree effect
└── assets/
    ├── logo.png          ← header logo, cropped from your mockup (placeholder — see note below)
    ├── footer-logo.jpg    ← footer logo (the dark/glowing tree lockup, flattened onto the footer's charcoal color)
    └── hero-bg.jpg        ← the tree-ring texture behind the hero headline
```

> **Note on the header logo:** `assets/logo.png` was cropped directly out of a
> mockup screenshot so the header has *something* right now. It has a faint
> off-white background instead of true transparency. Ask whoever designed the
> brand board for the actual logo file (ideally `.svg` or a transparent
> `.png`) and drop it in under the same filename to instantly upgrade the
> header.
>
> The **footer** (`assets/footer-logo.jpg`) uses the real designer logo — the
> dark, glowing tree lockup, which came with a true transparent background —
> flattened onto the footer's own charcoal color (`#202020`, set as
> `--color-bg-footer` in `css/theme.css`) so it sits directly on the footer
> with no box or halo around it. No placeholder there.

---

## Part 1 — See it on your own computer (no install needed yet)

Before touching VS Code or GitHub, just double-click `index.html` — it will
open directly in your browser. That's the fastest way to look at it right now.

---

## Part 2 — Install the tools

You only need to do this once, ever.

1. **Install VS Code** (the editor): go to https://code.visualstudio.com/, click
   Download, run the installer with default options.
2. **Install Git** (the tool that talks to GitHub): go to https://git-scm.com/downloads,
   download for your operating system, run the installer with default options
   (clicking "Next" through everything is fine).
3. **Create a GitHub account** if you don't have one: https://github.com/signup.
4. **Create a Render account**: https://render.com/ — sign up, and choose "Sign up
   with GitHub" so the two are linked from the start.

---

## Part 3 — Open the project in VS Code

1. Open VS Code.
2. Go to **File → Open Folder…** and select this `gray-oak-site` folder.
3. In the Extensions panel (the four-square icon on the left sidebar), search for
   **"Live Server"** by Ritwick Dey and click Install. This lets you preview the
   site with auto-refresh as you (or I) edit it.
4. Right-click `index.html` in the file list and choose **"Open with Live
   Server"** — it opens in your browser and refreshes automatically every time a
   file is saved.

---

## Part 4 — Put it on GitHub

1. In GitHub, click the **+** icon top-right → **New repository**. Name it
   something like `gray-oak-website`. Leave it Public or Private (either works
   with Render). Do **not** check "Add a README" — this folder already has one.
   Click **Create repository**.
2. Back in VS Code, open the built-in terminal: **Terminal → New Terminal**.
3. Type these commands one at a time, pressing Enter after each (replace the
   URL in the fourth line with the one GitHub shows you on the page after step 1
   — it will look like `https://github.com/yourname/gray-oak-website.git`):

   ```
   git init
   git add .
   git commit -m "Initial homepage draft"
   git branch -M main
   git remote add origin https://github.com/yourname/gray-oak-website.git
   git push -u origin main
   ```

4. Refresh the GitHub page — your files should now be there.

If Git asks you to sign in the first time, it will open a browser window to
authenticate with GitHub — just approve it there.

---

## Part 5 — Put it live on the internet with Render

1. In Render, click **New +** → **Static Site**.
2. Connect your GitHub account if prompted, then select the `gray-oak-website`
   repository.
3. Fill in the settings:
   - **Build Command:** leave blank (there's nothing to build — it's plain
     HTML/CSS/JS).
   - **Publish Directory:** `.` (a single period, meaning "the root of the repo").
4. Click **Create Static Site**. Render will give you a free URL like
   `gray-oak-website.onrender.com` within a minute or two, and it will load
   `index.html` automatically.
5. Once you're happy and ready to use the real domain: in Render, go to the
   site's **Settings → Custom Domains** and follow the instructions to point
   `www.grayoakadvisory.com` at it (this updates DNS records wherever the domain
   is registered).

From now on, **every time you push new changes to GitHub, Render automatically
redeploys the live site within a minute or two** — you never have to manually
upload anything again.

---

## Making changes going forward

For any future change — new copy, a new page, swapping in real logos and
photos, adjusting colors — the easiest workflow with no coding experience is:

1. Tell me (Claude) what you want changed, in plain language.
2. I'll edit the actual files for you.
3. In VS Code, open the Source Control panel (the icon with the branching lines)
   — it will show the files that changed. Type a short message like "update
   hero text" and click the checkmark/**Commit**, then click **Sync Changes**
   (or run `git add .`, `git commit -m "..."`, `git push` in the terminal, same
   as above).
4. Render redeploys automatically — refresh the live URL after a minute.

---

## The hero background

The dark hero at the top uses your real tree-ring texture image
(`assets/hero-bg.jpg`) with a slate-colored gradient laid over it (defined as
`--hero-bg-overlay` in `css/theme.css`) so the white headline stays readable no
matter where the text lands on the pattern. To swap in a different background
image later, just replace `assets/hero-bg.jpg` with a new file of the same
name (or update the filename in the `--hero-bg-image` line in `css/theme.css`).

## Adding a new page

`page-template.html` is a blank starting point with the header, a shorter
"interior page" hero, the footer, and two ready-made content sections (a
heading + text block, and a grid of short cards) all wired up — comments in
the file mark exactly what to edit. `about.html`, `services.html`,
`who-we-help.html`, and `insights.html` were all built from this same
template, so any of them is a working example to copy from too.

To build another page:

1. In VS Code, right-click `page-template.html` → **Copy**, then paste and
   rename it (e.g. `careers.html`).
2. Fill in the title, hero text, and content sections for that page — swap in
   real paragraphs, or a `.cards-grid` of short cards, or both.
3. Add the new page's link to the header nav and footer Quick Links on every
   *other* page (or just tell me the page's name and I'll wire up the
   navigation across the whole site in one pass).

## What's still placeholder / next steps

- The "Featured Insights" cards are empty boxes with generic titles — swap in
  real article titles, images, and links once you have content, or tell me what
  they should say and I'll fill them in.
- The four icon-strip labels (Trusted Advisors, Mission Focused, Built for
  Durability, Outcome Driven) are pulled straight from the brand board — replace
  if you want different language.
- The Services, Who We Help, and Insights pages currently use the same
  generic filler text and empty content boxes as About — swap in real copy
  and content whenever it's ready, the same way About's real content would
  be filled in.
- The contact form mentioned in the site questionnaire isn't wired up yet —
  Render's static hosting doesn't run backend code, so the simplest no-code
  option is a free form service like Formspree (https://formspree.io) plugged
  into a `<form>` tag — I can wire this in when you're ready.
