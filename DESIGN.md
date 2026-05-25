# Design Brief: Dark Sporty Fantasy Sports

## Tone & Differentiation
Bold, competitive, high-energy fantasy sports platform for cricket, football, and kabaddi. Dark mode premium aesthetic with orange accent signaling action and wins. Dream11-inspired contest flow with real-money betting sensibility. Eliminates noise—no messaging, pure competition focus.

## Color Palette
| Role | OKLCH | Usage |
| --- | --- | --- |
| Background | oklch(0.09 0.01 260) | Charcoal canvas, dark neutral base |
| Card | oklch(0.14 0.01 260) | Elevated surfaces, contest cards, team builders |
| Accent | oklch(0.62 0.22 35) | Orange: captain badges, live scores, wins, CTAs |
| Text Primary | oklch(0.95 0.01 260) | Body copy on dark |
| Text Muted | oklch(0.65 0.01 260) | Secondary labels, hints |
| Border | oklch(0.20 0.01 260) | Card edges, dividers |
| Success | oklch(0.65 0.15 150) | Winning streaks, prize confirmation |
| Destructive | oklch(0.55 0.15 25) | Contest closure, loss indicators |

## Typography
| Role | Font | Usage |
| --- | --- | --- |
| Display | Space Grotesk 700/800 | Contest names, leaderboard rank, prize pools |
| Body | DM Sans 400/500 | Team info, player stats, contest details |
| Mono | Space Mono 400 | Scores, stats, numeric precision |

## Elevation & Depth
- Shadow xs: `0 2px 4px oklch(0 0 0 / 0.12)` — subtle separators
- Shadow sm: `0 4px 8px oklch(0 0 0 / 0.15)` — card bases
- Shadow md: `0 8px 16px oklch(0 0 0 / 0.18)` — modals, overlays
- Card Elevated: `0 8px 32px oklch(0 0 0 / 0.25)` — featured contests
- Glow Orange: `0 0 24px oklch(0.62 0.22 35 / 0.4)` — live match halo
- Sport Glow: Dual glow + inset rim for active player cards

## Structural Zones
| Zone | Content | Visual Cue |
| --- | --- | --- |
| Header | Logo, wallet balance, live match badge | Sticky charcoal, orange live indicator |
| Hero | Featured contests, live match leaderboard | Full-width card-elevated shadow, sport-glow accent |
| Grid | Contest cards (3-4 columns desktop, 1-2 mobile) | Card borders, glow on hover |
| Team Builder | Player selection, budget cap, multipliers | Scrollable list, orange captain/VC badges |
| Leaderboard | Rank, user, points, prize tier | Card rows, success green for top 3 |
| Wallet | Balance, entry fees, prize claims | Card container, form inputs |
| Footer | Links, copyright | Muted text, no navigation (no messaging) |

## Spacing & Rhythm
- Base unit: 4px
- Padding: 12px (cards), 16px (sections), 24px (container edges)
- Gap: 12px (grid), 8px (lists)
- Breakpoints: 640px (mobile), 1024px (desktop)

## Component Patterns
- Buttons: Orange accent on hover, Space Grotesk 700, full-width on mobile
- Cards: Charcoal borders, card-elevated on featured, sport-glow hover
- Badges: Orange accent for captain/VC, green for rank rewards
- Form inputs: Dark background, orange focus ring
- Live indicators: Blinking orange glow, "LIVE" label in Space Grotesk
- Leaderboard rows: Alternating subtle backgrounds, top-3 green highlight

## Motion
- Fade-up: Contest card entry (0.6s ease-out)
- Slide-in-right: Team builder selections
- Glow pulse: Live score updates (custom keyframe)
- Hover scale: +2% on interactive elements

## Constraints
- No social referral program with bonus credits (out of scope)
- No in-app notifications for match start, team acceptance, prize claims
- Polling-only score updates (30s refresh from sports data API)
- Real-money wallet with Stripe payment integration
- Dream11-style UX: budget cap, captain/VC multipliers, contest leaderboards

## Signature Detail
Orange sport-glow on featured contest cards + live match leaderboard: radiant 24px blur + inset rim creates depth. Captain/VC badges in orange Space Grotesk bold signal authority and multiplier power. Charcoal + orange contrast evokes night stadium—premium, focused, competitive.
