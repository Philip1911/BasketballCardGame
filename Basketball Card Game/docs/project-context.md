# Hoops Card Club - Project Context

## Purpose of this document

This file is the high-level project context for the entire game. It is meant to help future contributors, designers, and coding agents understand:

- what the product is
- how the major systems work
- how the UI is structured
- how the visual design is intended to feel
- where the important logic lives
- what assumptions should be preserved when extending the game

This document describes the current intended state of the project, not just isolated implementation details.

---

## 1. Product Summary

**Hoops Card Club** is a browser-based basketball card collecting game centered around:

- opening packs
- collecting current NBA players
- collecting Hall of Fame legends
- completing team sets and larger collections
- progressing through dailies, achievements, profile customization, and reward packs

The fantasy is a modern sports card collecting experience with a presentation style inspired by FIFA / NBA 2K Ultimate Team style pack openings, layered with collectible scrapbook / binder progression.

The product is a single-page app with no frontend framework. Everything is rendered through vanilla HTML, CSS, and JavaScript.

The current UX target is fully usable touch-first play on small phones, with `iPhone 12 mini` size as a practical baseline for responsive layout decisions.

---

## 2. Core Pillars

The game should always reinforce these pillars:

### 2.1 Collecting

The player should feel like they are building a real club:

- unlocking first-time cards
- storing duplicates
- completing team sets
- completing larger conference / special collections
- curating a profile with featured cards and badges

### 2.2 Pack Excitement

Pack opening should feel premium and expressive:

- rarity should be legible before and after reveal
- premium pulls should feel special
- navigation between packs should be fast
- reward packs should be visually recognizable by identity alone

### 2.3 Long-Term Progression

The game should reward repeated play through:

- dailies
- achievements
- set completion
- collection completion
- saved reward packs
- profile cosmetics and badge progression

### 2.4 Strong Visual Identity

The UI should feel like a premium sports collection game:

- dark, modern, high-contrast shell
- strong card identities
- team-driven color and logo use
- compact but legible information density
- polished hover, reveal, and modal interactions

---

## 3. Tech / File Structure

The project currently lives in these core files:

- `index.html`
- `styles.css`
- `script.js`
- `player-data.js`
- `scripts/generate-player-data.mjs`

### 3.1 Responsibilities by file

#### `index.html`

Defines the static app shell and modal structure:

- top navigation
- packs view
- collections view
- players view
- profile view
- stats view
- pack reveal modal
- card preview modal
- set completion modal
- daily reward modal
- achievement reward modal
- favorite team modal
- profile editor modals

#### `styles.css`

Defines the entire visual language:

- app shell
- nav and layout
- packs
- cards
- modals
- collections and team detail views
- profile and achievements
- hover / reveal / cinematic animations

#### `script.js`

Owns almost all game logic:

- state initialization and persistence
- card catalog generation
- rarity logic
- pack definitions and pack opening
- duplicate storage and selling
- collections and set completion
- dailies
- achievements
- profile
- rendering of most dynamic UI
- event wiring

#### `player-data.js`

Contains the card dataset shipped to the client:

- current roster sets
- Hall of Fame set
- player images
- abilities / hidden abilities
- team metadata

#### `scripts/generate-player-data.mjs`

Build pipeline for roster and rating data:

- generates or refreshes the player dataset
- applies rating heuristics
- supports manual image / legend adjustments

---

## 4. Current App Navigation

Primary navigation is:

- `Packs`
- `Collections`
- `Players`
- `Profile`
- `Stats`

There is also a top-right `Dailies` entry point that opens a compact popover.

### 4.1 Packs

Purpose:

- buy store packs
- open saved reward packs
- inspect pack previews
- reroll / open another pack from inside the reveal flow

Sub-tabs:

- `Store`
- `My Packs`

These are true content tabs. Only one should be shown at a time.

### 4.2 Collections

Purpose:

- show macro collection progress first
- then drill into collection groups
- then drill into individual team sets

Hierarchy:

- Collections menu
- Collection group
- Team set

Current top-level collection groups:

- East
- West
- Special

Special currently contains Legends / special content.

### 4.3 Players

Purpose:

- browse owned club
- optionally include locked cards
- filter / sort / search
- sell duplicates individually or in bulk

### 4.4 Profile

Purpose:

- favorite team identity
- editable display name
- featured card showcase
- featured badges
- achievement summary and detail modal

### 4.5 Stats

Purpose:

- lifetime summary stats
- rarity pull counts
- save reset

---

## 5. Content Model

