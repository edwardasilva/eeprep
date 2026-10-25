# Content strategy: what EE students ask about getting hired

Strategy Bot, 2026-10-25. This file merges my Reddit research with Chief Bot's X research in `x-research-2026-10-25.md`. Every source has a BibTeX entry in `references.bib`, and the tables cite it by key.

The short version: students ask most about the first rung. They want to know how to get any interview, any internship, and any hands-on hardware work. That cluster is bigger than any single topic on the launch plan. So the launch set needs a "Your first internship" page, with a "First hardware experience" section next to it.

## How this was built

- Reddit: about 30 web searches across r/ECE, r/ElectricalEngineering, r/EngineeringStudents, r/EngineeringResumes, r/cscareerquestions, r/chipdesign, r/MEPEngineering, r/SecurityClearance and r/CollegeMajors. Posts are from September 2025 to October 2026, US-centric, with job-ad spam dropped.
- X: Chief Bot's 15 themes and 16 lessons, plus 4 posts Edward and Chief Bot sent me. I checked those 4 with the X API on 2026-10-25. All 4 exist and match the descriptions.
- Link checks: Reddit blocks this box's direct fetches with HTTP 403. So I confirmed each Reddit link through the search index. It returned the thread title and subreddit, and for most threads the post date and comment text. For 22 threads I read the post text or comments. For the other 29 I saw the title and URL only, and I cite them only as evidence that the question gets asked. The `references.bib` note on each entry stays "Accessed 2026-10-25".
- Ranking: each question is ranked by the number of independent sources (distinct posts or threads, X plus Reddit) that I cite for it. It is a count of what we found, not a measure of total volume. Ties are broken by Reddit engagement.
- Each post is one person's case. The lesson column states what holds beyond that one person.

## 1. Top 20 questions, ranked

Each item gives the question, what students are really stuck on, the source count, and the sources.

1. "I've sent hundreds of applications. Why do I get no interviews?" (11 sources)
   Stuck on: they keep applying through the same channel with the same resume and read silence as bad luck. One r/ECE poster sent about 500 applications and got 2 interviews.
   Reddit: `reddit-2026-200-internships`, `reddit-2026-no-internships-projects`, `reddit-2026-200-apps-one-phone`, `reddit-2026-what-actually-worked`. X: `x-PullingABravo-2026-applied12`, `x-StuartRay0-2026-vent`, `x-YungLeanCumShot-2025-cracked`, `x-3184_farm_ridge-2025-tesla35`, `x-getinglouderig-2026-indeed5`, `x-HiddenCircuit-2026-200rej`, `x-Gradient9-2026-nointern`.

2. "Hardware or software? Should I switch from CS to EE, or from EE to software?" (10 sources)
   Stuck on: in the same week they hear "CS is dead, pivot to EE" and "EE majors end up in software". They can't tell which is true.
   Reddit: `reddit-2026-ee-to-swe`, `reddit-2026-rush-to-ee`, `reddit-2026-cs-to-ee`. X: `x-SahilTalwarDev-2026-csdead`, `x-codewithsushi-2026-hwvssw`, `x-riotpyres-2026-eeswe`, `x-arVas231-2026-mecheee`, `x-jacksangl-2026-cepivot`, `x-TheCerebralChic-2026-ecepivot`, `x-nic_amadio-2026-hwpay`.

3. "Entry-level jobs want experience. Where are the real junior roles, and will a test or technician job trap me?" (10 sources)
   Stuck on: they search only for "design engineer" titles. One new grad had a short SpaceX technician stint. Five months out of school, he kept reaching final rounds for FPGA and analog roles with no offer.
   Reddit: `reddit-2026-constant-rejection`, `reddit-2026-how-bad-market`, `reddit-2026-so-job-market`, `reddit-2026-low-expectations`, `reddit-2026-stuck-test-engineer`. X: `x-Faceofboe5-2026-10yrs`, `x-thezachpendley-2025-twoyears`, `x-HiddenCircuit-2026-200rej`, `x-tech_withrobin-2026-sixjunior`, `x-SogeKingu2000-2026-labtech`.

