# Freext的个人主页

基于 Astro 的静态个人主页，使用 Notion 管理内容，并通过 GitHub Actions 发布到 GitHub Pages。

## 项目背景

这个主页首先用于求职展示，让招聘方能集中了解我的技能、项目经验和工作经历。同时，我也把主页本身作为一个工程项目：用 Notion 管理内容，以 Astro 构建静态页面，并通过 GitHub Actions 自动发布到 GitHub Pages，在不购买服务器或额外内容管理服务的情况下完成上线。项目重点是验证一条低成本、易维护的个人内容发布流程，并展示从页面开发到 API 集成和 CI/CD 部署的完整实践。

## 页面内容

页面依次包含首屏、关于我、技能、项目、工作经历、文章和联系方式。Profile、Skills、Projects、Experience、Articles 的内容在构建时从 Notion 读取。

Projects、Skills、Experience、Articles 都会展示有标题的记录。Notion 的「发布状态」只作为状态标签显示，不会筛选或隐藏记录；状态为空时不显示标签。标题为空的记录会跳过。Articles 没有记录时，文章区块不显示。

## 本地运行

环境要求：Node.js `>=22.23.4`。

```bash
npm install
Copy-Item .env.example .env.local
```

在 `.env.local` 中填写 Notion 凭证和五个数据源 ID，然后运行：

```bash
npm run notion:setup -- --check
npm run dev
```

开发服务器默认地址为 <http://localhost:4321/>。如果没有完整配置 Notion，开发环境会使用 `src/data/fixtures.ts` 中的示例数据，并显示提示横幅。生产构建缺少配置时会失败，不会把示例内容发布到网站。

`.env.local` 仅用于本机配置，不能提交到 Git。Notion API 密钥应放在 `NOTION_API_KEY`，其余五个变量为：

```text
NOTION_PROFILE_ID=
NOTION_PROJECTS_ID=
NOTION_SKILLS_ID=
NOTION_EXPERIENCE_ID=
NOTION_ARTICLES_ID=
```

变量可以填写 Notion 数据库链接、数据库 ID 或数据源 ID。分享给集成的数据库需要授予该 Internal Integration 读取权限。

## Notion 数据库

字段名、读取方式和校验规则集中定义在 [`src/lib/schema.ts`](src/lib/schema.ts)。运行 `npm run notion:setup -- --check` 可检查数据库是否可访问及是否缺少代码所需的字段。此命令只检查，不会更改数据库。

| 数据库 | 必需字段 | 用途 |
| --- | --- | --- |
| Profile | 资料名称（标题）、姓名、职业定位、个人简介、所在城市、联系邮箱、GitHub、头像、学历、毕业院校、毕业年份、`wechat`、`抖音` | 个人资料。页面使用第一条记录；姓名为空时使用资料名称兜底。`wechat` 与 `抖音` 是 URL 字段，存二维码图片直链；留空则该平台不渲染。加新平台改 `normalize.ts` 的 `SOCIALS` 表并在此补字段。 |
| Projects | 项目名称（标题）、摘要、分类、技术栈、封面图片、演示地址、GitHub、Slug、发布状态、精选项目、排序 | 项目卡片、标签、链接与排序。 |
| Skills | 技能（标题）、分类、技能定位、熟悉程度、技能描述、技能标签、是否展示 | 技能分组、进度条与描述。分类为空时归入「其他」；熟悉程度为百分比数字（`0.85` 与 `85` 两种写法都识别）。 |
| Experience | 公司名称（标题）、职位、开始时间、结束时间、工作职责、工作成果、是否展示、排序 | 工作时间线。结束时间为空时显示「至今」。工作职责与工作成果支持一行一条，也支持整段用句号分隔。 |
| Articles | 文章标题（标题）、摘要、分类、标签、封面图片、精选文章、发布时间、发布状态、排序 | 文章列表。发布时间读取页面创建时间。无文章时整个区块不渲染。 |

Projects 与 Articles 的「发布状态」使用 Notion Status 属性，页面显示状态名称原文；Skills 与 Experience 库没有该字段，页面上也不显示状态标签。选项由 Notion 数据库自身管理，修改时以数据库实际取值为准。当前网站不根据状态筛选记录。

