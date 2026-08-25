# Atmos — London Weather

A polished, dependency-free weather dashboard for London, UK. It gets live forecast data from the [Open-Meteo Forecast API](https://open-meteo.com/) and is designed to run as a static site.

## Run locally

No build step, package manager, or local server is required. Open `index.html` directly in a modern browser. The page fetches the Open-Meteo API over HTTPS.

## Publish with GitHub Pages

1. Push this repository's `main` branch to GitHub.
2. Open the repository **Settings** and choose **Pages** from the sidebar.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Select the `main` branch and the `/(root)` folder, then click **Save**.
5. Once GitHub finishes deployment, open the URL shown on the Pages settings screen.

The app is plain HTML, CSS, and JavaScript, so it works directly from the repository root on GitHub Pages.
