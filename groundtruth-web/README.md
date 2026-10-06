# GroundTruth -- static frontend

A static HTML/CSS/vanilla-JS site for the civic reporting project
(design system: Barlow Condensed + Inter, hazard-amber accent,
municipal/survey-grid visual language). Built to be pushed straight
to a GitHub repo and served with GitHub Pages -- no build step.

## Pages

- `index.html` -- landing page (hero, how it works, sample live feed, categories)
- `login.html` / `register.html` -- real auth forms, wired to the Django API
- `dashboard.html` -- logged-in view; loads the current user, areas and
  categories live from the API. The "Your reports" panel is a placeholder
  until the Report model/endpoints exist on the backend.

## Connecting it to your Django backend

Edit the one line at the top of `js/api.js`:

    const API_BASE = "http://127.0.0.1:8000/api";

Change it to wherever you deploy the `civic_reporter` Django project
from the previous step (GitHub Pages can't host Django itself --
you'll need something like Railway, Render, PythonAnywhere, or a VPS
for that part). You'll also need `django-cors-headers` installed and
configured on the backend so the browser is allowed to call it from
your `github.io` domain:

    pip install django-cors-headers
    # settings.py: add "corsheaders" to INSTALLED_APPS,
    # "corsheaders.middleware.CorsMiddleware" near the top of MIDDLEWARE,
    # and CORS_ALLOWED_ORIGINS = ["https://<you>.github.io"]

## Publishing on GitHub Pages

1. Push this folder's contents to the root of a GitHub repo (or to a
   `docs/` folder, or a `gh-pages` branch -- your choice).
2. Repo Settings -> Pages -> set the source to that location.
3. Your site is live at `https://<username>.github.io/<repo>/`.

## Notes

- Tokens are stored in `localStorage` (`gt_access_token` /
  `gt_refresh_token`) for simplicity. Fine for a student project;
  for production you'd want httpOnly cookies instead.
- Fonts load from Google Fonts via CDN -- works fine once deployed;
  just needs an internet connection (expected for any real visitor).
