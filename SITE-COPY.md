# 母公司网站原样副本

## CSS 与 JavaScript 独立文件

2026-09-15：110 个内容页面的全部 110 个 `<style>` 块、550 个内嵌 JavaScript 块已抽取为外部文件，并合并完全相同的内容：

- `site-assets/css/shared/`：公共样式（1 个文件）。
- `site-assets/js/shared/`：多个页面复用的配置与脚本。
- `site-assets/js/pages/`：各页面专属脚本，产品与新闻详情保留对应子目录。
- 原有外部样式、脚本仍在原路径，页首页脚和联系页的专用文件仍在 `site-assets/dongying/`。

共生成 127 个 JavaScript 文件。页面保留原引用位置、执行顺序和脚本 ID；修改这些独立 CSS/JS 文件后刷新页面即可，无需重新生成 HTML。HTML 元素上的原站定位 `style` 属性和事件属性保持原样，以兼容原站运行时布局逻辑；本次提取范围为独立的 `<style>` / `<script>` 内容块。

一次性抽取工具为 `scripts/extract-page-assets.py`（仅需 Python 3，无第三方依赖），已抽取的页面重复运行不会改变文件。备份和对应清单位于 `work/page-assets/`。已逐页验证代码内容和其余 HTML 字节保持一致，127 个脚本均通过语法检查。

浏览器已确认首页、联系页与产品详情页的显示和导航。联系页原站布局脚本的 `top`、`getBoundingClientRect` 报错及后台请求 404 在抽取前备份中同样存在，本次未修改这些原站逻辑。

## 当前页首页脚维护方式

2026-09-15：110 个内容页面已统一引用共享页首、页脚。修改根目录 `header.html`（页首）或 `footer.html`（页脚）后，在项目根目录运行：

```sh
node scripts/build-layout.cjs
```

生成的 `site-assets/layout/header.js`、`footer.js` 供所有页面共用，需要和 HTML 模板一起保存、发布。页面按原位置同步插入共享内容，保留原有脚本的初始化顺序；页首引用上的 `data-active-nav` 指定当前栏目。模板中的 `{{ROOT}}` 表示网站根目录，可兼容产品详情子目录及子路径部署。原有样式仍位于 `site-assets/dongying/`。

页首继续使用白色背景、蓝色「東盈創世」文字标志和普通导航样式；页脚内容、正文与图片保持不变。以下记录中的三个 `apply-dongying-*.cjs` 为历史迁移工具，不再用于日常维护；`components/dongying/` 保留来源副本，共享布局以根目录模板为准。抽取前备份位于 `work/shared-layout/before/`。

来源：https://yinchung.com/
复制时间：2026-09-13T01:36:52.938Z

共 109 个可由站内公开链接发现的页面，893 项本地资源。首页为 index.html。保留源站的文字、品牌、图片、布局与脚本；站内链接和分页适配本地静态文件。旧 dongying 栏目地址跳转到对应原版页面。

源站在线服务（地图、统计、表单提交等）仍依赖其服务端，不包含后台程序或管理数据。源站无法下载的资源见 site-copy-manifest.json 的 errors；保留原链接，由浏览器按源站逻辑回退。

## 日文版

2026-09-14：已将上述 109 个页面的网页文字转换为日文，包含导航、产品介绍、新闻、公司介绍、页脚及动态组件标签。主要页面文案与产品术语经过人工调整，长篇内容仍为机器翻译初稿。

按用户要求，全部图片保留原片，图片内文字不翻译。保持原站视觉风格，并调整日文字体与长分类名称的排版。

最终检查覆盖 13,666 项本地引用和 545 段内联脚本，未发现缺失翻译条目、本地引用缺失或新增脚本语法问题。改动已保存至本地项目，尚未推送或发布。

## 仅替换子公司页脚

2026-09-14：从 `D:/gitcode/zx751117-zx.github.io-main/zx751117-zx.github.io-main/footer.html` 及其样式、标志原图导入东盈创世页脚，应用至 109 个页面。母公司页首、导航、正文、正文图片、联系入口和原有脚本均未改变。

页脚使用子公司标志、宣传语、日本地址、电话、邮箱及版权信息。样式限定于页脚，并适配窄窗口和原站横向滚动。源文件夹未修改。源模板位于 `components/dongying/footer.html`，资源位于 `site-assets/dongying/`，在项目根目录运行 `node scripts/apply-dongying-footer.cjs` 可重新应用（需 cheerio，当前环境已具备）。

109 页与替换前对比，仅页脚及其新增资源引用发生变化；327 项页脚资源引用检查通过，并已在浏览器确认显示效果。替换前备份保存在 `work/footer-only/before/`。尚未推送或发布。

## 子公司お問い合わせ页面（保留母公司页首）

2026-09-15：读取同一来源文件夹的 `contact.html` 和表单脚本，将 `contact.html` 替换为东盈创世的联系信息及咨询表单，保留当前母公司页首和东盈创世页脚。其余 109 个页面仅更新联系链接，正文和原图保持不变。

表单保留源站的 mailto 方式：点击「送信する」后打开访客的邮件软件，需由访客确认发送。姓名、邮箱和咨询内容必填，公司名选填。页面明确说明这一发送方式，没有接入后台发送服务。

静态联系按钮及旧 `h-col-101.html#module617`、`contact_cn.html` 入口转到新联系页；动态按钮由 `site-assets/local-navigation.js` 适配。111 页共 13,068 项本地引用、空值和邮箱校验、日文邮件内容编码检查通过；已通过浏览器确认页面显示和旧入口跳转，未发送邮件。

源模板在 `components/dongying/contact.html`；生成器为 `scripts/apply-dongying-contact.cjs`。联系页样式和表单行为在 `site-assets/dongying/contact.css`、`contact.js`；替换前备份在 `work/contact-with-mother-header/before/`。尚未推送或发布。

## 页首标志与联系导航

2026-09-15：按最新要求，在 110 个页面中将页首 LOGO 替换为子公司原始 `pic/logo.png`（TOEISOSEI JAPAN），移除页首电话图标和号码。「お問い合わせ」改为主导航的第六项，复用「ホーム」的结构与样式，联系页显示蓝色选中状态。页脚、正文及正文图片不变。

生成器为 `scripts/apply-dongying-branding.cjs`，样式与选中状态逻辑在 `site-assets/dongying/header.css`、`header.js`。备份在 `work/header-branding/before/`。重新生成时按页脚、联系页、页首品牌的顺序应用。110 页内容对比与 440 项新增引用检查通过，标志与源图片字节一致；已在浏览器验证首页和联系页导航。尚未推送或发布。

用户随后明确指定蓝色文字标志：当前 110 页页首使用来源网站 `header.html` 中的「東盈創世」及「融合通信の未来をつなぐ」，样式采用源站蓝色、38px 主标题和 12px 宣传语。模板为 `components/dongying/wordmark.html`，品牌生成器已同步更新。此更正只改页首标志，页脚原图及导航不变；已逐页比对并确认浏览器效果。更正前备份位于 `work/blue-wordmark/before/`。
