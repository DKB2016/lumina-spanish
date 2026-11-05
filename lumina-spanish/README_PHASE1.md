# Phase 1: Learning experience expansion

This feature branch adds the first learning-content upgrade to Lumina.

## What's included

- 24 additional A1 comprehensible-input stories, for **30 total**.
- Existing six story IDs and saved progress remain unchanged.
- A minimal illustrated scene above each story. The illustration is intentionally a lightweight inline SVG scene with a topic pictogram; it is not a generated photo or a detailed story-specific artwork.
- **11 topical visual flashcard decks** containing **102 curated card entries** (some words appear in more than one topic).
- Cards display a visual cue, Spanish word, English meaning, and a Piper audio button.
- Card responses are saved in the existing `lumina-progress` browser storage under `deckReviews`.

## Test locally

```powershell
git fetch origin
git switch feature/learning-content-and-visual-vocab
cd lumina-spanish
npm install
npm run build
npm run dev
```

Start the Piper TTS server separately as described in `README_OFFLINE_TTS.md`.

### Manual acceptance checks

1. Confirm **30 stories** in Learn and existing completed lessons remain completed.
2. Open a new story; confirm scene illustration, full-story audio, slow audio, and individual sentence audio.
3. Complete a new story; confirm comprehension answers, XP, and vocabulary review still work.
4. Open **Flashcard decks**, choose Food & shopping, flip cards, play audio, and rate a card.
5. Reload the page and verify saved progress and deck review metadata remain.
6. Test narrow-screen/mobile layout.
7. Confirm the original Piper audio feature still works.

## Scope boundaries

This is **Phase 1**, not the full 5,000-word corpus. Decks are curated A1 samples, not frequency-ranked. The scene graphics and card pictograms are lightweight placeholders pending a proper licensed or generated image-asset pipeline. The new topic-deck rating is recorded but does not yet have a spaced-repetition scheduler; story-derived Review retains its existing scheduling.

## Data conventions

- `src/data.js`: original six lessons and the aggregate export.
- `src/extraLessons.js`: 24 new lessons, using the existing lesson shape.
- `src/topicDecks.js`: standalone topic-based vocabulary decks with stable card IDs.
- `src/main.jsx`: deck browsing/studying and illustrated listening scenes.
- `src/style.css`: responsive layouts for new components.

Do not merge until `npm run build` and manual audio checks pass.