### 5.1 Team Sets

Each NBA team is represented as its own set.

A set is complete when all cards from that team have been unlocked at least once.

Each set has:

- team metadata
- completion progress
- money reward
- reward pack
- team badge reward

### 5.2 Collection Groups

Collection groups are meta-collections containing multiple sets.

Current group model:

- East collection
- West collection
- Special collection

A collection is complete when all sets inside it are complete.

Collections award:

- money
- stronger reward pack(s)

### 5.3 Card Ownership Model

The game tracks card ownership by copy count, not by simple unlock flags.

Rules:

- first copy unlocks the card permanently
- additional copies are stored as duplicates
- duplicates can be sold manually
- duplicates are not auto-sold
- UI must clearly distinguish:
  - new pull
  - owned single
  - owned duplicate
  - locked / not yet collected

### 5.4 Locked Cards

Locked cards should communicate:

- not yet collected
- lower visual clarity than owned cards
- hidden player identity

Current locked-card intent:

- grey, softer theme
- reduced saturation
- blurred / muted art and content
- rating badge remains visible
- status pill remains visible
- border text should read `Locked`

Locked cards should look consistent in:

- team set view
- players view when `Show Locked` is enabled

---

## 6. Rarity System

### 6.1 Visible rarity families

The player-facing rarity families are:

- Silver
- Gold
- Glass
- Black Matter
- Legends

### 6.2 Internal note on Mythic

There is still an internal `mythic` bucket in some logic, but visually and in most player-facing systems it is folded into `Glass`.

Practical rule:

- if a card would previously be Mythic, it should visually behave like a premium Glass card unless it belongs to Black Matter or Legends

### 6.3 Rarity fantasy

#### Silver

- baseline modern cards
- metallic neutral identity
- lower-value tier

#### Gold

- good players
- warm premium styling
- combines older uncommon / rare feel into one cleaner tier

#### Glass

- elite modern players
- slightly transparent team-colored luxury look
- team-customized appearance
- premium subgroup includes full-art Glass showcase cards

#### Black Matter

- ultra-elite modern superstar tier
- current special list:
  - Shai Gilgeous-Alexander
  - Luka Doncic
  - Nikola Jokic
  - Victor Wembanyama
  - Giannis Antetokounmpo
- hidden ratings only
- no visible OVR on card face
- dark full-art presentation

#### Legends

- Hall of Fame special set
- hidden ratings only
- no visible OVR on card face
- white / gold / holy premium look
- full-art presentation

---

## 7. Card Presentation Rules

### 7.1 Standard card structure

Normal cards use:

- rating badge in top-left, when visible
- status / copy indicator in top-right
- player image area
- team line
- player name
- detail row at bottom

### 7.2 Border text

Cards use a border text system where rarity text runs around the card frame.

Rules:

- the text should follow the rounded border path
- on hover, the text loops continuously around the border
- when hover ends, the loop should pause in place instead of snapping back
- on next hover, it should continue from the paused point
- locked cards should display `Locked` in the border

### 7.3 Team art background

Standard non-full-art player cards use:

- a team-color diagonal gradient
- a repeating smaller team-logo pattern in a clear diamond grid
- the pattern should be visible but not overwhelm the player image

### 7.4 Full-art variants

There are currently three premium full-art families:

- Legends
- Black Matter
- premium Glass full-art showcase cards

#### Legends

- image covers the whole card
- bottom text sits over a white / gold readability gradient
- strong gold border
- holy, iconic presentation

#### Black Matter

- same full-art layout concept as Legends
- black-centered premium treatment
- white border text
- dark premium overlays
- team name and player name should read in white

#### Glass full-art showcase

- top 10 non-Black Matter, non-Legends Glass cards
- same inner layout family as other full-art cards
- keeps Glass identity
- still shows visible rating badge
- team-tinted frosted luxury presentation

### 7.5 Missing / locked art

Locked cards must not simply look like fully colored owned cards with a crude overlay.
They should have their own missing-card treatment:

- greyer background
- reduced color in the art
- lower clarity / slight blur
- border and badge elements remain readable

### 7.6 Premium cinematic mode

Legends and Black Matter cards support a cinematic hover mode.

Behavior:

- immediate premium hover treatment on hover
- after a short delay, card enters cinematic mode
- in cinematic mode, some informational UI fades out
- leaving hover should not instantly snap back if the user re-enters quickly
- on mobile inside card preview, the hover treatment should auto-start because hover does not exist there
- on mobile inside card preview, tapping a Legends or Black Matter card should toggle cinematic mode on and off with the same visual transition as desktop

