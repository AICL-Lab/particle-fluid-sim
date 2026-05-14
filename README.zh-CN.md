# WebGPU 粒子流体仿真

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="版本">
  <a href="https://github.com/AICL-Lab/particle-fluid-sim/actions/workflows/ci.yml">
    <img src="https://github.com/AICL-Lab/particle-fluid-sim/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
  <a href="https://github.com/AICL-Lab/particle-fluid-sim/actions/workflows/pages.yml">
    <img src="https://github.com/AICL-Lab/particle-fluid-sim/actions/workflows/pages.yml/badge.svg" alt="Pages">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/WebGPU-Enabled-005A9C?logo=webgpu&logoColor=white" alt="WebGPU">
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite">
</p>

<p align="center">
  <a href="README.md">English</a> | <b>简体中文</b>
</p>

---

基于 **WebGPU 计算着色器**构建的高性能粒子流体仿真项目。万级粒子实时物理仿真，GPU 加速计算。

🔮 **[在线演示](https://aicl-lab.github.io/particle-fluid-sim/demo/)** | 📖 **[文档](docs/)** | 📋 **[规范](openspec/specs/product/webgpu-particle-fluid-sim.md)**

> **💡 体验提示：** 打开 [在线演示](https://aicl-lab.github.io/particle-fluid-sim/demo/)，移动鼠标与粒子互动！

## ✨ 特性

### GPU 加速物理引擎

- **计算着色器物理** - 重力、排斥力、速度限制和边界反弹全部在 GPU 上运行
- **帧率无关** - 物理使用 `deltaTime` 确保在任何 FPS 下仿真速度一致
- **10,000 粒子** - 默认数量，根据设备能力自适应缩放最低至 2,500

### 自适应质量系统

- **自动设备检测** - 分析 GPU、CPU、内存和视口
- **运行时缩放** - 根据设备调整粒子数量 2,500 至 10,000
- **质量等级** - 低、中、高三级，HUD 实时显示

### 视觉效果

- **持久化拖尾** - 通过专用离屏纹理实现运动拖尾
- **基于速度的颜色** - 青色（慢速）到紫色（快速）渐变
- **HiDPI 适配** - 为 Retina 显示屏正确缩放

### 技术卓越

- **TypeScript** - 完整的类型安全
- **属性测试** - Vitest + fast-check 确保健壮性
- **WebGPU 最佳实践** - 工作组优化、缓冲区复用

## 🚀 快速开始

### 环境要求

- **Node.js**: 18+
- **浏览器**: Chrome 113+、Edge 113+ 或 Safari 17+

### 安装

```bash
# 克隆仓库
git clone https://github.com/AICL-Lab/particle-fluid-sim.git
cd particle-fluid-sim

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 在支持 WebGPU 的浏览器中打开 http://localhost:5173
```

### 可用命令

| 命令                    | 说明                       |
| ----------------------- | -------------------------- |
| `npm run dev`           | 启动热更新开发服务器       |
| `npm run build`         | TypeScript 检查 + 生产构建 |
| `npm run preview`       | 本地预览生产构建           |
| `npm test`              | 运行单元测试               |
| `npm run test:watch`    | 监听模式运行测试           |
| `npm run test:coverage` | 运行测试并生成覆盖率报告   |
| `npm run lint`          | 运行 ESLint                |
| `npm run typecheck`     | 运行 TypeScript 类型检查   |
| `npm run format`        | 使用 Prettier 格式化代码   |

## 📁 项目结构

使用 [OpenSpec](https://github.com/Fission-AI/OpenSpec) 进行规范驱动开发：

```
particle-fluid-sim/
├── openspec/               # OpenSpec 框架
│   ├── specs/              # 规范文档（事实来源）
│   │   ├── product/        # 产品需求 (PRD)
│   │   ├── rfc/            # 技术设计文档
│   │   ├── api/            # API 规范
│   │   └── testing/        # BDD 测试规范
│   ├── changes/            # 活跃的变更提案
│   └── config.yaml         # OpenSpec 配置
├── docs/                   # 文档
│   ├── setup/              # 环境与工具链配置
│   ├── architecture/       # 架构概览
│   ├── API.md              # API 参考
│   ├── PERFORMANCE.md      # 性能与分析指南
│   ├── TROUBLESHOOTING.md  # 故障排除指南
│   └── maintenance.md      # 收尾工作流与维护指南
├── src/                    # 源代码
│   ├── config/             # 仿真常量
│   ├── core/               # 核心模块
│   └── shaders/            # WGSL 着色器
├── .github/                # GitHub 配置
├── AGENTS.md               # AI Agent OpenSpec 工作流
├── CONTRIBUTING.md         # 贡献指南
├── CHANGELOG.md            # 版本历史
└── LICENSE                 # MIT 许可证
```

## 🏗️ 架构

### 异构计算

| 组件                 | 技术                    | 职责                               |
| -------------------- | ----------------------- | ---------------------------------- |
| **CPU (TypeScript)** | TypeScript              | 初始化、质量选择、输入处理、帧循环 |
| **GPU (WGSL)**       | WebGPU Shading Language | 物理仿真、拖尾效果、渲染           |

### 渲染管线

每帧按顺序执行四个 GPU 阶段：

| 阶段        | 着色器         | 输入       | 输出       | 用途       |
| ----------- | -------------- | ---------- | ---------- | ---------- |
| **1. 计算** | `compute.wgsl` | 粒子缓冲区 | 粒子缓冲区 | 更新物理   |
| **2. 拖尾** | `trail.wgsl`   | 离屏纹理   | 离屏纹理   | 淡化拖尾   |
| **3. 渲染** | `render.wgsl`  | 粒子缓冲区 | 离屏纹理   | 绘制粒子   |
| **4. 呈现** | `present.wgsl` | 离屏纹理   | 交换链     | 合成到屏幕 |

### 物理模型

```
每帧每个粒子:
  1. 应用重力: velocity += gravity * dt
  2. 应用鼠标排斥: 如果距离 < 半径
  3. 将速度限制在 MAX_SPEED 内
  4. 更新位置: position += velocity * dt
  5. 如果超出边界，带阻尼反弹
```

## ⚙️ 配置

`src/config/sim.ts` 中的关键常量：

| 常量                 | 默认值         | 单位  | 描述         |
| -------------------- | -------------- | ----- | ------------ |
| `PARTICLE_COUNT`     | 10,000         | -     | 默认粒子数量 |
| `GRAVITY`            | {x: 0, y: 600} | px/s² | 重力加速度   |
| `MAX_SPEED`          | 800            | px/s  | 速度上限     |
| `REPULSION_RADIUS`   | 200            | px    | 鼠标影响半径 |
| `REPULSION_STRENGTH` | 3000           | px/s  | 鼠标排斥力度 |
| `DAMPING`            | 0.9            | -     | 反弹能量保留 |
| `TRAIL_FADE_ALPHA`   | 0.05           | -     | 拖尾持久度   |

## 🧪 测试

项目使用 **Vitest** 配合 **fast-check** 进行属性测试：

```bash
# 运行所有测试
npm test

# 带覆盖率运行
npm run test:coverage

# UI 模式运行
npm run test:ui
```

测试覆盖范围：

- 粒子初始化边界
- 物理积分正确性
- 边界反弹行为
- 颜色插值
- 质量启发式计算

## 🌐 浏览器兼容性

需要 WebGPU 支持。最新支持情况见 [caniuse.com/webgpu](https://caniuse.com/webgpu)。

| 浏览器  | 最低版本 | 说明                                 |
| ------- | -------- | ------------------------------------ |
| Chrome  | 113+     | ✅ 推荐                              |
| Edge    | 113+     | ✅ 推荐                              |
| Safari  | 17+      | macOS 14+                            |
| Firefox | Nightly  | 需在 `dom.webgpu.enabled` 标志后启用 |
| Opera   | 99+      | 基于 Chromium                        |

## 📚 文档

### 规范文档（事实来源）

| 文档                                                                     | 描述                  |
| ------------------------------------------------------------------------ | --------------------- |
| [📋 产品需求](openspec/specs/product/webgpu-particle-fluid-sim.md)       | 功能性与非功能性需求  |
| [📐 RFC 0001: 核心架构](openspec/specs/rfc/0001-core-architecture.md)    | 系统架构与设计决策    |
| [📝 RFC 0002: 实现任务](openspec/specs/rfc/0002-implementation-tasks.md) | 实现任务追踪          |
| [🔌 API 规范](openspec/specs/api/typescript-interfaces.md)               | TypeScript 接口和契约 |
| [🧪 测试规范](openspec/specs/testing/bdd-specifications.md)              | BDD 测试规范          |

### 开发者与用户指南

| 文档                                       | 描述                          |
| ------------------------------------------ | ----------------------------- |
| [📖 API 参考](docs/API.md)                 | 完整的 API 文档               |
| [⚡ 性能指南](docs/PERFORMANCE.md)         | 基准测试与优化                |
| [🔧 故障排除](docs/TROUBLESHOOTING.md)     | 常见问题与解决方案            |
| [📚 文档索引](docs/README.md)              | 精简后的文档入口与导航        |
| [🛠️ 维护指南](docs/maintenance.md)         | OpenSpec 收尾工作流与维护流程 |
| [🏗️ 架构概览](docs/architecture/README.md) | 系统架构                      |

其他资源：

- [贡献指南](CONTRIBUTING.md) - 如何参与贡献
- [AGENTS.md](AGENTS.md) - AI Agent 规范驱动开发工作流
- [变更日志](CHANGELOG.md) - 版本历史
- [安全策略](.github/SECURITY.md) - 安全准则

## 🤝 贡献

欢迎贡献！详情请参阅我们的[贡献指南](CONTRIBUTING.md)。

### 开发工作流

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 按照[规范驱动开发](AGENTS.md)工作流进行更改
4. 运行测试 (`npm test`)
5. 提交更改 (`git commit -m '添加 amazing 功能'`)
6. 推送到分支 (`git push origin feature/amazing-feature`)
7. 开启 Pull Request

## 📄 许可证

本项目采用 **MIT 许可证** - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [WebGPU](https://www.w3.org/TR/webgpu/) - 使这一切成为可能的图形 API
- [Vite](https://vitejs.dev/) - 下一代前端工具
- [Vitest](https://vitest.dev/) - 极速单元测试
- [fast-check](https://dubzzz.github.io/fast-check/) - 属性测试

## 🔗 链接

- 🌐 **在线演示**: https://aicl-lab.github.io/particle-fluid-sim/demo/
- 💻 **代码仓库**: https://github.com/AICL-Lab/particle-fluid-sim
- 🐛 **问题追踪**: https://github.com/AICL-Lab/particle-fluid-sim/issues
- 💬 **讨论区**: https://github.com/AICL-Lab/particle-fluid-sim/discussions

---

<p align="center">
  用 💜 和 WebGPU 打造
</p>
