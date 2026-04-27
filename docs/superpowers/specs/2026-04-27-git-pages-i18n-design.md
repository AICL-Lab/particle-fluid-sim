# Git Pages 国际化设计文档

## 背景

当前项目使用自定义构建脚本生成静态文档站点，所有内容均为英文。需要添加中英文切换功能，以便用户可以选择适合自己的语言。

## 问题分析

- **现状**：`docs/site/index.html` 主页和 16 个 Markdown 文档全部是英文
- **需求**：支持中英文切换，URL 采用子目录方式 (`/zh-CN/`)
- **翻译范围**：全部文档

## 解决方案

将现有自定义文档系统迁移到 **Docusaurus 3.x**，利用其内置的国际化支持。

## 技术设计

### 1. 目录结构

```
docs-site/                         # Docusaurus 项目
├── docusaurus.config.ts          # 主配置文件
├── sidebars.ts                   # 侧边栏配置
├── i18n/                         # 国际化目录
│   └── zh-CN/
│       ├── code.json             # UI 文本翻译
│       └── docusaurus.plugin-content-docs/
│           └── current/          # 中文文档
│               ├── intro.md
│               ├── api.md
│               └── ...
├── src/
│   ├── pages/
│   │   ├── index.tsx             # 英文主页
│   │   └── index.module.css      # 主页样式
│   ├── components/               # 自定义 React 组件
│   │   ├── HeroSection/
│   │   ├── FeatureCard/
│   │   └── DemoEmbed/
│   └── css/
│       └── custom.css            # 全局样式（保留深色/浅色模式）
├── static/
│   └── demo/                     # Vite 构建的演示应用
└── docs/                         # 英文文档源文件
    ├── intro.md
    ├── api.md
    └── ...
```

### 2. URL 结构

| 页面     | 英文 URL             | 中文 URL                   |
| -------- | -------------------- | -------------------------- |
| 主页     | `/`                  | `/zh-CN/`                  |
| API 文档 | `/docs/api`          | `/zh-CN/docs/api`          |
| 架构文档 | `/docs/architecture` | `/zh-CN/docs/architecture` |
| 演示应用 | `/demo/`             | `/demo/` (语言无关)        |

### 3. 配置示例

```typescript
// docusaurus.config.ts
export default {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
    localeConfigs: {
      en: { label: 'English', direction: 'ltr' },
      'zh-CN': { label: '简体中文', direction: 'ltr' },
    },
  },
  // 自动生成 hreflang 标签
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        hreflang: 'en',
        href: 'https://lessup.github.io/particle-fluid-sim/',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        hreflang: 'zh-CN',
        href: 'https://lessup.github.io/particle-fluid-sim/zh-CN/',
      },
    },
  ],
};
```

### 4. 组件设计

#### HeroSection 组件

- 展示项目标题、副标题、CTA 按钮
- 支持深色/浅色模式动画背景
- 响应式设计

#### FeatureCard 组件

- 展示功能特性卡片（GPU 计算、WGSL 着色器等）
- 图标 + 标题 + 描述布局
- 支持悬浮效果

#### DemoEmbed 组件

- iframe 嵌入演示应用
- 全屏按钮
- 响应式高度

### 5. 构建流程

```bash
# 构建文档站点
cd docs-site && npm run build

# 构建演示应用（保持在项目根目录）
npm run build

# 合并部署
# Docusaurus 输出到 docs-site/build/
# 演示应用输出到 dist/ -> 复制到 docs-site/build/demo/
```

### 6. GitHub Actions 更新

```yaml
# .github/workflows/deploy.yml
- name: Build Docusaurus
  run: |
    cd docs-site
    npm ci
    npm run build

- name: Copy demo app
  run: cp -r dist/ docs-site/build/demo/

- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./docs-site/build
```

## 翻译内容

### UI 文本 (i18n/zh-CN/code.json)

```json
{
  "theme.ErrorPageContent.title": "页面未找到",
  "theme.NavBar.navAriaLabel": "主导航",
  "theme.SearchBar.label": "搜索",
  "theme.TOCCollapsible.toggleButtonLabel": "目录",
  "theme.CodeBlock.copied": "已复制",
  "theme.colorToggle.ariaLabel": "切换深色/浅色模式"
}
```

### 主页翻译

| 英文                      | 中文           |
| ------------------------- | -------------- |
| Particle Fluid Simulation | 粒子流体模拟   |
| GPU Compute Shaders       | GPU 计算着色器 |
| WGSL Shaders              | WGSL 着色器    |
| Interactive Demo          | 交互式演示     |
| Launch Demo               | 启动演示       |
| Explore Specs             | 查看规范       |

### 文档列表（需翻译）

1. `README.md` → `i18n/zh-CN/docusaurus.plugin-content-docs/current/intro.md`
2. `docs/API.md` → 中文版
3. `docs/ARCHITECTURE.md` → 中文版
4. `docs/DEVELOPMENT.md` → 中文版
5. `docs/CONTRIBUTING.md` → 中文版
6. `docs/CHANGELOG.md` → 中文版
7. `openspec/specs/` 下的规范文档

## 迁移步骤

### 阶段 1：基础设施（约 2 小时）

- [ ] 初始化 Docusaurus 项目
- [ ] 配置 TypeScript
- [ ] 配置 i18n

### 阶段 2：主页迁移（约 2 小时）

- [ ] 创建 React 组件替代静态 HTML
- [ ] 迁移 CSS 样式
- [ ] 实现深色/浅色模式

### 阶段 3：文档迁移（约 2 小时）

- [ ] 迁移 Markdown 文档到 `docs/` 目录
- [ ] 配置侧边栏
- [ ] 设置文档导航

### 阶段 4：演示集成（约 1 小时）

- [ ] 配置演示应用嵌入
- [ ] 处理跨域问题

### 阶段 5：翻译（约 8-16 小时）

- [ ] 翻译 UI 文本
- [ ] 翻译主页内容
- [ ] 翻译文档内容

### 阶段 6：部署更新（约 1 小时）

- [ ] 更新 GitHub Actions
- [ ] 测试部署流程
- [ ] 验证语言切换功能

## 验证计划

1. **功能验证**
   - 语言切换按钮正常工作
   - 中英文页面内容正确
   - 深色/浅色模式切换
   - 搜索功能按语言分离

2. **SEO 验证**
   - hreflang 标签正确
   - 页面 lang 属性正确
   - 站点地图包含所有语言版本

3. **性能验证**
   - 构建时间 < 2 分钟
   - 页面加载时间 < 3 秒
   - Lighthouse 分数 > 90

## 风险与缓解

| 风险         | 影响         | 缓解措施               |
| ------------ | ------------ | ---------------------- |
| 翻译质量不高 | 用户体验差   | 先机器翻译，再人工校对 |
| URL 结构变化 | 现有链接失效 | 添加重定向规则         |
| 构建时间增加 | CI 变慢      | 缓存依赖，并行构建     |
