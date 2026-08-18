# Gliit Design System (글잇 디자인 시스템)

> **Brand:** Gliit · 글잇 — a Korean literacy-growth brand for students.
> **Tagline (internal):** 사고를 잇는, 성장을 돕는 · _Connecting thought, growing minds._
> **Year:** 2026 styleguide

Gliit is a Korean education / EdTech brand focused on **문해력 (literacy)** — not as
rote drilling, but as a journey of exploring thoughts and expanding self-expression.
The brand identity centers on a handwriting-style wordmark "글잇" paired with a
rounded-square symbol that abstracts the quill (깃펜) — a metaphor for ideas
flowing on a page. The visual language is warm but disciplined: editorial typography,
soft purple as the lead color, with playful Notion-style doodle illustrations to
keep it inviting for younger learners.

---

## Sources

This design system was rebuilt from the user's Figma brand kit:

- **Figma file:** `[브랜드킷] gliit_글잇 (Copy).fig` (provided as a mounted virtual filesystem at chat time)
  - Pages: `/Cover`, `/page` (Slides — the full brand styleguide deck), `/page2` (paintings, patterned backgrounds, Notion-style assets)
  - Top components: **Tile**, **Caption detail**, **Caption number**, **Logo**, **Patterns**, **Description**

- **Additional notes from the user:**
  - Use `#9570CD` as main color
  - Mix `#F09B7A`, `#F0EA7A`, `#75BCFF`, `#F07AAF` as secondary
  - Use Notion-style illustrations and doodle drawings as decoration

If you have access to the source `.fig` file, the slide order on page `/page/Slides`
goes: Cover → Logo presentation → Logo usage → Moodboard → Colors → Logo support
→ Typography → Sizing & whitespace → Patterns → Logo image files (PNG).

---

## Index of files in this project

```
README.md                  ← you are here
SKILL.md                   ← Agent Skill entry point (for Claude Code)
colors_and_type.css        ← all color + typography tokens
assets/                    ← logos, patterns, mood images (copied from Figma)
fonts/                     ← (none copied — see TYPOGRAPHY caveat below)
preview/                   ← Design System tab cards (one HTML per concept)
slides/                    ← 1920×1080 sample slide layouts
ui_kits/
  app/                     ← Gliit student app — high-fidelity UI kit
  styleguide/              ← Brand styleguide deck — slide-style kit
```

---

## CONTENT FUNDAMENTALS

The brand voice is **warm, calm, mentor-like** — Gliit speaks _to_ students and
parents, not _at_ them. Korean copy uses polite endings (`-습니다`, `-합니다`) and
favors metaphor over instruction.

### Tone

- **Voice:** gentle, observant, encouraging. Closer to a thoughtful teacher than a
  product marketer. No hype, no exclamation points, no emoji.
- **Pronouns:** Gliit refers to itself by name (`글잇은…`) and addresses learners
  collectively (`학생의 사고를 깊게 만들고…`) rather than the second person.
- **Cadence:** descriptive sentences, often three-clause: situation → behavior →
  meaning. ("글잇의 로고는 생각과 사고가 서로 연결되고, 더 넓게 확장되는 과정을 담고 있습니다.")
- **Vibe:** _editorial_ — every sentence reads like it was written for a brand book,
  not an interface. Microcopy on the app loosens slightly but never becomes casual.

### Concrete examples (lifted from the styleguide)

| Topic | Korean source | What it tells us |
| --- | --- | --- |
| Brand promise | "글잇은 '잘 쓰게 만드는 도구'를 넘어, 생각과 표현을 연결해 주는 문해력 성장 파트너입니다." | Position above the tool category. |
| Logo rationale | "글잇의 로고는 생각과 사고가 서로 연결되고, 더 넓게 확장되는 과정을 담고 있습니다." | Always justify form with meaning. |
| Color note (in progress) | "컬러 작업중 (미정)" | Status notes are admitted plainly — no fluff. |
| Mood values | "사고를 잇는 · 성장을 돕는 · 친근한 · 유연한" | Four-word value chips, listed as caption details. |

### Casing & punctuation

