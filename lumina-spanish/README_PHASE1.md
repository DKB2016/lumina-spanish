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

## Vocabulary mastery upgrade (review confidence)

- Topical flashcards now have four responses: **Didn't know**, **Guessed**, **Barely knew**, **Knew it well**.
- The same Spanish word is tracked across topical decks and lesson vocabulary review using its normalized Spanish spelling.
- The Home, Progress, and top navigation show a conservative **mastered words** count.
- A word becomes mastered after at least **three consecutive high-confidence reviews across at least two calendar days**. A lower-confidence response resets its streak.
- High-confidence words get increasingly long review intervals (7, 13, 23, 41, 73, then 90 days); low-confidence words are prioritized for earlier review (immediately, 1 day, or 3 days).
- Previously mastered words are omitted from routine deck sessions until due. When every word is mastered and not due, opening the deck still allows voluntary full practice.
- Deck completion still summarizes the current session and offers a targeted **Review weaker words** action.
- This is a lightweight confidence scheduler, not yet a complete FSRS implementation. Existing historical binary deck ratings are preserved, but not automatically promoted to mastery without fresh confidence evidence.

### Additional acceptance checks

1. Complete a deck with mixed confidence ratings; verify results and weaker-word review.
2. Review the same word from two different decks; verify one shared mastery count, not duplicates.
3. Mark a word **Knew it well** three times on one day: it must **not** be mastered yet.
4. Repeat a high-confidence review on another day; verify mastery can increase.
5. Rate a mastered word **Didn't know** when it is next due; verify it is demoted.
6. Reload the app and confirm counts and confidence history persist.
7. Confirm completed story vocabulary review also updates shared word knowledge.
8. Run `npm run build` before merging.

## Topic folders and expanded decks

- The flashcard library now contains **11 topic folders**, each with **2 decks**, for **22 decks total**.
- Each deck contains **at least 25 cards** (550 card entries across the library). Original deck IDs are retained and padded with relevant vocabulary; 11 new 25-card decks have been added.
- Folder view shows **completed decks / total decks** and a progress bar.
- Inside each folder, deck cards show completion state, last session's high-confidence percentage, and number of words practiced.
- A deck is marked completed after its session reaches the final card, regardless of confidence; this is deliberately separate from word mastery. Completion is saved in `deckCompletions` in browser localStorage.
- Confidence-based scheduling continues to prioritize weak vocabulary; a repeat session may contain fewer than 25 due cards even though the deck's catalog contains 25+.
- Existing user progress remains in place. Previously completed deck sessions from before this feature are not backfilled as folder completions.

### Folder acceptance checks

1. Confirm 11 folders and two decks per folder, with at least 25 catalog cards each.
2. Finish one deck and return to the folder: verify **1 / 2 completed** and 50% progress.
3. Finish the other deck: verify **2 / 2 completed** and 100% progress.
4. Reload and verify completion remains; revisit a deck without resetting folder completion.
5. Verify a previously studied word retains confidence and mastery state.
6. Verify TTS matches the visible shuffled flashcard.
7. Run `npm run build` before merging.
