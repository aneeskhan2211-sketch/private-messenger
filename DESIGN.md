# Design Brief: Premium Dark Live Sports Fantasy Cricket

## Direction
Fantasy11 — high-energy live cricket fantasy sports platform with real-time ball-by-ball scoring, animated SVG indicators, and premium dark aesthetic.

## Tone
Bold, competitive, stadium-like energy. Dark charcoal canvas with vibrant orange accents for action/captain multipliers and cricket-green for live success indicators. No noise—pure competition focus.

## Differentiation
Animated live indicators (pulsing red dots, wicket spins, boundary flashes) + smooth leaderboard rank changes create an unforgettable real-time sports experience.

## Color Palette
| Token | OKLCH | Role |
| --- | --- | --- |
| Background | oklch(0.09 0.01 260) | Dark charcoal canvas |
| Card | oklch(0.12 0.01 260) | Elevated surfaces, contests |
| Text Primary | oklch(0.95 0.01 260) | Body copy on dark |
| Text Muted | oklch(0.7 0.01 260) | Secondary labels |
| Primary | oklch(0.62 0.22 35) | Orange: CTAs, captain badges, featured elements |
| Accent | oklch(0.62 0.22 35) | Orange: same as primary |
| Live Green | oklch(0.65 0.22 140) | Boundary highlights, success states |
| Destructive | oklch(0.65 0.2 25) | Red: wickets, losses, live indicators |
| Border | oklch(0.15 0.01 260) | Card edges, dividers |

## Typography
| Role | Font | Usage |
| --- | --- | --- |
| Display | Space Grotesk 800 | Match names, leaderboard ranks, prize pools |
| Body | DM Sans 400/500 | Team info, player stats, ball-by-ball events |
| Mono | Fira Code 400 | Scores, numeric data, overs |

## Elevation & Depth
Multi-layer depth via shadows: subtle base (xs) → cards (sm) → modals (md) → featured contests (elevated + sport-glow). Sport-glow dual effect (24px blur + inset rim) on selected player cards and live match cards creates radiant premium feel.

## Structural Zones
| Zone | Background | Border | Notes |
| --- | --- | --- | --- |
| Header | Charcoal card-elevated | Orange live badge | Sticky, wallet balance, live match indicator |
| Hero | Card elevated + sport-glow | Orange accent | Featured contest leaderboard, ball-by-ball feed |
| Grid | Card with border | Subtle divider | Contest cards 3-4 desktop, 1-2 mobile |
| Team Builder | Charcoal card | Orange selected | Player selection with captain/VC multipliers |
| Leaderboard | Alternating muted bg | None | Rank up/down animation, top-3 green highlight |
| Footer | Muted/40 | Border-t | Links, copyright |

## Spacing & Rhythm
Base 4px unit: 12px card padding, 16px section margins, 24px container edges. Grid gap 12px desktop, 8px mobile. Tight spacing reinforces premium sports feel.

## Component Patterns
- Buttons: Orange on hover, Space Grotesk 700, full-width mobile
- Cards: Charcoal border, card-elevated featured, sport-glow on hover
- Badges: Orange for captain/VC, green for rank rewards
- Live dot: 8px red pulsing indicator with 1.5s keyframe
- Ball-by-ball card: Slide-in from bottom 0.4s, milestone pulse on boundary/wicket
- Player selection: Animated inset border glow + outer halo on select
- Score flash: Green 0.6s for boundary, red 0.8s for wicket
- Rank arrows: Up (green fade) / Down (red fade) 0.8s exit animation

## Motion
Live animations drive engagement: pulsing red dot (live-indicator-pulse 1.5s), score flashes (boundary=green, wicket=red 0.6–0.8s), wicket spin (720deg rotate, 1.2s exit), ball-by-ball slide-in (0.4s ease-out), milestone orange pulse (0.8s), player-card glow border (1.2s infinite), rank change up/down (0.8s exit upward/downward).

## Constraints
- No ball-by-ball replay timeline after match (out of scope)
- No admin CricAPI key rotation panel (out of scope)
- 30s polling refresh from sports data API
- Real-money wallet via Stripe
- Dream11-style: budget cap, captain/VC multipliers, contest leaderboards

## Signature Detail
Animated red pulsing live dot + cricket-green boundary flash + orange wicket milestone pulse create a choreographed real-time sports feeling. Selected player cards animate with orange border glow + outer halo. Leaderboard rank changes fade up/down smoothly. Charcoal + orange + green color story feels premium, focused, and live.
