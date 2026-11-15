# Test de frappe (Typing Test)

Measure your keyboard typing speed in words per minute, along with your accuracy, and track your progress game after game.

*Version française : [README.md](README.md)*

## How to play

1. Pick a mode: **timed** (15 s, 30 s, 60 s or 2 min) or **by words** (25 or 50 words).
2. Start typing: the timer starts at the first letter. Type the words shown, separated by **Space**.
3. Each correct letter shows normally, each mistake in red; a live line shows the time left (or the words typed), your speed and your accuracy.
4. **Tab** or **Escape** (or the **Restart** button) starts a new game with new words.

**Punctuation and capitals** adds commas, full stops and capital letters to the text, for a test closer to real writing.

Words are drawn at random from the two hundred most common words of the language.

## The result

At the end, a card sums up the game:

- **Speed**: correct words per minute (a word counts as 5 characters, as in usual typing tests);
- **Raw**: the speed counting wrong characters too;
- **Accuracy**: the share of keystrokes typed without a mistake;
- **Correct words** out of words typed, and the **time**.

A new record in the chosen mode is announced.

## History

Below the typing area, a chart shows your **last 20 games** in the chosen mode, in words per minute, with your record.

## Data and sync

Your records per mode and the history of your last 200 games are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Test de frappe → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).

## New style and missed keys

- **The style of the recent games**: pixel art frames, buttons and font.
- **Big text**: the text to type and the keyboard grow with the window; the current line always stays visible.
- **Missed keys**: each mistake is counted on the expected letter. On the keyboard, keys you often miss turn from yellow (a little) to red (often), and the five most missed are listed below with their percentage. A key needs at least 5 presses to count.