「是否展示」取消勾选后，该条技能或经历不会出现在页面上。字段本身被删除时视为全部可见，避免误清空整个区块。

Skills 库没有排序字段，技能按熟悉程度降序排列，分类顺序取该分类下最高熟练度，因此最强的能力会排在前面。Experience 的排序字段按升序排列，值越小越早显示。Projects 与 Articles 按排序字段升序。无标题的内容记录会被忽略。

### 图片

封面图片与头像使用 URL 字段。填写可直接访问的图片链接；图片无法加载时，项目卡片会使用渐变背景和标题首字作为占位。

### 项目详情配图

项目详情页的配图定义在 `scripts/figures/project-figures.mjs`，每个项目两张，1600×1000、浅色底，配色取自站点设计令牌。改完定义后重新渲染：

```bash
npm run figures                    # 全部重渲
npm run figures -- --only=city     # 只渲 slug 含 city 的项目
```

产物写入 `public/projects/<slug>/fig-*.webp`。配图以 GitHub Pages 外链插入 Notion（`node scripts/insert-project-figures.mjs --write`），所以顺序是：先推图片、确认线上可访问，再写 Notion。Notion 自己托管的文件链接一小时就会过期，构建时会变成坏图，不要直接把图上传到 Notion。

## 常用命令

```bash
npm run dev       # 启动本地开发服务器
npm run check     # Astro 类型与组件检查
npm run build     # 生成 dist/ 静态网站；需要访问 Notion
npm run preview   # 本地预览构建结果
npm run verify    # 执行 check 和 build
npm run notion:setup -- --check  # 检查 Notion 数据库
```

## GitHub Pages 部署

工作流位于 `.github/workflows/deploy.yml`，推送到 `main`、每日定时任务或手动触发时会构建并发布网站。Notion 内容在每次构建时读取，因此 Notion 内容更新后会在下一次部署后显示。

在 GitHub 仓库设置 **Settings → Pages → Build and deployment**，将 Source 设为 **GitHub Actions**。然后到 **Settings → Secrets and variables → Actions** 添加：

- Repository secret：`NOTION_API_KEY`
- Repository variables：`NOTION_PROFILE_ID`、`NOTION_PROJECTS_ID`、`NOTION_SKILLS_ID`、`NOTION_EXPERIENCE_ID`、`NOTION_ARTICLES_ID`

工作流会先检查这些配置，再安装依赖、运行 Astro 检查、构建静态文件并部署到 Pages。查看 **Actions** 页面可确认构建和部署结果。

本仓库是用户根站点 `Freext-94.github.io`，`astro.config.mjs` 中的 `base` 应保持为 `/`。

## 修改入口

| 内容 | 文件 |
| --- | --- |
| 页面区块与首页文案 | `src/pages/index.astro` |
| Notion 字段名与数据库结构 | `src/lib/schema.ts` |
| 页面配色、字体和样式变量 | `src/styles/global.css` |
| 字体（思源黑体，自托管） | `src/layouts/Base.astro` 的 `@fontsource-variable/noto-sans-sc` 导入与 `--font-sans` |
| 站点名称 | `src/layouts/Base.astro` 的 `siteName`，取自 Notion「姓名」，格式为 `<姓名>的个人主页` |
| 导航链接 | `src/components/Nav.astro` |
| 项目详情配图 | `scripts/figures/project-figures.mjs` |
| 本地示例数据 | `src/data/fixtures.ts` |
| GitHub Pages 工作流 | `.github/workflows/deploy.yml` |

## 故障排查

- **`unauthorized`**：检查 `NOTION_API_KEY` 是否有效。
- **`restricted_resource`**：确认目标数据库已连接到该 Notion Integration。
- **`object_not_found`**：检查数据库链接或 ID 是否正确，以及集成是否有权限访问。
- **本地 `build` 无法连接 Notion**：检查网络连接；生产构建需要读取 Notion 数据。
- **Notion 更新后网页未变化**：静态页面只会在下一次成功构建和部署后更新，可在 GitHub Actions 手动触发工作流。
- **某字段没有显示**：运行 `npm run notion:setup -- --check` 检查字段是否存在，并确认对应记录已填写。
