---
sidebar_position: 2
---

# API 参考

WebGPU 粒子流体模拟的 TypeScript API 文档。

> **规范契约**：接口定义的权威来源是 [`openspec/specs/api/typescript-interfaces.md`](https://github.com/LessUp/particle-fluid-sim/blob/master/openspec/specs/api/typescript-interfaces.md)。

## 配置

### `src/config/sim.ts`

包含所有模拟常量的核心配置文件。

| 常量                 | 类型     | 默认值           | 描述                        |
| -------------------- | -------- | ---------------- | --------------------------- |
| `PARTICLE_COUNT`     | `number` | `10000`          | 默认粒子数量                |
| `PARTICLE_SIZE`      | `number` | `16`             | 每个粒子的字节大小          |
| `WORKGROUP_SIZE`     | `number` | `64`             | WebGPU 计算着色器工作组大小 |
| `GRAVITY`            | `Vec2`   | `{x: 0, y: 600}` | 重力加速度（px/s²）         |
| `DAMPING`            | `number` | `0.9`            | 边界碰撞时的速度衰减        |
| `REPULSION_RADIUS`   | `number` | `200`            | 鼠标排斥半径（像素）        |
| `REPULSION_STRENGTH` | `number` | `3000`           | 鼠标排斥力强度              |
| `MAX_SPEED`          | `number` | `800`            | 粒子最大速度（px/s）        |

### 着色器前导函数

```typescript
function buildComputeShaderPreamble(): string;
```

构建计算着色器的 WGSL 常量声明。

```typescript
function buildRenderShaderPreamble(): string;
```

构建渲染着色器的 WGSL 常量声明。

```typescript
function buildTrailShaderPreamble(): string;
```

构建轨迹着色器的 WGSL 常量声明。

## 类型

### `src/types.ts`

```typescript
interface Particle {
  x: number; // X 坐标（像素）
  y: number; // Y 坐标（像素）
  vx: number; // X 方向速度（px/s）
  vy: number; // Y 方向速度（px/s）
}

interface Vec2 {
  x: number;
  y: number;
}

interface Color {
  r: number;
  g: number;
  b: number;
}
```

## 核心模块

### WebGPU 初始化 (`src/core/webgpu.ts`)

```typescript
async function initWebGPU(canvas: HTMLCanvasElement): Promise<WebGPUContext | null>;
```

初始化 WebGPU 设备、上下文和画布配置。如果不支持 WebGPU 则返回 `null`。

### 缓冲区管理 (`src/core/buffers.ts`)

```typescript
function createParticleBuffer(device: GPUDevice, count: number): GPUBuffer;
```

创建粒子数据的 GPU 缓冲区，包含初始随机位置。

```typescript
function createUniformBuffer(device: GPUDevice): GPUBuffer;
```

创建模拟参数的 uniform 缓冲区。

### 物理计算 (`src/core/physics.ts`)

```typescript
function generateInitialParticles(count: number): Particle[];
```

生成具有随机位置和速度的粒子。

```typescript
function applyGravity(velocity: Vec2, gravity: Vec2, dt: number): Vec2;
```

对速度应用重力加速度。

### 颜色映射 (`src/core/color.ts`)

```typescript
function lerpColor(a: Color, b: Color, t: number): Color;
```

两颜色之间的线性插值。

```typescript
function velocityToColor(vx: number, vy: number, maxSpeed: number): Color;
```

将粒子速度映射到颜色渐变（青色 → 紫色）。

### 质量检测 (`src/core/quality.ts`)

```typescript
function detectQualityTier(): QualityTier;
```

检测设备性能等级以进行自适应质量缩放。

```typescript
function getParticleCountForTier(tier: QualityTier): number;
```

返回指定质量等级推荐的粒子数量。

## 相关文档

- [架构概述](/docs/architecture) - 系统设计和数据流
- [性能指南](/docs/performance) - 优化策略
- [故障排除](/docs/troubleshooting) - 常见问题及解决方案
