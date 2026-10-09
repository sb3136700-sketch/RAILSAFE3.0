# Train 2 + RailSafe 3.0 Integration

## Strategy

RailSafe 3.0 remains the primary application. The Train 2 user interface is embedded at `/travel-tools` in an isolated `src/train2/` subtree. The original `Train_2` repository and the `main` branches of both repositories are unchanged by this integration branch.

## Integrated journey tools

- Journey tracker, planner, and route timeline.
- Live train status card using RailRadar when configured.
- Coach position and interactive coach/berth map.
- PNR utilities and fare calculator.
- Station information and travel checklist.
- Nearby services, food guide, weather and luggage reminders.
- AI travel assistant, translation, destination alarms, and travel utilities.
- Ticket, food, and RailMadad/complaint links.
- Legacy travel UI kept in its module; its primary SOS action opens RailSafe's SOS workflow.

## Live train status

The UI calls `/api/trains/:trainNumber/live`. Both the Express server and the Netlify function route proxy the request to RailRadar on the server.

Set `RAILRADAR_API_KEY` as a server-side environment variable. `RAILRADAR_BASE_URL` can be `https://api.railradar.in` or `https://api.railradar.in/v1`; the backend normalises the value. Never put the API key into a Vite `VITE_*` variable.

The route uses a timeout, a short cache, error responses, and explicit unavailable/stale states. Provider coordinates are shown only when supplied by the provider or derived as explicitly labeled estimates.

## SMS configuration

MSG91 integration stays optional. SOS storage and manual SMS fallback must work before a provider is configured. Do not set placeholder MSG91 values or claim external delivery until a live provider call returns a verifiable status.

## Review and validation

This branch was created using GitHub repository operations. A local dependency install, type check, Vite production build, and interactive browser test have not been run by the GitHub connector. Review the diff and verify the build/preview before merging into the default branch.