- **English:** sentence-case only. "Brand styleguide", not "Brand Styleguide".
- **Wordmark:** lowercase `gliit` (script) — never capitalized.
- **Korean wordmark:** `글잇` — never reads "Gliit" alongside Korean.
- **No emoji.** Decoration is handled by doodle illustrations, not emoji.
- **Unicode in numbers:** captions use circled numerals (① ② ③) inside dark chips.

---

## VISUAL FOUNDATIONS

### Colors

The palette is **one anchor + one playful chord**.

| Token | Hex | Use |
| --- | --- | --- |
| `--gliit-purple` | `#9570CD` | **Primary** — brand anchor (print). |
| `--gliit-purple-digital` | `#A97AF0` | Digital surfaces / app accents. |
| `--gliit-purple-soft` | `#CDA9FF` | Tints, washes, soft surfaces. |
| `--gliit-orange` | `#F09B7A` | Secondary — warm. |
| `--gliit-yellow` | `#F0EA7A` | Secondary — bright. |
| `--gliit-blue` | `#75BCFF` | Secondary — cool. |
| `--gliit-pink` | `#F07AAF` | Secondary — energy / CTA. |
| `--gliit-onyx` | `#0E1318` | Foreground / lockup ink. |
| `--gliit-paper` | `#F8F9F9` | Tile background. |
| `--gliit-haze` | `#EBECF0` | Canvas / artboard. |

**Logo color rules.** The lockup (symbol + wordmark) has exactly three allowed
states; never recolor it any other way:

| Background | Logo file | Notes |
| --- | --- | --- |
| **Bright** — white, paper, warm tints | `assets/gliit-logo-official.png` | Default: gradient symbol + black wordmark |
| **Pure black** (`#000000`) | `assets/gliit-logo-on-dark.png` | Gradient symbol preserved, wordmark white |
| **Dark tint** — brand purple, photos, saturated darks | `assets/gliit-logo-mono-white.png` | Whole lockup as solid white |

Never apply CSS filters or recolor by hand — always swap the artwork file.

This means coloured-but-not-pure backgrounds always force the mark to
monochrome — never let the gradient symbol sit on a tinted ground.

### Typography

- **Display:** HS산토끼체 2.0 — a rounded Korean handwriting face. Used at 32–56px
  for slide titles, hero "글잇" wordmark, and the cursive `gliit` script logo.
- **Title / Body:** IBM Plex Sans KR — Regular for body (16–20px), Medium for
  subtitles, SemiBold/Bold for titles up to 32px. Excellent Korean rendering.
- **Numerals & micro-captions:** Space Grotesk — only inside small circular
  number chips and English captions.
- **Pretendard** is listed as an acceptable fallback for IBM Plex Sans KR.

Line height for Korean body copy is **1.4–1.6**. Letter-spacing stays at zero.

### Spacing & sizing

The deck is built on an **8-point grid** with the major beats at `8 / 16 / 24 / 40
/ 80 / 120`. Slide canvas is 1920×1080; outer padding is **80px**. Internal
section gaps run 16 or 24. Cards (Tiles) use **24px inner padding**.

### Radii

- `8px` for image cards and small tiles
- `16px` for Tile component (the main grid card)
- `24px` for full-slide containers
- **33% of the side** for the rounded-square symbol mark (gives the distinctive
  "soft chiclet" silhouette)

### Backgrounds

- **Default:** plain white `#FFFFFF`.
- **Surface:** `#F8F9F9` paper for tiles.
- **Hero / cover:** repeating **글잇** wordmark patterns, 20% tint of brand
  purple OR onyx, full-bleed. Two tile sizes (large and small) tile the canvas.
- **Photographic backgrounds** are used in moodboards — warm, hand-touched
  scenes (mechanical keyboards, hand-lettered "Kido", layered post-its). Color
  vibe is **warm, slightly desaturated, with grain** — not glossy stock.
- **No bluish-purple gradient hero backgrounds**, no neon. The one
  permitted gradient is the soft-purple `#A97AF0 → #FF85C2` on app icons.

### Decoration

Notion-style **doodle illustrations** in solid ink (`#231F20`) sit alongside
photographic mood imagery. They are line-only, hand-drawn, casual — never used
as full backgrounds, always as accent stickers.

