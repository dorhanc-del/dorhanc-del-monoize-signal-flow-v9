# Monoize V11.6 — Port pictures + real classroom gear

Small update. Needs V11.5 installed.

Changed files:
- `public/core.js`
- `public/teacher.js`
- `public/teacher.html`
- `public/style.css`
- `netlify/functions/api.mjs`
- `README_START_HERE.md`
- `AUDIO_PORT_AUDIT.md`
- NEW folder `public/images/ports/` (43 port pictures)
- NEW card pictures in `public/images/`: `pa-column-system-card.png`, `mixer-mg10xu-card.jpg`, `monitors-cr35-card.jpg`, `dj-flx4-card.jpg`

## What changed
1. **Port pictures (optional).** In Teacher Studio > Equipment & Cable Library, open an equipment or source card. Under the port lists there is a new **Port pictures** section with one row per input and output. Choose a photo of that jack and click **Upload port picture**. The card saves automatically. **Remove** takes a picture off.
2. **Students see the picture in two places:**
   - Hovering over a port on the canvas shows the picture above the port name.
   - After clicking an output and an input, the connection window shows both port pictures side by side (FROM OUTPUT → TO INPUT).
3. A port that has a picture shows a small white dot on its corner.
4. Ports without a picture work exactly as before.
5. **Built-in port pictures.** Audio Interface (5 ports) and RØDECaster Pro II (8 ports) come with their port pictures already attached. Nothing to upload. They attach to the standard port names; a port you renamed in Teacher Studio will not get one (upload it by hand). If you upload your own picture or click Remove, your choice is kept and the built-in picture does not come back.

6. **New PA Speakers card (LD Systems MAUI 28 G3 MIX column PA).** New card picture. Ports are now:
   - Inputs: Input 1, Input 2, Input 3, Input 4 (XLR / 1/4" TRS / 1/4" TS combo jacks)
   - Outputs: Monitor 1 out, Monitor 2 out, System Out (XLR)
   - All 7 ports come with port pictures.
   - Footswitch, SysLink and Bluetooth are not modeled.
   - **Saved answer keys still work.** The old Left speaker input is now Input 1 and Right speaker input is now Input 2, in the same positions. Signal-Flow-A1 (Main Out L → Input 1, Main Out R → Input 2) grades the same as before.
   - This switch happens automatically once, and only if the PA card still has the standard Left/Right ports. If you had customized the PA ports in Teacher Studio, the card is left alone.
   - The card is still called "PA Speakers". You can rename it in Teacher Studio.

7. **Three more cards now match the real gear** (new card picture, real ports, every port has a picture):
   - **Audio Mixer = Yamaha MG10XU.** Inputs: Ch 1–4 Mic/Line combo (XLR/TRS/TS), Ch 5/6 and Ch 7/8 line L/R (1/4"), RCA 5 L / RCA 6 R. Outputs: Stereo Out L/R (1/4"), Stereo Out L/R (XLR), Monitor Out L/R. Not modeled: Ch 9/10, RCA 7/8, FX Send, phones, USB.
   - **Studio Monitors = Mackie CR3.5.** Inputs: TRS input L/R (1/4" only — the CR3.5 has **no XLR**, so XLR into the monitors is no longer possible), RCA in L/R. Not modeled: 1/8" Stereo In, passive-speaker output.
   - **DJ Source = Pioneer DDJ-FLX4.** Outputs: Master Out L/R (RCA). New input: Mic input (1/4"). Not modeled: USB-C.
   - **Saved answer keys still work.** The old ports keep their positions with the same jack type: Mic 1/2 → Ch 1/2, Line A/B → Ch 5/6, RCA in L/R → RCA 5/6, Main Out L/R → Stereo Out L/R (1/4"); monitor Left/Right → TRS input L/R; DJ RCA out L/R → Master Out L/R. New ports are added after them, so the mixer's port list reads Ch 1, Ch 2, Ch 5, Ch 6, RCA 5, RCA 6, Ch 3, Ch 4, Ch 7, Ch 8.
   - Only exception: an answer key that sent an **XLR** cable into the Studio Monitors will need re-saving (the real monitors have no XLR jack).
   - Each card switches automatically once, only if its ports were still the standard V11.5 list. Customized cards are left alone. Names stay the same.
8. **Taller cards.** Devices with many ports (like the mixer) get a taller card so the port dots never overlap. A card can now have up to 12 inputs and 12 outputs.

## Rules kept
- Cable names are still hidden until submission. Use port photos that do not have cable names printed on them.
- Grading, attempts, the blank canvas and port positions are unchanged. Saved assignments and answer keys still match.
- Nothing in Netlify Blobs is erased. Images use the same 2 MB limit and file types as card images.

## Install
Unzip, then in GitHub choose **Add file > Upload files** and drag in the extracted `public` and `netlify` folders and the README so every file lands in the same path (the pictures go in `public/images/ports/`). Do not upload the ZIP. Commit, wait for Netlify to say **Published**, then refresh the Student Lab and Teacher Studio.

## Live test after install
1. Teacher Studio: open Audio Interface and the RØDECaster. Confirm every port row in Port pictures already shows a thumbnail.
2. Reload the Teacher Studio page and open the card again. Confirm the picture is still there.
3. Teacher Studio: open PA Speakers. Confirm the new picture, Inputs 1–4, the 3 outputs and their port pictures. Open Signal-Flow-A1 and confirm the exemplar still shows the mixer wired to the PA.
4. Teacher Studio: open Audio Mixer, Studio Monitors and DJ Source. Confirm the new pictures and port lists. Open Signal_FLow_A2 and confirm the RØDECaster still connects to both monitors.
5. Student Lab (`?assignment=demo`): add the interface, hover Combo input 1. Confirm the picture pops up.
6. Connect a mic to that input. Confirm both port pictures show in the connection window.
7. Remove the picture in Teacher Studio. Confirm the port goes back to text only.
8. Submit a demo chain and confirm grading still works.
