# Freext — Personal Portfolio

English · [简体中文](README.md)

This is my job-hunting homepage, and a piece of work in its own right.

I want visitors to quickly see what I've built, what I'm good at, and where I have hands-on experience. The site also answers a question for itself: can you run a personal website without buying a server or building an admin panel, and keep it updated? The answer turned out to be yes — content lives in Notion, Astro generates the pages, and GitHub Actions publishes to GitHub Pages.

Live: [freext-94.github.io](https://freext-94.github.io/)

![Homepage](https://freext-94.github.io/notion-assets/personal-portfolio/01-hero.webp)

## Screens

| Portfolio | Mobile |
| --- | --- |
| ![Portfolio](https://freext-94.github.io/notion-assets/personal-portfolio/05-portfolio.webp) | ![Mobile](https://freext-94.github.io/notion-assets/personal-portfolio/07-mobile.webp) |

## What's inside

The homepage covers my intro, skills, work history, and a few featured projects. Each project opens into a full write-up, all projects live under the portfolio page, and articles have their own index. Contact details are on the homepage.

Project write-ups — background, process, responsibilities, images, links — live directly in the body of the corresponding Notion page. **Notion is the single source of content**: the site reads it at build time, and the repo deliberately keeps no duplicate Markdown copy, so the two can't drift apart.

A project's status shows up as a tag but doesn't control whether it's published. Rows with an empty title are skipped; if the articles database is empty, the articles section simply doesn't render.

## Run it locally

You need Node.js 22.23.4 or newer. Install dependencies, then set up local config:

```bash
npm install
Copy-Item .env.example .env.local
```

Fill in your Notion credentials in `.env.local`, then:

```bash
npm run notion:setup -- --check
npm run dev
```

Open <http://localhost:4321/>.

Without Notion configured, development falls back to built-in sample content. A production build without Notion config fails on purpose, so sample data never ships. `.env.local` holds a secret: don't commit it, don't paste it into public chats.

Variable names are listed in `.env.example`: `NOTION_API_KEY` plus five database IDs. An ID can be a Notion database URL, a database ID, or a data source ID. Remember to connect all five databases to your Notion integration.

## Working with Notion

Day to day, edit your intro, skills, experience, projects, or articles in the corresponding Notion database. Project write-ups are edited in the project page body, with headings, paragraphs, lists, bold text, links, images, and embeds.

To check the databases are readable and the fields line up:

```bash
npm run notion:setup -- --check
```

It only checks; it never modifies your databases. Field names and how they're read live in [`src/lib/schema.ts`](src/lib/schema.ts).

## Deployment

Pushing to `main` makes GitHub Actions check the Notion config, install dependencies, build the site, and publish to GitHub Pages. After changing content in Notion, trigger a build and the site updates. You can also run the workflow manually from the repository's **Actions** tab.

Set the repository's Pages source to **GitHub Actions**. The workflow needs:

- Secret: `NOTION_API_KEY`
- Variables: `NOTION_PROFILE_ID`, `NOTION_PROJECTS_ID`, `NOTION_SKILLS_ID`, `NOTION_EXPERIENCE_ID`, `NOTION_ARTICLES_ID`

Notion, GitHub Actions, and GitHub Pages all have free tiers; there's no server to keep alive. Images live in the repo or behind stable public URLs — Notion's temporary file links expire.

## Commands

```bash
npm run dev       # local development
npm run check     # type-check Astro pages
npm run build     # sync Canva covers, then build
npm run preview   # preview the build
npm run verify    # check + build
```

`npm run build` and `npm run verify` hit Notion; network trouble usually means the build can't fetch content.

The workflow lives at `.github/workflows/deploy.yml` and runs on push to `main` or manually (the daily schedule is currently commented out during optimization). Notion content is read on every build, so changes appear after the next deploy.

## Where to change code

- Homepage sections and order: `src/pages/index.astro`
- Project detail and portfolio index: `src/pages/projects/`
- Article index and detail: `src/pages/articles/`
- Notion field definitions and reading: `src/lib/`
- Colors, type, and global styles: `src/styles/global.css`
- Page components: `src/components/`
- GitHub Pages deployment: `.github/workflows/deploy.yml`

If a field isn't showing up, run `npm run notion:setup -- --check` first. If content changed but the site didn't, check the latest build under GitHub Actions.

## Privacy

- Project write-ups live only in Notion; the repo keeps no copy.
- `.env.local`, `public/covers/`, `scripts/.figure-out/`, and `scripts/.notion-dump/` are all in `.gitignore`, so forks and GitHub archive downloads don't include them.
- Images and screenshots in this repo are the portfolio's own display assets. Never commit the Notion key in `.env.local`, and never paste it into a public chat.

If you want to use this repo as a template, replace `public/avatar.png`, `public/og.png`, and the contents of `public/projects/` with your own assets.
