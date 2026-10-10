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
