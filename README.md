# HygieneCheck UK

A map-first UK restaurant hygiene discovery tool. It presents **published official Food Standards Agency (FSA) data** alongside clearly labelled HygieneCheck UK inspection-freshness classifications. It does not make food safety guarantees, infer that a business is unsafe, or create historical ratings.

## Architecture

- **React + TypeScript + Vite** user interface with responsive map/list selection synchronisation.
- `src/services/postcode.ts` encapsulates Postcodes.io postcode validation and geocoding.
- `src/services/fsa.ts` encapsulates FHRS API v2 calls and response transformation. UI components never make API calls directly; the service can be swapped for a serverless proxy later.
- `src/domain.ts` owns distances, inspection ages, classifications, summaries, filters, and sorting.
- Leaflet/OpenStreetMap renders the map and Recharts renders the rating distribution.

## Local setup

```bash
npm install
npm run dev
```

## Testing

```bash
npm run lint
npm test
npm run build
npm run e2e
```

Unit tests cover postcode handling, distance, inspection age/freshness, FSA transformation, median, and filter/sort behavior. Playwright is configured as the browser test runner for future end-to-end test expansion.

## APIs

- [Postcodes.io](https://postcodes.io/) for postcode validation and coordinates.
- [FSA FHRS API v2](https://api.ratings.food.gov.uk/help) with `x-api-version: 2` for official published establishment records.

## Deployment

GitHub Actions runs lint, unit tests, and the production build before publishing the generated `dist` artifact to GitHub Pages. Vite uses the repository base path in Actions. For a different repository, update `hygienecheck-uk` in `vite.config.ts`.

## Known limitations and future proxy

The FHRS browser API may be subject to CORS, availability, and rate limits. An application-owned serverless proxy should eventually cache responses, handle rate limiting, and expose the same typed `searchNearby` contract; no UI component changes should be needed. FSA coordinates and detailed score fields are not always published, and all summaries only represent the complete retrieved result set (or are marked partial if a page fails).
