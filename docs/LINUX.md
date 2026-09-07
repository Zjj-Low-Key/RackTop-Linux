# RackTop Linux

## 支持范围

- Ubuntu 24.04 x86_64 桌面，保留 RackTop 的 React / Tauri / SQLite 架构及现有 SSH 工作流。
- `.deb` 适合常规安装；AppImage 适合免安装运行，但仍需要 Linux 桌面会话和 WebKitGTK 4.1 等系统库，并不保证在所有发行版可用。
- 本版本没有验证 ARM64、Ubuntu 22.04 或其他发行版，不提供这些平台的安装包。

## 安装与启动

从 [Releases](https://github.com/Zjj-Low-Key/RackTop-Linux/releases) 下载后，在下载目录运行：

```bash
sudo apt install ./RackTop_1.26.0_linux-amd64.deb
racktop
```

也可以从应用菜单打开 RackTop。DEB 自动声明 OpenSSH、桌面终端、WebKitGTK、D-Bus 和托盘运行依赖。保存 SSH 密码需要已解锁的 Secret Service（Ubuntu 默认使用 GNOME Keyring）；钥匙串不可用时，应用沿用原有错误提示，不会改为明文保存。

AppImage：

```bash
chmod +x RackTop_1.26.0_linux-x86_64.AppImage
./RackTop_1.26.0_linux-x86_64.AppImage
```

没有 FUSE 时使用 `./RackTop_1.26.0_linux-x86_64.AppImage --appimage-extract-and-run`。AppImage 需要 `libwebkit2gtk-4.1-0`、`libayatana-appindicator3-1`、`libdbus-1-3`、`openssh-client`、`xdg-utils` 和一个提供 `x-terminal-emulator` 的桌面终端。GNOME 托盘图标取决于桌面的 AppIndicator 支持，应用主窗口不依赖图标可见。

## 更新和数据

Linux 的更新检查使用本 fork 的 GitHub Releases，更新按钮打开下载页。DEB 安装新版即可升级；AppImage 替换文件即可。尚未配置独立的 Linux 自动更新签名，因此不启用自动下载安装，不使用上游更新包。

保留应用标识 `com.racktop.desktop`。数据库默认位于 `~/.local/share/com.racktop.desktop/racktop.sqlite`，尊重 `XDG_DATA_HOME`。密码由系统钥匙串保存；卸载 DEB 不会删除数据库或 SSH 配置。原有数据格式不需要迁移。

## 开发与打包

需要 Node.js 20+（CI 使用 22）、Rust stable 和以下系统依赖：

```bash
sudo apt update
sudo apt install -y build-essential curl wget file libwebkit2gtk-4.1-dev libxdo-dev libssl-dev librsvg2-dev libayatana-appindicator3-dev patchelf libdbus-1-dev xdg-utils openssh-client
npm ci
npm test
npm run build
cargo test --locked --manifest-path src-tauri/Cargo.toml
npm run tauri dev
npm run bundle:linux
```

Tauri 自动合并 `src-tauri/tauri.linux.conf.json`。发布文件输出到 `src-tauri/target/release/linux-packages/`，附本地 `SHA256SUMS`；Release 以 GitHub Assets Digest 为准。

真实钥匙串测试只创建并删除随机名称的测试凭据，不访问用户 SSH 密码：

```bash
cargo test --locked --manifest-path src-tauri/Cargo.toml --test linux_keyring -- --ignored
```

CI 使用 `scripts/smoke-linux.sh` 安装 DEB、在隔离数据目录启动 DEB 与 AppImage、检查数据库创建和崩溃日志，再卸载 DEB。它是启动烟雾测试，不替代真实 GPU 服务器连接、窗口交互或不同桌面显示协议的测试。