### Animation & states

The styleguide doesn't prescribe motion explicitly, but the brand vocabulary
suggests:

- **Easing:** soft and unhurried — `cubic-bezier(0.4, 0, 0.2, 1)` or similar
  ease-out for entries, 250–400ms durations.
- **Hover:** prefer brightness/opacity shifts (e.g. fade to 80%) over color
  changes. On dark chips, lighten by ~6%.
- **Press:** slight scale-down (0.97) and 60–80% opacity. No skeuomorphic shadow
  bumps.
- **No bounces, no parallax, no entrance choreography.** The brand earns trust
  through stillness; motion is a courtesy, not a feature.

### Borders & shadows

- Borders are almost always invisible (`rgba(255,255,255,0.10)` on dark, or
  `#E2E4E7` mist on light). Hairline only.
- **Shadow system** is light and editorial:
  - `--shadow-card`: 1/2 + 8/24 — for floating cards
  - `--shadow-pop`: 2/8 + 20/48 — for modals or featured tiles
  - `--shadow-button`: barely-there 1px + 2/6 — primary action lift
- **No glowing borders, no inner shadows, no left-accent-color borders.**

### Layout rules

- **Fixed elements:** a tiny lockup (logo symbol + `글잇` script, ~34px tall)
  always sits in the **bottom-left** corner of every slide.
- **Three-column slide pattern:** 420px description column (left, 80px from edge)
  → 60px gap → 1260px content column (right).
- **Caption details** appear as numbered chip rows under the description:
  `(① circled number 24×24) + 16px gap + caption text`.

### Transparency & blur

- Body text uses `rgba(13,18,22,0.86)` for warmth — not pure black.
- Captions step down through `0.70 → 0.40` opacity on the ink color.
- Blur is **not** part of the system. Frosted glass / glassmorphism is off-brand.

### Imagery vibe

- Warm, slightly desaturated, hand-touched. Real objects (keyboards, paper,
  hands, lights). Often shot with shallow depth-of-field.
- B&W appears only in deep-onyx app icon mockups.
- Grain is acceptable in moodboard imagery, not in product UI.

### Cards

A "Tile" — the most-used component — is a rounded **16px** rectangle, paper
fill (`#F8F9F9`), 24px inner padding, with an optional circled-number chip in
the top-left and an optional caption block in the bottom-left. No border, no
shadow by default.

---

## ICONOGRAPHY

The Figma file uses **Font Awesome** style icons for app UI: `archive`, `plus`,
`close`, `book-open-reader`, `settings-round`, `bell`, `arrow-left-to-bracket`.
These are stroked, rounded, single-color. The brand mark itself (the "ℓ/e"
rounded-square symbol) is a custom SVG.

**This system's choice:** because no Font Awesome license was supplied with the
file, we use **Lucide Icons** from CDN as the working set — they have the
identical stroke/round-cap feel as the FA "Sharp Light" set referenced.
Substitution is flagged for the user's confirmation.

- Icon set: **Lucide** via `https://unpkg.com/lucide@latest`
- Stroke width: **1.75px** default, **1.5px** on small (16px) sizes
- Color: always inherits `currentColor`
- **No emoji**, no Unicode symbol icons in product chrome.
- The circled numerals **① ② ③** _are_ used — but as branded **chips**
  (rounded-square 24×24 with Space Grotesk numeral), not raw Unicode.

Custom Gliit icons (the symbol mark, the wordmark) live in `assets/` as SVGs.

---

## CAVEATS / FONT SUBSTITUTIONS

1. **HS산토끼체 2.0** is loaded locally from `fonts/HSSanTokki2.0_2024_.ttf`
   (the licensed file you provided). Registered as `HS Santokki` via
   `@font-face` in `colors_and_type.css`.
2. **IBM Plex Sans KR** is loaded from Google Fonts — full match.
3. **Pretendard** is loaded from jsDelivr — full match.
4. The Figma file references "Font Awesome" icons but the actual icon assets
   weren't all extracted. We substitute Lucide; if you'd prefer Font Awesome
   Sharp Light, supply a kit ID and we'll swap.
