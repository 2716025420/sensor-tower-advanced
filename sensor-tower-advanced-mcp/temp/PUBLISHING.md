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

## 7. 常见问题排查 (Troubleshooting)

### 🔴 发布失败：E403 Forbidden (2FA)
如果你看到类似 `Two-factor authentication ... is required` 的错误，说明 NPM 强制要求双重验证。

1.  **必须要开启 2FA**：登录 [npmjs.com](https://www.npmjs.com/) -> 右上角头像 -> Account Settings -> 2FA，选择 **Authenticator App**。
2.  **发布时带上验证码**：
    ```bash
    npm publish --otp=123456
    ```
    *(其中 123456 是你手机 Google Authenticator 上显示的 6 位数字)*

### 🔴 无法连接/二维码刷不出来 (中国大陆用户)
如果你在设置 2FA 时，网页上的n二维码加载失败或提示连接错误：
1.  **网络问题**：NPM 的某些资源可能被墙。尝试使用全局代理/VPN 访问 npmjs.com。
2.  **手动输入密钥**：在扫描二维码的页面下方，通常有一个 **"Can't scan?"** 或 **"Enter key manually"** 的选项。点击它会显示一串类似 `JBSWY...` 的字符。你可以在 Google Authenticator 中选择 "输入设置密钥" (Enter setup key) 来手动添加，效果和扫码一样。

### 🔴 E403 Forbidden (包名/权限)
- 如果包名以 `@feedmob/` 开头，你需要确保你在 NPM 上有 `feedmob` 这个 Organization，且你是成员。
- 如果没有 Organization，请将 `package.json` 中的 `name` 改为 `sensor-tower-advanced-mcp-你的名字` 这种无 Scope 的普通包名。

