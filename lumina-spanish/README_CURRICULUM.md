# Interactive A1 curriculum (work in progress)

This feature branch adds the first two units of a **new** A1 learning path, with eight complete lesson *flows*. The existing 30 story lessons and flashcard library remain available.

## Units
1. First Conversations: greetings, names, origins, polite requests.
2. People and Daily Life: family, likes, routines, neighborhood.

## Eight reusable activity stages
Discover phrase meaning and pronunciation → audio listening question → arrange Spanish sentence chunks → reading comprehension → guided dialogue → original writing → microphone speaking practice → real-life challenge.

All lesson data is stored in `src/curriculumData.js`, and the reusable activity renderer lives in `src/Curriculum.jsx`. Each lesson's completion and text responses are saved in the existing browser `lumina-progress` localStorage object under `curriculumProgress`. Audio is generated through the existing Piper server. Recorded microphone audio is kept only in the browser session and is not uploaded or persisted.

## Important current limitations
- This is a substantial **pilot**, not a completed full A1 curriculum. Six further A1 units, more lesson variations, and a calibrated unit assessment still need to be authored.
- The conversation, writing, and speaking stages are **practice, not automatically scored**. Microphone recordings can be played back but are not transcribed or graded.
- Learners can currently advance without answering all activities correctly. Completion reflects visiting the lesson's stages, not demonstrated CEFR proficiency.
- Listening and reading multiple-choice questions are intentionally introductory. Production quality requires unseen passages, plausible distractors, contextual feedback, and multiple forms.
- Browser localStorage is not cloud synchronization or a durable multi-device account.
- This branch has not yet been verified with a local Vite build.

## Acceptance checklist
1. `npm install` and `npm run build`.
2. Open **A1 Curriculum**, confirm two units with four lessons each.
3. Open each lesson and navigate all eight activity stages.
4. Check Spanish-only Piper audio in Discover and Listen.
5. Verify the sentence builder and reset, listening and reading feedback.
6. Type dialogue and writing responses; verify they are saved after completing the lesson.
7. Allow microphone permission, record, stop, and play back audio; test denial handling.
8. Complete a lesson, reload, and confirm its completion status persists.
9. Check phone-sized layout and regression-test existing Learn, Review, Decks, and Assessments tabs.
