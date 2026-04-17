# Project Philosophy: Spec-Driven Development (SDD)

> **Project**: WebGPU Particle Fluid Simulation
> **Version**: 2.0.0
> **Last Updated**: 2026-04-17

本项目严格遵循**规范驱动开发（Spec-Driven Development）**范式。所有的代码实现必须以 `/specs` 目录下的规范文档为唯一事实来源（Single Source of Truth）。

---

## Directory Context (目录说明)

| 目录 | 用途 |
|------|------|
| `/specs/product/` | 产品功能定义与验收标准 (PRD) |
| `/specs/rfc/` | 技术设计文档与架构决策 (RFCs) |
| `/specs/api/` | API 接口定义（如 OpenAPI.yaml, GraphQL Schema） |
| `/specs/db/` | 数据库模型定义（如 DBML, Prisma Schema） |
| `/specs/testing/` | BDD 测试用例规范（.feature 文件） |
| `/docs/` | 开发者和用户文档 |
| `/docs/setup/` | 环境搭建指南 |
| `/docs/tutorials/` | 用户使用教程 |
| `/docs/architecture/` | 高层面架构说明 |
| `/docs/assets/` | 图片、UML 图等静态资源 |

---

## AI Agent Workflow Instructions (AI 工作流指令)

当你（AI）被要求开发一个新功能、修改现有功能或修复 Bug 时，**必须严格按照以下工作流执行，不可跳过任何步骤**：

### Step 1: 审查与分析 (Review Specs)

- 在编写任何代码之前，首先阅读 `/specs` 目录下相关的产品文档、RFC 和 API 定义。
- 如果用户指令与现有 Spec 冲突，请立即停止编码，并指出冲突点，询问用户是否需要先更新 Spec。

### Step 2: 规范优先 (Spec-First Update)

- 如果这是一个新功能，或者需要改变现有的接口/数据库结构，**必须首先提议修改或创建相应的 Spec 文档**（如 `openapi.yaml` 或 RFC 文档）。
- 等待用户确认 Spec 的修改后，才能进入代码编写阶段。

### Step 3: 代码实现 (Implementation)

- 编写代码时，必须 100% 遵守 Spec 中的定义（包括变量命名、API 路径、数据类型、状态码等）。
- 不要在代码中擅自添加 Spec 中未定义的功能（No Gold-Plating）。

### Step 4: 测试验证 (Test against Spec)

- 根据 `/specs` 中的验收标准（Acceptance Criteria）编写单元测试和集成测试。
- 确保测试用例覆盖了 Spec 中描述的所有边界情况。

---

## Code Generation Rules

1. **API 变更**: 任何对外部暴露的 API 变更，必须同步修改 `/specs/api/` 下的相关文件。
2. **架构决策**: 如果遇到不确定的技术细节，请查阅 `/specs/rfc/` 下的架构约定，不要自行捏造设计模式。
3. **双语文档**: 当添加或更新文档时，确保英文版和中文版同步更新。
4. **变更日志**: 所有变更必须记录在 `CHANGELOG.md` 的 `[Unreleased]` 部分。

---

## Project Quick Reference

### Key Specs

| Spec | Path |
|------|------|
| Product Requirements (PRD) | `specs/product/webgpu-particle-fluid-sim.md` |
| RFC 0001: Core Architecture | `specs/rfc/0001-core-architecture.md` |
| RFC 0002: Implementation Tasks | `specs/rfc/0002-implementation-tasks.md` |

### Key Documentation

| Document | Path |
|----------|------|
| API Reference | `docs/API.md` |
| Performance Guide | `docs/PERFORMANCE.md` |
| Troubleshooting | `docs/TROUBLESHOOTING.md` |
| Maintenance Guide | `docs/maintenance.md` |

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |

---

## Why This Declaration?

1. **防范 AI 幻觉**: 强制第一步读取 `/specs` 可以锚定 AI 的思考范围，防止在没有上下文的情况下"自由发挥"。
2. **约束修改路径**: 声明了"修改代码前先改 Spec"，保证了文档与代码永远同步（Document-Code Synchronization）。
3. **提高 PR 质量**: 当 AI 帮你生成 Pull Request 时，实现会与业务逻辑高度一致，因为它是根据 Spec 中定义的验收标准来进行开发的。

---

*This file is the AI agent configuration for Spec-Driven Development. Do not remove.*