This should work in:

- packs
- preview modal
- profile showcase
- collections
- players

---

## 8. Pack System

### 8.1 Store packs

Current store lineup:

- Street Pack
  - 3 cards
  - free
  - no default guarantee
  - bad luck protection
- Riser Pack
  - 3 cards
  - guaranteed 85+
- Bench Pack
  - 5 cards
  - no guarantee
- Spotlight Pack
  - 5 cards
  - guaranteed 89+
- Rotation Box
  - 7 cards
  - guaranteed 87+
- Mega Pack
  - 10 cards
  - guaranteed 92+

### 8.2 Saved packs / My Packs

`My Packs` is inventory only.

It should show:

- every reward pack instance the player owns
- no store packs
- packs as separate items, not stacked into one count tile

Saved packs are free to open because they are already earned rewards.

### 8.3 Pack opening rules

- no duplicate player can appear twice in the same pack
- store packs cost money
- saved reward packs do not cost money
- duplicates are stored by default
- duplicate cards can be sold manually from the reveal

### 8.4 Street Pack bad luck protection

The Street Pack has a pity / bad luck meter.

Rule:

- if the player does not pull an 87+ in 10 Street Packs in a row
- the next Street Pack guarantees one 87+

This pity system applies only to the free Street Pack.

### 8.5 Pack reveal UX

Pack reveal is modal-based.

Key interaction goals:

- manual card-by-card reveal
- premium suspense for stronger pulls
- quick reroll flow
- fast navigation between pack previews

Features:

- reveal all
- duplicate sell controls
- open new pack
- left/right arrows after reveal completion
- skip reveal with hold-space behavior
- open next pack with hold-space behavior

Mobile-specific rule:

- on small phone-sized screens, pack opening should switch from the desktop multi-card grid to a single-card stack flow
- the pack should begin on one unrevealed card
- only the first card should require a tap-to-reveal interaction
- after the first reveal, swiping left or right should advance into the remaining cards without requiring another reveal tap
- the active mobile pack card should feel large and dominant in the viewport, not like a reduced grid tile
- the final mobile card should expose a bottom `Continue` action to enter the full pack overview
- once the full pack overview is reached on mobile, cards should be presented as a horizontal carousel
- the mobile pack overview carousel should show `new` cards first sorted high to low, then transition into `duplicates` sorted high to low
- the transition into duplicates should be visually obvious inside the same carousel, not split into separate carousels
- pack navigation arrows / pills should only appear during actual pack preview, not in the resolved pack overview
- the full pack overview should appear only after the player explicitly continues from the final mobile card
- the resolved pack view on mobile should keep a close `X` in the top-right and an `Open New Pack` action at the bottom when a repeatable pack exists

### 8.6 Pack previews

Pack previews exist for:

- store packs
- saved packs

Rules:

- pack tilt is only active in preview mode
- preview is also where arrow navigation is used
- opening the pack from preview is handled through the centered action button, not inline pack-card buttons

### 8.7 Reward pack identity

Reward packs must be visually distinct and recognizable:

- store packs differ by prestige and complexity
- team reward packs use team logo and team colors
- achievement packs and daily packs use their own reward visual identities

The player should quickly understand pack quality by visual identity before reading text.

---

## 9. Rewards and Progression

### 9.1 Set rewards

Completing a team set should award:

- money
- a team-themed reward pack
- a team badge

### 9.2 Collection rewards

Completing a collection group should award:

- money
- stronger collection-level reward pack(s)

These should be more meaningful than set rewards.

### 9.3 Daily challenges

Dailies are a compact recurring progression layer.

Current structure:

- 3 randomized daily challenges per day
- 1 bonus reward for completing all 3

Challenge types can include:

- open packs
- pull certain rarities
- pull cards from a team
- pull cards from a position

Daily rewards are packs sent to `My Packs`.

### 9.4 Achievements

Achievements are long-term milestone progression.

They should:

- reward repeated engagement
- cover multiple play styles
- unlock badges
- upgrade badge quality across tiers
- occasionally award packs

Important reward constraint:

- achievement packs should never exceed a single-card 95+ guarantee
- very high guarantees should remain rare and tied to major progression, not common achievement tiers

### 9.5 Profile rewards

Profile progression is mostly cosmetic / expressive:

- featured cards
- featured badges
- favorite team identity
- display name
- achievement visibility

---

## 10. Collections and Team Set UX

