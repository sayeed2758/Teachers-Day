# Teacher's Day Gift — Multi-Teacher Edition

One GitHub Pages website can serve all 10 teachers using personalized query links.

## Teacher links

Replace `YOUR-USERNAME.github.io/teachers-day-gift` with your actual GitHub Pages address:

- `?teacher=shahid` — Shahid Sir
- `?teacher=sakti` — Sakti Sir
- `?teacher=sameer` — Sameer Sir
- `?teacher=naila` — Naila Ma'am
- `?teacher=mitanjali` — Mitanjali Ma'am
- `?teacher=sanjeeda` — Sanjeeda Ma'am
- `?teacher=rupali` — Rupali Ma'am
- `?teacher=saraswati` — Saraswati Ma'am
- `?teacher=sumitra` — Sumitra Ma'am
- `?teacher=fatima` — Fatima Ma'am

Example:
`https://YOUR-USERNAME.github.io/teachers-day-gift/?teacher=shahid`

## How it works

- `assets/teachers.js` contains the 10 teacher profiles.
- `assets/app.js` reads the `teacher` URL parameter and replaces every teacher-name field.
- The classroom, animations, letter, report card, and school memories remain common.
- If a link has an unknown teacher key, the site safely falls back to Shahid Sir and shows a small warning.

## School memories

The memories section is intentionally common for all 10 teachers. Replace the four photo placeholders in `index.html`/CSS with your school memory images later.

## Music

Put the chosen MP3 at `assets/music.mp3`, then uncomment the `<source>` line in `index.html`.
