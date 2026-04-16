# 性能优化指南

← [返回文档首页](README.md) | [English](../en/PERFORMANCE.md)

> **版本**: 2.0.0  
> **最后更新**: 2026-04-16

---

本指南为 WebGPU 粒子流体仿真项目提供全面的性能数据、基准测试方法和优化策略。

## 目录

- [性能概览](#性能概览)
- [参考硬件](#参考硬件)
- [基准测试结果](#基准测试结果)
- [优化指南](#优化指南)
- [性能分析技巧](#性能分析技巧)
- [性能问题排除](#性能问题排除)

---

## 性能概览

WebGPU 粒子流体仿真专为高性能 GPU 加速粒子物理而设计。主要性能特征：

| 指标 | 典型值 | 说明 |
|------|--------|------|
| 目标 FPS | 60 | 匹配显示器刷新率 |
| 帧预算 | ~16.67ms | 预留浏览器开销 |
| 工作组大小 | 64 | 适用于大多数 GPU |
| 粒子更新 | GPU 计算着色器 | 数千粒子并行处理 |

---

## 参考硬件

用于对比的基准硬件规格：

| 级别 | 设备 | CPU | GPU | 内存 |
|------|------|-----|-----|------|
| **高端** | 游戏台式机 | AMD Ryzen 9 5950X | NVIDIA RTX 3080 | 32 GB |
| **中端** | MacBook Pro | Apple M1 Pro | 集成显卡 | 16 GB |
| **低端** | 入门级笔记本 | Intel i5-1135G7 | Intel Iris Xe | 8 GB |
| **移动** | iPhone 15 Pro | Apple A17 Pro | 集成显卡 | 8 GB |

---

## 基准测试结果

### 粒子数量扩展性

不同粒子数量下的性能 (FPS)：

| 粒子数 | 高端 | 中端 | 低端 | 移动 |
|--------|------|------|------|------|
| 2,500 | 60 | 60 | 60 | 60 |
| 5,000 | 60 | 60 | 60 | 58 |
| 7,500 | 60 | 60 | 55 | 45 |
| 10,000 | 60 | 60 | 48 | 35 |

### 帧时间分解

各阶段平均耗时（10,000 粒子，60 FPS 目标）：

| 阶段 | 时间 (ms) | 预算占比 | 描述 |
|------|-----------|----------|------|
| 计算 | 1.2 | 7% | 物理仿真 |
| 拖尾 | 0.3 | 2% | 纹理淡化 |
| 渲染 | 0.8 | 5% | 绘制粒子 |
| 呈现 | 0.2 | 1% | 合成到屏幕 |
| **GPU 总计** | **2.5** | **15%** | 所有 GPU 阶段 |
| **开销** | **~14** | **85%** | 浏览器、合成等 |

### 自适应质量结果

按设备类型的默认粒子数量：

| 设备类型 | 粒子数 | 质量等级 | 缩放因子 |
|----------|--------|----------|----------|
| 高端台式机 | 10,000 | 高 | 100% |
| 中端台式机 | 7,500 | 高 | 75% |
| 高端笔记本 | 7,000 | 中 | 70% |
| 中端笔记本 | 5,000 | 中 | 50% |
| 低端设备 | 2,500-3,500 | 低 | 25-35% |
| Fallback 适配器 | 2,500 | 低 | 25% |

---

## 优化指南

### 用户优化

#### 浏览器优化

1. **使用 Chrome 或 Edge**
   - 截至 2026 年最佳 WebGPU 性能
   - 最成熟的 WebGPU 实现
   
2. **保持浏览器更新**
   - 每个版本都有 WebGPU 改进
   - 推荐使用最新 Chrome/Edge

3. **禁用扩展程序**
   - GPU 加速扩展可能干扰
   - 问题持续时尝试无痕模式

4. **检查 GPU 加速**
   - Chrome: 访问 `chrome://gpu`
   - 确认 "WebGPU" 显示 "硬件加速"

#### 系统优化

1. **更新 GPU 驱动**
   - NVIDIA: [nvidia.com 下载](https://www.nvidia.com/Download/)
   - AMD: [amd.com 下载](https://www.amd.com/support)
   - Intel: 使用 Windows Update 或 Intel 驱动助手

2. **关闭 GPU 密集型应用**
   - 其他 WebGPU/WebGL 标签页
   - 视频编码/解码
   - 3D 应用

3. **电源设置（笔记本）**
   - 连接电源适配器
   - 禁用省电/节能模式
   - 设置为"高性能"模式

### 开发者优化

#### GPU 性能

1. **保持工作组大小为 64**
   ```wgsl
   // 适用于大多数 GPU
   @compute @workgroup_size(64)
   fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
     // 粒子更新逻辑
   }
   ```

2. **复用 GPU 缓冲区**
   ```typescript
   // ✅ 推荐: 写入现有缓冲区
   device.queue.writeBuffer(uniformBuffer, 0, uniformData);
   
   // ❌ 避免: 每帧创建缓冲区
   const buffer = device.createBuffer({ size: 256, usage: ... });
   ```

3. **最小化缓冲区更新**
   ```typescript
   // 每帧只更新一次 uniform
   updateUniformBuffer(device, buffer, width, height, mouseX, mouseY, dt);
   ```

4. **使用合适的缓冲区使用标志**
   ```typescript
   // 粒子缓冲区: 存储 + 顶点 + 复制目标
   usage: GPUBufferUsage.STORAGE | 
          GPUBufferUsage.VERTEX | 
          GPUBufferUsage.COPY_DST
   ```

#### 内存管理

1. **销毁未使用的资源**
   ```typescript
   // 仿真停止时
   renderer.destroy(); // 清理纹理、缓冲区
   ```

2. **移除事件监听器**
   ```typescript
   // 使用命名函数以便移除
   window.removeEventListener('resize', handleResize);
   ```

3. **测试中避免内存泄漏**
   ```typescript
   afterEach(() => {
     // 清理创建的资源
   });
   ```

#### 着色器优化

1. **最小化分支**
   ```wgsl
   // ✅ 更好: 较少分支
   let factor = select(0.0, 1.0 - dist / radius, dist < radius);
   
   // 为清晰性可接受
   if (dist < radius) {
     // 排斥逻辑
   }
   ```

2. **使用常量替代魔法数字**
   ```wgsl
   // 构建时注入的常量
   const MAX_SPEED: f32 = 800.0;
   const DAMPING: f32 = 0.9;
   ```

---

## 性能分析技巧

### 浏览器开发者工具

#### Chrome 性能标签

1. 打开 DevTools (F12)
2. 进入 Performance 标签
3. 点击 Record
4. 运行仿真 5-10 秒
5. 点击 Stop
6. 分析：
   - 帧时间（应 < 16.67ms）
   - GPU 活动
   - JavaScript 执行时间

#### WebGPU 专用工具

```javascript
// 在控制台检查适配器信息
const adapter = await navigator.gpu.requestAdapter();
const info = await adapter.requestAdapterInfo();
console.table(info);
// 显示: 供应商、架构、设备、描述
```

### FPS 计数器

仿真在左上角显示 FPS。解读：

| FPS | 状态 | 措施 |
|-----|------|------|
| 60 | ✅ 最佳 | 无需操作 |
| 45-59 | ⚠️ 良好 | 可轻微优化 |
| 30-44 | ⚠️ 一般 | 考虑减少粒子数 |
| < 30 | ❌ 较差 | 降低质量或检查系统 |

### 质量等级监视器

HUD 显示当前质量等级：
- **高**: 完整粒子数 (7,500-10,000)
- **中**: 减少数量 (5,000-7,500)
- **低**: 最小数量 (2,500-5,000)

---

## 性能问题排除

### 低 FPS (< 30)

#### 检查清单

1. **验证 WebGPU 硬件加速**
   ```javascript
   // 浏览器控制台中
   const adapter = await navigator.gpu.requestAdapter();
   console.log('Fallback 适配器:', adapter.isFallbackAdapter);
   // 良好性能应为 false
   ```

2. **检查粒子数量**
   - 查看左上角 HUD
   - 如超过设备能力，质量系统应自动调整

3. **浏览器特定问题**

   | 浏览器 | 常见问题 | 解决方案 |
   |--------|----------|----------|
   | Chrome | GPU 进程崩溃 | 重启浏览器 |
   | Edge | 同 Chrome | 重启浏览器 |
   | Safari | 节能模式 | 系统设置中禁用 |

4. **系统问题**
   - 检查可用 GPU 内存
   - 关闭后台应用
   - 更新 GPU 驱动

### 卡顿

1. **检查垃圾回收暂停**
   - 使用 Chrome DevTools Memory 标签
   - 寻找锯齿状模式

2. **减少循环内分配**
   ```typescript
   // ✅ 复用数组
   const uniformData = new Float32Array(8);
   
   function frame() {
     uniformData[0] = width;
     // ... 更新值
     device.queue.writeBuffer(buffer, 0, uniformData);
   }
   ```

### CPU 占用高

预期行为：
- **JavaScript**: 极低 (< 5% 单核)
- **GPU**: 基于粒子数变化
- **总计**: 不应显著影响系统

如 CPU 占用高：
- 检查自定义代码中的无限循环
- 验证 requestAnimationFrame 使用
- 检查过度日志输出

---

## 性能测试

### 自动化基准测试

```typescript
// 基准测试示例
async function benchmark(particleCount: number, duration: number) {
  const frames = [];
  let frameCount = 0;
  const startTime = performance.now();
  
  function measure() {
    const now = performance.now();
    const elapsed = now - startTime;
    
    if (elapsed < duration * 1000) {
      frames.push(1000 / (now - lastTime));
      frameCount++;
      lastTime = now;
      requestAnimationFrame(measure);
    } else {
      reportResults(frames, particleCount);
    }
  }
  
  measure();
}
```

### 报告问题

报告性能问题时，请包含：

1. **系统信息**
   ```
   浏览器: Chrome 122.0.6261.57
   系统: macOS 14.3
   设备: MacBook Pro 14", M1 Pro, 16GB
   ```

2. **仿真信息**
   ```
   粒子数量: 10,000
   质量等级: 高
   FPS: 45
   ```

3. **基准数据**
   - Chrome DevTools Performance 导出（如可能）
   - `chrome://gpu` 输出

---

## 相关资源

- [API 参考文档](API.md) - 技术文档
- [故障排除指南](TROUBLESHOOTING.md) - 一般问题
- [WebGPU 最佳实践](https://developer.chrome.com/docs/webgpu/) - 外部资源

---

*文档版本: 2.0.0 | 最后更新: 2026-04-16*
