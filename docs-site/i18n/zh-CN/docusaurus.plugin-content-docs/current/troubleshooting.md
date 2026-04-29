---
sidebar_position: 5
---

# 故障排除

WebGPU 粒子流体模拟的常见问题及解决方案。

## 浏览器兼容性问题

### WebGPU 不支持

**错误：** `WebGPU is not supported in this browser`

**解决方案：**

- 使用 Chrome 113+、Edge 113+ 或 Safari 17+
- 在 Firefox 中启用 WebGPU：在 `about:config` 中设置 `dom.webgpu.enabled` 为 `true`
- 查看 [caniuse.com/webgpu](https://caniuse.com/webgpu) 了解当前支持情况

**在浏览器控制台中快速检查：**

```javascript
if (!navigator.gpu) {
  console.log('WebGPU 不支持');
}
```

### 浏览器版本过旧

**解决方案：**

- 将 Chrome/Edge 更新到最新版本
- 将 Safari 更新到 macOS 14+
- 在 Windows/Linux 上使用 Chrome 以获得最佳支持

## 初始化错误

### "GPU adapter not found"

**原因：** 没有兼容的 GPU 或硬件加速已禁用

**解决方案：**

1. **检查 GPU 加速：**
   - Chrome：访问 `chrome://gpu`
   - 确保"硬件加速"已启用

2. **更新 GPU 驱动：**
   - NVIDIA：从 [nvidia.com](https://www.nvidia.com/Download/index.aspx) 下载
   - AMD：从 [amd.com](https://www.amd.com/en/support) 下载
   - Intel：使用 Windows Update 或 Intel 驱动助手

### "Device unavailable"

**原因：** GPU 正被其他应用程序使用

**解决方案：**

- 关闭其他 GPU 密集型应用程序
- 重启浏览器
- 检查是否有其他浏览器标签页正在使用 WebGPU

## 性能问题

### 低 FPS / 卡顿

**解决方案：**

1. **检查质量等级：** 应用自动缩放粒子（2,500 - 10,000）
2. **减少浏览器开销：** 关闭其他标签页和扩展
3. **更新 GPU 驱动** 到最新版本
4. **检查电源设置：** 在笔记本电脑上使用"高性能"模式

### 黑屏

**解决方案：**

1. 检查浏览器控制台的 WebGPU 错误
2. 确保硬件加速已启用
3. 尝试不同的 WebGPU 兼容浏览器

## 移动端问题

### 触摸不工作

**解决方案：** 触摸事件应该自动工作。如果不工作，请确保：

- JavaScript 已启用
- 没有浏览器扩展阻止事件
- 触摸事件没有被拦截

### 移动端性能

**解决方案：**

- 在 Android 上使用 Chrome 或 Edge
- 在 iOS 上使用 Safari 17+
- 应用会自动减少移动设备上的粒子数量

## 获取帮助

如果您遇到本文档未涵盖的问题：

1. 查看 [GitHub Issues](https://github.com/LessUp/particle-fluid-sim/issues)
2. 提交新问题，包含：
   - 浏览器和版本
   - 操作系统
   - 控制台错误消息
   - 重现步骤
