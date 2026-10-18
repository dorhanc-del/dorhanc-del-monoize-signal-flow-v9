# Monoize V11.5 — Left/right ports (includes V11.4)

Small update. Needs V11.3 installed. Includes everything from V11.4, so you do not need to install V11.4 separately.

Changed files:
- `netlify/functions/api.mjs`
- `public/core.js`
- `AUDIO_PORT_AUDIT.md`
- `README_START_HERE.md`

What changed:
0. **Left and right ports (V11.5).** DJ Source now has RCA out L and R. Audio Interface has Line Out L and R (plus USB). Audio Mixer has Line A (left) and Line B (right) inputs and Main Out L and R. PA Speakers and Studio Monitors each have a Left speaker input and a Right speaker input (combo jacks: XLR, 1/4" TRS or TS only). **No combo or line jack accepts RCA.** RCA has its own separate ports: Audio Mixer and Studio Monitors each have RCA in L and RCA in R (added after the old ports, so old port positions are unchanged). PA Speakers have no RCA input. A saved exemplar that sent RCA into a mixer Line input or a speaker input must be re-saved to the new RCA ports. A stereo chain now needs a wire to each side. Existing port positions are kept, so saved answer keys still match, but an old answer key that used ONE wire into a speaker or mixer will now be missing the second wire. Open those assignments in Teacher Studio and re-save the exemplar. Custom ports are left alone.
1. **RØDECaster Pro II ports.** It now has USB-C 1, Main Out L, Main Out R and USB-C 2. A correct chain to two speakers uses two separate speaker cables. Old stock ports keep their positions (port 1 = USB, port 2 = main out), so saved assignments and answer keys still match. Custom port edits made in Teacher Studio are left alone.
2. **Answer-key privacy.** The public assignment data no longer includes the teacher's exemplar device layout. Grading is unchanged.
3. **Neutral student wires.** Before submission every student wire is one neutral color, so wire color cannot reveal the cable type. After submission, and always in Teacher Studio, wires use the cable colors again.

Nothing in Netlify Blobs is erased. No assignments, grades, catalogs or images are touched.

Install: unzip, then in GitHub choose Add file > Upload files and upload the extracted files into the same paths (do not upload the ZIP). Commit, wait for Netlify to say Published, then refresh the Student Lab and Teacher Studio.
