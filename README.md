# Freext 的个人主页

[English](README.en.md) · 简体中文

这是我的求职主页，也是我拿来展示的一件作品。

我想让别人打开页面后，能比较快地知道我做过什么、擅长什么、在哪些事情上有实际经验。主页本身也顺便回答一个问题：不买服务器、不另搭后台，能不能把个人网站做出来并持续更新？现在答案是：可以。内容放 Notion，Astro 负责生成网页，GitHub Actions 自动发布到 GitHub Pages。

在线地址：[freext-94.github.io](https://freext-94.github.io/)

![首页](https://freext-94.github.io/notion-assets/personal-portfolio/01-hero.webp)

## 界面

| 作品集 | 手机端 |
| --- | --- |
| ![作品集](https://freext-94.github.io/notion-assets/personal-portfolio/05-portfolio.webp) | ![手机端](https://freext-94.github.io/notion-assets/personal-portfolio/07-mobile.webp) |

## 这里有什么

首页放个人介绍、技能、几段工作经历和精选项目；项目可以点进去看完整过程，全部项目在「作品集」页面，文章在「全部文章」页面，联系方式也在首页。

项目详情里的背景、过程、职责、图片和链接直接写在 Notion 项目页面正文里。**Notion 是唯一的内容来源**，网站构建时读取它；仓库里不再留一份项目正文 Markdown，免得两边改着改着对不上。

Notion 里的状态会显示成标签，但不会决定内容是否展示。标题空着的记录会跳过；文章库为空时，文章区块就不出现。

## 想在本地跑起来

需要 Node.js 22.23.4 或更新版本。先装依赖，再准备本地配置：

```bash
npm install
Copy-Item .env.example .env.local
```

在 `.env.local` 里填好 Notion 配置后：

```bash
npm run notion:setup -- --check
npm run dev
```

然后打开 <http://localhost:4321/>。

开发时如果没配 Notion，会看到内置示例内容；正式构建没有 Notion 配置会直接失败，避免把示例资料发上线。`.env.local` 里有密钥，别提交到 Git，也别贴到公开聊天里。

要填的变量名都在 `.env.example`：`NOTION_API_KEY` 和五个库的 ID。ID 可以填 Notion 数据库链接、数据库 ID 或数据源 ID。记得把这五个库连接到你的 Notion Integration。

## Notion 怎么用

日常改个人介绍、技能、经历、项目或文章，直接去 Notion 对应的库里改。项目详情正文也是在对应项目页面里编辑，支持标题、段落、列表、加粗、链接、图片和嵌入内容。

检查库能不能读取、字段有没有对上：

```bash
npm run notion:setup -- --check
```

它只检查，不会改数据库。字段名和程序怎么读取字段，集中在 [`src/lib/schema.ts`](src/lib/schema.ts) 里。

## 怎么发布

推送到 `main` 后，GitHub Actions 会检查 Notion 配置、安装依赖、构建页面并发布到 GitHub Pages。Notion 内容变了以后，重新触发一次构建就会更新网站。也可以去 GitHub 仓库的 **Actions** 页面手动运行工作流。

仓库的 Pages 来源要设成 **GitHub Actions**。Actions 配置里需要：

- Secret：`NOTION_API_KEY`
- Variables：`NOTION_PROFILE_ID`、`NOTION_PROJECTS_ID`、`NOTION_SKILLS_ID`、`NOTION_EXPERIENCE_ID`、`NOTION_ARTICLES_ID`

整个站点用到的 Notion、GitHub Actions 和 GitHub Pages 都有免费方案；不用自己养一台服务器。图片放在仓库或使用稳定的公开图片链接，Notion 临时文件链接可能过期。

## 常用命令

```bash
npm run dev       # 本地开发
npm run check     # 检查 Astro 页面和类型
npm run build     # 同步 Canva 封面，然后构建网站
npm run preview   # 预览构建结果
npm run verify    # 检查并构建
```

`npm run build` 和 `npm run verify` 会访问 Notion；遇到网络问题时，通常是构建取不到内容。

工作流位于 `.github/workflows/deploy.yml`，推送到 `main` 或手动触发时会构建并发布网站（每日定时任务当前优化阶段暂时关闭）。Notion 内容在每次构建时读取，因此 Notion 内容更新后会在下一次部署后显示。

## 如果要改代码

- 首页内容和区块顺序：`src/pages/index.astro`
- 项目详情和作品集清单：`src/pages/projects/`
- 文章列表和详情：`src/pages/articles/`
- Notion 字段定义和读取：`src/lib/`
- 颜色、字体和全局样式：`src/styles/global.css`
- 页面组件：`src/components/`
- GitHub Pages 自动发布：`.github/workflows/deploy.yml`

有字段没显示时先跑 `npm run notion:setup -- --check`；页面内容更新了但线上没变化时，到 GitHub Actions 看最近一次构建有没有成功。

## 关于隐私

- 项目正文只存在 Notion，仓库不保留副本。
- `.env.local`、`public/covers/`、`scripts/.figure-out/`、`scripts/.notion-dump/` 都在 `.gitignore` 里，fork 或从 GitHub 打包下载不会带上。
- 仓库里的配图与截图属于主页的展示素材；`.env.local` 里的 Notion 密钥不要提交，也不要贴到公开聊天里。

如果你打算把这个仓库当模板分发，把 `public/avatar.png`、`public/og.png` 和 `public/projects/` 换成自己的素材即可。
