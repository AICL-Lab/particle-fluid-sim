# 渲染管线

粒子模拟的可视化架构。

## 概述

渲染管线通过多阶段流程将粒子物理状态转换为视觉输出，针对 WebGPU 优化。

## 管线架构

```mermaid
flowchart TB
    subgraph Input["输入"]
        PB["粒子缓冲区<br/>(位置、速度)"]
        UB["均匀缓冲区<br/>(画布尺寸)"]
    end

    subgraph Vertex["顶点阶段"]
        V1["加载粒子数据"]
        V2["转换为 NDC<br/>(-1 到 1)"]
        V3["计算速度"]
    end

    subgraph Fragment["片段阶段"]
        F1["速度 → 颜色<br/>(青到紫)"]
        F2["应用亮度"]
        F3["输出 RGBA"]
    end

    subgraph Output["输出"]
        TEX["离屏纹理"]
    end

    PB --> V1 --> V2 --> V3 --> F1 --> F2 --> F3 --> TEX
    UB --> V2
```

## 颜色映射

```mermaid
graph LR
    subgraph Velocity["速度"]
        S0["0 px/s"]
        S1["400 px/s"]
        S2["800 px/s"]
    end

    subgraph Color["颜色"]
        C0["青色<br/>#00FFFF"]
        C1["蓝紫<br/>#4488FF"]
        C2["紫色<br/>#E64DFF"]
    end

    S0 --> C0
    S1 --> C1
    S2 --> C2
```

| 速度 | 颜色 | RGB               |
| ---- | ---- | ----------------- |
| 0    | 青色 | `(0, 1, 1)`       |
| 400  | 插值 | `(0.45, 0.65, 1)` |
| 800  | 紫色 | `(0.9, 0.3, 1)`   |

**亮度缩放：** 静止时 50% → 最大速度时 100%。

## 源文件

| 文件                       | 用途         |
| -------------------------- | ------------ |
| `src/shaders/render.wgsl`  | 粒子渲染     |
| `src/shaders/trail.wgsl`   | 轨迹淡出效果 |
| `src/shaders/present.wgsl` | 屏幕合成     |
| `src/core/pipelines.ts`    | 管线创建     |

## 下一步

- [自适应质量系统](/zh/whitepaper/quality-system) - 性能缩放
- [性能指南](/zh/performance) - 优化技巧