4. "Which EE field is hiring? Power, embedded, RF, semiconductors, data centers?" (9 sources)
   Stuck on: they pick a field by interest or hype, then learn late that some fields hire bachelor's grads and some expect an MS.
   Reddit: `reddit-2026-specialization-future`, `reddit-2026-embedded-vs-power`, `reddit-2026-specialization-2nd-year`, `reddit-2026-mep-data-center-offer`. X: `x-xBitcoin_Teej-2026-infra`, `x-alex_no3l-2026-datacenter`, `x-Chairman43343-2026-powersys`, `x-JHL_Express-2026-drones`, `x-gm16108-2025-utaustin`.

5. "What project should I build so a recruiter cares?" (8 sources)
   Stuck on: they copy project ideas from forums. One commenter says recruiters see the same "basic Arduino" builds over and over. Commenters also disagree on whether personal projects matter at all.
   Reddit: `reddit-2025-resume-project-ee`, `reddit-2025-projects-got-hired`, `reddit-2026-resume-roast-19f`. X: `x-WRoykhan31606-2026-embedded`, `x-TyskiDziku-2026-puttogether`, `x-RubenGonVera-2026-standout`, `x-ElectronJacob-2026-devices`, `x-ApplyBoltApp-2026-astranis`.

6. "What do hardware interviews ask, and why do I fail after the final round?" (8 sources)
   Stuck on: there's no hardware LeetCode. Strong-looking candidates "bomb the interviews", in one firmware hiring manager's words.
   Reddit: `reddit-2026-nvidia-soc-interview`, `reddit-2026-asic-15-days`, `reddit-2026-dv-interview-prep`, `reddit-2026-constant-rejection`. X: `x-i2cjak-2025-battery`, `x-wysiwyg74111299-2026-bomb`, `x-princess_yfe-2026-panel`, `x-sentient_Mas-2025-firstint`.

7. "Will AI replace electrical engineers?" (8 sources)
   Stuck on: an incoming freshman posted a ChatGPT house wiring plan and asked if EE is safe. Commenters found basic errors in it, like a porch light that wasn't connected.
   Reddit: `reddit-2026-ai-replace-ee`, `reddit-2025-ai-replaced-or-evolve`, `reddit-2026-ee-and-ai`. X: `x-Abuu_300-2026-replace`, `x-ravikiran_dev7-2026-gpt6`, `x-DThucydides-2026-safeai`, `x-hilmybox-2026-curricula`, `x-Kila_Tech-2026-adapt`.

8. "What's wrong with my resume, and does my GPA matter?" (7 sources)
   Stuck on: resumes that run two pages, hide the graduation date, and leave out GPA and coursework. Freshmen with a 2.6 to 3.0 GPA ask if they are already filtered out.
   Reddit: `reddit-2026-200-internships`, `reddit-2026-resume-roast-19f`, `reddit-2026-resume-rising-3rd`, `reddit-2026-200-apps-one-phone`, `reddit-2025-gpa-matter`, `reddit-2026-low-gpa-internship`. X: `x-3184_farm_ridge-2025-tesla35`.

9. "Is a master's or PhD worth it, or is it a way to wait out the market?" (7 sources)
   Stuck on: they weigh about $50k of debt against a market they can't read.
   Reddit: `reddit-2026-masters-worth-it`, `reddit-2026-masters-after-grad`. X: `x-Athazagor-2025-masters`, `x-JohnnyDollarz-2026-msworth`, `x-5suomynona-2025-50k`, `x-ja17fan2003-2026-phdlock`, `x-gm16108-2025-utaustin`.

10. "Which tools and bench skills should I learn?" (7 sources)
    Stuck on: they list software on a resume but can't run a scope or a function generator unassisted.
    Reddit: `reddit-2026-freshman-skills`, `reddit-2026-kicad-learning`, `reddit-2025-software-every-ee`. X: `x-OnosSpeaks-2025-scope`, `x-labs_yy-2025-labs`, `x-lukeweston-2026-wires`, `x-DesertMouse_97-2026-plc`.

11. "Can I even apply? Citizenship, ITAR, clearance and visas." (7 sources, narrow case)
    Stuck on: they apply for months before noticing "U.S. person required" lines, or they are F-1 students facing sponsorship filters.
    Reddit: `reddit-2026-secret-clearance`, `reddit-2025-f1-survive`. X: `x-getemployedd-2026-varda`, `x-zerogtalent-2026-clearance`, `x-TechBriefInfo-2026-intl`, `x-multiphobe-2026-ukspons`, `x-0x3FFF_-2026-defense`.

