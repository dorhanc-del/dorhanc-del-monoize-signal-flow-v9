# MONOIZE SIGNAL FLOW LAB V9 — NETLIFY FREE

V9 has two interfaces:
- `https://YOUR-SITE.netlify.app/` — Student Lab (Chromebook)
- `https://YOUR-SITE.netlify.app/teacher.html` — private-data Teacher Studio (Mac)

The teacher page itself can be visited by anyone, but all assignments, answer keys, uploads, and results require a server-verified teacher session. Never share the teacher password.

## Important: NOT the old drag-and-drop ZIP deployment

Netlify's static drag-and-drop ZIP upload does not deploy the Functions needed for V9 authentication, image uploading, assignment storage, and grading. Use a Git-connected project or the Netlify CLI. For easiest setup:

1. Unzip this package. Create a **private GitHub repository** and upload the contents of the `monoize_v9` folder to the **root** of that repository, including `package.json`, `netlify.toml`, `public/`, and `netlify/functions/`.
2. In Netlify: **Add new project → Import an existing project → GitHub**, connect the repository.
3. Deploy with build directory `public` (the supplied `netlify.toml` already sets it). Netlify installs the `@netlify/blobs` dependency while building.
4. Netlify dashboard → **Project configuration → Environment variables**: add BOTH:
   - `MONOIZE_TEACHER_PASSWORD`: a long, unique teacher password, **not** your Netlify password.
   - `MONOIZE_SESSION_SECRET`: at least 32 random characters, preferably 64. Store privately. Rotating it signs out old sessions.
5. Redeploy after setting variables so the Functions receive them.
6. Visit `/api/status` (it should return `{"ok":true,"configured":true}`) and then visit `/teacher.html`, sign in.
7. Create a new assignment (or load demo), choose devices, draw the answer-key connections, check Published, and Save.
8. Use **Copy Student Link** and share that link in Schoology. Students use Chromebooks and type a class alias/code (avoid full names).
9. Teacher Studio → Grades & Results shows submitted scores and CSV download.

## Teacher Studio features

- Assignment creation + edits, answer-key connections, publishing.
- Equipment/source/destination asset cards; upload/replace an image (PNG/JPG/WEBP/GIF under 2 MB).
- Cable asset cards; upload/replace an image, edit line color and labels.
- Edit input/output connection types (one per line: `Name|XLR,TRS`). Save to update catalog.
- View submissions and download CSV.

## Important instructional and security details

- Answer keys reside in Netlify Blobs and are never sent with the public student challenge.
- The built-in **demo** assignment is included as a starting example.
- Changing ports or cable IDs on already published assignments can invalidate older stored answer keys. Prefer adding new items and testing before changing items heavily.
- Students may inspect the student page but cannot access teacher-only API routes without the teacher cookie. Teacher Studio is password-gated by Netlify Functions.
- This is an early **pilot**, not a district-certified student information system. Store only classroom aliases/codes; verify DPS policies before using student data. No automatic Schoology gradebook sync.
- Login uses an administrator-managed secret environment variable. It has no account-recovery or rate-limiting system; protect the login URL, use a strong password, and test before widespread student use.
- Scores are calculated against **exact matching connections and ports**. Incorrect extra edges do not add points, but a student's score reflects correct required links divided by required links. Change assignment layouts only between use, not during active student work.
- Netlify Blobs are site-wide and persist across deployments. Free-plan availability and quotas depend on Netlify's current terms.
- Because Netlify Blobs is simple key-value storage, this is intended for a small pilot. If class size and grading records grow substantially, migrating results to a proper database may be advisable.

## Local development (on Mac)

Install Node.js (LTS), then in this project folder run:

```bash
npm install
npx netlify dev
```

You may need `npx netlify login`/`npx netlify link` to connect local development to your Netlify project and Netlify Blobs.

## Package structure

- `public/index.html` + `public/student.js`: student interface
- `public/teacher.html` + `public/teacher.js`: teacher interface
- `public/core.js`: drag-and-connect canvas shared by both
- `public/images/`: all supplied equipment images bundled in the app
- `netlify/functions/api.mjs`: protected data, asset uploads and grading API
- `netlify.toml`: build settings and `/api/*` routing
- `package.json`: Netlify Blobs dependency

This package has been syntax/asset checked, but *live Netlify deployment, image uploads, and Mac/Chromebook browser interaction are not yet verified*. Use a trial assignment before teaching with it.


