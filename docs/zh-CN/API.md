# API 参考文档

← [返回文档首页](README.md) | [English](../en/API.md)

> **版本**: 2.0.0  
> **最后更新**: 2026-04-16

---

本文档提供 WebGPU 粒子流体仿真项目的完整 API 文档，涵盖所有公共模块、函数、类型和常量。

## 目录

- [快速开始](#快速开始)
- [配置](#配置)
- [类型定义](#类型定义)
- [核心模块](#核心模块)
  - [WebGPU 初始化](#webgpu-初始化)
  - [缓冲区管理](#缓冲区管理)
  - [物理引擎](#物理引擎)
  - [颜色映射](#颜色映射)
  - [输入处理](#输入处理)
  - [管线创建](#管线创建)
  - [渲染器](#渲染器)
  - [质量启发式](#质量启发式)
- [着色器常量](#着色器常量)
- [数据布局](#数据布局)
- [术语表](#术语表)

---

## 快速开始

```typescript
import { initWebGPU } from './core/webgpu';
import { createBuffers } from './core/buffers';
import { createPipelines } from './core/pipelines';
import { createRenderer } from './core/renderer';
import { createMouseHandler } from './core/input';

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = await initWebGPU(canvas);
  const buffers = createBuffers(ctx.device, { x: canvas.width, y: canvas.height });
  const pipelines = createPipelines(ctx.device, ctx.format, buffers);
  const mouse = createMouseHandler(canvas);
  
  const renderer = createRenderer(ctx, pipelines, buffers, mouse.getMousePosition);
  renderer.start();
}
```

---

## 配置

### `src/config/sim.ts`

包含所有仿真常量的中央配置文件。修改这些值会影响 CPU 和 GPU 的行为。

#### 仿真常量

| 常量 | 类型 | 默认值 | 单位 | 描述 |
|------|------|--------|------|------|
| `PARTICLE_COUNT` | `number` | `10000` | 个 | 默认粒子数量 |
| `PARTICLE_SIZE` | `number` | `16` | 字节 | 每个粒子的字节数 (4 floats × 4 bytes) |
| `WORKGROUP_SIZE` | `number` | `64` | 线程 | WebGPU 计算工作组大小 |
| `GRAVITY` | `Vec2` | `{x: 0, y: 600}` | px/s² | 重力加速度 |
| `DAMPING` | `number` | `0.9` | 比率 | 边界反弹速度阻尼 |
| `REPULSION_RADIUS` | `number` | `200` | px | 鼠标排斥半径 |
| `REPULSION_STRENGTH` | `number` | `3000` | px/s | 鼠标排斥力度 |
| `MAX_SPEED` | `number` | `800` | px/s | 最大粒子速度 |
| `COLOR_MAX_SPEED` | `number` | `800` | px/s | 颜色最大强度对应速度 |
| `DEFAULT_DELTA_TIME` | `number` | `1/60` | s | 默认时间步长 |
| `MAX_DELTA_TIME` | `number` | `0.05` | s | 最大 dt，防止不稳定 |
| `TRAIL_FADE_ALPHA` | `number` | `0.05` | alpha | 拖尾淡化速率 |

#### 颜色常量

| 常量 | 类型 | RGB 值 | 描述 |
|------|------|--------|------|
| `CYAN` | `Color` | `{r: 0, g: 1, b: 1}` | 慢速粒子颜色 (青色) |
| `PURPLE` | `Color` | `{r: 0.9, g: 0.3, b: 1}` | 快速粒子颜色 (紫色) |

#### 着色器前导函数

这些函数生成注入常量的 WGSL 代码：

```typescript
function buildComputeShaderPreamble(): string
```
返回包含以下常量的 WGSL 代码：`GRAVITY`, `REPULSION_RADIUS`, `REPULSION_STRENGTH`, `DAMPING`, `MAX_SPEED`

```typescript
function buildRenderShaderPreamble(): string
```
返回包含以下常量的 WGSL 代码：`CYAN`, `PURPLE`, `MAX_SPEED`

```typescript
function buildTrailShaderPreamble(): string
```
返回包含以下常量的 WGSL 代码：`TRAIL_FADE_ALPHA`

---

## 类型定义

### `src/types.ts`

#### 核心接口

```typescript
interface Particle {
  x: number;   // X 坐标 (像素)
  y: number;   // Y 坐标 (像素)
  vx: number;  // X 方向速度 (px/s)
  vy: number;  // Y 方向速度 (px/s)
}
```

```typescript
interface Vec2 {
  x: number;
  y: number;
}
```

```typescript
interface Color {
  r: number;  // 红色 (0-1)
  g: number;  // 绿色 (0-1)
  b: number;  // 蓝色 (0-1)
}
```

#### GPU 类型

```typescript
interface Uniforms {
  width: number;      // 画布宽度
  height: number;     // 画布高度
  mouseX: number;     // 鼠标 X 坐标
  mouseY: number;     // 鼠标 Y 坐标
  deltaTime: number;  // 帧间隔时间
  _pad1: number;      // 16 字节对齐填充
  _pad2: number;
  _pad3: number;
}
```

```typescript
interface WebGPUContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
  canvas: HTMLCanvasElement;
}
```

```typescript
interface ParticleBuffers {
  particleBuffer: GPUBuffer;
  uniformBuffer: GPUBuffer;
  particleCount: number;
}
```

```typescript
interface Pipelines {
  computePipeline: GPUComputePipeline;
  renderPipeline: GPURenderPipeline;
  trailPipeline: GPURenderPipeline;
  presentPipeline: GPURenderPipeline;
  computeBindGroup: GPUBindGroup;
  renderBindGroup: GPUBindGroup;
}
```

#### 质量类型

```typescript
type SimulationQualityTier = 'low' | 'medium' | 'high';

interface RuntimeSimulationSettings {
  particleCount: number;
  qualityTier: SimulationQualityTier;
  scale: number;
}

interface SimulationHeuristicsInput {
  hardwareConcurrency?: number;        // CPU 核心数
  deviceMemory?: number;               // 设备内存 (GB)
  isFallbackAdapter: boolean;          // 是否 fallback GPU
  maxStorageBufferBindingSize: number; // GPU 缓冲区限制
  viewportPixels: number;              // 画布像素数
}
```

---

## 核心模块

### WebGPU 初始化

#### `src/core/webgpu.ts`

处理 WebGPU 初始化和画布配置。

```typescript
async function initWebGPU(canvas: HTMLCanvasElement): Promise<WebGPUContext>
```
初始化 WebGPU 并返回完整上下文。

**参数:**
- `canvas` - 用于渲染的 HTML 画布元素

**返回值:** `Promise<WebGPUContext>`

**异常:**
- `Error` - 浏览器不支持 WebGPU
- `Error` - 无法获取 GPU 适配器
- `Error` - 无法获取 GPU 设备
- `Error` - 无法创建画布上下文

**示例:**
```typescript
try {
  const ctx = await initWebGPU(canvas);
  console.log('WebGPU 已初始化:', ctx.adapter.info);
} catch (err) {
  console.error('WebGPU 初始化失败:', err.message);
}
```

```typescript
function setupCanvas(canvas: HTMLCanvasElement): void
```
配置画布以支持全屏 HiDPI 渲染。

```typescript
function reconfigureContext(ctx: WebGPUContext): void
```
画布尺寸变化后重新配置上下文。

---

### 缓冲区管理

#### `src/core/buffers.ts`

管理 GPU 缓冲区创建和粒子数据初始化。

```typescript
function initializeParticles(
  canvasSize: Vec2,
  particleCount?: number
): Float32Array
```
创建初始粒子数据（随机位置和速度）。

**返回值:** `Float32Array`，每个粒子 4 个 float（x, y, vx, vy）

```typescript
function createParticleBuffer(
  device: GPUDevice,
  initialData: Float32Array
): GPUBuffer
```
创建粒子数据的 GPU 存储缓冲区。

**使用标志:** `STORAGE | VERTEX | COPY_DST`

```typescript
function createUniformBuffer(device: GPUDevice): GPUBuffer
```
创建全局参数的 uniform 缓冲区。

**使用标志:** `UNIFORM | COPY_DST`

```typescript
function updateUniformBuffer(
  device: GPUDevice,
  buffer: GPUBuffer,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  deltaTime?: number
): void
```
更新 uniform 缓冲区为当前帧数据。

```typescript
function createBuffers(
  device: GPUDevice,
  canvasSize: Vec2,
  particleCount?: number
): ParticleBuffers
```
便利函数，一次性创建所有缓冲区。

**示例:**
```typescript
const buffers = createBuffers(device, { x: 1920, y: 1080 }, 10000);
console.log(`已创建 ${buffers.particleCount} 个粒子`);
```

---

### 物理引擎

#### `src/core/physics.ts`

CPU 参考实现，与 WGSL 计算着色器逻辑一致。

```typescript
function applyGravity(
  velocity: Vec2,
  gravity?: Vec2,
  deltaTime?: number
): Vec2
```
对速度向量应用重力。

**公式:** `velocity + gravity * deltaTime`

```typescript
function calculateRepulsion(
  position: Vec2,
  mousePos: Vec2,
  radius?: number,
  repulsionStrength?: number,
  deltaTime?: number
): Vec2
```
计算鼠标排斥力。

**算法:**
1. 计算到鼠标的距离
2. 如距离 < 半径: 应用反比距离力
3. 返回力向量 × deltaTime

```typescript
function clampVelocity(velocity: Vec2, maxSpeed?: number): Vec2
```
将速度大小限制在最大速度内。

```typescript
function applyBoundaryBounce(
  position: Vec2,
  velocity: Vec2,
  canvasSize: Vec2,
  damping?: number
): { position: Vec2; velocity: Vec2 }
```
处理带阻尼的边界碰撞。

```typescript
function updateParticle(
  particle: Particle,
  canvasSize: Vec2,
  mousePos: Vec2,
  deltaTime?: number,
  gravity?: Vec2
): Particle
```
完整粒子更新（重力 → 排斥 → 限制 → 移动 → 反弹）。

---

### 颜色映射

#### `src/core/color.ts`

基于速度的颜色映射 CPU 参考实现。

```typescript
function velocityToColor(velocity: Vec2): Color
```
将速度转换为 RGB 颜色。

**算法:**
1. 计算速度大小
2. 使用 `COLOR_MAX_SPEED` 归一化到 [0, 1]
3. 在 CYAN（慢速）和 PURPLE（快速）之间线性插值
4. 应用亮度: `0.5 + 0.5 * factor`

```typescript
function getSpeedFactor(velocity: Vec2): number
```
返回归一化速度 [0, 1]。

**示例:**
```typescript
const color = velocityToColor({ x: 400, y: 300 });
// 根据速度 ≈ 500 px/s 返回插值颜色
```

---

### 输入处理

#### `src/core/input.ts`

鼠标和触摸输入处理，支持 HiDPI 坐标映射。

```typescript
interface MouseState {
  x: number;
  y: number;
  isOnCanvas: boolean;
}

function createMouseHandler(canvas: HTMLCanvasElement): {
  getMousePosition: () => Vec2;
  destroy: () => void;
}
```
创建带自动清理功能的输入处理器。

**特性:**
- 支持鼠标和触摸事件
- HiDPI 坐标映射
- 离开画布时返回 `(-1000, -1000)`

**示例:**
```typescript
const mouse = createMouseHandler(canvas);

// 帧循环中
const pos = mouse.getMousePosition();

// 清理
mouse.destroy();
```

---

### 管线创建

#### `src/core/pipelines.ts`

创建所有 WebGPU 管线和绑定组。

```typescript
function createComputePipeline(device: GPUDevice): {
  pipeline: GPUComputePipeline;
  bindGroupLayout: GPUBindGroupLayout;
}
```
创建粒子物理计算管线。

```typescript
function createRenderPipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): { pipeline: GPURenderPipeline; bindGroupLayout: GPUBindGroupLayout }
```
创建粒子渲染管线。

```typescript
function createTrailPipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): GPURenderPipeline
```
创建拖尾淡化管线。

```typescript
function createPresentPipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): GPURenderPipeline
```
创建最终合成管线。

```typescript
function createPipelines(
  device: GPUDevice,
  format: GPUTextureFormat,
  buffers: ParticleBuffers
): Pipelines
```
创建所有管线并配置绑定组。

---

### 渲染器

#### `src/core/renderer.ts`

管理主渲染循环和帧合成。

```typescript
class Renderer {
  constructor(
    ctx: WebGPUContext,
    pipelines: Pipelines,
    buffers: ParticleBuffers,
    getMousePosition: () => Vec2,
    onFrame?: () => void
  );
  
  start(): void;
  stop(): void;
  destroy(): void;
}
```

**渲染管线（每帧）:**

| 顺序 | 阶段 | 着色器 | 描述 |
|------|------|--------|------|
| 1 | 计算 | `compute.wgsl` | 更新粒子物理 |
| 2 | 拖尾 | `trail.wgsl` | 淡化拖尾纹理 |
| 3 | 渲染 | `render.wgsl` | 绘制粒子到纹理 |
| 4 | 呈现 | `present.wgsl` | 合成到屏幕 |

```typescript
function createRenderer(
  ctx: WebGPUContext,
  pipelines: Pipelines,
  buffers: ParticleBuffers,
  getMousePosition: () => Vec2,
  onFrame?: () => void
): Renderer
```
渲染器工厂函数。

**示例:**
```typescript
const renderer = createRenderer(
  ctx, 
  pipelines, 
  buffers, 
  mouse.getMousePosition,
  () => console.log('帧已渲染')
);
renderer.start();

// 后续
renderer.stop();
renderer.destroy();
```

---

### 质量启发式

#### `src/core/quality.ts`

基于设备能力的运行时粒子数量调整。

```typescript
function resolveSimulationSettings(
  input: SimulationHeuristicsInput,
  preferredParticleCount?: number
): RuntimeSimulationSettings
```
确定设备的最佳仿真设置。

**启发式规则:**

| 因素 | 阈值 | 比例限制 |
|------|------|----------|
| Fallback 适配器 | 任意 | 40% |
| 设备内存 | ≤ 2 GB | 45% |
| 设备内存 | ≤ 4 GB | 65% |
| CPU 核心 | ≤ 2 | 45% |
| CPU 核心 | ≤ 4 | 70% |
| 视口 | 4K+ | 65% |
| 视口 | QHD | 85% |

```typescript
function readRuntimeHeuristics(
  adapter: GPUAdapter,
  device: GPUDevice
): SimulationHeuristicsInput
```
读取设备能力以确定质量设置。

**示例:**
```typescript
const heuristics = readRuntimeHeuristics(adapter, device);
const settings = resolveSimulationSettings(heuristics, 10000);
console.log(`质量: ${settings.qualityTier}, 粒子数: ${settings.particleCount}`);
```

---

## 着色器常量

运行时注入 WGSL 的常量：

### 计算着色器
```wgsl
const GRAVITY: vec2f = vec2f(0.0, 600.0);
const REPULSION_RADIUS: f32 = 200.0;
const REPULSION_STRENGTH: f32 = 3000.0;
const DAMPING: f32 = 0.9;
const MAX_SPEED: f32 = 800.0;
```

### 渲染着色器
```wgsl
const CYAN: vec3f = vec3f(0.0, 1.0, 1.0);
const PURPLE: vec3f = vec3f(0.9, 0.3, 1.0);
const MAX_SPEED: f32 = 800.0;
```

### 拖尾着色器
```wgsl
const TRAIL_FADE_ALPHA: f32 = 0.05;
```

---

## 数据布局

### 粒子缓冲区 (Storage)

每个粒子: **16 字节**

| 偏移 | 大小 | 字段 | 类型 | 描述 |
|------|------|------|------|------|
| 0 | 4 字节 | x | f32 | X 坐标 |
| 4 | 4 字节 | y | f32 | Y 坐标 |
| 8 | 4 字节 | vx | f32 | X 方向速度 |
| 12 | 4 字节 | vy | f32 | Y 方向速度 |

### Uniform 缓冲区

总大小: **32 字节**

| 偏移 | 大小 | 字段 | 类型 | 描述 |
|------|------|------|------|------|
| 0 | 4 | width | f32 | 画布宽度 |
| 4 | 4 | height | f32 | 画布高度 |
| 8 | 4 | mouseX | f32 | 鼠标 X |
| 12 | 4 | mouseY | f32 | 鼠标 Y |
| 16 | 4 | deltaTime | f32 | 帧时间 |
| 20 | 4 | _pad1 | f32 | 填充 |
| 24 | 4 | _pad2 | f32 | 填充 |
| 28 | 4 | _pad3 | f32 | 填充 |

---

## 术语表

| 术语 | 定义 |
|------|------|
| **WGSL** | WebGPU 着色语言 (WebGPU Shading Language) |
| **工作组 (Workgroup)** | GPU 线程组（本项目为 64 个线程） |
| **调度 (Dispatch)** | 启动计算着色器工作组 |
| **绑定组 (Bind Group)** | 着色器资源绑定 |
| **管线 (Pipeline)** | 预配置的 GPU 执行状态 |
| **帧缓冲 (Framebuffer)** | GPU 渲染像素内存 |
| **离屏纹理 (Offscreen Texture)** | 非显示渲染目标 |
| **计算着色器 (Compute Shader)** | 通用计算的 GPU 程序 |
| **片段着色器 (Fragment Shader)** | 像素着色的 GPU 程序 |

---

## 另请参阅

- [性能优化指南](PERFORMANCE.md) - 优化和基准测试
- [故障排除指南](TROUBLESHOOTING.md) - 常见问题
- [项目主 README](../../README.md) - 项目概览

---

*文档版本: 2.0.0 | API 版本: 2.0.0 | 最后更新: 2026-04-16*