12. "How do referrals and career fairs actually work?" (6 sources)
    Stuck on: cold LinkedIn messages that go nowhere. Even a referral is no sure thing. One parent's daughter, with a UT Austin master's, got a referral and no interview.
    Reddit: `reddit-2026-what-actually-worked`, `reddit-2025-referrals-hardware`, `reddit-2026-2nd-year-internship`, `reddit-2026-no-internships-projects`, `reddit-2025-not-waste-undergrad`. X: `x-gm16108-2025-utaustin`.

13. "When does hardware recruiting happen, and where are the postings?" (6 sources)
    Stuck on: CS advice doesn't transfer. A student in August 2026 saw summer 2027 internship posts but few 2027 new-grad posts and worried it meant no jobs.
    Reddit: `reddit-2026-lack-2027-newgrad`, `reddit-2026-200-apps-one-phone`. X: `x-techwithvivian-2025-nohwinfo`, `x-techwithvivian-2025-hwama`, `x-VazeKshitij-2026-hwjob`, `x-PythonHub-2026-simplify`.

14. "I don't have an internship yet. Am I cooked?" (6 sources)
    Stuck on: sophomores and juniors treat one missed summer as the end. Seniors with zero internships ask whether to stop applying.
    Reddit: `reddit-2026-cooked-junior`, `reddit-2026-no-internship-cooked`, `reddit-2026-sophomore-no-internship`, `reddit-2026-no-internships-projects`, `reddit-2026-graduate-no-internships`, `reddit-2026-low-expectations`.

15. "How do I get my first internship with no experience?" (5 sources)
    Stuck on: the loop where experience needs an internship and an internship needs experience. Community college and transfer students ask before they have taken any core EE classes.
    Reddit: `reddit-2026-internships-before-classes`, `reddit-2026-internships-little-experience`, `reddit-2026-2nd-year-internship`, `reddit-2025-not-waste-undergrad`. X: `x-sTYLz2021-2026-space`.