### 10.1 Collections overview

The first collection screen is not a set list. It is a collection-group screen:

- East
- West
- Special

Each group shows:

- collection identity
- top-level progress
- preview of teams inside

### 10.2 Inside a collection group

Inside a collection group, the user sees the team sets for that group.

Set cards should emphasize:

- team logo
- team name
- progress
- completion state

### 10.3 Inside a team set

The team set view should feel scrapbook-like / binder-like.

It should use:

- team colors as background
- large faded team logo behind the card tray
- clear progress
- a strong sense of building a collection page

The header should be compact and intentional.

Important current UX rule:

- `Back` and `Bulk Sell` should not sit too close together
- misclick risk should be minimized

Card preview rule inside team sets:

- opening a card preview from a team set should preserve left/right navigation through the full set order
- desktop should expose explicit previous / next controls
- mobile should support both explicit buttons and horizontal swipe navigation
- on mobile card preview, border-tag rotation and other hover-driven card effects should auto-play

---

## 11. Players Screen

The Players screen is the flexible club browser.

It should support:

- search
- sort
- multi-team filtering
- multi-rarity filtering
- position filtering
- optional locked-card inclusion
- bulk sell tools

### 11.1 Locked card behavior in Players

When `Show Locked` is enabled:

- locked cards should use the same missing-card visual language as team sets
- not a different ad hoc style

### 11.2 Layout intent

The Players grid should align with the toolbar and use the full content width cleanly.

Design intent:

- left and right edges of the card grid should visually align with the controls above
- avoid awkward centered islands of cards if the section is meant to read like a full catalog

---

## 12. Profile System

The profile is intended to feel closer to a Steam-style collector profile than a simple stats panel.

### 12.1 Favorite team

On first load, the player is prompted to choose a favorite team.

Rules:

- shown as a modal on first onboarding
- can choose later
- can be changed later from profile

Favorite team affects:

- profile visual identity
- team-themed background
- favorite-team achievement track

### 12.2 Profile name

The user can set a custom profile name.

Fallback behavior:

- if favorite team exists: `Team Fan`
- otherwise: `Basketball Fan`

### 12.3 Featured cards

The profile supports up to 3 featured cards.

Requirements:

- normal card-sized slots
- empty slots should be clickable
- editing uses a dedicated modal picker
- swapping logic must understand already-used cards

### 12.4 Featured badges

The profile supports up to 6 highlighted badges.

Requirements:

- compact but premium presentation
- swapping logic similar to featured cards
- badge picker remains open while arranging

### 12.5 Achievement summary

Profile shows:

- achievement progress
- completed / total milestones
- quick open into a fuller achievements modal

The profile background should adapt to the favorite team using:

- team colors
- repeated logo pattern
- translucent surfaces layered above the themed background

---

## 13. Stats Screen

Stats should stay meaningful and fun.

Current intended stats:

- Balance
- Packs Opened
- Total Cards Pulled
- Total Card Progress
- Lifetime Earnings
- Lifetime Pack Spending
- pull counts by rarity

Card preview also includes personal collection stats:

- first unboxed date
- total unbox count for that player

---

## 14. Save Data Model

The save state is stored locally in browser storage.

High-level categories include:

- money
- collection ownership
- copy counts
- pull counts
- packs opened
- saved packs
- daily challenge state
- achievements and badge unlocks
- profile state
- favorite team
- card history / first-unboxed tracking

Important persistence rule:

- changes should preserve backward compatibility when possible
- if save structure changes, migrations or safe defaults should be used

---

## 15. Visual Design System

The entire product should broadly follow CRAP principles:

- Contrast
- Repetition
- Alignment
- Proximity

### 15.1 Contrast

- strong dark shell
- bright premium accents
- card rarity identity must be legible
- text readability always wins over decorative effects

### 15.2 Repetition

Repeat these patterns consistently:

- eyebrow labels
- panel shells
- rounded controls
- reward pills
- card border logic
- pack presentation language

### 15.3 Alignment

Sections should feel grid-aligned, not casually centered.

Important alignment targets:

- toolbars with card grids
- profile sidebar sections
- pack modal header, progress rows, and card rows
- team detail header and card tray

### 15.4 Proximity

Related controls should feel grouped.

Examples:

- pack actions near pack content
- bulk sell hidden when secondary
- profile showcase edit actions attached to their slots
- reward information visually grouped with reward pack previews

### 15.5 Mobile-first usability

Small-screen usability is a first-class design constraint, not a later polish pass.

Practical rule:

