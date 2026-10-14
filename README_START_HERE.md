# Monoize V10.1 — Workspace Zoom & Image Refresh

This release adds canvas zoom (50%-175%, 25% increments) in both Teacher Studio and Student Lab, preserving position/cable drawing and adjusting dragging distance for zoom.

The Teacher Studio asset editor now keeps the just-saved image on screen rather than immediately replacing it with a potentially stale catalog read. It also offers a **Reload saved images** button to confirm what the server currently returns. Newly uploaded image URLs are unique. Student tabs must be reloaded to pick up catalog changes.

## Deploy

Use the existing GitHub-connected Netlify project. Unzip, upload **the contents** of the monoize_v101 folder to the repository root, replace existing files, commit, wait for Published. Do not upload this ZIP using Netlify's static drag-and-drop. Existing environment variables and stored assignment data are not intentionally modified.

## Testing

1. In Teacher Studio, upload one mixer image and wait for the success message. Use Reload saved images to verify.
2. Open Student Lab in a fresh tab, reload the assignment, and confirm it shows the mixer image.
3. Click zoom + and -, verify connections still align with ports, drag cards, then use Reset zoom.
4. Test on a Chromebook before classroom use.

Note: This update fixes the editor's stale-refresh behavior, but a failed live storage write or an existing browser tab may still require investigation. The live Netlify deployment has not been verified by this build.


## V10.2: Student starts with an empty canvas

Teacher Studio continues to save its exemplar layout and answer-key wires. The Student Lab now starts with zero devices, and **Clear workspace** removes every student device and wire. Students select their own devices from the teacher-approved bank. The exemplar is not copied onto the student canvas.

**Teacher setup:** Ensure the equipment bank checkboxes include all the required sources/devices (plus any distractors), and save a complete exemplar with the correct number of equipment cards. The grading server currently requires the student's submitted equipment types and counts to match the exemplar before scoring. An incorrect equipment selection may be rejected without counting as a graded attempt; this is a pre-existing limitation and is not addressed in V10.2.


## V10.3 — Daily attempt resets

Attempts are now tracked per assignment, first name, class, and Denver calendar day. The day changes at midnight America/Denver. Existing grades are preserved; prior attempt state is not deleted. No student can reset assessment attempts. In Teacher Studio > Grades & Results, there is a reset control for a student who scored 100 raw points on the first submission today. Resets permit an additional graded run on the same day; old results remain visible. This is teacher-authenticated. Students using another alias can still bypass attempt limits, as before. Test with a sample identity.

## V10.4 — Selective cable removal and grading breakdown

- In Student Lab and Teacher Studio, click a wire on the canvas and confirm to disconnect only that wire. You can also remove a connection from the Connections list or click Undo last wire. Rewiring does not use an attempt.
- After a successful graded submission, Student Lab displays raw connection accuracy, attempt penalty, and final score. For a second attempt with a 10-point penalty and 100% raw accuracy, the final score is 90%.
- The teacher exemplar and per-assignment grading settings determine the raw score and penalty. If a result is 75%, review the saved answer key and grading penalty in Teacher Studio.


## V10.5 — Image-only cable quiz

The Student Lab cable picker shows pictures/symbols only, without visible cable names or abbreviations.
Teacher Studio still labels cable choices so the answer key is easy to create.
Cable names are retained in accessibility labels and grading data. Existing photos whose labels are baked directly into the lower part of an image are cropped in the selection window.
Connection labels **after** cable selection remain visible on the signal-flow canvas.


## V10.6 — Equity grading + image-only cable assessment
Student cable choices are pictures without names. ACOUSTIC and WIRELESS are labeled since they are not physical cables. Connection lists, lines, and pre-submission feedback do not disclose cable names. After successful submission a list of chosen cable names is displayed.
New grades use the rule `recordedScore = max(50, max(0, rawScore - priorAttempts * penalty))`. Grades & Results displays raw score, deduction, pre-floor score, and whether the 50% floor was applied, with the same detail in CSV export. Earlier stored grades are unchanged. This implements the specifically requested 50% floor and does not claim to implement any other DPS policy.
