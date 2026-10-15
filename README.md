# HK Next Train

A mobile-first web app showing live MTR train arrival times, built on the
official [data.gov.hk Next Train API](https://data.gov.hk/en-data/dataset/mtr-data2-nexttrain-data)
(`rt.data.gov.hk/v1/transport/mtr/getSchedule.php`). Pure static files —
no build step, no dependencies — ready to serve from GitHub Pages.

It opens on **Airport Express (AEL) from Tsing Yi (TSY) towards Hong Kong (HOK)**,
and any other line/station/direction can be picked from the controls.

## Features

- All 10 heavy-rail lines and every station code from the official
  [Next Train API data dictionary](https://opendata.mtr.com.hk/doc/Next_Train_DataDictionary_v1.7.pdf)
- Direction tabs with live destination labels (e.g. *To Hong Kong*), including
  EAL extras: *via Racecourse* and arrival/departure indicators
- Ticking `m:ss` countdowns that stay accurate against the server clock
  (handles device clock skew and non-HK timezones)
- Auto-refresh every minute, paused while the tab is hidden; manual refresh button
- Delay and special-service-arrangement banners straight from the API
- Shareable URLs via the hash, e.g. `#AEL/TSY/DOWN`, plus localStorage memory
  of your last view
- Installable PWA (manifest + icons), dark/light themes, safe-area aware

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

A static server is preferred over opening `index.html` directly so the
manifest and hash URLs behave; the API itself is fetched over HTTPS with
`Access-Control-Allow-Origin: *`, so it works from any origin.

## Deploy to GitHub Pages

```sh
git init
git add .
git commit -m "HK Next Train app"
gh repo create hkmtr --public --source=. --push   # or create + push any way you like
```

Then on GitHub: **Settings → Pages → Build and deployment → Source: Deploy from
a branch → `main` / `/ (root)`**. The site appears at
`https://<user>.github.io/hkmtr/`.

(If you place the files under a subfolder or use Jekyll, keep the included
`.nojekyll` file.)

## Project layout

| File | Purpose |
| --- | --- |
| `index.html` | Page shell |
| `style.css` | Mobile-first dark/light UI |
| `app.js` | Station data, API client, rendering, countdowns |
| `manifest.webmanifest`, `icons/`, `favicon.svg` | PWA assets |
| `tools/make_icons.py` | Regenerates the PNG icons (stdlib only) |

## Data source & disclaimer

Data: MTR Corporation via [data.gov.hk](https://data.gov.hk/en-data/dataset/mtr-data2-nexttrain-data).
This is an unofficial project with no affiliation to MTR Corporation; times are
estimates and are provided without warranty.