16. "Is EE cooked? What do the unemployment numbers say?" (5 sources)
    Stuck on: viral figures that mix computer engineering with electrical engineering.
    X: `x-getinglouderig-2026-cooked`, `x-LayoffAI-2026-learncode`, `x-Jon_173d-2026-third`, `x-FutureAiSutra-2026-aiproof`. Primary table: `nyfed-2026-outcomes-by-major` (https://www.newyorkfed.org/research/college-labor-market).
    The New York Fed Outcomes by Major table covers graduates aged 22 to 27. It uses 2024 survey data and was released February 4, 2026. Computer engineering unemployment is 7.8%. Electrical engineering unemployment is 3.2%. EE underemployment is 21.1%.

17. "Do clubs, design teams and undergrad research count as experience?" (5 sources)
    Stuck on: freshmen and sophomores don't know these count, or which one to pick.
    Reddit: `reddit-2026-internship-or-research`, `reddit-2026-undergrad-research`, `reddit-2025-not-waste-undergrad`, `reddit-2026-internships-little-experience`. X: `x-irishScott2-2026-kendall`.

18. "Hardware projects cost money. How do I start on a student budget?" (5 sources)
    Stuck on: parts, boards and EDA licenses look expensive next to a free laptop-only CS project.
    X: `x-CodeWithOnari-2025-expensive`, `x-karanbhilhatiya-2026-oppcost`, `x-princess_yfe-2026-budget`, `x-blind_via-2026-altium`, `x-BackwoodsEnginr-2026-kicad`.

19. "Signals and Systems and Fourier transforms make no sense. How do I catch up?" (5 sources)
    Stuck on: the math arrives with no application attached, and it's gone a week after the final.
    X: `x-EmperorChi9617-2026-fourier`, `x-joseph_ofofon-2025-missed`, `x-baby__engineer-2026-s300l`, `x-yoruis27-2026-takehome`, `x-siliconcodesign-2026-analog`.

20. "Should I negotiate my offer? What do interns and co-ops get paid?" (5 sources, partly a narrow case)
    Stuck on: intern-conversion and first offers, with no idea what is normal. The X posts are mostly about Canadian co-op programs, so they are a narrow case for a US site.
    Reddit: `reddit-2026-intern-conversion-salary`, `reddit-2026-negotiate-entry`. X: `x-CKalitin-2026-coop`, `x-asdfjahbo0-2026-rivian`, `x-holycanolii-2026-pipeline`.

Read together, items 1, 5, 12, 13, 14, 15, 17 and 18 are all one question: how do I get my first real hardware experience? Those 8 items have 52 source citations between them (some posts back more than one item), more than any other cluster.

## 2. Lessons and the page map

Page names: Resume, Job market ("Getting a job in this market"), How to study, Signals guide (the signals/DSP guide), and the proposed Your first internship. Section names are working titles. Links are 1 to 3 representative sources. Section 1 has the full list.

| # | Question | Source link | Cite key | General lesson | Target page and section |
|---|---|---|---|---|---|
| 1 | Hundreds of applications, no interviews | [r/ECE, 500 apps for 2 interviews](https://www.reddit.com/r/ECE/comments/1vscm44/how_bad_is_it_to_graduate_with_zero_internships/), [@HiddenCircuit](https://x.com/HiddenCircuit/status/2030726124863467683), [@Gradient9](https://x.com/Gradient9/status/2017492024698732721) | `reddit-2026-no-internships-projects`, `x-HiddenCircuit-2026-200rej`, `x-Gradient9-2026-nointern` | Volume does not fix a broken channel. If 20 applications bring zero interviews, change the resume or the channel before you send 20 more. | Job market > Why online applications go nowhere |
| 2 | Hardware or software, CS to EE | [r/CollegeMajors](https://www.reddit.com/r/CollegeMajors/comments/1t7hi0a/the_rush_to_electrical_engineering_by/), [@SahilTalwarDev](https://x.com/SahilTalwarDev/status/2113857287336923420) | `reddit-2026-rush-to-ee`, `x-SahilTalwarDev-2026-csdead` | EE is a harder degree. It is no shortcut out of a crowded CS market. Embedded and firmware work is the one lane that keeps both doors open. | Job market > Hardware, software, or both |
| 3 | Entry level wants experience, test and technician roles | [r/ElectricalEngineering, 5 months unemployed](https://www.reddit.com/r/ElectricalEngineering/comments/1ub50g2/where_do_i_apply_now_with_constant_rejection_and/), [@Faceofboe5](https://x.com/Faceofboe5/status/2050228727410311464), [r/EE, stuck in test](https://www.reddit.com/r/ElectricalEngineering/comments/1u2vx2q/how_to_not_get_stuck_in_a_career_as_test_engineer/) | `reddit-2026-constant-rejection`, `x-Faceofboe5-2026-10yrs`, `reddit-2026-stuck-test-engineer` | Junior jobs hide under other titles. Search test, validation, manufacturing, controls and field applications engineer too. Treat a test or technician job as a bridge with a planned exit. | Job market > Entry-level wants experience |
| 4 | Which field is hiring | [r/EE, embedded vs power](https://www.reddit.com/r/ElectricalEngineering/comments/1qlaol2/is_it_really_hard_to_get_an_embeddedelectronics/), [@Chairman43343](https://x.com/Chairman43343/status/2049629743834894402) | `reddit-2026-embedded-vs-power`, `x-Chairman43343-2026-powersys` | Fields differ in who they hire. Commenters say power hires bachelor's grads steadily, while RF and IC design often expect an MS. Choose with that in view. | Job market > Which EE fields are hiring |
| 5 | What project to build | [r/EE, project for a resume](https://www.reddit.com/r/ElectricalEngineering/comments/1ndmj2u/could_anyone_recommend_a_project_for_ee_majors/), [r/EngineeringStudents](https://www.reddit.com/r/EngineeringStudents/comments/1odiu6l/personal_projects_that_got_you_hired_for/), [@ApplyBoltApp](https://x.com/ApplyBoltApp/status/2104728614407164037) | `reddit-2025-resume-project-ee`, `reddit-2025-projects-got-hired`, `x-ApplyBoltApp-2026-astranis` | One project you can defend line by line beats five you copied. One commenter's DC-DC converter came with an 80-page write-up. Another built an Arduino plant monitor and got a 6-month internship at a defense company. His advice is to build a small version of what the target company makes. | Resume > Projects. Your first internship > First hardware experience |
| 6 | Hardware interviews | [r/ECE, NVIDIA SoC new grad](https://www.reddit.com/r/ECE/comments/1s01szz/nvidia_soc_hardware_engineer_new_grad_interview/), [@i2cjak](https://x.com/i2cjak/status/1989855226996953289), [@wysiwyg74111299](https://x.com/wysiwyg74111299/status/2069401935002681453) | `reddit-2026-nvidia-soc-interview`, `x-i2cjak-2025-battery`, `x-wysiwyg74111299-2026-bomb` | Hardware interviews test fundamentals you can drill, like digital logic, timing, op-amps and filters. After every rejection, write down the questions you missed and study those first. | Signals guide > Interview questions. Job market > Turning interviews into offers |
| 7 | Will AI replace EEs | [r/EE, AI wiring plan](https://www.reddit.com/r/ElectricalEngineering/comments/1sujlpy/will_ai_slowly_replace_some_electrical/), [@hilmybox](https://x.com/hilmybox/status/2067277355111092413) | `reddit-2026-ai-replace-ee`, `x-hilmybox-2026-curricula` | AI changes tasks first, and junior tasks most. An engineer still signs off on the design. The bigger risk is fewer intern seats, which raises the bar for hands-on proof. | Job market > AI and EE jobs |
| 8 | Resume and GPA | [r/EE, 200+ apps resume](https://www.reddit.com/r/ElectricalEngineering/comments/1vts6mz/student_electrical_engineering_student_i_applied/), [r/EE, GPA](https://www.reddit.com/r/ElectricalEngineering/comments/1oyd4a7/how_much_does_gpa_matter_when_applying_for/) | `reddit-2026-200-internships`, `reddit-2025-gpa-matter` | A reviewer must see your year, graduation date, GPA and relevant classes in the first glance. GPA mostly matters where a company sets a minimum, and commenters aimed for 3.0. Below it, go where you can talk to a person, like career fairs. | Resume > Education, GPA and coursework |
| 9 | Master's or PhD | [r/EE, is a master's worth it](https://www.reddit.com/r/ElectricalEngineering/comments/1qb7g1d/is_a_masters_degree_worth_it_in_ee_field/), [@5suomynona](https://x.com/5suomynona/status/1988436263133761909) | `reddit-2026-masters-worth-it`, `x-5suomynona-2025-50k` | Decide by subfield. An MS pays off for RF, DSP, analog and IC design. Elsewhere, get hired with the BS, and many employers will pay for the MS later. | Job market > Master's, PhD, or industry |
| 10 | Tools and bench skills | [r/EngineeringStudents, freshman skills](https://www.reddit.com/r/EngineeringStudents/comments/1si0rp5/as_a_freshman_ee_student_what_skills_should_i/), [@OnosSpeaks](https://x.com/OnosSpeaks/status/2001938854585270650) | `reddit-2026-freshman-skills`, `x-OnosSpeaks-2025-scope` | A tool on a resume counts only next to work done in it. List KiCad beside the board you laid out. Learn the scope and function generator until you can use them without help. | How to study > Practice in the lab. Resume > Skills |
| 11 | Citizenship, ITAR, clearance, visas (narrow) | [r/SecurityClearance](https://www.reddit.com/r/SecurityClearance/comments/1s98f7e/internship_or_ft_job_that_requires_secret/), [@getemployedd](https://x.com/getemployedd/status/2105557978330128795) | `reddit-2026-secret-clearance`, `x-getemployedd-2026-varda` | Read the eligibility line before anything else. A "U.S. person required (ITAR)" posting is closed to many international students, however good the fit. Legal details must come from official sources. | Job market > Who can apply (short box) |
| 12 | Referrals and career fairs | [r/EE, 2nd-year internship](https://www.reddit.com/r/ElectricalEngineering/comments/1v36dj4/best_ways_to_get_an_internship_as_2nd_year_ee/), [r/ECE, referrals](https://www.reddit.com/r/ECE/comments/1mojjy7/how_do_you_actually_get_referralsinterviews_for/) | `reddit-2026-2nd-year-internship`, `reddit-2025-referrals-hardware` | People get you past the resume stack. One commenter got zero interviews from online applications unless he had first met the company at a career fair. Professors and alumni are good first contacts. One top comment says many professors can refer students directly. | Your first internship > Cold outreach and career fairs |
| 13 | Recruiting timeline | [r/EE, 2027 new grad jobs](https://www.reddit.com/r/ElectricalEngineering/comments/1vvqcgw/lack_of_2027_new_grad_jobs/), [@techwithvivian](https://x.com/techwithvivian/status/1991690947277840422) | `reddit-2026-lack-2027-newgrad`, `x-techwithvivian-2025-nohwinfo` | Internships post first, in late summer and fall. New-grad roles follow, and commenters saw some open as late as March or April. Apply on that calendar. | Your first internship > Recruiting calendar |
| 14 | No internship yet | [r/EE, junior with no internship](https://www.reddit.com/r/ElectricalEngineering/comments/1qsr99n/am_i_cooked_if_i_dont_have_an_internship_summer/), [r/ECE, 500 apps for 2 interviews](https://www.reddit.com/r/ECE/comments/1vscm44/how_bad_is_it_to_graduate_with_zero_internships/) | `reddit-2026-cooked-junior`, `reddit-2026-no-internships-projects` | One missed summer is a setback you can recover from. On a 500-application thread, commenters pointed to technologist roles, a design team like FSAE, or an 8 to 12 month co-op. Long co-ops often convert to full-time offers. | Your first internship > If this summer falls through |
| 15 | First internship from zero | [r/EE, internships before core classes](https://www.reddit.com/r/ElectricalEngineering/comments/1wjc383/how_to_get_into_internships_without_actually/), [@sTYLz2021](https://x.com/sTYLz2021/status/2078043532250493266) | `reddit-2026-internships-before-classes`, `x-sTYLz2021-2026-space` | A first internship comes from proof you can build and finish something. One commenter got two EE internships at a community college, before any core EE classes, on circuit, PCB and embedded projects. | Your first internship > No experience yet: where to start |
| 16 | Is EE cooked, unemployment data | [New York Fed, Outcomes by Major](https://www.newyorkfed.org/research/college-labor-market), [@LayoffAI](https://x.com/LayoffAI/status/2066522112404177061), [@Jon_173d](https://x.com/Jon_173d/status/2012173550656852015) | `nyfed-2026-outcomes-by-major`, `x-LayoffAI-2026-learncode`, `x-Jon_173d-2026-third` | Viral numbers often blend computer and electrical engineering. Show the majors separately. The New York Fed Outcomes by Major table was released February 4, 2026, covers graduates aged 22 to 27, and uses 2024 survey data. Computer engineering unemployment is 7.8%. Electrical engineering unemployment is 3.2%, and EE underemployment is 21.1%. Cite `nyfed-2026-outcomes-by-major`. | Job market > What the data says |
| 17 | Clubs, teams and research | [r/ECE, internships without experience](https://www.reddit.com/r/ECE/comments/1q4oypq/how_to_get_internships_in_college_without_much/), [r/EE, not wasting undergrad](https://www.reddit.com/r/ElectricalEngineering/comments/1puvlji/how_to_not_waste_my_undergrad_2nd_year_with_no/) | `reddit-2026-internships-little-experience`, `reddit-2025-not-waste-undergrad` | Team competitions and research count as experience, and recruiters treat them that way. A racing or rocket team in year one gives a freshman something real to discuss at a fair. | Your first internship > First hardware experience |
| 18 | Project cost | [@princess_yfe](https://x.com/princess_yfe/status/2052407178993029236), [@blind_via](https://x.com/blind_via/status/2061016080370573758) | `x-princess_yfe-2026-budget`, `x-blind_via-2026-altium` | Most of the cost has a free route. Use the department's idle oscilloscopes, KiCad, and the Altium student license before you buy anything. | Your first internship > First hardware experience: starting on a student budget |
| 19 | Signals and Systems is hard | [@EmperorChi9617](https://x.com/EmperorChi9617/status/2101555675243725149), [@joseph_ofofon](https://x.com/joseph_ofofon/status/2003009472520978548) | `x-EmperorChi9617-2026-fourier`, `x-joseph_ofofon-2025-missed` | Transforms stick when you see them work on a real signal first, like audio or a sensor trace. Students who missed one lecture need a catch-up path, not a full re-read. | Signals guide > Why this matters. How to study > Catching up |
| 20 | Offers and pay (partly narrow) | [r/EE, intern conversion salary](https://www.reddit.com/r/ElectricalEngineering/comments/1vldjgq/intern_conversion_starting_salary_negotiation/), [@CKalitin](https://x.com/CKalitin/status/2089195619122647124) | `reddit-2026-intern-conversion-salary`, `x-CKalitin-2026-coop` | Know the rules of the program before you get the offer. Some co-op programs forbid negotiating. The Canadian co-op case is narrow, so it gets a short box only. Edward's own offer numbers are the best specific here. | Job market > Internship and job offers (short box) |

## 3. Recommended launch-page changes

1. Add "Your first internship" as a fifth launch page. It answers items 12, 13, 14, 15 and 17, and its "First hardware experience" section answers items 5 and 18. That cluster is the biggest in the data.
2. Put a "First hardware experience" section next to "Your first internship", on the same page at launch. It covers what to build, team and research options, and a student-budget starter list. It can split into its own page in Phase 4 if it grows past one screen.
3. Aim "Getting a job in this market" at the senior and new grad. Build it around items 1, 2, 3, 4, 7, 9 and 16. Its first section is "Entry-level wants experience", because that and the no-interviews problem lead the ranking.
4. Give the Resume page a projects section that admits the disagreement. Some commenters say personal projects got them hired. One frequent commenter says recruiters ignore them and value team competitions and research. The page can say both and explain when each holds.
5. Reframe the signals/DSP guide to serve hiring. Keep the subject, but add an "Interview questions" section and an application-first opening. Job seekers asked for interview fundamentals (item 6) far more than for DSP help. Coursework pain about Signals and Systems (item 19) is real but has fewer sources.
6. Keep "How to study", but anchor it to two hiring facts: the GPA cutoff (item 8) and bench skills (item 10). If the launch set must stay at four pages, How to study is the page to move to Phase 4. It has the least hiring evidence behind it.
7. Mark narrow cases. ITAR, visas and Canadian co-op pay get short boxes, not sections.

## 4. Topics with surprising demand that we had not planned

- Power, utilities, MEP and data centers as the entry door. One commenter said MEP and facilities look like the only industries that want new grads right now (`reddit-2026-constant-rejection`). Students also ask whether to take data-center MEP offers (`reddit-2026-mep-data-center-offer`) and whether the FE exam proves power skills (`reddit-2026-fe-power`). Suggested Phase 4 page: "Power, utilities and data centers".
- Staffing agencies and temp-to-hire. Two threads have people who got hired this way. One says the call came 2 days after sending a resume to an agency (`reddit-2026-low-expectations`, `reddit-2026-constant-rejection`). No plan page mentions agencies. Add a section to Job market.
- Interview conversion. Several people reach final rounds and then get ghosted (`reddit-2026-constant-rejection`, `reddit-2026-no-internships-projects`). This deserves its own Job market section, and later a "Hardware interviews" page.
- Community college and transfer students. They ask about internships before their core classes (`reddit-2026-internships-before-classes`). Your first internship can give them a short path.
- Paid auto-apply services. A top comment in `reddit-2026-2nd-year-internship` warns students not to pay for them, and another says the subreddit gets spammed with them. One plain sentence on the Job market page would save students money.
- The space industry. `x-sTYLz2021-2026-space` asks how a senior working fast food lands a first space job. Edward's SpaceX story fits this question directly. It could anchor the Your first internship page.

## 5. Open items

- The New York Fed Outcomes by Major table is checked. It covers graduates aged 22 to 27, uses 2024 survey data, and was released February 4, 2026. Computer engineering unemployment is 7.8%. Electrical engineering unemployment is 3.2%. EE underemployment is 21.1%. Cite `nyfed-2026-outcomes-by-major`. `needs: bib entry`.
- 30 Reddit threads are cited from title and URL only. Before a page quotes one, open it in a browser and confirm the wording.
- No Reddit search covered Signals and Systems coursework. Item 19 rests on X alone.
