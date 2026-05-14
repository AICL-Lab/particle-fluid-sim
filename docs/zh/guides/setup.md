# 环境配置

开发环境详细配置指南。

## 前置条件

### 必需

- **Node.js 18+** - JavaScript 运行时
- **npm 9+** - 包管理器（随 Node.js 安装）
- **Git** - 版本控制

### 推荐

- **VS Code** - 支持 TypeScript 的 IDE
- **Chrome 113+** - 支持 WebGPU 的浏览器

## 安装

### 1. 克隆仓库

```bash
git clone https://github.com/LessUp/particle-fluid-sim.git
cd particle-fluid-sim
```

### 2. 安装依赖

```bash
npm install
```

### 3. 验证安装

```bash
npm run typecheck
npm test
```

## IDE 配置

### VS Code 扩展

安装以下扩展以获得最佳体验：

| 扩展               | 用途         |
| ------------------ | ------------ |
| ESLint             | 代码检查     |
| Prettier           | 代码格式化   |
| TypeScript Nightly | 最新 TS 特性 |

## 浏览器配置

### Chrome

Chrome 113+ 默认启用 WebGPU。

### Safari

Safari 17+ 需要 macOS 14+ (Sonoma)。

### Firefox

实验性启用 WebGPU：

1. 打开 `about:config`
2. 设置 `dom.webgpu.enabled = true`
3. 重启浏览器

## 本地开发

### 开发服务器

```bash
npm run dev
```

- 启用热模块替换（HMR）
- 访问地址 `http://localhost:5173`

### 生产构建

```bash
npm run build
npm run preview
```

## 故障排除

### "WebGPU not supported" 错误

- 更新到 Chrome 113+ 或 Edge 113+
- 检查 `chrome://gpu` 的 WebGPU 状态
- 确保已启用硬件加速

### TypeScript 错误

```bash
# 清除 node_modules 并重新安装
rm -rf node_modules
npm install
```

### 测试失败

```bash
# 运行测试并显示详细输出
npm test -- --reporter=verbose
```
