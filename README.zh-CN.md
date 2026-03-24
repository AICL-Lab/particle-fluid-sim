# WebGPU 粒子流体仿真

[English](README.md) | 简体中文

这是一个基于 WebGPU 计算着色器的高性能粒子流体仿真项目。TypeScript 负责初始化、输入、质量选择与帧循环，WGSL 负责物理计算、拖尾淡化、粒子绘制和最终呈现；运行时会根据设备能力在较低粒子数与默认 10,000 粒子之间自适应。

[![CI](https://github.com/LessUp/particle-fluid-sim/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/particle-fluid-sim/actions/workflows/ci.yml)
[![Pages](https://github.com/LessUp/particle-fluid-sim/actions/workflows/pages.yml/badge.svg)](https://github.com/LessUp/particle-fluid-sim/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![WebGPU](https://img.shields.io/badge/WebGPU-Enabled-005A9C?logo=webgpu&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)

## 特性

- **GPU 物理仿真** - 重力、排斥、速度钳制、边界反弹全部在 WebGPU compute shader 中执行
- **自适应质量** - 启动时根据设备能力和视口大小动态选择粒子数量
- **帧率无关** - CPU 参考实现、测试和 GPU 计算统一使用 `deltaTime`
- **持久化拖尾** - 使用离屏纹理保存拖尾，再通过 present pass 输出到屏幕
- **HiDPI 适配** - 渲染尺寸和输入坐标都考虑 `devicePixelRatio`
- **属性测试** - 用 Vitest + fast-check 验证核心仿真约束

## 环境要求

- Node.js 18+
- 支持 WebGPU 的浏览器（Chrome 113+、Edge 113+、Safari 17+）

## 快速开始

```bash
npm install
npm run dev
# 在支持 WebGPU 的浏览器中打开 http://localhost:5173
```

## 常用命令

| 命令                    | 说明                       |
| ----------------------- | -------------------------- |
| `npm run dev`           | 启动开发服务器             |
| `npm run build`         | TypeScript 检查 + 生产构建 |
| `npm run preview`       | 预览生产构建               |
| `npm test`              | 运行测试                   |
| `npm run test:watch`    | 监听模式测试               |
| `npm run test:coverage` | 输出覆盖率报告             |
| `npm run lint`          | 运行 ESLint                |
| `npm run typecheck`     | 运行 TypeScript 类型检查   |

## 项目结构

```
src/
├── config/
│   └── sim.ts            # 共享仿真常量与 WGSL 常量注入
├── core/
│   ├── buffers.ts        # GPU 缓冲区创建与粒子初始化
│   ├── color.ts          # CPU 端颜色映射参考实现
│   ├── input.ts          # 鼠标/触屏输入与 HiDPI 坐标映射
│   ├── physics.ts        # 与 compute shader 对齐的 CPU 物理参考实现
│   ├── pipelines.ts      # Compute / render / trail / present 管线创建
│   ├── quality.ts        # 运行时粒子数量自适应策略
│   ├── renderer.ts       # 帧循环、离屏拖尾纹理与最终呈现
│   └── webgpu.ts         # WebGPU 初始化与画布设置
├── shaders/
│   ├── compute.wgsl      # 物理计算着色器
│   ├── present.wgsl      # 最终全屏合成 pass
│   ├── render.wgsl       # 粒子渲染着色器
│   └── trail.wgsl        # 拖尾淡化着色器
├── main.ts               # 应用入口
├── style.css             # 全屏画布与 UI 覆盖层样式
└── types.ts              # 共享接口与常量导出
```

## 架构

项目采用异构计算模型：

- **CPU（TypeScript）**：初始化 WebGPU、选择运行质量、更新 uniforms、处理输入、驱动帧循环
- **GPU（WGSL）**：更新粒子、淡化拖尾纹理、绘制粒子，并将离屏结果输出到画布

### 渲染流程

每帧依次执行四个 GPU pass：

| Pass        | 着色器                     | 用途                       |
| ----------- | -------------------------- | -------------------------- |
| **Compute** | `src/shaders/compute.wgsl` | 更新粒子位置和速度         |
| **Trail**   | `src/shaders/trail.wgsl`   | 淡化持久化离屏纹理         |
| **Render**  | `src/shaders/render.wgsl`  | 将粒子绘制到离屏纹理       |
| **Present** | `src/shaders/present.wgsl` | 将离屏纹理合成到交换链画布 |

拖尾效果不再依赖交换链纹理的跨帧保留行为，而是由 `src/core/renderer.ts` 维护专用离屏纹理，因此在不同浏览器和 GPU 上更稳定。

## 配置

所有共享仿真常量集中在 `src/config/sim.ts`，包括：

- 默认粒子数：`10,000`
- 重力：`600 px/s²`
- 阻尼：`0.9`
- 排斥半径：`200 px`
- 排斥强度：`3,000 px/s`
- 最大速度：`800 px/s`
- 默认 delta time：`1 / 60 s`
- 拖尾淡化 alpha：`0.05`

`src/core/pipelines.ts` 会把这些常量注入到 WGSL shader 前导代码里，从而保证 TypeScript、测试和 shader 参数一致。

### 自适应质量

`src/core/quality.ts` 会在启动时根据以下因素选择运行时粒子数量：

- fallback adapter
- `navigator.deviceMemory`（若浏览器支持）
- `navigator.hardwareConcurrency`
- 视口像素数量
- WebGPU storage buffer 限制

通常运行范围在 **2,500 到 10,000 粒子** 之间，实际粒子数和质量等级会显示在页面右上角。

## 测试

项目使用 Vitest 和 fast-check 验证：

- 粒子初始化边界
- 基于 delta time 的物理积分
- 边界反弹行为
- 排斥力方向与衰减
- 颜色插值逻辑
- 运行时质量选择策略

完整校验命令：

```bash
npm run lint
npm test
npm run build
```

## 浏览器兼容性

项目依赖 WebGPU。最新支持情况可参考 [caniuse.com/webgpu](https://caniuse.com/webgpu)。

| 浏览器  | 最低版本         |
| ------- | ---------------- |
| Chrome  | 113+             |
| Edge    | 113+             |
| Firefox | 需启用标志       |
| Safari  | 17+（macOS 14+） |

## 许可证

MIT - [项目主页](https://lessup.github.io/particle-fluid-sim/)
