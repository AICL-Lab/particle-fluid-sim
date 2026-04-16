# 故障排除指南

← [返回文档首页](README.md) | [English](../en/TROUBLESHOOTING.md)

> **版本**: 2.0.0  
> **最后更新**: 2026-04-16

---

本指南帮助您诊断和解决 WebGPU 粒子流体仿真项目的常见问题。

## 目录

- [快速诊断](#快速诊断)
- [浏览器问题](#浏览器问题)
- [初始化错误](#初始化错误)
- [性能问题](#性能问题)
- [视觉问题](#视觉问题)
- [移动端问题](#移动端问题)
- [获取帮助](#获取帮助)

---

## 快速诊断

在浏览器控制台（F12 → Console）中运行以下命令来诊断问题：

```javascript
// 1. 检查 WebGPU 支持
console.log('WebGPU 支持:', !!navigator.gpu);

// 2. 检查适配器可用性
const adapter = await navigator.gpu?.requestAdapter();
console.log('适配器可用:', !!adapter);
console.log('Fallback 适配器:', adapter?.isFallbackAdapter);

// 3. 检查设备
const device = await adapter?.requestDevice();
console.log('设备可用:', !!device);

// 4. 检查画布
const canvas = document.getElementById('canvas');
console.log('找到画布:', !!canvas);
console.log('画布尺寸:', canvas?.width, 'x', canvas?.height);

// 5. 检查 WebGPU 上下文
const ctx = canvas?.getContext('webgpu');
console.log('WebGPU 上下文:', !!ctx);
```

**所有检查应返回 `true` 或有效值。** 如任何检查返回 `false` 或 `undefined`，请参见下方相关章节。

---

## 浏览器问题

### WebGPU 不支持

**错误:** `WebGPU is not supported in this browser`

**原因:** 您的浏览器未启用或不支持 WebGPU。

**解决方案:**

| 浏览器 | 最低版本 | 解决方案 |
|--------|----------|----------|
| Chrome | 113+ | 更新到最新版本 |
| Edge | 113+ | 更新到最新版本 |
| Safari | 17+ | 将 macOS 更新到 14+ |
| Firefox | Nightly | 在 `about:config` 中启用 `dom.webgpu.enabled` |

**检查支持:**
```javascript
if (!navigator.gpu) {
  alert('请使用 Chrome 113+、Edge 113+ 或 Safari 17+');
}
```

### 浏览器版本过旧

**症状:** 仿真无法启动，控制台显示语法错误

**解决方案:**
1. 检查浏览器版本
2. 更新到最新版本：
   - Chrome: 菜单 → 帮助 → 关于 Google Chrome
   - Edge: 菜单 → 帮助和反馈 → 关于 Microsoft Edge
   - Safari: 系统设置 → 通用 → 软件更新

---

## 初始化错误

### "GPU adapter not found"

**错误信息:** `Failed to get GPU adapter`

**原因与解决方案:**

#### 1. 硬件加速已禁用

**Chrome:**
1. 访问 `chrome://settings/system`
2. 启用"使用硬件加速模式（如果可用）"
3. 重启浏览器

**验证:**
- 访问 `chrome://gpu`
- 查找 "WebGPU: Hardware accelerated"

#### 2. GPU 驱动过旧

更新显卡驱动：

| 厂商 | 更新方式 |
|------|----------|
| NVIDIA | [官方下载](https://www.nvidia.com/Download/) |
| AMD | [官方下载](https://www.amd.com/support) |
| Intel | Windows Update 或 [Intel 助手](https://www.intel.com/content/www/us/en/support/detect.html) |

#### 3. GPU 被占用

关闭可能使用 GPU 的应用程序：
- 其他带有 WebGL/WebGPU 的浏览器标签页
- 视频编辑软件
- 3D 游戏或应用程序

### "Canvas element not found"

**错误信息:** `Canvas element not found`

**解决方案:**

1. **验证 HTML 结构:**
   ```html
   <canvas id="canvas"></canvas>
   ```

2. **检查脚本加载顺序:**
   ```html
   <!-- 在画布之后加载 -->
   <canvas id="canvas"></canvas>
   <script type="module" src="main.js"></script>
   ```

3. **验证 JavaScript:**
   ```javascript
   const canvas = document.getElementById('canvas');
   if (!canvas) {
     console.error('未找到画布！');
   }
   ```

### "Failed to create WebGPU context"

**错误:** 画布上下文创建失败

**解决方案:**

1. **检查画布是否在 DOM 中:**
   ```javascript
   console.log(document.contains(canvas)); // 应为 true
   ```

2. **验证画布尺寸:**
   ```javascript
   if (canvas.width === 0 || canvas.height === 0) {
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
   }
   ```

3. **尝试重新创建上下文:**
   ```javascript
   const ctx = canvas.getContext('webgpu');
   if (!ctx) {
     // 回退或显示错误
     showError('WebGPU 不可用');
   }
   ```

---

## 性能问题

### 低 FPS（少于 30）

**症状:** 动画卡顿或不连贯

**诊断:**
```javascript
// 检查质量设置
console.log('质量等级:', qualityTier);
console.log('粒子数量:', particleCount);
```

**解决方案:**

1. **检查质量自动检测**
   - 仿真应根据设备自动调整
   - 查看左上角 HUD 了解质量等级

2. **关闭其他 GPU 密集型应用**
   - 其他浏览器标签页
   - 视频流
   - 3D 应用

3. **电源模式（笔记本）**
   - 连接电源适配器
   - 禁用节能模式
   - 将性能模式设置为"高"

4. **检查 Fallback 适配器**
   ```javascript
   const adapter = await navigator.gpu.requestAdapter();
   if (adapter.isFallbackAdapter) {
     alert('使用软件渲染。请更新 GPU 驱动。');
   }
   ```

### 高帧时间

**症状:** 持续延迟，不只是偶发卡顿

**在 DevTools 中检查:**
1. 打开 Performance 标签
2. 记录 5 秒
3. 查找长帧（> 16.67ms）

**常见原因:**

| 原因 | 解决方案 |
|------|----------|
| 粒子过多 | 质量系统应自动调整 |
| 浏览器扩展 | 禁用扩展，尝试无痕模式 |
| 浏览器过旧 | 更新到最新版本 |
| 温度节流 | 检查设备温度 |

---

## 视觉问题

### 黑屏

**症状:** 画布完全黑色

**诊断步骤:**

1. **检查控制台错误**
   ```javascript
   // 应无红色错误
   ```

2. **验证 WebGPU 初始化**
   ```javascript
   console.log('WebGPU:', !!navigator.gpu);
   ```

3. **检查粒子是否初始化**
   ```javascript
   // 在 main.ts 或控制台中
   console.log('缓冲区:', buffers);
   console.log('粒子数量:', buffers?.particleCount);
   ```

4. **尝试强制重绘**
   ```javascript
   // 调整窗口大小或
   window.dispatchEvent(new Event('resize'));
   ```

**解决方案:**

| 问题 | 解决方案 |
|------|----------|
| WebGPU 失败 | 更新浏览器，检查加速 |
| 着色器编译错误 | 清除缓存 (Ctrl+Shift+R) |
| 画布不可见 | 检查 CSS: `display: block` |
| 粒子离屏 | 调整浏览器大小，刷新页面 |

### 粒子不可见

**症状:** 黑屏或画布显示但没有粒子

**诊断:**
```javascript
// 检查初始化
const canvas = document.getElementById('canvas');
console.log('尺寸:', canvas.width, canvas.height);

// 检查 WebGPU
const ctx = await initWebGPU(canvas);
console.log('格式:', ctx.format);
```

**解决方案:**

1. **清除浏览器缓存**
   - Windows/Linux: `Ctrl + Shift + R`
   - macOS: `Cmd + Shift + R`

2. **检查控制台中的着色器错误**
   - 查找 WGSL 编译错误
   - 向 GitHub issues 报告着色器错误

3. **验证颜色映射**
   ```typescript
   // 检查配置
   import { COLOR_MAX_SPEED } from './config/sim';
   console.log('颜色最大速度:', COLOR_MAX_SPEED);
   ```

### 颜色错误

**症状:** 粒子显示错误颜色或全部同色

**检查:**
```javascript
// 验证颜色常量
console.log('CYAN:', CYAN);
console.log('PURPLE:', PURPLE);
console.log('COLOR_MAX_SPEED:', COLOR_MAX_SPEED);
```

**解决方案:**
- 检查着色器编译错误
- 验证 `COLOR_MAX_SPEED` 不为零
- 尝试刷新页面

### 拖尾不显示

**症状:** 粒子后无运动拖尾

**诊断:**
```javascript
// 检查拖尾配置
console.log('TRAIL_FADE_ALPHA:', TRAIL_FADE_ALPHA);
// 应约为 0.05
```

**解决方案:**

1. **验证拖尾 alpha 值**
   - 应为 `0.05` 或类似值（不是 1.0）
   - 检查 `src/config/sim.ts`

2. **检查离屏纹理**
   - 验证拖尾管线正在执行
   - 检查控制台中的纹理创建错误

3. **清除浏览器缓存**
   - 强制刷新并清除缓存

---

## 移动端问题

### 触摸无效

**症状:** 触摸屏幕无交互

**解决方案:**

1. **验证触摸事件已启用**
   ```javascript
   // 检查触摸支持
   console.log('触摸:', 'ontouchstart' in window);
   ```

2. **检查浏览器缩放**
   - 重置缩放到 100%
   - 双指缩放可能干扰

3. **尝试不同浏览器**
   - iOS: Safari 有最佳 WebGPU 支持
   - Android: 推荐使用 Chrome

### 移动端性能问题

**症状:** 移动设备上 FPS 非常低

**预期行为:**

| 设备 | 预期 FPS | 粒子数量 |
|------|----------|----------|
| iPhone 15 Pro | 35-45 | 10,000 |
| iPhone 14 | 30-40 | 7,500 |
| 安卓旗舰 | 30-45 | 7,500-10,000 |
| 中端设备 | 25-35 | 5,000-7,500 |

**优化:**

1. **关闭后台应用**
2. **启用性能模式**
3. **降低亮度**（防止温度节流）
4. **iOS 使用 Safari**（更好的 WebGPU）

### 方向问题

**症状:** 旋转设备时仿真出现故障

**解决方案:**
1. 旋转后刷新页面
2. 检查调整大小处理程序是否工作：
   ```javascript
   window.addEventListener('resize', () => {
     console.log('调整大小:', window.innerWidth, window.innerHeight);
   });
   ```

---

## 调试工作流

遇到问题时，遵循以下系统化方法：

### 步骤 1: 基本检查

```javascript
// 运行所有诊断
const diagnostics = {
  webgpu: !!navigator.gpu,
  adapter: !!(await navigator.gpu?.requestAdapter()),
  canvas: !!document.getElementById('canvas'),
  context: !!document.getElementById('canvas')?.getContext('webgpu')
};
console.table(diagnostics);
// 所有应为 true
```

### 步骤 2: 检查控制台

1. 打开 DevTools (F12)
2. 查找红色错误信息
3. 展开错误查看堆栈跟踪
4. 记录任何着色器编译错误

### 步骤 3: 隔离问题

| 测试 | 方法 | 预期 |
|------|------|------|
| 浏览器问题 | 尝试不同浏览器 | 在 Chrome/Edge 中工作 |
| 缓存问题 | Ctrl+Shift+R 刷新 | 重新加载 |
| 扩展问题 | 无痕模式 | 无扩展 |
| GPU 问题 | 检查 `chrome://gpu` | 硬件加速 |

### 步骤 4: 收集信息

报告问题前，收集：

```javascript
// 在控制台中运行并复制输出
(async () => {
  const browser = navigator.userAgent;
  const adapter = await navigator.gpu?.requestAdapter();
  const info = adapter ? await adapter.requestAdapterInfo() : null;
  
  console.log('=== 系统信息 ===');
  console.log('浏览器:', browser);
  console.log('适配器:', info);
  console.log('Fallback:', adapter?.isFallbackAdapter);
})();
```

---

## 获取帮助

### 报告前

1. **先尝试这些:**
   - [ ] 强制刷新 (Ctrl+Shift+R)
   - [ ] 不同浏览器
   - [ ] 禁用扩展
   - [ ] 更新浏览器
   - [ ] 更新 GPU 驱动

2. **查阅文档:**
   - [API 参考文档](API.md)
   - [性能优化指南](PERFORMANCE.md)
   - [主 README](../../README.md)

### 报告问题

请在错误报告中包含以下信息：

**系统信息:**
```
浏览器: Chrome 122.0.6261.95 (Official Build) (arm64)
系统: macOS 14.3.1 (Darwin 23.3.0)
设备: MacBook Pro 14" 2021, Apple M1 Pro, 16GB RAM
```

**仿真信息:**
```
粒子数量: 10,000
质量等级: 高
FPS: ~45
```

**控制台输出:**
- 复制任何红色错误信息
- 如相关包括警告

**复现步骤:**
1. 打开仿真
2. 等待 5 秒
3. 快速移动鼠标
4. 观察卡顿

### 报告位置

- 🐛 **Bug:** [GitHub Issues](https://github.com/LessUp/particle-fluid-sim/issues/new?template=bug_report.yml)
- 💡 **功能请求:** [GitHub Issues](https://github.com/LessUp/particle-fluid-sim/issues/new?template=feature_request.yml)
- 💬 **问题:** [GitHub Discussions](https://github.com/LessUp/particle-fluid-sim/discussions)

---

## 快速参考

| 问题 | 首先尝试 | 然后尝试 |
|------|----------|----------|
| 无法启动 | 更新浏览器 | 在 `chrome://gpu` 检查 WebGPU |
| 黑屏 | 强制刷新 (Ctrl+Shift+R) | 检查控制台错误 |
| 低 FPS | 关闭其他标签页 | 查看 HUD 中的质量等级 |
| 触摸无效 | 刷新页面 | 尝试 Safari (iOS) |
| 卡顿 | 检查温度节流 | 减少粒子数量 |

---

*文档版本: 2.0.0 | 最后更新: 2026-04-16*
