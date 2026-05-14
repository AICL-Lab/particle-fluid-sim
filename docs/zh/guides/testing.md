# 测试指南

如何测试 WebGPU 粒子流体模拟代码库。

## 测试框架

项目使用 **Vitest** 进行单元测试，使用 **fast-check** 进行属性测试。

## 运行测试

```bash
# 运行所有测试
npm test

# 监视模式（TDD）
npm run test:watch

# 带覆盖率报告
npm run test:coverage

# 交互式 UI
npm run test:ui
```

## 测试结构

测试与源文件同位置：

```
src/core/
├── buffers.ts
├── buffers.test.ts
├── color.ts
├── color.test.ts
├── physics.ts
├── physics.test.ts
└── quality.ts
    └── quality.test.ts
```

## 属性测试

项目使用 **fast-check** 进行属性测试：

### 示例：粒子边界

```typescript
import * as fc from 'fast-check';
import { initializeParticles } from './buffers';

test('粒子初始化在画布边界内', () => {
  fc.assert(
    fc.property(
      fc.record({
        width: fc.integer({ min: 100, max: 2000 }),
        height: fc.integer({ min: 100, max: 2000 }),
      }),
      fc.integer({ min: 100, max: 10000 }),
      (canvasSize, count) => {
        const particles = initializeParticles(canvasSize, count);
        // 所有粒子应在边界内
        for (let i = 0; i < count; i++) {
          const x = particles[i * 4];
          const y = particles[i * 4 + 1];
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThan(canvasSize.width);
        }
      }
    )
  );
});
```

## 测试类别

### 物理测试

| 属性     | 验证                  |
| -------- | --------------------- |
| 粒子边界 | 所有粒子在画布内      |
| 物理积分 | 位置/速度更新匹配公式 |
| 边界反弹 | 带阻尼的正确反射      |
| 速度钳制 | 速度 ≤ MAX_SPEED      |

### 颜色测试

| 属性     | 验证              |
| -------- | ----------------- |
| RGB 范围 | 所有分量在 [0, 1] |
| 速度映射 | 越快 = 越紫       |

### 质量测试

| 属性     | 验证             |
| -------- | ---------------- |
| 缩放限制 | 输出在有效范围内 |
| 等级分类 | 正确的等级分配   |

## 覆盖率目标

| 类别 | 目标 |
| ---- | ---- |
| 语句 | 80%+ |
| 分支 | 75%+ |
| 函数 | 85%+ |
| 行   | 80%+ |

运行覆盖率查看当前状态：

```bash
npm run test:coverage
```
