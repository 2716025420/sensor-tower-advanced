# MCP Server 发布至 NPM 完整指南

本文档将指导你如何将 `@feedmob/sensor-tower-advanced` 发布到 NPM 仓库。

## 1. 准备工作

在发布之前，我们已经帮你更新了 `package.json`，包含了关键词配置和发布权限设置。

### 检查清单
- [ ] **版本号** (`version`)：当前为 `0.1.0`。每次发布新内容前都需要更新。
- [ ] **名称** (`name`)：`@feedmob/sensor-tower-advanced`。注意这是一个 Scoped Package（组织包）。
- [ ] **构建**：确保代码能正常转译为 JavaScript。

## 2. 构建项目

在发布前，必须确保 `dist/` 目录是最新的。虽然你在 `package.json` 中配置了 `prepare` 脚本（会在发布时运行），但手动运行一次以确保没有错误是更稳妥的做法。

```bash
npm run build
```

## 3. 登录 NPM

如果你还没有 NPM 账号，请先在 [npmjs.com](https://www.npmjs.com/) 注册。

在终端中登录：

```bash
npm login
```

系统会提示你按回车键打开浏览器进行验证。登录成功后，终端会显示 "Logged in as <username>..."。
你可以运行 `npm whoami` 来确认当前登录用户。

## 4. 发布到 NPM

由于你的包名是 `@feedmob/` 开头，这属于 **Scoped Package**。默认情况下，NPM 会尝试将其作为私有包发布（如果你没有付费账户则会失败）。

我们已经在 `package.json` 中添加了 `"publishConfig": { "access": "public" }`，这意味着你只需要运行标准的发布命令即可：

```bash
npm publish
```

如果发布成功，你会看到类似以下的输出：
`+ @feedmob/sensor-tower-advanced@0.1.0`

> **注意**：如果遇到 402 Payment Required 错误，请尝试显式运行命令： `npm publish --access public`

## 5. 后续版本更新与维护

当你修改代码并准备发布新版本时，请遵循以下流程：

### 5.1 自动更新版本号
NPM 提供了方便的命令来更新版本号并自动创建 git tag：

- **修复 Bug** (0.1.0 -> 0.1.1):
  ```bash
  npm version patch
  ```

- **添加新功能** (0.1.0 -> 0.2.0):
  ```bash
  npm version minor
  ```

- **重大架构变更** (0.1.0 -> 1.0.0):
  ```bash
  npm version major
  ```

### 5.2 再次发布
版本号更新后，再次运行发布命令：

```bash
npm publish
```

## 6. 在 Claude Desktop 中使用已发布的包

发布成功后，任何人（包括你自己）都可以通过 `npx` 直接运行这个 MCP Server，而不需要下载源码。

在 Claude Desktop 的配置文件 (`claude_desktop_config.json`) 中，你可以这样配置：

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

这样，你的 MCP Server 就成功转换为了一个易于分发和使用的云端工具了！
