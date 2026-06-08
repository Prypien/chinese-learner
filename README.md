# Chinese Learner

Handwriting practice for **A Course in Contemporary Chinese** (當代中文課程), Book 1, Lessons 1–4.

## Open the app (iPad / phone / browser)

**https://prypien.github.io/chinese-learner/**

This is the website — not the GitHub repo page below. Bookmark this link on your iPad.

> **First time setup:** In the repo go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. After the next push, the app URL above will work (not the README).

The GitHub repo page (`github.com/Prypien/chinese-learner`) only shows code and this README. That is normal.

The app is **fully static** (HTML, CSS, JavaScript). No server is required in production. GitHub Pages hosts the built files from the `out/` folder.

## Features

- **Lessons** — vocabulary and practice per lesson (L1–L4)
- **Vocabulary** — all words, filterable by lesson
- **Jen's text** — characters from Jen's self-introduction for exam prep
- **Custom vocabulary** — pick your own word list (saved in the browser)
- **Three practice modes** — with outline, no outline, from memory (pinyin hint)

Works on iPad with Apple Pencil in Safari.

## Build & deploy

Production build (same as GitHub Actions):

```bash
npm install
npm run build
```

Output goes to `out/`. Push to `main` and GitHub Actions deploys to Pages automatically.

Local preview (matches GitHub Pages):

```bash
npm run preview
```

Open http://localhost:4173/chinese-learner/

## Development (optional)

Only needed when editing the app:

```bash
npm run dev
```

Open http://localhost:3000

## Tech

- [Next.js](https://nextjs.org) static export (`output: "export"`)
- [Hanzi Writer](https://chanind.github.io/hanzi-writer/) for stroke practice
- Character stroke data bundled at build time (no external CDN)

## License

Private learning project.