## V9.1 grading rules
Teacher Studio now has Practice / Assessment mode, graded submission limit, per-prior-submission point penalty, feedback detail, score visibility, and lock-after-final-attempt controls. Defaults: Assessment / 2 submissions / -10 points for the second / general feedback / show score / lock after final. The grading API stores counters in Netlify Blobs keyed by assignment and classroom alias. Note: aliases are self-declared and can be changed, so this is not tamper-proof student identity. For high-stakes use integrate verified student identity, and consider transactional storage for concurrent submissions. Previous submissions are retained in results. Existing projects require a Git commit and redeploy.


## V9.2 student identification
Student entry now requires a first name and one class period from 6A, 7A, 8A, or 8B. Attempt limits use assignment + first name + class period. Two students sharing a first name in one class collide; students can evade attempts by changing input. No verified authentication is provided. Previously recorded aliases remain readable in Results as Legacy records. Update requires uploading changed repository files and deploying, not merely uploading this ZIP to Netlify Drop. Use test names until district data policy is confirmed.


## V9.4 port tooltips
Blue input and gold output ports now show a high-contrast tooltip beside the port on hover and keyboard focus, with the port name and supported cable types. This replaces Chrome's unreliable native title tooltip. No changes to your saved assignments or Netlify environment variables are required.


## V9.5 — audio port audit and combo-input corrections

- Built-in generic audio-interface combo input 1 and 2 now accept XLR (mic), 1/4-inch TRS (line), and 1/4-inch TS (instrument).
- RØDECaster Pro II now has four modeled XLR/TRS/TS combo inputs, plus USB and TRS outputs. This models physical inputs without claiming all input configurations are identical.
- Existing teacher-created items, custom image uploads, and assignments are not reset. A migration updates recognizable built-in legacy combo ports at catalog loading time. Customized port definitions are otherwise preserved.
- For an existing assignment whose answer key requires a specific TRS wire, editing catalog port compatibility does NOT change the answer key: reopen the assignment and revise the key in Teacher Studio if necessary.
- Student links and class dropdown (6A, 7A, 8A, 8B) are unchanged. Redeploy through your existing GitHub repository.
- IMPORTANT: These cards simplify real audio: a stereo left/right pair is generally TWO separate channels/cables; USB audio must be supported by both devices, including host/device roles; 1/4-inch TRS may carry balanced mono or unbalanced stereo depending on the device; wireless receiver images may not reflect actual physical XLR connectors. Never use this lab as a real-world wiring specification without consulting model manuals.


## V9.6 dark background
The visual theme now uses a near-black canvas and charcoal panels. Equipment-image areas remain light for contrast; gold/blue ports and color-coded wires remain unchanged. No connector logic, student grading, or signal-level rules changed. Deploy by replacing project files in your existing GitHub repository and committing.


V9.7 diagnostic update (2026-10-10):
- Submission errors now identify the exact invalid connection rather than displaying a generic error.
- Invalid submissions still do NOT use a graded attempt.
- Teacher answer-key errors identify the port/cable that needs correction.
- Teacher "Save Assignment + Key" does not update student attempt counters.
- To record an attempt, students must click "Check & Submit for Grade" and receive a receipt.
- Existing assignments and attempt records are not reset by this deployment.


V9.8 — Student canvas ID correction
-----------------------------------
Student submissions now include the actual canvas devices and the server safely maps recreated equipment cards to the teacher assignment's original device IDs. It checks that the type and number of devices match the assignment, then verifies every cable and port before grading. The 2-attempt / 10-point penalty rules are unchanged, and invalid structural submissions still do not consume an attempt.

For teachers: use a published assignment with equipment nodes and a complete answer key saved. For testing, use a new first-name/class combination or a practice-mode assignment. A successfully graded submission will display a receipt number.

Caution: If an assignment contains multiple copies of the same device, recreated copies are mapped to original slots in insertion order. For such lessons keep the original cards on the canvas and move them rather than removing and recreating them.


## V9.9 — Image upload save fix

In Teacher Studio > Equipment & Cable Library, **Upload image** now uploads the image AND saves it to the currently selected card automatically. You no longer need to click Save card a second time. The selected card stays selected when the catalog refreshes. A visible confirmation appears after the save finishes. Use **Save card / Port configuration** separately for name or port edits. If a save fails, the card is not claimed as updated.

Deploy by committing the full contents of monoize_v99 to the existing GitHub repository. No environment variables or database changes are required.


V10.0 troubleshooting fix:
Teacher Studio → Equipment & Cable Library → select Audio Interface → Restore Audio Interface Ports (keeps image).
Then reload student assignment. Only a successful Check & Submit for Grade response with receipt registers an attempt; Save Assignment + Key never registers attempts.
