# 快速开始

一分钟内运行粒子模拟。

## 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/LessUp/particle-fluid-sim.git
cd particle-fluid-sim

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

在支持 WebGPU 的浏览器中打开 **http://localhost:5173**。

## 系统要求

### Node.js

- **版本：** 18.0.0 或更高
- **下载：** [nodejs.org](https://nodejs.org/)

### 浏览器支持

| 浏览器  | 版本    | 状态             |
| ------- | ------- | ---------------- |
| Chrome  | 113+    | ✅ 推荐          |
| Edge    | 113+    | ✅ 推荐          |
| Safari  | 17+     | ✅ macOS 14+     |
| Firefox | Nightly | ⚠️ 需启用标志    |
| Opera   | 99+     | ✅ 基于 Chromium |

> **Firefox 用户：** 在 `about:config` 中设置 `dom.webgpu.enabled = true` 启用 WebGPU

## 控制方式

| 操作               | 效果                |
| ------------------ | ------------------- |
| **移动鼠标**       | 推开粒子            |
| **触摸（移动端）** | 与鼠标交互相同      |
| **调整窗口大小**   | 自动适配 HiDPI 缩放 |

## 开发命令

```bash
# 启动开发服务器（带 HMR）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 运行测试
npm test

# 运行测试覆盖率
npm run test:coverage

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 格式化代码
npm run format
```

## 下一步

- [环境配置](/zh/guides/setup) - 详细配置指南
- [测试指南](/zh/guides/testing) - 如何测试代码库
- [系统架构](/zh/whitepaper/architecture) - 系统设计
