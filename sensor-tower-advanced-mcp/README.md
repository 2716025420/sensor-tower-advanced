# Sensor Tower Advanced MCP Server

这是一个高级 Sensor Tower MCP (Model Context Protocol) 服务器，旨在为 AI Agent 提供强大的移动应用市场情报分析能力。它通过封装 Sensor Tower API，让大模型能够直接查询和分析应用的用户画像、使用行为等深层数据。

> **当前状态**: 核心功能开发中，目前已支持 Demographics (用户画像) 模块。

## � 核心功能

### 已实现功能 (Implemented)

#### 1. 用户画像分析 (`get_demographics`)
深入了解应用受众的构成，辅助市场定位和竞品分析。

*   **功能**: 获取指定应用在特定时间段、特定国家的用户年龄和性别分布数据。
*   **支持平台**: iOS, Android
*   **主要参数**:
    *   `app_ids`: 应用 ID 列表 (逗号分隔)
    *   `start_date` / `end_date`: 分析时间范围 (YYYY-MM-DD)
    *   `countries`: 目标国家代码 (如 US, CN)
    *   `date_granularity`: 数据粒度 (daily, monthly 等)

## � 快速开始

### 前置要求
*   **Node.js**: >= 16.0.0 (推荐 v18 LTS 或更高)
*   **Sensor Tower API Token**: 需要拥有企业级 Sensor Tower 账号并获取 API Token。

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

```bash
npm run build
```

构建产物将输出至 `dist/` 目录。

### 3. 配置 MCP 客户端

将此服务器添加到您的 MCP 客户端配置文件中（例如 Claude Desktop 的 `claude_desktop_config.json`）。

**Windows 配置示例:**

```json
{
  "mcpServers": {
    "sensor-tower-advanced": {
      "command": "node",
      "args": [
        "F:/path/to/your/project/sensor-tower-advanced-mcp/dist/index.js"
      ],
      "env": {
        "SENSOR_TOWER_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

**MacOS/Linux 配置示例:**

```json
{
  "mcpServers": {
    "sensor-tower-advanced": {
      "command": "node",
      "args": [
        "/absolute/path/to/sensor-tower-advanced-mcp/dist/index.js"
      ],
      "env": {
        "SENSOR_TOWER_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

> ⚠️ **注意**: 请务必使用 `dist/index.js` 的绝对路径，并替换 `your_api_token_here` 为您真实的 Key。

## �️ 开发指南

### 常用命令

*   **`npm run build`**: 编译 TypeScript 代码到 `dist/` 目录。
*   **`npm run watch`**: 监听文件变化并自动重新编译 (适合开发阶段)。
*   **`npm run prepare`**: 安装依赖后的自动钩子，执行构建。

### 项目结构

```
.
├── src/
│   └── index.ts       # 服务器入口与 API 逻辑实现
├── dist/              # 编译后的 JavaScript 文件
├── CACHE_DESIGN.md    # 本地缓存层设计文档 (规划中)
├── package.json       # 项目依赖与脚本
└── tsconfig.json      # TypeScript 配置
```

## 📅 路线图 (Roadmap)

我们计划逐步扩展更多 Sensor Tower 的核心差异化数据能力：

1.  **广告创意分析 (`get_ad_creatives`)**: 分析竞品的广告素材投放策略。
2.  **跨应用使用行为 (`cohort_engagement`)**: 分析用户重叠度和跨应用行为。
3.  **SDK 技术栈检测 (`sdk_detection`)**: 识别竞品使用的第三方 SDK 工具。
4.  **智能缓存层**: 依据 `CACHE_DESIGN.md` 实现本地 SQLite 缓存，减少 API 调用消耗并提升响应速度。

## 📝 许可证

FeedMob Internal
