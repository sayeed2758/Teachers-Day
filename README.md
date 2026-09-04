# Teacher's Day Interactive — multi-teacher base

A single static site that resolves a teacher from `?teacher=` and keeps the same interactive classroom experience.

Examples:
- `/?teacher=shahid`
- `/?teacher=sakti`
- `/?teacher=sameer`

## Current interaction pass
- Orientation gate on portrait phones
- Intro surprise screen
- Corridor → classroom cinematic transition
- Classroom zoom/reset
- Interactive hotspots for report card, envelope, diary, and memory cards
- Modal open/close animation with image reveal
- Sound toggle and small synthesized chime (no audio file required)
- Keyboard Escape close
- Gentle desktop pointer parallax
- Shared single-codebase teacher data architecture

## Important
The current build references the public artwork URLs from the supplied reference site so the interaction prototype can be tested immediately. Before production, swap those URLs for licensed/local artwork and add the final teacher-specific content/photos.
