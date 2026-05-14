# 贡献指南

如何为 WebGPU 粒子流体模拟项目做贡献。

## 开发工作流

### 1. Fork 并克隆

```bash
# 在 GitHub 上 Fork 仓库，然后：
git clone https://github.com/YOUR_USERNAME/particle-fluid-sim.git
cd particle-fluid-sim
npm install
```

### 2. 创建分支

```bash
git checkout -b feature/your-feature-name
```

### 3. 进行更改

遵循规范驱动开发工作流：

1. **阅读** [AGENTS.md](../../../AGENTS.md) 了解工作流详情
2. **实现功能前先更新规范**
3. **为新功能编写测试**
4. **运行验证**：`npm run verify`

### 4. 提交 Pull Request

```bash
git commit -m "feat: 添加你的功能"
git push origin feature/your-feature-name
```

然后在 GitHub 上提交 Pull Request。

## 代码风格

### TypeScript

- 启用严格模式
- 优先使用 `const` 而非 `let`
- 公共函数使用显式返回类型

### 格式化

提交前运行 Prettier：

```bash
npm run format
```

### 代码检查

```bash
npm run lint
npm run lint:fix  # 自动修复问题
```

## 提交信息

遵循 [约定式提交](https://www.conventionalcommits.org/zh-hans/)：

| 类型        | 描述     |
| ----------- | -------- |
| `feat:`     | 新功能   |
| `fix:`      | 错误修复 |
| `docs:`     | 文档     |
| `test:`     | 测试     |
| `refactor:` | 代码重构 |
| `chore:`    | 维护     |

示例：

```
feat: 添加粒子数量 URL 参数
fix: 修正 HiDPI 坐标映射
docs: 更新 API 参考
```

## Pull Request 检查清单

- [ ] 代码编译通过（`npm run typecheck`）
- [ ] 测试通过（`npm test`）
- [ ] 代码检查通过（`npm run lint`）
- [ ] 覆盖率保持（`npm run test:coverage`）
- [ ] 构建成功（`npm run build`）
- [ ] 规范已更新（如适用）
- [ ] 文档已更新（如适用）

## 获取帮助

- **问题：** [GitHub Issues](https://github.com/LessUp/particle-fluid-sim/issues)
- **讨论：** [GitHub Discussions](https://github.com/LessUp/particle-fluid-sim/discussions)

## 许可证

通过贡献，你同意你的贡献将在 MIT 许可证下授权。
