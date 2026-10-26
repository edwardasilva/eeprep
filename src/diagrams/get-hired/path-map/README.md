# FIG 4.1 path map (draft for #15, epic #4 "Your first internship")

Creative Bot, Oct 25, 2026. Draft on the box only. It is not in a PR yet.

## Files

- `path-map.svg`, `path-map.png`: desktop, 1040 px wide (the site's "wide" figure size). The PNG is 1600 px wide.
- `path-map-dark.svg`, `path-map-dark.png`: the same figure with the dark tokens.
- `path-map-mobile.svg`, `path-map-mobile.png`: vertical layout, 400 px wide. The PNG is rendered at 2x (800 px).
- `src/build_path_map.py`: builds all six files. It reuses the text-to-path code in `brand/src/build_brand.py`, so the SVGs carry no font dependency.

Rebuild with `python3 src/build_path_map.py`. It needs uharfbuzz, fonttools, playwright and Chrome.

## Nodes and their sources

Q numbers are items in the top-20 list in `/home/box/edward/eeprep/content-strategy.md`. Cite keys come from its section 1 and section 2 tables.

| Node | Q items | Cite keys used in the figure | Claim drawn from |
|---|---|---|---|
| No experience yet (start) | Q15 | `reddit-2026-internships-before-classes` | Row 15 lesson: proof that you can build and finish something |
| Personal hardware project | Q5, Q15, Q18 | `reddit-2025-resume-project-ee`, `reddit-2025-projects-got-hired`, `x-princess_yfe-2026-budget`, `x-blind_via-2026-altium` | Row 5 (defend it line by line, a small version of what the target company makes), row 18 (department scopes, KiCad, Altium student license) |
| Student design team | Q14, Q17 | `reddit-2026-internships-little-experience`, `reddit-2026-no-internships-projects` | Row 17 (racing or rocket team in year one, something to discuss at a fair) |
| Research with a professor | Q12, Q17 | `reddit-2026-undergrad-research`, `reddit-2026-2nd-year-internship` | Row 17 (research counts), row 12 (many professors can refer students directly) |
| Bench skills in the lab | Q10 | `reddit-2026-freshman-skills` | Row 10 (scope and function generator without help) |
| Resume | Q8, Q10 | `reddit-2026-200-internships` | Row 8 (year, graduation date, GPA, classes at first glance), row 10 (tool next to the work) |
| Career fairs and referrals | Q12, Q13 | `reddit-2026-2nd-year-internship`, `reddit-2026-lack-2027-newgrad` | Row 12 (people get you past the stack, professors and alumni), row 13 (internships post in late summer and fall) |
| Loop: no interviews after 20 applications | Q1 | `reddit-2026-no-internships-projects` | Row 1 lesson (change the resume or the channel) |
| Hardware interviews | Q6 | `reddit-2026-nvidia-soc-interview` | Row 6 (digital logic, timing, op-amps, filters, study missed questions) |
| First internship offer (end) | none | none | Goal of the page |
| If this summer falls through | Q14 | `reddit-2026-no-internships-projects` | Row 14 (recoverable setback, technologist role, design team, 8 to 12 month co-op, co-ops convert) |

## Left out on purpose

- Campus jobs and class projects. The source does not mention either as a route to an internship.
- Q11 (ITAR, visas). It is a narrow case and gets a short box on the page, not a node.
- Q20 (negotiating offers). It comes after the offer.
- Q3 test and technician jobs. The source frames them as new-grad bridges, not internship routes. The technologist role appears only in the fallback, as row 14 has it.
- No quotes. Every node paraphrases a lesson from the strategy file. Before the page quotes a Reddit thread, open it and check the wording (content-strategy.md, open items).

## Keys that need a browser check before launch

Three cite keys on this figure are marked "Verified: search-only" in references.bib. They show the question students ask, not the lesson the figure draws. Open each thread in a browser and confirm it before launch.

- `reddit-2026-freshman-skills`
- `reddit-2026-nvidia-soc-interview`
- `reddit-2026-undergrad-research`
