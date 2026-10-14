# Monoize V10.7 — Mistakes Count as Grades

## What's new
- Students can choose **any physical cable** between an output and an input; wrong choices remain on the board and are scored after submission. Acoustic and wireless retain visible labels; physical cable names remain hidden until submission.
- Students can select the wrong equipment from the *teacher-permitted equipment bank* and still submit for partial credit. The teacher exemplar remains separate.
- Raw scoring: **30% equipment identification** and **70% correct connections**. Extra incorrect devices or wires reduce the relevant score; missing items also lower it.
- The saved assignment's existing grading settings still apply, including second-attempt deductions, daily attempt resets, grade visibility, and the 50% recorded-grade floor.
- Audio Interface standard **stereo line output** supports **TRS and TS** cable selections. This is a teaching simplification: on real interfaces, TRS is generally the preferred balanced connection, while whether TS is supported depends on the device's output design. Verify hardware manuals before wiring physical equipment.
- Structural safety remains: a connection requires actual ports; a port cannot have two incoming/outgoing wires; nonexistent cable IDs are not accepted.

## Update existing Netlify deployment
1. Extract this ZIP.
2. Upload the files **inside** the extracted monoize_v107 folder to your existing GitHub repository, replacing matching files in their original directories.
3. Commit the changes and wait for Netlify's deployment to publish.
4. Test with a sample student, including a wrong cable and a wrong permitted device; verify that the grading receipt and attempt count appear in Teacher Studio.

**Note:** Teacher-edited catalog ports are preserved. If you manually customized the Audio Interface output, V10.7 only adds TS to an output still named 'Stereo line output' that already accepts TRS. Existing saved answer keys are not rewritten.

The changes have been syntax and package-checked, but not verified against your live Netlify data.


## V10.8 — Attempt status / TS outputs
- Entering a first name and class no longer triggers a scary submission-limit error toast. Status instead clearly states how many submissions the server has **already recorded for today** and how many remain. The second attempt stays enabled when exactly one of two attempts has been used. An actual two-of-two limit still prevents another graded submission; teacher reset is available.
- Generic Audio Mixer main TRS line out and RØDECaster main TRS out now permit TS as a physically possible unbalanced cable too. Existing saved stock ports are upgraded automatically without overwriting image changes or custom names. Teacher exemplar controls whether TS earns full credit.
- Existing recorded attempt counts are intentionally preserved: reinstalling code does not reset used submissions.


## V10.9 — Teacher reset from Grades & Results
The teacher can reset a student’s attempts for any assignment at any time (no 100% first-attempt requirement). Enter assignment ID, first name, class period or click Reset attempts beside an existing grade. Only the current Denver-day attempt counter is reset. Historical submissions and grades are retained. This reset does not alter a prior score or reset other students.


## V10.10 disconnect fix
Corrected missing `Board.removeLink()` handler and re-enabled cable SVG pointer hit testing. Every connection row now has a labeled Disconnect button. This does not consume an attempt or clear other wires.


## V10.11 — Clear grades & restart
Teacher Studio → Grades & Results now offers **Clear grades & restart** per student/assignment, both from a grade row and via the student reset fields. Confirmation requires typing `DELETE GRADES`. This deletes ALL recorded results for that student + assignment (including earlier days), resets today's attempt count, and does not affect other students or assignments. Unlike Reset attempts, deletion is permanent. Download a CSV backup first if needed.


## V10.12: Delete all grades
Teacher Studio → Grades & Results now has one Delete All Grades button with an Are you sure? confirmation. This permanently clears all students’ saved grades across every assignment and all attempt counters. It does not delete assignments, equipment, or answer keys. Export CSV first if you need a backup.
