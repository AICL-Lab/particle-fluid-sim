---
layout: home
hero:
  name: WebGPU 粒子流体模拟
  text: 技术白皮书
  tagline: 基于 WebGPU 计算着色器的高性能 GPU 粒子模拟。探索 10,000 粒子 @ 60 FPS 背后的架构设计。
  actions:
    - theme: brand
      text: 在线演示
      link: /demo/
    - theme: alt
      text: 阅读白皮书
      link: /zh/whitepaper/architecture
features:
  - icon: ⚡
    title: GPU 加速物理
    details: 所有物理计算通过 WebGPU 计算着色器在 GPU 上运行。重力、排斥力、速度钳制和边界反弹并行处理 10,000 个粒子。
  - icon: 🎯
    title: 自适应质量
    details: 自动检测设备能力，动态调整粒子数量（2,500 ~ 10,000）。低端设备保持流畅，高端硬件全速运行。
  - icon: 🎨
    title: 持久轨迹
    details: 通过专用离屏纹理实现优美的运动轨迹，基于速度的颜色映射。慢粒子呈青色，快粒子发紫光。
  - icon: 📊
    title: 帧率无关
    details: 物理计算使用 delta time，无论 30 FPS 还是 144 FPS，模拟速度保持一致。帧率下降时不会出现物理爆炸。
---
