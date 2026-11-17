# 个人主页 · 作品集

Astro 静态站 + Notion 作为内容后台。改内容只用打开 Notion，不用碰代码。

- **框架**：Astro 7（纯静态输出，产物就是几个 HTML/CSS/JS 文件）
- **内容源**：Notion Internal Integration API，构建时拉取
- **图片**：Notion 里用 URL 类型字段存图床直链，站点不搬运图片
- **部署**：GitHub Pages + GitHub Actions

页面区块：首屏 → 关于我 → 技能 → 项目 → 经历（含教育背景）→ 文章 → 联系。
除首屏文案外，全部内容来自 Notion。

---

## 环境要求

Node.js **≥ 22.23.4**（Astro 7 的硬性要求）。先确认：

```bash
node -v
```

版本不够的话，Windows 下用 winget 装，装完要重开终端：

```bash
winget install --id OpenJS.NodeJS.22 --exact
```

---

## 快速开始

```bash
npm install
cp .env.example .env.local     # 填 token 和五个数据源 ID
npm run notion:setup -- --check   # 验证能不能读到
npm run dev                    # http://localhost:4321/
```

**没配凭证也能跑**：缺配置时站点会用 `src/data/fixtures.ts` 里的占位数据，
开发页面顶部有一条提示横幅（这条横幅不会出现在生产构建里）。

---

## 接入 Notion

### 1. 创建集成

<https://www.notion.so/my-integrations> → **New integration** →
Capabilities 至少勾上读取内容 → 复制 **Internal Integration Secret** 填进
`.env.local` 的 `NOTION_API_KEY`。

### 2. 把五个库授权给这个集成

对 Profile / Projects / Skills / Experience / Articles 每个库：
页面右上角 **•••** → **Connections** → 选中刚创建的集成。

> 如果这五个库都挂在同一个父页面下，只授权父页面即可，子库会继承权限。

### 3. 填数据源 ID

在 Notion 里打开某个库 → **•••** → **Copy link**，把链接整段粘进 `.env.local`：

```
NOTION_PROFILE_ID=https://www.notion.so/Profile-41ac81d5c69b809ab37b000b829571ed
```

链接和裸 ID 都认（会自动解析）。也可以直接填数据源 ID。

### 4. 验证

```bash
npm run notion:setup -- --check
```

输出形如 `✓ Projects：4 行（…）`，并且会点名任何**代码期望有、但库里没有**的字段。
改完 Notion 字段名后跑一次这个命令，是最快的排错方式。

---

## Notion 数据结构