- the app should remain comfortable on `iPhone 12 mini` sized screens
- primary navigation should stay easy to tap without accidental presses
- modals must fit inside the viewport without hidden critical actions
- card grids should reduce density before causing horizontal overflow
- sets and players should still target a 2-card layout on `iPhone 12 mini` class widths when practical
- when a mobile card grid collapses to a single visible column, the card should sit centered rather than hugging the left edge
- actions near the bottom of the screen should remain thumb-reachable

---

## 16. Interaction Design Rules

### 16.1 Previews

- card tilt is preview-only
- pack tilt is preview-only
- normal browsing grids should prioritize clarity over motion

### 16.2 Hover quality

Visual effects must never make the card art or text look blurry or degraded.

Glows belong on shell layers, not on the content layer.

### 16.3 Modal philosophy

Modals are used for:

- pack reveal
- card preview
- reward celebration
- favorite team selection
- profile editors
- achievements detail

Modal layouts should:

- stay compact
- avoid unnecessary nested panels
- keep the primary action obvious

### 16.4 Spacebar hold interactions

Pack modal uses hold interactions to support fast repeat play:

- hold space to skip reveal
- hold space to open next pack

These should feel optional, additive, and clearly communicated through progress-fill buttons.

### 16.5 Mobile modal behavior

On small screens:

- modals should use nearly the full viewport width
- internal scroll is acceptable, viewport overflow is not
- reveal arrows and modal actions must not overlap each other
- card preview scale should be reduced rather than clipped
- modal padding should shrink before content is allowed to overflow sideways
- player filters and bulk sell should open in dedicated mobile modals instead of expanding the desktop inline panels
- those player-control mobile modals should close through a bottom `Save Settings` action
- daily challenges should use a dedicated mobile modal with a close icon instead of relying on the desktop popover pattern
- card typography should scale down with smaller card widths so text does not dominate the card on phone screens
- the rotating rarity border tags should tighten up and sit slightly further inside the frame on mobile so the corners stay visually clean

---

## 17. Content Pipeline and Image Policy

### 17.1 Roster data

Current player data targets the 2025-26 NBA roster state.

### 17.2 Manual art overrides

Some art is deliberately overridden in code for better visual quality:

- Black Matter players
- full-art Glass showcase players
- Legends

These overrides are part of the product identity and should not be casually removed.

### 17.3 Art direction by card type

- standard cards: modern team-themed portrait cards
- Glass full-art: premium action shots
- Black Matter: dark, modern, elite action imagery
- Legends: iconic archival / classic action imagery

Preferred image traits for premium full-art cards:

- full-body or near full-body
- in-game action
- readable silhouette
- correct jersey when practical

### 17.4 Responsive image delivery

The runtime image strategy should optimize first for reliability and perceived speed.

Current rule set:

- NBA headshots are treated as responsive assets, not as one fixed-size image
- normal card views should prefer lighter NBA headshot variants when available
- card preview may request the full-size source when needed
- pack preload should warm the card-sized asset, not always the heaviest source
- if a lighter NBA variant fails, the UI should retry with the full-size source before giving up
- if image loading still fails, the card should fall back to the designed art placeholder instead of breaking layout

Supporting rule:

- preconnects to image-heavy hosts are acceptable when they materially improve first-load behavior

---

## 18. Important Current Constraints

- no framework migration is planned right now
- the app is tightly stateful and imperative
- CSS carries a large amount of the visual behavior
- image changes often require crop tuning
- reward balance should stay meaningful without trivializing progression

When adding new features, avoid:

- making the top of a view feel bloated
- introducing centered layouts that break grid alignment
- overloading cards with too many chips or rows
- using effects that reduce readability
- giving too many high-end guaranteed rewards too early

---

## 19. Future-Friendly Extension Points

These are natural future systems for the game:

- duplicate trade-up / exchange system
- more special collections
- more custom reward pack families
- seasonal events
- profile progression cosmetics
- advanced card history / provenance

If these are added, they should plug into the existing structure:

- packs
- saved packs
- achievements
- profile showcase
- collection hierarchy

---

## 20. Working Rule for Future Changes

When editing this project, optimize for this order:

1. clarity of the collecting fantasy
2. readability of the UI
3. strength of the reward / pack loop
4. premium feel of cards and packs
5. animation polish

If a visual effect hurts readability or makes the game harder to use, readability should win.

Additional standing rule:

- when making changes, update this context file if the change adds a durable UX rule, rendering policy, or architectural assumption that future work should preserve
