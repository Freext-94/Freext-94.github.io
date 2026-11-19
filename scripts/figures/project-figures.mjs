/**
 * 项目详情配图定义 —— 浅色版，配色对齐站点 :root 设计令牌。
 *
 * 每个项目两张：一张讲「怎么做」，一张讲「关键判断」。
 * 画布统一 1600×1000，白卡片 + 浅紫底，和站点浅色主题一致。
 */

export const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1600px;height:1000px}
body{font-family:'Noto Sans SC Variable','Microsoft YaHei',sans-serif;color:#16131f;-webkit-font-smoothing:antialiased}
.fig{
  position:relative;width:1600px;height:1000px;padding:58px 64px 46px;overflow:hidden;
  display:flex;flex-direction:column;
  background:
    radial-gradient(880px 520px at 3% -10%, rgba(109,40,217,.10), transparent 62%),
    radial-gradient(700px 460px at 102% 110%, rgba(219,39,119,.08), transparent 60%),
    #f4f2fa;
}
.fig::before{
  content:'';position:absolute;inset:0;pointer-events:none;
  background-image:
    linear-gradient(rgba(22,19,31,.038) 1px,transparent 1px),
    linear-gradient(90deg,rgba(22,19,31,.038) 1px,transparent 1px);
  background-size:52px 52px;
  -webkit-mask-image:radial-gradient(125% 85% at 50% -5%,#000 22%,transparent 82%);
          mask-image:radial-gradient(125% 85% at 50% -5%,#000 22%,transparent 82%);
}
.wrap{position:relative;z-index:1;display:flex;flex-direction:column;height:100%}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:48px}
.kicker{font-family:var(--mono);font-size:12px;letter-spacing:.18em;color:var(--accent);display:flex;align-items:center;gap:10px;font-weight:600}
.kicker::before{content:'';display:block;width:26px;height:1px;background:currentColor;opacity:.55}
h1{font-size:42px;font-weight:640;line-height:1.28;letter-spacing:-.02em;margin-top:15px;color:#16131f}
.sub{margin-top:13px;font-size:17.5px;line-height:1.66;color:#5c5670;max-width:1090px}
.tag{flex:none;font-family:var(--mono);font-size:11.5px;letter-spacing:.08em;color:#6b6483;border:1px solid rgba(22,19,31,.14);border-radius:999px;padding:8px 14px;white-space:nowrap;margin-top:2px;background:#fff}
.stage{flex:1;display:flex;flex-direction:column;justify-content:center;padding:26px 0 20px;min-height:0}
.foot{margin-top:auto;padding-top:15px;border-top:1px solid rgba(22,19,31,.1);display:flex;justify-content:space-between;gap:24px;font-size:12.5px;color:#8b85a0;line-height:1.5}
.foot b{color:#5c5670;font-weight:600}
.panel{background:#fff;border:1px solid rgba(22,19,31,.085);border-radius:16px}
.mono{font-family:var(--mono);font-variant-numeric:tabular-nums}
.note{margin-top:18px;font-size:15.5px;color:#5c5670;line-height:1.6;display:flex;gap:12px;align-items:flex-start}
.note::before{content:'';flex:none;width:3px;height:18px;border-radius:2px;background:var(--accent);margin-top:3px;opacity:.8}
.card{background:#fff;border:1px solid rgba(22,19,31,.085);border-radius:16px;box-shadow:0 1px 2px rgba(22,19,31,.035),0 10px 24px -20px rgba(22,19,31,.45)}
.arrow{flex:none;display:flex;align-items:center;justify-content:center;color:rgba(22,19,31,.22);font-size:23px;line-height:1}

/* 矩阵 */
.mx{border:1px solid rgba(22,19,31,.1);border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 1px 2px rgba(22,19,31,.035),0 16px 32px -26px rgba(22,19,31,.5)}
.mx-head,.mx-row{display:grid;grid-template-columns:196px repeat(4,1fr)}
.mx-head{border-bottom:1px solid rgba(22,19,31,.1);background:#faf9fe}
.mx-corner{padding:20px 22px;font-size:12.5px;color:#8b85a0;display:flex;flex-direction:column;justify-content:flex-end;gap:4px}
.mx-stage{padding:18px 22px;border-left:1px solid rgba(22,19,31,.08)}
.mx-stage b{display:block;font-size:19px;font-weight:640;letter-spacing:-.01em}
.mx-stage span{display:block;margin-top:5px;font-size:13px;color:#8b85a0}
.mx-stage i{display:block;font-family:var(--mono);font-size:11px;color:var(--accent);letter-spacing:.14em;margin-bottom:8px;font-style:normal;font-weight:600}
.mx-row{border-top:1px solid rgba(22,19,31,.08)}
.mx-label{padding:22px;background:linear-gradient(90deg,color-mix(in srgb,var(--row) 7%,#fff),#fff 96%);border-left:3px solid var(--row)}
.mx-label b{display:block;font-size:20px;font-weight:640}
.mx-label span{display:block;margin-top:6px;font-size:13px;color:#8b85a0}
.mx-cell{padding:22px;border-left:1px solid rgba(22,19,31,.08);font-size:15.5px;line-height:1.62;color:#3f3a4f;display:flex;flex-direction:column;justify-content:center}
.mx-cell em{font-style:normal;color:#8b85a0;font-size:12.5px;display:block;margin-top:6px}

/* 清单表 */
.sheet{border:1px solid rgba(22,19,31,.1);border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 1px 2px rgba(22,19,31,.035),0 16px 32px -26px rgba(22,19,31,.5)}
.sheet-top{display:flex;justify-content:space-between;align-items:baseline;padding:20px 26px;border-bottom:1px solid rgba(22,19,31,.09);background:#faf9fe}
.sheet-top b{font-size:17px;font-weight:640}
.sheet-top span{font-family:var(--mono);font-size:12px;color:#8b85a0;letter-spacing:.06em}
.tr{display:grid;grid-template-columns:1.05fr .92fr .84fr 1.28fr 116px;align-items:center;min-height:88px}
.tr.th{min-height:54px;background:#fbfaff;border-bottom:1px solid rgba(22,19,31,.09);font-size:12.5px;color:#8b85a0;letter-spacing:.06em}
.tr+.tr{border-top:1px solid rgba(22,19,31,.07)}
.td{padding:16px 24px;font-size:15px;color:#3f3a4f;line-height:1.45}
.td:first-child{color:#16131f;font-weight:600}
.pill{display:inline-block;font-size:12.5px;padding:4px 11px;border-radius:999px;border:1px solid;line-height:1.4;white-space:nowrap}
.ok{color:#15803d;border-color:#bbf7d0;background:#f0fdf4}
.wip{color:#b45309;border-color:#fde68a;background:#fffbeb}
.wait{color:#5c5670;border-color:rgba(22,19,31,.14);background:#f6f5fb}

/* 步骤卡 */
.flow{display:grid;grid-template-columns:repeat(4,1fr);gap:56px;position:relative}
.step{position:relative;padding:24px 24px 22px;border-radius:16px;background:#fff;border:1px solid rgba(22,19,31,.085);min-height:300px;display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(22,19,31,.035),0 12px 26px -22px rgba(22,19,31,.5)}
.step .no{font-family:var(--mono);font-size:12px;letter-spacing:.14em;color:var(--accent);font-weight:600}
.step h3{margin-top:12px;font-size:23px;font-weight:640;letter-spacing:-.01em}
.step p{margin-top:12px;font-size:15px;line-height:1.66;color:#5c5670}
.step .body{margin-top:auto;padding-top:18px}
.chipline{display:flex;flex-wrap:wrap;gap:8px}
.chip{font-size:13px;padding:6px 12px;border-radius:999px;border:1px solid rgba(22,19,31,.12);color:#494357;background:#fbfaff;white-space:nowrap}
.chip.v{color:#6d28d9;border-color:rgba(109,40,217,.24);background:rgba(109,40,217,.07)}
.chip.p{color:#be185d;border-color:rgba(219,39,119,.24);background:rgba(219,39,119,.07)}
.chip.a{color:#b45309;border-color:rgba(234,88,12,.26);background:rgba(234,88,12,.07)}
.kv{list-style:none;display:grid;gap:9px}
.kv li{font-size:14.5px;color:#3f3a4f;display:flex;gap:9px;line-height:1.5}
.kv li::before{content:'';flex:none;width:5px;height:5px;border-radius:50%;background:var(--accent);margin-top:8px;opacity:.7}
.step .arrow-r{position:absolute;right:-44px;top:50%;transform:translateY(-50%);width:32px;text-align:center;color:rgba(22,19,31,.2);font-size:21px}

/* 回路 */
.loop-row{display:grid;grid-template-columns:repeat(4,1fr);gap:48px}
.loop-card{padding:22px;border-radius:16px;border:1px solid rgba(22,19,31,.085);background:#fff;min-height:206px;box-shadow:0 1px 2px rgba(22,19,31,.035),0 10px 24px -20px rgba(22,19,31,.45)}
.loop-card b{display:block;font-size:21px;font-weight:640;letter-spacing:-.01em}
.loop-card span{display:block;margin-top:10px;font-size:14.5px;color:#5c5670;line-height:1.62}
.loop-card i{display:block;font-family:var(--mono);font-size:11.5px;color:var(--accent);letter-spacing:.14em;font-style:normal;margin-bottom:10px;font-weight:600}
.loop-back{position:relative;height:112px;margin-top:6px}
.loop-back svg{display:block;width:100%;height:100%}

/* 台账链路 */
.chain{display:grid;grid-template-columns:repeat(6,1fr);gap:22px}
.tile{padding:20px 18px;border-radius:15px;border:1px solid rgba(22,19,31,.085);background:#fff;min-height:196px;display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(22,19,31,.035)}
.tile .no{font-family:var(--mono);font-size:11.5px;color:#8b85a0;letter-spacing:.12em}
.tile b{display:block;margin-top:10px;font-size:19px;font-weight:640;line-height:1.35}
.tile span{display:block;margin-top:8px;font-size:13px;color:#5c5670;line-height:1.55}
.tile em{display:block;margin-top:auto;padding-top:12px;font-size:12px;color:var(--accent);font-style:normal;font-family:var(--mono)}
.drops{display:grid;grid-template-columns:repeat(6,1fr);gap:22px;height:38px}
.drops i{display:block;justify-self:center;width:1px;height:100%;background:linear-gradient(rgba(22,19,31,.18),rgba(22,19,31,.05))}
.ledger{display:flex;align-items:center;justify-content:space-between;gap:32px;padding:24px 30px;border-radius:16px;border:1px solid color-mix(in srgb,var(--accent) 26%,#fff);background:color-mix(in srgb,var(--accent) 6%,#fff);box-shadow:0 1px 2px rgba(22,19,31,.04)}
.ledger b{font-size:24px;font-weight:640;letter-spacing:-.01em}
.ledger span{display:block;margin-top:7px;font-size:14px;color:#5c5670}
.ledger .tags{display:flex;gap:9px;flex-wrap:wrap;justify-content:flex-end}

/* 三问 */
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.q{padding:28px 28px 26px;border-radius:16px;border:1px solid rgba(22,19,31,.085);background:#fff;border-top:3px solid var(--c);display:flex;flex-direction:column;min-height:398px;box-shadow:0 1px 2px rgba(22,19,31,.035),0 14px 30px -24px rgba(22,19,31,.5)}
.q .no{font-family:var(--mono);font-size:12px;color:var(--c);letter-spacing:.16em;font-weight:600}
.q h3{margin-top:14px;font-size:32px;font-weight:640;letter-spacing:-.02em}
.q .desc{margin-top:14px;font-size:15px;line-height:1.7;color:#5c5670}
.q .evi{margin-top:auto;padding-top:22px;border-top:1px dashed rgba(22,19,31,.14)}
.q .evi span{display:block;font-size:12px;color:#8b85a0;letter-spacing:.08em;margin-bottom:10px}
.q .evi b{display:block;font-size:15.5px;font-weight:500;color:#3f3a4f;line-height:1.9}

/* 阶梯 */
.cascade{display:flex;flex-direction:column;gap:16px}
.tier{display:flex;align-items:center;gap:26px;padding:22px 28px;border-radius:15px;border:1px solid rgba(22,19,31,.085);background:#fff;position:relative;overflow:hidden;box-shadow:0 1px 2px rgba(22,19,31,.035)}
.tier::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--c)}
.tier .idx{font-family:var(--mono);font-size:12px;color:var(--c);letter-spacing:.12em;flex:none;width:32px;font-weight:600}
.tier .name{flex:none;width:150px}
.tier .name b{display:block;font-size:22px;font-weight:640}
.tier .name span{display:block;margin-top:4px;font-size:12.5px;color:#8b85a0}
.tier .detail{font-size:16px;color:#3f3a4f;line-height:1.6}
.tier .detail em{font-style:normal;color:#5c5670;font-size:13.5px;display:block;margin-top:5px}
.tier .side{margin-left:auto;font-family:var(--mono);font-size:12px;color:#8b85a0;white-space:nowrap}

/* 追溯链 */
.trace{position:relative;padding-top:54px}
.bracket{position:absolute;left:0;right:0;top:0;height:34px}
.bracket .line{position:absolute;left:36px;right:36px;top:22px;height:1px;background:rgba(22,19,31,.16)}
.bracket .lbl{position:absolute;left:50%;top:0;transform:translateX(-50%);background:#f4f2fa;padding:0 16px;font-family:var(--mono);font-size:12.5px;color:var(--accent);letter-spacing:.06em;font-weight:600}
.bracket .tick{position:absolute;top:16px;width:1px;height:14px;background:rgba(22,19,31,.16)}
.trace-row{display:grid;grid-template-columns:1fr 40px 1fr 40px 1fr;align-items:center}
.doc{padding:24px;border-radius:16px;border:1px solid rgba(22,19,31,.085);background:#fff;min-height:234px;box-shadow:0 1px 2px rgba(22,19,31,.035),0 12px 26px -22px rgba(22,19,31,.45)}
.doc .id{font-family:var(--mono);font-size:12.5px;color:var(--accent);letter-spacing:.06em;font-weight:600}
.doc b{display:block;margin-top:8px;font-size:22px;font-weight:640}
.doc ul{list-style:none;margin-top:18px;display:grid;gap:10px}
.doc li{font-size:14.5px;color:#5c5670;display:flex;justify-content:space-between;gap:12px;border-bottom:1px dashed rgba(22,19,31,.1);padding-bottom:9px}
.doc li span{color:#3f3a4f}
.doc li i{font-style:normal;font-family:var(--mono);font-size:12px;color:#8b85a0}
.qa{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:30px}
.qa div{padding:18px 22px;border-radius:12px;border:1px solid rgba(22,19,31,.09);background:#fff;font-size:15px;color:#3f3a4f;display:flex;gap:12px;align-items:center}
.qa div b{font-family:var(--mono);font-size:11.5px;color:#8b85a0;font-weight:500}

/* 管道 */
.pipe{display:grid;grid-template-columns:repeat(4,1fr);gap:52px}
.pipe .stage-card{padding:24px;border-radius:16px;border:1px solid rgba(22,19,31,.085);background:#fff;min-height:320px;display:flex;flex-direction:column;position:relative;box-shadow:0 1px 2px rgba(22,19,31,.035),0 12px 26px -22px rgba(22,19,31,.45)}
.pipe .stage-card h3{font-size:22px;font-weight:640;letter-spacing:-.01em}
.pipe .stage-card .cap{margin-top:8px;font-size:13.5px;color:#5c5670;line-height:1.6}
.pipe .stage-card .stack{margin-top:26px;display:grid;gap:8px}
.pipe .stage-card .stack span{font-size:14.5px;color:#3f3a4f;border:1px solid rgba(22,19,31,.1);border-radius:8px;padding:9px 12px;background:#fbfaff}
.pipe .arrow-r{position:absolute;right:-40px;top:50%;transform:translateY(-50%);width:28px;text-align:center;color:rgba(22,19,31,.2);font-size:20px;z-index:2}
.verb{position:absolute;right:-46px;top:calc(50% - 26px);width:60px;text-align:center;font-size:11px;color:var(--accent);letter-spacing:.06em;font-family:var(--mono);font-weight:600}

/* 漏斗 */
.funnel{display:flex;flex-direction:column;align-items:center;gap:14px}
.band{width:100%;padding:24px 30px;border-radius:16px;border:1px solid rgba(22,19,31,.085);background:#fff;display:flex;align-items:center;gap:26px;box-shadow:0 1px 2px rgba(22,19,31,.035),0 12px 26px -22px rgba(22,19,31,.45)}
.band .lbl{flex:none;width:130px}
.band .lbl b{display:block;font-size:21px;font-weight:640}
.band .lbl span{display:block;margin-top:4px;font-size:11.5px;color:#8b85a0;font-family:var(--mono);letter-spacing:.08em}
.band .txt{font-size:16px;color:#3f3a4f;line-height:1.6}
.band .flag{margin-left:auto;flex:none;font-size:12.5px;padding:6px 12px;border-radius:999px;border:1px solid rgba(22,19,31,.14);color:#5c5670;background:#fbfaff;white-space:nowrap}
.band.b1{width:100%}
.band.b2{width:88%}
.band.b3{width:76%}
.down{align-self:center;color:rgba(22,19,31,.2);font-size:18px;line-height:1}

/* 时间曲线 */
.chart{position:relative}
.chart svg{display:block;width:100%}
.legend{display:flex;gap:26px;margin-top:8px;padding-left:2px;flex-wrap:wrap}
.legend div{display:flex;align-items:center;gap:9px;font-size:13.5px;color:#5c5670}
.legend i{width:24px;height:3px;border-radius:2px;display:block;flex:none}

/* 定级 */
.grade{display:grid;grid-template-columns:1.1fr 56px .95fr 56px .92fr;align-items:center}
.factor{display:grid;gap:14px}
.factor .fx{padding:18px 20px;border-radius:13px;border:1px solid rgba(22,19,31,.085);background:#fff;box-shadow:0 1px 2px rgba(22,19,31,.03)}
.factor .fx b{display:block;font-size:18px;font-weight:640}
.factor .fx span{display:block;margin-top:6px;font-size:13px;color:#5c5670;line-height:1.55}
.gauge{display:grid;gap:10px}
.gauge .lv{padding:16px 20px;border-radius:12px;border:1px solid;display:flex;align-items:center;justify-content:space-between;gap:14px}
.gauge .lv b{font-size:19px;font-weight:640}
.gauge .lv span{font-size:12.5px;opacity:.8}
.lv.hi{color:#be123c;border-color:#fecdd3;background:#fff1f2}
.lv.mid{color:#b45309;border-color:#fde68a;background:#fffbeb}
.lv.low{color:#15803d;border-color:#bbf7d0;background:#f0fdf4}
.report{padding:22px;border-radius:14px;border:1px solid rgba(22,19,31,.085);background:#fff;box-shadow:0 1px 2px rgba(22,19,31,.03)}
.report b{display:block;font-size:18px;font-weight:640}
.report .row{display:flex;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px dashed rgba(22,19,31,.1);font-size:13.5px;color:#5c5670}
.report .row:last-child{border-bottom:0;padding-bottom:0}
.report .row span{color:#3f3a4f;font-weight:500}
.grade .arrow{font-size:18px}

/* 蛇形步骤 */
.snake{display:grid;grid-template-columns:repeat(3,1fr);gap:40px 72px}
.snake .node{padding:22px 24px;border-radius:16px;border:1px solid rgba(22,19,31,.085);background:#fff;min-height:196px;position:relative;box-shadow:0 1px 2px rgba(22,19,31,.035)}
.snake .node .no{font-family:var(--mono);font-size:11.5px;color:var(--accent);letter-spacing:.14em;font-weight:600}
.snake .node h3{margin-top:10px;font-size:21px;font-weight:640}
.snake .node p{margin-top:8px;font-size:14px;color:#5c5670;line-height:1.6}
.snake .node .check{margin-top:12px;font-size:12.5px;color:#3f3a4f;display:flex;gap:8px;align-items:flex-start}
.snake .node .check b{color:var(--accent);font-weight:600;flex:none}
.snake .node::after{content:'→';position:absolute;right:-52px;top:50%;transform:translateY(-50%);color:rgba(22,19,31,.2);font-size:20px}
.snake .node.r::after{content:'←';left:-52px;right:auto}
.snake .node.i3::after,.snake .node.i6::after{display:none}
.turn{display:flex;justify-content:flex-end;align-items:center;padding-right:196px;height:38px;color:rgba(22,19,31,.28);font-size:19px;margin:0}

/* 金字塔 */
.pyramid{display:grid;grid-template-columns:660px 1fr;gap:60px;align-items:center}
.pyramid svg{display:block;width:100%}
.pyr-notes{display:grid;gap:28px}
.pyr-notes .pn{position:relative;padding-left:22px}
.pyr-notes .pn::before{content:'';position:absolute;left:0;top:6px;bottom:4px;width:2px;background:var(--c);opacity:.55}
.pyr-notes b{display:block;font-size:21px;font-weight:640}
.pyr-notes b em{font-style:normal;font-size:11.5px;font-family:var(--mono);color:#8b85a0;letter-spacing:.08em;margin-left:10px}
.pyr-notes span{display:block;margin-top:7px;font-size:14px;color:#5c5670;line-height:1.62}

/* 成本账单 */
.cost{display:grid;grid-template-columns:400px 1fr;gap:56px;align-items:stretch}
.bill{padding:30px;border-radius:18px;border:1px solid color-mix(in srgb,var(--accent) 24%,#fff);background:linear-gradient(155deg,color-mix(in srgb,var(--accent) 8%,#fff),#fff 72%);display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(22,19,31,.04),0 18px 36px -30px rgba(22,19,31,.6)}
.bill .cap{font-family:var(--mono);font-size:12px;letter-spacing:.12em;color:#5c5670;font-weight:600}
.bill .big{display:flex;align-items:baseline;gap:10px;margin-top:18px}
.bill .big b{font-size:112px;font-weight:600;letter-spacing:-.06em;line-height:1;font-family:var(--mono);color:var(--accent)}
.bill .big span{font-size:17px;color:#5c5670}
.bill .stats{margin-top:auto;padding-top:26px;display:grid;gap:12px}
.bill .stats div{display:flex;justify-content:space-between;font-size:14px;color:#5c5670;border-top:1px dashed rgba(22,19,31,.12);padding-top:12px}
.bill .stats b{color:#16131f;font-weight:600;font-family:var(--mono);font-size:13.5px}
.rows{border:1px solid rgba(22,19,31,.1);border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 1px 2px rgba(22,19,31,.03)}
.rows .rh,.rows .rr{display:grid;grid-template-columns:150px 1fr 110px;align-items:center}
.rows .rh{min-height:48px;font-size:11.5px;color:#8b85a0;letter-spacing:.08em;background:#faf9fe;border-bottom:1px solid rgba(22,19,31,.09)}
.rows .rr{min-height:66px;border-top:1px solid rgba(22,19,31,.07)}
.rows .rr:first-of-type{border-top:0}
.rows .rc{padding:12px 22px;font-size:14.5px;color:#3f3a4f}
.rows .rc:first-child{color:#16131f;font-weight:600}
.rows .rc:last-child{text-align:right;font-family:var(--mono);font-size:14px;color:#5c5670}
.cost-note{margin-top:18px;display:flex;gap:10px;flex-wrap:wrap}
.cost-note span{font-size:12.5px;color:#5c5670;border:1px dashed rgba(22,19,31,.16);border-radius:999px;padding:6px 12px;background:#fff}

/* 排坑 */
.pits{border:1px solid rgba(22,19,31,.1);border-radius:18px;overflow:hidden;background:#fff;box-shadow:0 1px 2px rgba(22,19,31,.035),0 16px 32px -28px rgba(22,19,31,.5)}
.pit{display:grid;grid-template-columns:64px 1fr 1.1fr;align-items:center;min-height:104px}
.pit+.pit{border-top:1px solid rgba(22,19,31,.075)}
.pit .n{padding-left:26px;font-family:var(--mono);font-size:12.5px;color:#8b85a0;letter-spacing:.06em}
.pit .p{padding:18px 26px 18px 8px;font-size:17px;font-weight:600;color:#16131f;line-height:1.5}
.pit .p em{display:block;margin-top:6px;font-style:normal;font-size:13px;color:#8b85a0;font-weight:400;line-height:1.55}
.pit .s{padding:18px 28px;font-size:14.5px;color:#5c5670;line-height:1.62;border-left:1px solid rgba(22,19,31,.075);align-self:stretch;display:flex;align-items:center}
`;

export const THEMES = {
  violet: '#6d28d9',
  pink: '#db2777',
  orange: '#ea580c',
  cyan: '#0891b2',
};

export const figures = [
  /* ── 城市服务 ─────────────────────────────────────────── */
  {
    slug: 'city-service-operations',
    file: 'fig-01-journey-matrix.png',
    theme: 'pink',
    kicker: 'CITY SERVICE · 运营路径',
    title: '供给、入口、内容：落在同一条用户路径上',
    sub: '服务商决定「有没有得用」，功能入口决定「会不会用」，内容运营决定「知不知道」。三条线要交叉在同一段路径里。',
    tag: '城市服务 · 2020—2022',
    body: `
      <div class="mx">
        <div class="mx-head">
          <div class="mx-corner"><span>工作层</span><span>用户路径 →</span></div>
          <div class="mx-stage"><i>01</i><b>发现</b><span>知道有这项服务</span></div>
          <div class="mx-stage"><i>02</i><b>进入</b><span>找得到入口</span></div>
          <div class="mx-stage"><i>03</i><b>使用</b><span>下得了单、办得成</span></div>
          <div class="mx-stage"><i>04</i><b>复用</b><span>下次还愿意来</span></div>
        </div>
        <div class="mx-row" style="--row:${THEMES.pink}">
          <div class="mx-label"><b>供给</b><span>服务商资源</span></div>
          <div class="mx-cell">按类别梳理可接入的服务<em>先有清单，再谈合作</em></div>
          <div class="mx-cell">明确接入方式与结算规则<em>规则前置，后期才可控</em></div>
          <div class="mx-cell">把服务标准写进合作约定<em>响应时效、服务范围</em></div>
          <div class="mx-cell">按合作记录复盘，淘汰不达标的</div>
        </div>
        <div class="mx-row" style="--row:${THEMES.violet}">
          <div class="mx-label"><b>入口</b><span>功能与原型</span></div>
          <div class="mx-cell">入口放在用户本来就会经过的位置</div>
          <div class="mx-cell">页面结构与交互原型先跑一遍<em>与产品、技术确认可行性</em></div>
          <div class="mx-cell">接口联调、上线验收<em>入口可用、信息准确</em></div>
          <div class="mx-cell">修上线初期暴露的配置与展示问题</div>
        </div>
        <div class="mx-row" style="--row:${THEMES.cyan}">
          <div class="mx-label"><b>内容</b><span>自有平台 + 矩阵</span></div>
          <div class="mx-cell">按使用场景选题，不做纯功能介绍</div>
          <div class="mx-cell">功能更新同步出说明</div>
          <div class="mx-cell">教程、服务推荐持续输出<em>降低第一次使用的门槛</em></div>
          <div class="mx-cell">自有平台与自媒体矩阵保持同一节奏</div>
        </div>
      </div>
      <div class="note">服务罗列出来不构成产品。三条线缺一条，用户就停在半路：找得到但用不了，或者能用但不知道。</div>
    `,
    footLeft: '<b>对应正文</b>　项目背景 / 主要工作一至四',
    footRight: '运营动作按用户路径拆解，不是按部门职责拆解',
  },
  {
    slug: 'city-service-operations',
    file: 'fig-02-vendor-list.png',
    theme: 'pink',
    kicker: 'CITY SERVICE · 供给基础',
    title: '服务商资源清单：三列空着，服务质量就不可控',
    sub: '清单不是通讯录。接入方式、结算规则、服务标准写清楚了，后面的联调和运营才有依据。',
    tag: '服务商对接',
    body: `
      <div class="sheet">
        <div class="sheet-top"><b>本地服务商资源清单</b><span>v1.0 · 按服务类别归集</span></div>
        <div class="tr th">
          <div class="td">服务类别</div><div class="td">接入方式</div><div class="td">结算规则</div><div class="td">服务标准</div><div class="td">状态</div>
        </div>
        <div class="tr"><div class="td">家政保洁</div><div class="td">H5 页面接入</div><div class="td">按单结算</div><div class="td">48 小时内响应，明码标价</div><div class="td"><span class="pill ok">已上线</span></div></div>
        <div class="tr"><div class="td">家电维修</div><div class="td">API 对接</div><div class="td">月结</div><div class="td">24 小时上门，配件另计</div><div class="td"><span class="pill ok">已上线</span></div></div>
        <div class="tr"><div class="td">同城配送</div><div class="td">小程序跳转</div><div class="td">按单结算</div><div class="td">2 小时送达，超时赔付</div><div class="td"><span class="pill wip">联调中</span></div></div>
        <div class="tr"><div class="td">社区养老</div><div class="td">人工转接</div><div class="td">月结</div><div class="td">预约制，服务范围限定街道</div><div class="td"><span class="pill wait">洽谈中</span></div></div>
        <div class="tr"><div class="td">汽车服务</div><div class="td">H5 页面接入</div><div class="td">按单结算</div><div class="td">门店核销，价格统一公示</div><div class="td"><span class="pill wait">待评估</span></div></div>
      </div>
      <div class="note">同一类别至少准备两家备选，避免单点依赖；结算方式不同，台账就要分开记。</div>
    `,
    footLeft: '<b>对应正文</b>　主要工作一 · 服务商对接',
    footRight: '表内为示例结构，实际以合作约定为准',
  },

  /* ── 智慧城市 ─────────────────────────────────────────── */
  {
    slug: 'digital-operations',
    file: 'fig-01-requirement-channel.png',
    theme: 'violet',
    kicker: 'SMART CITY · 需求通道',
    title: '需求从基层走到版本，中间不能失真',
    sub: '基层的业务流程受政策与属地影响，同一个功能在不同区县的用法可能完全不同。靠会议纪要和转述，信息一定会丢。',
    tag: '智慧城市 · 2020—2022',
    body: `
      <div class="flow">
        <div class="step">
          <div class="no">STEP 01</div><h3>三类输入</h3>
          <p>先分清来源的可信度，避免把个别用户的偏好当成普遍需求。</p>
          <div class="body"><div class="chipline">
            <span class="chip a">政策要求</span><span class="chip p">业务痛点</span><span class="chip v">使用习惯</span>
          </div></div>
          <div class="arrow-r">→</div>
        </div>
        <div class="step">
          <div class="no">STEP 02</div><h3>归并成一张文档</h3>
          <p>把零散的诉求拆开、合并，标注清楚，产品才排得出优先级。</p>
          <div class="body"><ul class="kv">
            <li>使用频次</li><li>影响范围</li><li>依赖条件</li>
          </ul></div>
          <div class="arrow-r">→</div>
        </div>
        <div class="step">
          <div class="no">STEP 03</div><h3>评审与原型确认</h3>
          <p>产品、技术、业务同场过一遍，交互要贴合基层实际操作习惯。</p>
          <div class="body"><ul class="kv">
            <li>需求评审会</li><li>原型确认</li><li>开发节点跟进</li>
          </ul></div>
          <div class="arrow-r">→</div>
        </div>
        <div class="step">
          <div class="no">STEP 04</div><h3>版本上线</h3>
          <p>验收阶段发现的问题逐条记录、推动修复，再进入下一轮。</p>
          <div class="body"><ul class="kv">
            <li>验收问题清单</li><li>修复跟进</li><li>培训与推广</li>
          </ul></div>
        </div>
      </div>
      <div class="note">需求文档要能回答三件事：谁提出、解决什么问题、上线后怎么验证。缺最后一条，清单就无法验收。</div>
    `,
    footLeft: '<b>对应正文</b>　主要工作一至三',
    footRight: '通道的价值在于可追溯，而不是会议开得多',
  },
  {
    slug: 'digital-operations',
    file: 'fig-02-training-loop.png',
    theme: 'violet',
    kicker: 'SMART CITY · 反哺',
    title: '培训现场，是需求最真实的采样点',
    sub: '正式调研里用户会说「还行」，培训现场他们会直接问「这一步为什么点不动」。卡点比答案更有价值。',
    tag: '培训与推广',
    body: `
      <div class="loop-row">
        <div class="loop-card"><i>01 · 现场</i><b>产品培训</b><span>编制操作指南与培训手册，配演示视频，把学习成本压下来。</span></div>
        <div class="loop-card"><i>02 · 采样</i><b>高频问题</b><span>同一个问题被问第三次，就不是用户不会用，是设计有问题。</span></div>
        <div class="loop-card"><i>03 · 分流</i><b>补文档 或 提需求</b><span>能靠说明解决的补帮助材料，解决不了的进需求池。</span></div>
        <div class="loop-card"><i>04 · 闭环</i><b>下一版修掉</b><span>问题回流到产品，下一次培训讲的是新版本。</span></div>
      </div>
      <div class="loop-back">
        <svg viewBox="0 0 1472 112" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id="loopArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="#6d28d9" stroke-opacity=".6" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </marker>
          </defs>
          <path d="M1360 6 L1360 58 Q1360 74 1344 74 L146 74 Q130 74 130 58 L130 14"
                fill="none" stroke="#6d28d9" stroke-opacity=".34" stroke-width="1.4" stroke-dasharray="5 6" marker-end="url(#loopArrow)"/>
          <text x="746" y="50" fill="#6d28d9" fill-opacity=".85" font-size="13" text-anchor="middle" font-family="ui-monospace, Consolas, monospace" letter-spacing="1">下一场培训 · 用新版本讲</text>
        </svg>
      </div>
      <div class="note">培训不是交付的终点。用户在现场卡住的地方，就是产品下一版要改的地方。</div>
    `,
    footLeft: '<b>对应正文</b>　主要工作三 · 培训与推广',
    footRight: '帮助材料与需求池，是同一批问题的两个出口',
  },

  /* ── 工程物资 ─────────────────────────────────────────── */
  {
    slug: 'engineering-procurement',
    file: 'fig-01-ledger-chain.png',
    theme: 'orange',
    kicker: 'PROCUREMENT · 物资链路',
    title: '六步走完，每一步都落在同一本台账上',
    sub: '工程物资「多、散、急」，靠口头交接，月底对账一定扯皮。让单据先落地，账才对得上。',
    tag: '工程物资 · 2018',
    body: `
      <div class="chain">
        <div class="tile"><div class="no">01</div><b>需求提报</b><span>按施工计划整理采购清单</span><em>用料计划</em></div>
        <div class="tile"><div class="no">02</div><b>招标询价</b><span>拟定招标文件初稿，参与比价</span><em>招标文件</em></div>
        <div class="tile"><div class="no">03</div><b>到货验收</b><span>核对数量、规格与随附资料</span><em>报检记录</em></div>
        <div class="tile"><div class="no">04</div><b>入库登记</b><span>登记数量、批次与存放位置</span><em>入库单</em></div>
        <div class="tile"><div class="no">05</div><b>领用出库</b><span>凭需求单或工单发放</span><em>领用单</em></div>
        <div class="tile"><div class="no">06</div><b>月度对账</b><span>核对入库、出库与库存</span><em>对账表</em></div>
      </div>
      <div class="drops"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div class="ledger">
        <div>
          <b>物资仓储管理台账</b>
          <span>一笔物料一条记录：同一批次能追到供应商，也能追到用在哪。</span>
        </div>
        <div class="tags">
          <span class="chip">数量</span><span class="chip">批次</span><span class="chip">存放位置</span><span class="chip">出入库</span><span class="chip">结算</span>
        </div>
      </div>
      <div class="note">「有单可查、有账可对」不是口号：出库没有单据，库存就一定对不上。</div>
    `,
    footLeft: '<b>对应正文</b>　主要工作一至四',
    footRight: '闭环：需求—采购—验收—入库—出库—对账',
  },
  {
    slug: 'engineering-procurement',
    file: 'fig-02-three-questions.png',
    theme: 'orange',
    kicker: 'PROCUREMENT · 记账的目的',
    title: '每一笔物资，都要能回答三个问题',
    sub: '物资管理的核心不是记账本身，而是任何一笔物料被问起时，都能立刻给出答案。',
    tag: '复盘 · 三个问题',
    body: `
      <div class="three">
        <div class="q" style="--c:${THEMES.orange}">
          <div class="no">QUESTION 01</div>
          <h3>从哪来</h3>
          <div class="desc">哪家供应商、哪一批次、进场时检查过什么。出了问题要能追回源头。</div>
          <div class="evi"><span>答案落在</span><b>送货单 · 报检记录<br>供应商与批次信息</b></div>
        </div>
        <div class="q" style="--c:${THEMES.violet}">
          <div class="no">QUESTION 02</div>
          <h3>到哪去</h3>
          <div class="desc">哪个工单领走的、谁领的、用在哪个部位。没有单据的领用等于丢失。</div>
          <div class="evi"><span>答案落在</span><b>领用单 · 工单<br>领用人与用途</b></div>
        </div>
        <div class="q" style="--c:${THEMES.cyan}">
          <div class="no">QUESTION 03</div>
          <h3>还剩多少</h3>
          <div class="desc">当前库存、月度差异、在途数量。数字对不上，月底就要扯皮。</div>
          <div class="evi"><span>答案落在</span><b>库存台账 · 月度对账表<br>入库与出库流水</b></div>
        </div>
      </div>
      <div class="note">单据和台账必须同步。事后补记，等于没有记录——补出来的账，经不起对。</div>
    `,
    footLeft: '<b>对应正文</b>　复盘 · 三个问题',
    footRight: '台账的价值在可追溯，不在记了多少行',
  },

  /* ── ICT 采购 ─────────────────────────────────────────── */
  {
    slug: 'ict-procurement',
    file: 'fig-01-institution-layers.png',
    theme: 'cyan',
    kicker: 'ICT PROCUREMENT · 流程建设',
    title: '制度要落地，得配三样东西',
    sub: '只发一份管理办法，执行时还是靠人问、靠人记。制度、工具、培训三层都到位，流程才真的跑起来。',
    tag: 'ICT 采购 · 2022—2024',
    body: `
      <div style="display:flex;gap:12px;margin-bottom:22px">
        <span class="chip v">对齐集团要求：关键控制点不降低</span>
        <span class="chip a">适配公司实际：非关键环节简化</span>
      </div>
      <div class="cascade">
        <div class="tier" style="--c:${THEMES.cyan};width:100%">
          <div class="idx">01</div>
          <div class="name"><b>制度</b><span>规则层</span></div>
          <div class="detail">《ICT 项目采购管理办法 V1.0》
            <em>采购方式 · 审批权限 · 执行流程 · 归档要求</em></div>
          <div class="side">可执行</div>
        </div>
        <div class="tier" style="--c:${THEMES.violet};width:92%">
          <div class="idx">02</div>
          <div class="name"><b>工具</b><span>载体层</span></div>
          <div class="detail">采购台账 + 配套表单
            <em>需求表 ↔ 采购执行 ↔ 结算账单，三端关联</em></div>
          <div class="side">可追溯</div>
        </div>
        <div class="tier" style="--c:${THEMES.pink};width:84%">
          <div class="idx">03</div>
          <div class="name"><b>培训</b><span>执行层</span></div>
          <div class="detail">面向需求部门讲清口径
            <em>需求提报口径 · 审批节点 · 材料要求</em></div>
          <div class="side">能照做</div>
        </div>
        <div class="tier" style="--c:${THEMES.orange};width:76%">
          <div class="idx">04</div>
          <div class="name"><b>落地</b><span>结果层</span></div>
          <div class="detail">按流程执行，问题回流修订
            <em>高频问题 → 操作说明 → 下一版制度</em></div>
          <div class="side">跑得动</div>
        </div>
      </div>
      <div class="note">制度是文件，台账和表单才是动作。缺了载体，制度就停在纸面。</div>
    `,
    footLeft: '<b>对应正文</b>　项目背景 / 主要工作一、二、五',
    footRight: '新设公司：守住关键控制点，其余环节留简化空间',
  },
  {
    slug: 'ict-procurement',
    file: 'fig-02-traceability.png',
    theme: 'cyan',
    kicker: 'ICT PROCUREMENT · 台账',
    title: '一笔需求 — 一次采购 — 一张结算',
    sub: '台账的关键是关联，不是记录。三张单据串起来，才能回答钱花在哪、对应哪个需求、结算是否完成。',
    tag: '采购台账',
    body: `
      <div class="trace">
        <div class="bracket">
          <div class="line"></div>
          <div class="lbl">同一项目编号 · ICT-2023-017</div>
          <div class="tick" style="left:36px"></div>
          <div class="tick" style="right:36px"></div>
        </div>
        <div class="trace-row">
          <div class="doc">
            <div class="id">REQ-0231</div>
            <b>采购需求单</b>
            <ul>
              <li><span>需求部门</span><i>运维中心</i></li>
              <li><span>预算金额</span><i>¥ 86,000</i></li>
              <li><span>期望到货</span><i>2023-06</i></li>
            </ul>
          </div>
          <div class="arrow">→</div>
          <div class="doc">
            <div class="id">PO-0187</div>
            <b>采购执行单</b>
            <ul>
              <li><span>供应商</span><i>已准入</i></li>
              <li><span>采购方式</span><i>比价</i></li>
              <li><span>合同金额</span><i>¥ 83,500</i></li>
            </ul>
          </div>
          <div class="arrow">→</div>
          <div class="doc">
            <div class="id">INV-0092</div>
            <b>结算账单</b>
            <ul>
              <li><span>发票状态</span><i>已收票</i></li>
              <li><span>付款进度</span><i>已付款</i></li>
              <li><span>归属需求</span><i>REQ-0231</i></li>
            </ul>
          </div>
        </div>
        <div class="qa">
          <div><b>Q1</b>这笔钱花在哪？</div>
          <div><b>Q2</b>对应哪个需求？</div>
          <div><b>Q3</b>结算是否完成？</div>
        </div>
      </div>
      <div class="note">一张只记采购单号的表格没有多少价值。三端关联后，进度跟踪和数据统计才是顺手的事。</div>
    `,
    footLeft: '<b>对应正文</b>　主要工作二 · 采购台账建设',
    footRight: '表内编号与金额为结构示例',
  },
  /* ── 产品运营 ─────────────────────────────────────────── */
  {
    slug: 'product-operations',
    file: 'fig-01-capability-pipeline.png',
    theme: 'pink',
    kicker: 'PRODUCT OPS · 产品化',
    title: '从原子能力，到能上架的产品',
    sub: 'HIS、LIS、PACS 的能力散在各个项目文档里，销售对外讲一次就要重写一次材料。中间缺的是一层「产品化」的整理。',
    tag: '医疗信息化 · 2022—2024',
    body: `
      <div class="pipe">
        <div class="stage-card">
          <h3>原子能力</h3>
          <div class="cap">系统里的功能模块与服务能力，先全部摊开。</div>
          <div class="stack">
            <span>HIS · 医院信息系统</span>
            <span>LIS · 检验信息系统</span>
            <span>PACS · 影像归档</span>
            <span>其他交付模块</span>
          </div>
          <div class="verb">归类</div>
          <div class="arrow-r">→</div>
        </div>
        <div class="stage-card">
          <h3>产品单元</h3>
          <div class="cap">按业务场景重新组合，每个单元讲得清边界。</div>
          <div class="stack">
            <span>适用场景</span>
            <span>功能边界</span>
            <span>交付形态</span>
          </div>
          <div class="verb">包装</div>
          <div class="arrow-r">→</div>
        </div>
        <div class="stage-card">
          <h3>对外材料</h3>
          <div class="cap">统一口径，换谁去讲都是同一套说法。</div>
          <div class="stack">
            <span>产品目录</span>
            <span>解决方案</span>
            <span>报价口径</span>
          </div>
          <div class="verb">上架</div>
          <div class="arrow-r">→</div>
        </div>
        <div class="stage-card">
          <h3>线上渠道</h3>
          <div class="cap">产品具备可检索、可展示、可推广的载体。</div>
          <div class="stack">
            <span>集团商城</span>
            <span>天翼云</span>
            <span>资质与资料对接</span>
          </div>
        </div>
      </div>
      <div class="note">关键不在「写材料」，在于把技术语言翻译成客户能理解的产品语言，并保证不同人对外描述一致。</div>
    `,
    footLeft: '<b>对应正文</b>　主要工作二、三',
    footRight: '产品化的前提是标准化：先统一术语，再谈复用',
  },
  {
    slug: 'product-operations',
    file: 'fig-02-analysis-to-action.png',
    theme: 'pink',
    kicker: 'PRODUCT OPS · 经营分析',
    title: '经营分析要能回到动作',
    sub: '只呈现收支数字，分析就停在报表层。指出哪类项目毛利偏低、哪个环节成本异常，才叫完成工作。',
    tag: '经营分析与成本管控',
    body: `
      <div class="funnel">
        <div class="band b1">
          <div class="lbl"><b>数据层</b><span>DATA</span></div>
          <div class="txt">按项目与产品维度整理收入、支出与成本构成，形成定期跟踪机制。</div>
          <div class="flag">停在这一层，只是报表</div>
        </div>
        <div class="down">↓</div>
        <div class="band b2">
          <div class="lbl"><b>判断层</b><span>JUDGEMENT</span></div>
          <div class="txt">识别成本异常与毛利波动：哪类项目毛利偏低，哪个环节在吃掉利润。</div>
          <div class="flag">要能指出具体位置</div>
        </div>
        <div class="down">↓</div>
        <div class="band b3">
          <div class="lbl"><b>动作层</b><span>ACTION</span></div>
          <div class="txt">调价、控成本、换资源、调整投入节奏。</div>
          <div class="flag">能回到动作，才算分析</div>
        </div>
      </div>
      <div class="note">数字本身不构成结论。分析材料里如果没有「下一步做什么」，业务方看完还是不知道该怎么办。</div>
    `,
    footLeft: '<b>对应正文</b>　主要工作一 · 经营分析与成本管控',
    footRight: '复盘：经营分析要能回到动作',
  },

  /* ── 舆情 ─────────────────────────────────────────────── */
  {
    slug: 'public-opinion-analysis',
    file: 'fig-01-time-window.png',
    theme: 'pink',
    kicker: 'PUBLIC OPINION · 时间差',
    title: '舆情工作的价值，集中在「时间差」',
    sub: '早一小时发现，处置空间完全不同。等到上了热搜再写总结，能做的事已经很少了。',
    tag: '舆情监测 · 2019—2020',
    body: `
      <div class="chart">
        <svg viewBox="0 0 1472 556" role="img" aria-label="舆情声量随时间变化与可处置窗口">
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#db2777" stop-opacity=".18"/>
              <stop offset="1" stop-color="#db2777" stop-opacity="0"/>
            </linearGradient>
            <marker id="dotArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M2 1L8 5L2 9" fill="none" stroke="#0891b2" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </marker>
          </defs>

          <!-- 网格 -->
          <g stroke="#e7e3f1" stroke-width="1">
            <line x1="80" y1="120" x2="1400" y2="120"/>
            <line x1="80" y1="220" x2="1400" y2="220"/>
            <line x1="80" y1="320" x2="1400" y2="320"/>
            <line x1="80" y1="420" x2="1400" y2="420"/>
          </g>
          <line x1="80" y1="500" x2="1400" y2="500" stroke="#d9d3e6" stroke-width="1"/>
          <text x="80" y="52" fill="#8b85a0" font-size="12.5" font-family="ui-monospace, Consolas, monospace">声量</text>
          <text x="1400" y="534" fill="#8b85a0" font-size="12.5" text-anchor="end" font-family="ui-monospace, Consolas, monospace">时间 →</text>

          <!-- 可处置窗口 -->
          <rect x="440" y="60" width="640" height="440" fill="#db2777" fill-opacity=".055"/>
          <line x1="440" y1="60" x2="440" y2="500" stroke="#db2777" stroke-opacity=".28" stroke-dasharray="4 6"/>
          <line x1="1080" y1="60" x2="1080" y2="500" stroke="#db2777" stroke-opacity=".28" stroke-dasharray="4 6"/>
          <text x="760" y="88" fill="#be185d" fill-opacity=".85" font-size="13" text-anchor="middle" letter-spacing="2" font-family="ui-monospace, Consolas, monospace">可处置窗口</text>

          <!-- 面积 -->
          <path d="M80 492 C220 486 340 474 440 452 C520 434 570 400 630 350 C700 292 750 220 850 175 C930 138 1000 118 1080 114 C1180 110 1280 122 1380 132 L1380 500 L80 500 Z" fill="url(#area)"/>

          <!-- 处置后 -->
          <path d="M80 492 C220 486 340 474 440 452 C520 434 580 408 640 392 C720 372 800 364 900 362 C1020 360 1200 364 1380 368"
                fill="none" stroke="#0891b2" stroke-width="2" stroke-dasharray="6 7" stroke-linecap="round"/>
          <text x="1240" y="352" fill="#0e7490" font-size="13" text-anchor="end" font-family="ui-monospace, Consolas, monospace">及时处置后</text>
          <text x="1240" y="336" fill="#8b85a0" font-size="11.5" text-anchor="end">声量压在低位</text>

          <!-- 实际 -->
          <path d="M80 492 C220 486 340 474 440 452 C520 434 570 400 630 350 C700 292 750 220 850 175 C930 138 1000 118 1080 114 C1180 110 1280 122 1380 132"
                fill="none" stroke="#db2777" stroke-width="2.6" stroke-linecap="round"/>
          <text x="1330" y="112" fill="#be185d" font-size="13" text-anchor="end" font-family="ui-monospace, Consolas, monospace">实际扩散</text>

          <!-- 节点 -->
          <g font-family="'Noto Sans SC Variable',sans-serif">
            <circle cx="250" cy="480" r="5" fill="#fff" stroke="#8b85a0" stroke-width="2"/>
            <text x="250" y="522" font-size="13.5" fill="#5c5670" text-anchor="middle">首发</text>
            <text x="250" y="544" font-size="11.5" fill="#8b85a0" text-anchor="middle">T+0</text>

            <circle cx="440" cy="452" r="6" fill="#fff" stroke="#db2777" stroke-width="2.4"/>
            <text x="418" y="424" font-size="14" fill="#be185d" text-anchor="end" font-weight="600">监测发现</text>
            <text x="418" y="442" font-size="11.5" fill="#8b85a0" text-anchor="end">线索进入视野</text>

            <circle cx="630" cy="350" r="6" fill="#fff" stroke="#db2777" stroke-width="2.4"/>
            <text x="608" y="322" font-size="14" fill="#be185d" text-anchor="end" font-weight="600">研判完成</text>
            <text x="608" y="340" font-size="11.5" fill="#8b85a0" text-anchor="end">性质 · 影响面 · 趋势</text>

            <circle cx="780" cy="225" r="6" fill="#fff" stroke="#db2777" stroke-width="2.4"/>
            <text x="802" y="210" font-size="14" fill="#be185d" font-weight="600">分级上报</text>
            <text x="802" y="228" font-size="11.5" fill="#8b85a0">争取处置时间</text>

            <circle cx="1080" cy="114" r="7" fill="#db2777"/>
            <text x="1080" y="88" font-size="14" fill="#be185d" text-anchor="middle" font-weight="600">热搜</text>
            <text x="1080" y="70" font-size="11.5" fill="#8b85a0" text-anchor="middle">处置空间已经很窄</text>
          </g>
        </svg>
      </div>
      <div class="legend">
        <div><i style="background:#db2777"></i>实际扩散曲线</div>
        <div><i style="background:#0891b2"></i>及时处置后的声量</div>
        <div><i style="background:rgba(219,39,119,.16)"></i>可处置窗口（监测发现 → 热搜）</div>
      </div>
      <div class="note">窗口不是等来的，是监测和研判抢出来的。早发现一小时，可选的处置方式就多几种。</div>
    `,
    footLeft: '<b>对应正文</b>　项目背景 / 主要工作一至三',
    footRight: '曲线为示意，用于说明时间差，不代表具体项目数据',
  },
  {
    slug: 'public-opinion-analysis',
    file: 'fig-02-risk-gauge.png',
    theme: 'pink',
    kicker: 'PUBLIC OPINION · 研判',
    title: '风险等级不是感觉，是三个维度的交叉',
    sub: '事件性质、传播速度、涉事主体，缺一个都判不准。定级之后，上报对象和时效才有依据。',
    tag: '研判与上报',
    body: `
      <div class="grade">
        <div class="factor">
          <div class="fx"><b>事件性质</b><span>政策、安全、民生还是服务纠纷；是不是硬约束。</span></div>
          <div class="fx"><b>传播速度</b><span>从首发到扩散用了多久，转载节点在增加还是衰减。</span></div>
          <div class="fx"><b>涉事主体</b><span>谁被点名，影响面覆盖哪个层级、哪些人群。</span></div>
        </div>
        <div class="arrow">→</div>
        <div class="gauge">
          <div class="lv hi"><b>重要</b><span>即时上报</span></div>
          <div class="lv mid"><b>关注</b><span>2 小时内</span></div>
          <div class="lv low"><b>一般</b><span>并入日报</span></div>
        </div>
        <div class="arrow">→</div>
        <div class="report">
          <b>上报动作</b>
          <div class="row"><span>对象</span>属地 / 上级 / 客户</div>
          <div class="row"><span>时效</span>即时 · 2 小时 · 日报</div>
          <div class="row"><span>内容</span>事实 · 判断 · 建议</div>
        </div>
      </div>
      <div class="note">报告要能落到动作：只讲「发生了什么」价值有限，说清「接下来可能怎样、建议怎么做」才算完成。</div>
    `,
    footLeft: '<b>对应正文</b>　主要工作三 · 研判与上报',
    footRight: '定级标准要沉淀成口径，同类事件判断才一致',
  },

  /* ── 送餐机器人 ───────────────────────────────────────── */
  {
    slug: 'delivery-robot-commissioning',
    file: 'fig-01-delivery-steps.png',
    theme: 'cyan',
    kicker: 'FIELD DELIVERY · 现场实施',
    title: '交付不是「送到就走」',
    sub: '真正决定体验的是现场调试：地图准不准、路线顺不顺、任务稳不稳。每一步都要有验收口径。',
    tag: '服务机器人 · 现场交付',
    body: `
      <div class="snake">
        <div class="node i1"><div class="no">STEP 01</div><h3>设备安装与联网</h3><p>就位、上电、基础检查，配置网络并完成 IOT 绑定。</p><div class="check"><b>验收</b><span>设备在线，状态可监看</span></div></div>
        <div class="node i2"><div class="no">STEP 02</div><h3>地图建图与校准</h3><p>扫描现场环境，标定餐桌、取餐口、充电桩等关键点位。</p><div class="check"><b>验收</b><span>点位准确，定位不漂移</span></div></div>
        <div class="node i3"><div class="no">STEP 03</div><h3>路线调试与避障</h3><p>按实际送餐路径规划，调停靠、避障与语音提示。</p><div class="check"><b>验收</b><span>狭窄通道、高峰拥堵能过</span></div></div>
      </div>
      <div class="turn">↓</div>
      <div class="snake" style="direction:rtl">
        <div class="node i4 r" style="direction:ltr"><div class="no">STEP 04</div><h3>任务测试</h3><p>模拟真实下单，跑通取餐、送达、返航、回充。</p><div class="check"><b>验收</b><span>任务链条闭环，异常可复测</span></div></div>
        <div class="node i5 r" style="direction:ltr"><div class="no">STEP 05</div><h3>培训与交付</h3><p>现场人员操作培训与演示，交付使用说明与常见问题。</p><div class="check"><b>验收</b><span>不依赖调试人员也能用</span></div></div>
        <div class="node i6 r" style="direction:ltr"><div class="no">STEP 06</div><h3>稳定运行</h3><p>在日常营业场景中持续跑，问题有记录、有处理方式。</p><div class="check"><b>验收</b><span>同样指令，每次同样结果</span></div></div>
      </div>
      <div class="note">现场交付的核心是「可复现」：同样的指令，每次都能得到同样的结果，才算调通。</div>
    `,
    footLeft: '<b>对应正文</b>　工作内容一至五',
    footRight: '验收口径写清楚，交付才不靠口头确认',
  },
  {
    slug: 'delivery-robot-commissioning',
    file: 'fig-02-pyramid.png',
    theme: 'cyan',
    kicker: 'FIELD DELIVERY · 三层影响',
    title: '建图决定上限，路线决定体验，培训决定成本',
    sub: '三个层次的影响不是并列的：底下没打好，上面的调试都白费；上面没交付好，后面全是维护工单。',
    tag: '复盘 · 三层影响',
    body: `
      <div class="pyramid">
        <svg viewBox="0 0 660 520" role="img" aria-label="建图、路线、培训三层影响金字塔">
          <defs>
            <linearGradient id="t1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#0e7490"/><stop offset="1" stop-color="#0891b2"/>
            </linearGradient>
            <linearGradient id="t2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#67e8f9"/><stop offset="1" stop-color="#a5f3fc"/>
            </linearGradient>
            <linearGradient id="t3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#cffafe"/><stop offset="1" stop-color="#ecfeff"/>
            </linearGradient>
          </defs>
          <polygon points="330,8 232,150 428,150" fill="url(#t1)"/>
          <polygon points="218,164 442,164 518,312 142,312" fill="url(#t2)"/>
          <polygon points="128,326 532,326 618,474 42,474" fill="url(#t3)" stroke="#a5f3fc" stroke-width="1.5"/>

          <g text-anchor="middle" font-family="'Noto Sans SC Variable',sans-serif">
            <text x="330" y="112" font-size="19" font-weight="640" fill="#ffffff">建图</text>
            <text x="330" y="134" font-size="11.5" fill="#cffafe">决定上限</text>

            <text x="330" y="238" font-size="20" font-weight="640" fill="#155e75">路线</text>
            <text x="330" y="260" font-size="11.5" fill="#0e7490">决定体验</text>

            <text x="330" y="404" font-size="20" font-weight="640" fill="#155e75">培训</text>
            <text x="330" y="426" font-size="11.5" fill="#0e7490">决定后续成本</text>
          </g>
        </svg>
        <div class="pyr-notes">
          <div class="pn" style="--c:#0891b2">
            <b>建图质量<em>LAYER 01</em></b>
            <span>点位标不准，路线规划就没有意义。地图是后面所有调试的地基。</span>
          </div>
          <div class="pn" style="--c:#22d3ee">
            <b>路线调试<em>LAYER 02</em></b>
            <span>停靠位置、避障策略、语音提示，决定顾客实际感受到的体验。</span>
          </div>
          <div class="pn" style="--c:#22d3ee">
            <b>培训交付<em>LAYER 03</em></b>
            <span>常见问题讲清楚，现场能自己处理，后续维护成本才会低。</span>
          </div>
        </div>
      </div>
      <div class="note">三层不是并列关系：地基建好，体验才稳；交付讲透，成本才降。</div>
    `,
    footLeft: '<b>对应正文</b>　复盘 · 建图与路线',
    footRight: '同样的指令，每次同样结果，才算调通',
  },

  /* ── 个人主页 ─────────────────────────────────────────── */
  {
    slug: 'personal-portfolio',
    file: 'fig-01-cost-sheet.png',
    theme: 'violet',
    kicker: 'BUILD IN PUBLIC · 成本',
    title: '这套东西，每个月的账单是 0',
    sub: '没有服务器、没有数据库、没有域名费。内容放 Notion 免费版，站点放 GitHub Pages，构建交给 Actions。',
    tag: '个人主页 · Astro + Notion',
    body: `
      <div class="cost">
        <div class="bill">
          <div class="cap">MONTHLY COST</div>
          <div class="big"><b>¥0</b><span>/ 月</span></div>
          <div class="stats">
            <div><span>Notion 数据库</span><b>5 个</b></div>
            <div><span>服务器</span><b>0 台</b></div>
            <div><span>定时构建</span><b>每天 1 次</b></div>
          </div>
        </div>
        <div>
          <div class="rows">
            <div class="rh"><div class="rc">项目</div><div class="rc">方案</div><div class="rc">费用</div></div>
            <div class="rr"><div class="rc">服务器</div><div class="rc">GitHub Pages 静态托管</div><div class="rc">¥ 0</div></div>
            <div class="rr"><div class="rc">数据库</div><div class="rc">Notion 免费版</div><div class="rc">¥ 0</div></div>
            <div class="rr"><div class="rc">域名</div><div class="rc">github.io 子域</div><div class="rc">¥ 0</div></div>
            <div class="rr"><div class="rc">CI / CD</div><div class="rc">公开仓库 Actions 额度</div><div class="rc">¥ 0</div></div>
            <div class="rr"><div class="rc">图床</div><div class="rc">复用已有服务</div><div class="rc">¥ 0</div></div>
            <div class="rr"><div class="rc">Token</div><div class="rc">各家免费额度</div><div class="rc">¥ 0</div></div>
            <div class="rr"><div class="rc">备案</div><div class="rc">github.io 免备案</div><div class="rc">免</div></div>
          </div>
          <div class="cost-note">
            <span>代价：内容非实时生效</span>
            <span>没有搜索与评论</span>
            <span>国内访问偶尔失效</span>
          </div>
        </div>
      </div>
    `,
    footLeft: '<b>对应正文</b>　算笔账',
    footRight: '省钱不是目的，不用运维、不用担心账单才是',
  },
  {
    slug: 'personal-portfolio',
    file: 'fig-02-pitfalls.png',
    theme: 'violet',
    kicker: 'BUILD IN PUBLIC · 排障',
    title: '上线前踩的五个坑',
    sub: '流程跑通那天以为稳了，真正的坑才开始。每一个都不难，难的是它不报错。',
    tag: '翻车记录',
    body: `
      <div class="pits">
        <div class="pit">
          <div class="n">01</div>
          <div class="p"><span>数据库 ID 失效</span><em>API 升到 2025-09-03，查询只认 data_source_id</em></div>
          <div class="s">先按数据源查；明确报 object_not_found 才降级解析数据库。网络错误不能当成「找不到」。</div>
        </div>
        <div class="pit">
          <div class="n">02</div>
          <div class="p"><span>环境变量集体失踪</span><em>import.meta.env[key] 构建后全是 undefined，还不报错</em></div>
          <div class="s">五个变量逐个写成字面量，不再用动态取值。</div>
        </div>
        <div class="pit">
          <div class="n">03</div>
          <div class="p"><span>本机 DNS 卡超时</span><em>IPv6 可用、IPv4 不可达，构建随机失败</em></div>
          <div class="s">默认解析顺序改成 IPv4 优先，构建成功率才稳住。</div>
        </div>
        <div class="pit">
          <div class="n">04</div>
          <div class="p"><span>示例数据差点上生产</span><em>缺配置也能构建，等于发布了一份假简历</em></div>
          <div class="s">生产缺配置直接抛错，宁可构建失败，也不让假数据上线。</div>
        </div>
        <div class="pit">
          <div class="n">05</div>
          <div class="p"><span>正文注入把页面截断</span><em>富文本里出现 &lt;/script&gt;，set:html 当场失效</em></div>
          <div class="s">先全部转义，再按白名单包标签，链接只放行 http、https、mailto。</div>
        </div>
      </div>
      <div class="note">难的不是把页面做出来，是半年后它还能自己跑，出错时还错得明显。</div>
    `,
    footLeft: '<b>对应正文</b>　翻车五次，才算入门',
    footRight: '每个坑的解法都写进了代码或工作流',
  },
];
