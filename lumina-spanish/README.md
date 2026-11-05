# Lumina Spanish ✦

A self-hosted, mobile-friendly Spanish comprehensible-input learning app. React + Vite, no cloud account required.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A modern browser with Web Speech synthesis support

## Start locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Access from another device on your LAN

Vite is configured to listen on all interfaces (`--host 0.0.0.0`). Find your computer's LAN IP, for example `192.168.1.50`, and open:

`http://192.168.1.50:5173`

Allow TCP port 5173 through your host firewall if needed. Both devices must be on the same network, and your router must not isolate wireless clients. Do **not** port-forward the development server to the public internet.

## Build for production

```bash
npm run build
npm run preview
```

The static site is generated in `dist/`. For longer-term LAN hosting, serve `dist/` with nginx, Caddy, or another static web server. This is a frontend-only application.

## Included

- Six A1 stories with English translations and Mexican Spanish speech synthesis
- Tap-to-listen sentences, normal and slow story playback
- Comprehension questions and feedback
- XP, daily goals, streaks, achievements, lesson completion
- Vocabulary flashcards with a simple spaced-review scheduler
- Weekly activity chart, browser-local persistence, JSON export, reset
- Responsive desktop/mobile layout

## Important limitations

- **Progress is saved in the browser's localStorage.** It does not sync across browsers, devices, or private browsing sessions. Export backups from Settings.
- Audio uses the device/browser speech synthesis engine. `es-MX` is requested, but voice availability and quality depend on installed voices and browser support. Audio is not prerecorded.
- Review intervals are a lightweight MVP (1, 2, 4, 8... days up to 30); they are not an FSRS implementation.
- No AI-generated conversations, pronunciation scoring, backend, or authentication yet.
- Streaks reflect completed lessons, not review-only days.

## Extend it

- Add lessons in `src/data.js`, following the existing object format.
- For cross-device persistence, add a backend (e.g., FastAPI + PostgreSQL or SQLite) and accounts.
- For better audio, add licensed recorded clips or a self-hosted speech service.
- For more adaptive learning, add FSRS and a learner-specific vocabulary mastery model.
