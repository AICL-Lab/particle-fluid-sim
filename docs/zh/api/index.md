# API 参考

WebGPU 粒子流体模拟的完整 API 文档。

## 配置

所有模拟常量定义在 `src/config/sim.ts`。

### 常量

| 常量                 | 类型     | 默认值           | 描述                     |
| -------------------- | -------- | ---------------- | ------------------------ |
| `PARTICLE_COUNT`     | `number` | `10000`          | 默认粒子数量             |
| `PARTICLE_SIZE`      | `number` | `16`             | 每粒子字节数（4 个浮点） |
| `WORKGROUP_SIZE`     | `number` | `64`             | 计算着色器工作组大小     |
| `GRAVITY`            | `Vec2`   | `{x: 0, y: 600}` | 重力加速度（px/s²）      |
| `DAMPING`            | `number` | `0.9`            | 边界反弹速度阻尼         |
| `REPULSION_RADIUS`   | `number` | `200`            | 鼠标影响半径（px）       |
| `REPULSION_STRENGTH` | `number` | `3000`           | 鼠标排斥力强度           |
| `MAX_SPEED`          | `number` | `800`            | 最大速度（px/s）         |
| `TRAIL_FADE_ALPHA`   | `number` | `0.05`           | 每帧轨迹淡出             |

---

## 类型

### Particle

```typescript
interface Particle {
  x: number; // 位置 X（像素）
  y: number; // 位置 Y（像素）
  vx: number; // 速度 X（px/s）
  vy: number; // 速度 Y（px/s）
}
```

### Vec2

```typescript
interface Vec2 {
  x: number;
  y: number;
}
```

### Color

```typescript
interface Color {
  r: number; // 红（0-1）
  g: number; // 绿（0-1）
  b: number; // 蓝（0-1）
}
```

---

## 核心模块

### WebGPU 初始化 (`src/core/webgpu.ts`)

```typescript
async function initWebGPU(canvas: HTMLCanvasElement): Promise<WebGPUContext>;
```

初始化 WebGPU 并返回上下文。失败时抛出异常。

```typescript
function setupCanvas(canvas: HTMLCanvasElement): void;
```

配置画布为全屏显示，支持 HiDPI。

---

### 缓冲区管理 (`src/core/buffers.ts`)

```typescript
function initializeParticles(canvasSize: Vec2, particleCount?: number): Float32Array;
```

创建初始粒子数据，随机位置和速度。

```typescript
function createParticleBuffer(device: GPUDevice, initialData: Float32Array): GPUBuffer;
```

创建粒子数据的 GPU 存储缓冲区。

```typescript
function createUniformBuffer(device: GPUDevice): GPUBuffer;
```

创建全局参数的 GPU 均匀缓冲区。

---

### 物理 (`src/core/physics.ts`)

物理计算的 CPU 参考实现。

```typescript
function applyGravity(velocity: Vec2, gravity?: Vec2, deltaTime?: number): Vec2;
```

对速度应用重力加速度。

```typescript
function clampVelocity(velocity: Vec2, maxSpeed?: number): Vec2;
```

将速度大小钳制到最大速度。

```typescript
function updateParticle(
  particle: Particle,
  canvasSize: Vec2,
  mousePos: Vec2,
  deltaTime?: number,
  gravity?: Vec2
): Particle;
```

更新单个粒子一帧。

---

### 质量启发式 (`src/core/quality.ts`)

```typescript
type SimulationQualityTier = 'low' | 'medium' | 'high';

interface RuntimeSimulationSettings {
  particleCount: number;
  qualityTier: SimulationQualityTier;
  scale: number;
}

function resolveSimulationSettings(
  input: SimulationHeuristicsInput,
  preferredParticleCount?: number
): RuntimeSimulationSettings;
```

根据设备能力确定运行时粒子数量。

---

### 渲染器 (`src/core/renderer.ts`)

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

管理渲染循环和帧合成。

---

## 数据布局

### 粒子缓冲区

| 偏移 | 大小 | 字段 | 类型 |
| ---- | ---- | ---- | ---- |
| 0    | 4    | x    | f32  |
| 4    | 4    | y    | f32  |
| 8    | 4    | vx   | f32  |
| 12   | 4    | vy   | f32  |

### 均匀缓冲区

| 偏移  | 大小 | 字段      | 类型 |
| ----- | ---- | --------- | ---- |
| 0     | 4    | width     | f32  |
| 4     | 4    | height    | f32  |
| 8     | 4    | mouseX    | f32  |
| 12    | 4    | mouseY    | f32  |
| 16    | 4    | deltaTime | f32  |
| 20-28 | 12   | \_pad     | f32  |
