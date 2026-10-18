# Monoize V11.4 — RØDECaster ports, answer-key privacy, neutral wires

Small update. Needs V11.3 installed.

Changed files:
- `netlify/functions/api.mjs`
- `public/core.js`
- `AUDIO_PORT_AUDIT.md`
- `README_START_HERE.md`

What changed:
1. **RØDECaster Pro II ports.** It now has USB-C 1, Main Out L, Main Out R and USB-C 2. A correct chain to two speakers uses two separate speaker cables. Old stock ports keep their positions (port 1 = USB, port 2 = main out), so saved assignments and answer keys still match. Custom port edits made in Teacher Studio are left alone.
2. **Answer-key privacy.** The public assignment data no longer includes the teacher's exemplar device layout. Grading is unchanged.
3. **Neutral student wires.** Before submission every student wire is one neutral color, so wire color cannot reveal the cable type. After submission, and always in Teacher Studio, wires use the cable colors again.

Nothing in Netlify Blobs is erased. No assignments, grades, catalogs or images are touched.

Install: unzip, then in GitHub choose Add file > Upload files and upload the extracted files into the same paths (do not upload the ZIP). Commit, wait for Netlify to say Published, then refresh the Student Lab and Teacher Studio.