字段名在 [src/lib/schema.ts](file:///F:/appwin/Ai%20agent/src/lib/schema.ts) 里集中定义，
读取器和校验脚本共用同一份，改一处即可。

### Profile（取第一行）

| 字段 | 类型 | 用途 |
| --- | --- | --- |
| 姓名 | 文本 | 首屏大字、标题、页脚 |
| 职业定位 | 文本 | 首屏副标题、关于我导语、SEO 标题 |
| 个人简介 | 文本 | 关于我段落；空行分段，首段同时用作 meta description |
| 所在城市 | 地点 | 首屏定位标签，会自动去掉「中国大陆」等国别前缀 |
| 联系邮箱 | Email | 联系区邮箱按钮 |
| GitHub | URL | 导航栏按钮 + 联系区 |
| 头像 | URL | 首屏圆形头像；留空则用姓名首字生成渐变徽标 |
| 学历 / 毕业院校 / 毕业年份 | 单选 / 文本 / 数字 | 经历区底部的「教育背景」信息条，任一留空则自动省略 |
| 资料名称 | 标题 | 备用姓名（「姓名」为空时兜底） |

### Projects

| 字段 | 类型 | 用途 |
| --- | --- | --- |
| 项目名称 | 标题 | 卡片标题。**为空该行会被跳过**，可当草稿占位行用 |
| 摘要 | 文本 | 卡片正文 |
| 分类 | 单选 | 标题上方的彩色小标 |
| 技术栈 | 多选 | 卡片底部胶囊 |
| 封面图片 | URL | 图床直链；留空则回退到页面封面，再留空则用项目首字生成渐变底图 |
| 演示地址 / GitHub | URL | 卡片按钮，任一留空则不渲染对应按钮 |
| 发布状态 | Status | 原样显示为封面右上角徽章，不做过滤 |
| 精选项目 | 复选 | 封面左上角「精选」标；**排序后的第一条**若是精选会占据整行大图版式 |
| 排序 | 数字 | 升序。全部留空时按 Notion 返回顺序，建议认真填 |
| Slug | 文本 | 已读取但当前未使用（详情页路由未做） |

### Skills

| 字段 | 类型 | 用途 |
| --- | --- | --- |
| 技能 | 标题 | 名称。为空的行会被跳过 |
| 分类 | 单选 | 决定分组，留空归入「其他」 |
| 熟悉程度 | 单选 | 有值才显示彩色徽章，留空不占位 |
| 具体说明 | 文本 | 名称下方的说明文字 |
| 排序 | 数字 | 组内升序 |

### Experience

| 字段 | 类型 | 用途 |
| --- | --- | --- |
| 公司名称 | 标题 | 时间线条目标题。为空的行会被跳过 |
| 职位 | 文本 | 公司名称下方彩色行 |
| 开始时间 / 结束时间 | 日期 | 渲染成 `2022.05 — 2024.06`；**结束时间留空显示「至今」**并让节点呼吸发光 |
| 工作职责 | 文本 | 要点列表。换行分隔或整段句号分隔都能正确拆分 |
| 工作成果 | 文本 | 独立的「主要成果」高亮块 |
| 排序 | 数字 | **升序即时间倒序**（库里 1 是最近一段） |

### Articles

结构与 Projects 类似（文章标题 / 摘要 / 分类 / 标签 / 封面图片 / 精选文章 / 排序），
发布时间取自 `created_time`。**当前 0 行时整个区块不渲染**，写入内容后自动出现。

---

## 图片与图床

封面图片是 Notion 的 **URL 类型**字段，填什么就显示什么，站点不做转存也不压缩。
判断标准：链接直接粘到浏览器地址栏能看到图片，就可以填。

图片 404 时卡片会自动摘掉 `<img>`，露出底层的渐变首字图，不会留破图。

---

## 自定义

| 想改什么 | 改哪里 |
| --- | --- |
| 配色、圆角、字体 | `src/styles/global.css` 顶部的 `:root` 令牌 |
| 区块顺序与文案措辞 | `src/pages/index.astro` |
| 导航锚点 | `src/components/Nav.astro` 的 `links` 数组 |
| Notion 字段名 | `src/lib/schema.ts` |
| 部署路径 | `astro.config.mjs` 的 `site` 与 `base` |

### 部署路径

本项目部署在**用户根站点** `https://freext-94.github.io`，仓库名为 `Freext-94.github.io`，
因此 `base` 必须是 `'/'`：

```js
export default defineConfig({
  site: 'https://freext-94.github.io',
  base: '/',
});
```

如果以后换成项目仓库（`https://freext-94.github.io/<仓库名>/`），把 `base` 改成 `'/<仓库名>'`。
**`base` 配错最典型的现象是页面能打开但完全没样式、图片全 404。**

> 注意：只有仓库名严格等于 `<用户名>.github.io` 才是根站点。叫 `github.io` 不算，
> 那会被当成普通项目，地址末尾仍带 `/github.io`。

---

## 构建与检查

```bash
npm run check     # 类型检查
npm run build     # 产物输出到 dist/（会实际请求 Notion，约 1–2 秒）
npm run preview   # 本地预览产物
npm run verify    # check + build，CI 前的自检
```

---

## 部署到 GitHub Pages

1. 建仓库、推代码。
2. **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
3. 配置变量：
   - **Secrets**：`NOTION_API_KEY`
   - **Variables**：`NOTION_PROFILE_ID`、`NOTION_PROJECTS_ID`、`NOTION_SKILLS_ID`、
     `NOTION_EXPERIENCE_ID`、`NOTION_ARTICLES_ID`（ID 不是机密，放 Variables 更合适）
4. 手动跑一次 **Actions → 构建并部署到 GitHub Pages → Run workflow** 完成首次发布。
   之后推送到 `main` 会自动重建。

工作流带了一条 `cron: '0 18 * * *'`（UTC，北京时间凌晨 2 点）的定时构建，
这样只在 Notion 改了内容、没提交代码，第二天也会自动同步。不想每天跑就删掉 `schedule` 段。

---

## 常见问题

**页面能打开但完全没样式** — `astro.config.mjs` 的 `base` 和实际访问路径不一致。

**`unauthorized`** — `NOTION_API_KEY` 不对，或 CI 里没配这个 Secret。

**`restricted_resource`** — 数据库没授权给集成，回到「把五个库授权给这个集成」。

**`object_not_found`** — ID 粘错了。注意「复制数据库链接」拿到的是数据库 ID，
代码两种都支持，但如果链接指向的是某个视图或页面，就解析不出来。

**本地构建卡在超时后报 object_not_found** — 是网络问题被旧版本代码误报了。
现在只有真正的「找不到」才会退化成数据库 ID 解析，网络故障会走重试。
构建约 1–2 秒属正常，超过 10 秒基本是本机到 Notion 的链路问题。

**内容改了但线上没变** — 静态站在重新构建前不会变。推送一次触发构建，或等定时构建。

**某个字段填了却不显示** — 先跑 `npm run notion:setup -- --check`，它会列出缺失字段。

---

## 附录：从零重建 Notion 库

现有库不可用时，可以在某个已授权给集成的父页面下重建一套：

```bash
npm run notion:setup -- https://www.notion.so/父页面-xxxx --write
```

会按 `schema.ts` 的定义创建 Profile / Projects / Skills / Experience / Articles
五个库，并把新 ID 写回 `.env.local`。**重复执行会再建一套同名库**，不要当成同步命令用。
