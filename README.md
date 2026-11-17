# 个人主页 · 作品集

Astro 静态站 + Notion 作为内容后台 + 图床存图。改内容只用打开 Notion，不用碰代码。

- **框架**：Astro 7（纯静态输出，产物就是几个 HTML/CSS/JS 文件）
- **内容源**：Notion Internal Integration API，构建时拉取
- **图片**：Notion 里用 URL 属性存图床直链，站点不搬运图片
- **部署**：GitHub Pages + GitHub Actions

---

## 环境要求

Node.js **≥ 22.23.4**（Astro 7 的硬性要求）。先确认：

```bash
node -v
```

版本不够的话，Windows 下用 winget 装：

```bash
winget install --id OpenJS.NodeJS.22 --exact
```

装完要重开终端才会生效。

---

## 快速开始

```bash
npm install
cp .env.example .env.local   # 填入 Notion 凭证，见下一节
npm run dev                  # http://localhost:4321/portfolio-homepage
```

**没有 Notion 凭证也能跑**：缺配置时站点会用 `src/data/fixtures.ts` 里的示例数据，
开发时页面顶部有一条提示横幅（这条横幅不会出现在生产构建里）。

---

## 接入 Notion

### 1. 创建集成

打开 <https://www.notion.so/my-integrations> → **New integration** →
Capabilities 勾上 `read` 和 `insert`（要让脚本建库就必须开 insert）→
复制 **Internal Integration Secret** 到 `.env.local` 的 `NOTION_API_KEY`。

### 2. 授权父页面

在 Notion 里新建一个页面（比如叫「个人主页」），打开它 → 右上角 **•••** →
**Connections** → **View other connections** → 选中刚创建的集成。

> 只授权父页面就够了，脚本在这个页面下建的四个库会自动继承权限。

### 3. 一键建库

```bash
npm run notion:setup -- https://www.notion.so/你的页面-xxxxxxxx --write
```

`--write` 会把四个数据源 ID 直接写进 `.env.local`。不想自动写文件就去掉这个参数，
脚本会把 ID 打印出来让你自己粘。

字段名很多，**建议用脚本建库而不是手动搭**，手动搭很容易漏字段导致内容显示不出来。

建好后随时可以校验配置：

```bash
npm run notion:setup -- --check
```

### 4. 填内容

四个库分别是：

| 库 | 用途 | 页面区块 |
| --- | --- | --- |
| 🚀 作品集 | 项目卡片 | `#projects` |
| 🛠️ 技能栈 | 分类进度条 | `#skills` |
| 📈 经历 | 时间线 | `#experience` |
| ✉️ 联系方式 | 社交链接 | `#contact` |

字段说明：

**作品集**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| 作品名称 | 标题 | 卡片主标题 |
| 一句话简介 | 文本 | 卡片副文案 |
| 项目说明 | 文本 | 多行文本，每行渲染成一条要点 |
| 标签 / 技术栈 | 多选 | 卡片底部的小胶囊 |
| 封面图 | URL | **填图床直链**；留空则用页面封面，再留空就显示首字渐变图 |
| 在线地址 / 源码地址 | URL | 卡片按钮，任一留空则不渲染对应按钮 |
| 时间 / 我的角色 | 文本 | 角标与署名 |
| 首页展示 | 复选 | 勾选后卡片带「精选」标；第一行勾上会占据整行大图版式 |
| 排序 | 数字 | 升序。**留空全部为 0，顺序由 Notion 返回结果决定**，建议认真填 |

**技能栈**：技能名称（标题）、分类（单选，决定分组）、熟练度（百分比数字，
`0.9` 和 `90` 两种写法都认）、补充说明（鼠标悬停 title）、图标（单选 emoji）、排序。

**经历**：职位（标题）、单位、时间、地点、工作内容（多行文本，每行一条）、
进行中（复选，时间线节点会呼吸发光）、类型（单选）、排序（数字越大越靠前）。

**联系方式**：名称（标题）、地址（URL）、图标（单选，可选
`github / twitter / linkedin / mail / wechat / blog / zhihu / juejin / bilibili / telegram / link`）、
展示文案、是否邮箱（复选，勾上则不带 `target="_blank"`）、排序。

---

## 图片与图床

封面图字段是 Notion 的 **URL 类型**，填什么就显示什么，站点不做转存、不做压缩。
所以任何能给出直链的图床都能用：Cloudflare R2 / OSS / imgbed / GitHub 仓库 raw 链接等。

判断标准：把链接直接粘到浏览器地址栏能看到图片，就可以填。

---

## 自定义

| 想改什么 | 改哪里 |
| --- | --- |
| 姓名、职位、头像、邮箱、简介 | `src/data/profile.ts` |
| 配色、圆角、字体 | `src/styles/global.css` 顶部的 `:root` 令牌 |
| 首页区块顺序 | `src/pages/index.astro` |
| 导航锚点 | `src/components/Nav.astro` 的 `links` 数组 |
| 部署路径 | `astro.config.mjs` 的 `site` 与 `base` |

身份信息（姓名/头像/简介）刻意放在本地而不是 Notion：首屏不用等接口，构建也更稳。

### 部署到 GitHub Pages 项目站点

`https://<用户名>.github.io/<仓库名>/` 这种形式需要设置 `base`：

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://your-username.github.io',
  base: '/your-repo-name',
});
```

部署到用户根站点（`https://<用户名>.github.io`）则把 `base` 改成 `'/'`。
**`base` 配错最典型的现象是样式和图片 404。**

---

## 构建与检查

```bash
npm run check     # 类型检查
npm run build     # 产物输出到 dist/
npm run preview   # 本地预览产物
npm run verify    # check + build，CI 前的自检
```

---

## 部署到 GitHub Pages

1. 建仓库、推代码。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
3. 配置变量：
   - Secrets：`NOTION_API_KEY`
   - Variables（不是机密，放 Variables 更合适）：`NOTION_PROJECTS_ID`、
     `NOTION_SKILLS_ID`、`NOTION_EXPERIENCE_ID`、`NOTION_LINKS_ID`
     ID 从 `.env.local` 里复制即可。
4. 手动跑一次 **Actions → 构建并部署到 GitHub Pages → Run workflow** 完成首次发布。
   之后推送到 `main` 会自动重新构建。

工作流里带了一条 `cron: '0 18 * * *'`（UTC，即北京时间凌晨 2 点）的定时构建，
这样只在 Notion 里改了内容、没提交代码，第二天也会自动同步。不想每天跑就删掉 `schedule` 段。

---

## 常见问题

**页面能打开但完全没样式** — `astro.config.mjs` 的 `base` 和实际访问路径不一致。

**`[notion] 读取失败（unauthorized）`** — `NOTION_API_KEY` 不对，或 CI 里没配这个 Secret。

**`[notion] 读取失败（restricted_resource）`** — 数据库没授权给集成，回到「授权父页面」那一步。

**内容改了但线上没变** — 静态站在重新构建前不会变。推送一次触发构建，或等定时构建。

**某个字段填了却不显示** — 用 `npm run notion:setup -- --check` 确认读到的是哪个库，
再核对字段名是否和 `src/lib/schema.ts` 完全一致（包括空格）。

**想加一整个新区块** — 在 `src/lib/schema.ts` 里加一份集合定义，
跑一次 `notion:setup` 建新库，然后写组件挂到 `index.astro`。
