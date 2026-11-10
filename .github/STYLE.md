# Human plain-English communication

Write plain English that a smart reader outside the field understands on one read, in a voice that sounds like one specific person. The rules come from three sources:

- ASD-STE100 Simplified Technical English, as summarized in the simple-english skill: [https://www.ui-skills.com/skills/aminblg/simple-english](https://www.ui-skills.com/skills/aminblg/simple-english)

- Wikipedia:Signs of AI writing: [https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)

- Wikipedia: Artificial intelligence content detection: [https://en.wikipedia.org/wiki/Artificial_intelligence_content_detection](https://en.wikipedia.org/wiki/Artificial_intelligence_content_detection)

Sections 3, 6, and 7 also adapt the parts that fit eeprep from two projects:

- unslop by Clayton Kim, on formulaic writing: [https://github.com/theclaymethod/unslop](https://github.com/theclaymethod/unslop)

- unslop by Damir Sokolovsky, on AI-looking interfaces, licensed CC BY 4.0: [https://github.com/heydamir/unslop](https://github.com/heydamir/unslop)

The goal is good writing, not beating a detector. Detectors are unreliable and flag human text, especially from non-native speakers. Text that is specific, accurate, and useful is what reads as human.

## 1. Say something real

1. Lead with the answer, the result, or the takeaway. Do not restate the question.

2. Put a specific in every paragraph: a number, a name, a date, a worked example, a mistake someone made. Generic claims anyone could write are the strongest AI tell.

3. Take a position when you have one. "Do this, skip that, because..." beats a neutral survey.

4. State the fact, not its importance. Never say a thing "plays a pivotal role", "underscores", "highlights the importance of", "marks a turning point", or "leaves a lasting legacy". Say what it did.

5. Attribute opinions to a named source. Never write "experts say", "many believe", or "is widely regarded".

6. Do not add a closing section about "challenges and future prospects", and do not summarize with "Overall" or "In conclusion".

7. Never invent facts, quotes, or citations. Every source must be real, reachable, and actually say what you cite it for.

## 2. Sentences

1. Use simple tenses and active voice, and name the actor: "You run the migration." Prefer "ran" over "has been run".

2. Use "is" and "has". Do not dodge them with "serves as", "stands as", "functions as", "represents", "boasts", "features", or "offers".

3. Put the condition before the command, with a comma: "If the build fails, read the log."

4. Keep sentences short: at most 20 words for steps and 25 for explanation. **Vary the length inside that limit.** Mix a 6-word sentence with an 18-word one. A wall of identical 12-word sentences reads as machine-made.

5. Do not tack an -ing clause onto a sentence (", highlighting its role", ", making it easy"). Start a new sentence.

6. No em dashes and no semicolons. Write two sentences, or name the relation with "because", "but", or "so".

7. Use one word for one meaning through the whole text. Do not swap synonyms for variety ("the device... the unit... the apparatus").

8. Break up noun chains longer than three words with a preposition.

9. Use the modals can, will, and must. Turn a required "should" into "must" and delete an optional one. You may hedge once when there is real uncertainty, and say why.

10. Define a technical term in a few words the first time you use it, e.g. "idempotent (safe to run twice)". Do not define product names or standard names.

## 3. Words to cut

Cut these on sight. One may be a coincidence, but several together read as AI:

> additionally (as an opener), align with, boast, bolster, crucial, deep dive, delve, emphasize, enduring, enhance, foster, garner, highlight (verb), interplay, intricate, key (adjective), landscape (abstract), leverage, meticulous, multifaceted, pivotal, quietly, robust, seamless, showcase, tapestry, testament, underscore, valuable, vibrant, comprehensive, powerful, simply, "in order to", "it is worth noting", "in today's fast-paced world".

Also cut phrases that clear the throat or demand attention: "here's the thing", "it turns out", "the truth is", "let's dive in", "let's unpack", "this matters because", "make no mistake", "let that sink in", "game changer", "lean into", "double down", and "moving forward".

Also cut "not just X, but Y", "not X, but Y", "Y rather than X" used for drama, and decorative groups of three. Use a list of three only when there really are three things.

## 4. Formatting

1. A chat reply is prose. Use no headers, no bold lead-ins, and no tables unless the reader asked for one. Use a code block only for something the reader must copy.

2. Documents use formatting only where it carries structure. Use sentence-case headings, never Title Case. Do not skip heading levels, and do not put a heading over a section of one or two sentences.

3. Use no bold for emphasis and no "**Label:** sentence" bullet lists.

4. Make a vertical list only for three or more parallel items or steps, with one instruction per item.

5. Use no emoji, and straight quotes ' " rather than curly ones.

6. Put the warning before the risk: "Do not run this against production. The command deletes rows."

7. Write link text as if it were not a link. Capitalize it only at the start of a sentence, a list item, a table cell, or a heading, or when a word is a proper noun, an acronym, or a brand (IEEE, LinkedIn, Handshake, Alex Doe). Write "the resume page" and "the section on getting a referral first", not "the Resume page" or "the Get a referral first section". A colon does not start a sentence, so "Next: the resume page" stays lowercase. Headings, navigation, sidebar labels, card titles, and figure titles keep their own case.

8. Give a wikilink an explicit alias when its label would be capitalized in the middle of a sentence, as in `[[Resume|resume]] page`. The link target stays as it is. `npm run check:link-case` reads the built pages after `npm run build` and fails on a capitalized link in running text. If the link starts with a real proper noun, add that name, or a phrase that starts with it, to the names list in `.github/scripts/check-link-case.mjs`.

## 5. Voice and register

1. Write chat replies the way a knowledgeable friend talks. No openers like "Great question" or "Certainly". No closers like "I hope this helps", "Let me know if...", or "Feel free to...". No praise for the question.

2. Use no disclaimers about knowledge cutoffs or source availability, and no "as an AI".

3. Contractions: use them in conversational chat and in casual web prose, where people naturally use them. Leave them out of formal technical documents, procedures, and anything meant for translation. This is the STE register.

4. In a personal guide, write in the author's own voice. Use their real experiences and their real numbers.

5. Never touch code, identifiers, commands, file paths, quoted errors, product names, or facts when rewriting.

## 6. Self-check before delivering

1. Search the text for `—`, `;`, `**`, and lines starting with `#` or `-` in a chat reply. Fix every hit.

2. Search for the cut words in section 3, and for `serves as`, `stands as`, `has been`, `should`, `, highlighting`, `, making`, `not just`, `In conclusion`, and `Overall`.

3. Count the words in the three longest sentences and split any over 20 or 25. Then check that sentence lengths actually vary.

4. Find each generic paragraph and add a specific to it, or delete it.

5. Check that every citation and link is real and supports the claim it is attached to.

6. Read the text aloud. If a real person would not say a line that way, rewrite it.

7. Treat a scan as a list of candidates. Check each hit in context, and keep every fact, number, and link. A quote or a literal use can stay. A clean scan does not prove the text is good.

## 7. Interface and figures

1. Keep the page quiet. Use no gradients on surfaces or text, no glows, and no colored shadows.

2. Write labels in sentence case with normal letter spacing. Use no italics for emphasis and no exclamation marks.

3. Draw figures in ink, the mute border, and the 6% tint. Do not use crimson in a figure. Crimson stays on site chrome, such as the nav underline.

4. Give every box in a figure the same treatment. Do not highlight one box, step, or bar. If one item matters most, say so in the page text.

5. Use a dashed box only for a fallback or an aside that the figure or page explains.

6. End every line on something. A connector touches a box or a dot at both ends. Check wide and narrow widths, because a line that connects at one width can float at another.

7. Keep bracket placeholders such as [X]. On this site they mean a number the student measures, so they are not fake data.

## 8. Sound like a person

Following sections 1 to 4 too literally makes a second kind of tell: copy that is clipped, staged, and pleased with itself. It reads like a slogan, not like a person. These rules come from four sources:

- Paul Graham, Write Like You Talk: [https://paulgraham.com/talk.html](https://paulgraham.com/talk.html)

- Morkes and Nielsen's 1997 study, where the objective rewrite of a promotional page scored 27% higher in measured usability: [https://www.nngroup.com/papers/webwriting/rewriting.html](https://www.nngroup.com/papers/webwriting/rewriting.html)

- The Microsoft Writing Style Guide on contractions: [https://learn.microsoft.com/en-us/style-guide/word-choice/use-contractions](https://learn.microsoft.com/en-us/style-guide/word-choice/use-contractions)

- The Google developer documentation style guide on voice and tone: [https://developers.google.com/style/tone](https://developers.google.com/style/tone)

1. Write it the way you would explain it to a classmate, then read it aloud. If you would not say a line that way, rewrite it.

2. Join facts that belong together. A run of short declaratives ("Two controllers. One crane. The fast one gives margin back.") reads as ad copy. Use "and", "but", "so", or "because" when the ideas connect.

3. Do not stage a reveal. Cut the setup line that exists only to make the next line land ("My LinkedIn has the job titles. These pages have the equations."). Say the plain thing once.

4. Do not write taglines or teasers. "One JSON file in, one page of PDF out" and "watch where each one loses the pitch" sell. Describe what the thing does, and let the reader decide it is good.

5. Do not argue with the reader or wink at them. Cut asides such as "It doesn't matter." or "but they were good." If something cannot be shown, say so and stop.

6. Name what a section holds in its heading. "Part 1: slow on purpose" and "Where the classes showed up" are cute. "Part 1: the slow controller" and "Courses behind the projects" are clear.

7. In personal prose, use the contractions a person would say: it's, don't, I'd. Keep them out of steps and procedures, per section 5.

8. A rule in this guide never beats a sentence that reads well. If a fix makes a line stiffer, keep the original and note why.

9. Write about the subject, not the page. "This site has the long versions of my projects" and "My job history is on LinkedIn" describe the page, and the nav and footer already say both. Start with the fact: "I write embedded software for a large aerospace hardware company." A line about the page stays only when it tells the reader something the page cannot show, such as where its advice comes from.

10. Give a summary one job. A card blurb or a page description says what the thing is in one sentence, plus one number or result if it has one. The page itself holds the rest.
