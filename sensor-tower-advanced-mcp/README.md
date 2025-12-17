# Sensor Tower Advanced MCP Server

这是一个基于 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) 的高级 Sensor Tower 服务器，允许 AI 模型（如 Claude）直接查询移动应用的市场情报数据。

## ✨ 核心功能

目前已支持以下核心 API：

- **`get_demographics`**: 
  - 查询应用的用户画像数据（年龄、性别分布）。
  - 支持 iOS/Android 双平台。
  - 支持按国家、日期粒度（日/周/月）筛选。

## 🚀 快速开始

### 方式一：直接运行 (推荐)

无需下载源码，直接通过 `npx` 运行：

**Claude Desktop 配置 (`claude_desktop_config.json`):**

```json
{
  "mcpServers": {
    "sensor-tower": {
      "command": "npx",
      "args": [
        "-y",
        "@feedmob/sensor-tower-advanced"
      ],
      "env": {
        "SENSOR_TOWER_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

### 方式二：本地开发

如果您需要修改代码或进行调试：

1. **克隆仓库并安装依赖**
   ```bash
   git clone <repo-url>
   cd sensor-tower-advanced-mcp
   npm install
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **配置 Claude Desktop**
   指向本地构建的 `dist/index.js` 文件：
   ```json
   {
     "mcpServers": {
       "sensor-tower-local": {
         "command": "node",
         "args": ["/绝对路径/到/dist/index.js"],
         "env": {
           "SENSOR_TOWER_API_TOKEN": "your_api_token_here"
         }
       }
     }
   }
   ```

## 🛠️ 配置说明

| 环境变量 | 描述 | 必填 |
| --- | --- | --- |
| `SENSOR_TOWER_API_TOKEN` | 您的 Sensor Tower API Key | ✅ |

## 📝 许可证

MIT
