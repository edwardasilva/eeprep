# Human plain-English communication

Write plain English that a smart reader outside the field understands on one read, in a voice that sounds like one specific person. The rules come from three sources:

- ASD-STE100 Simplified Technical English, as summarized in the simple-english skill: [https://www.ui-skills.com/skills/aminblg/simple-english](https://www.ui-skills.com/skills/aminblg/simple-english)

- Wikipedia:Signs of AI writing: [https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)

- Wikipedia: Artificial intelligence content detection: [https://en.wikipedia.org/wiki/Artificial_intelligence_content_detection](https://en.wikipedia.org/wiki/Artificial_intelligence_content_detection)

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

Also cut "not just X, but Y", "not X, but Y", "Y rather than X" used for drama, and decorative groups of three. Use a list of three only when there really are three things.

## 4. Formatting

1. A chat reply is prose. Use no headers, no bold lead-ins, and no tables unless the reader asked for one. Use a code block only for something the reader must copy.

2. Documents use formatting only where it carries structure. Use sentence-case headings, never Title Case. Do not skip heading levels, and do not put a heading over a section of one or two sentences.

3. Use no bold for emphasis and no "**Label:** sentence" bullet lists.

4. Make a vertical list only for three or more parallel items or steps, with one instruction per item.

5. Use no emoji, and straight quotes ' " rather than curly ones.

6. Put the warning before the risk: "Do not run this against production. The command deletes rows."

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
