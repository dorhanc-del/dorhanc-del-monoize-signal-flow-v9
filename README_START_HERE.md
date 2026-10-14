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
