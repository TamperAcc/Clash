# GitHub Copilot Instructions (Clash Profile)

## 1. Project Context
Network proxy configurations for **Mihomo Party**, **FlClash**, and **Stash (iOS/macOS)**.
- **Repository**: Maps to `TamperAcc/Clash` remote root.
- **Production URLs**: 
  - Source: `aw.githubusercontent.com/TamperAcc/Clash/main/...`
  - CDN (Live): `cdn.jsdelivr.net/gh/TamperAcc/Clash@main/...`
- **Core Mission**: Optimize connectivity for Developer Tools (GitHub, AI Models) and domestic Hardware Ecosystem (Bambu Lab).

## 2. File Architecture & Logic Flow
The configuration logic flows from Reference YAMLs to Implementation Scripts.

| File | Role | Description |
| :--- | :--- | :--- |
| **ClashVerge.yaml** | **Reference Logic** | The "Source of Truth" for rules and groups logic. |
| **Mihomo_Override.js** | **Primary Implement** | PC (Mihomo Party) config. Ported from ClashVerge.yaml. |
| **FlClash_Override.js** | **Primary Implement** | PC (FlClash) config. Variation of Mihomo script. |
| **Stash_Override.stoverride**| **Stash Implement** | iOS/macOS Stash specific override. Ported from Mihomo/FlClash. |
| **Stash.yaml** | **Secondary Base** | Standalone Stash profile for non-override users. |

**Critical**: Logic MUST be mirrored: `ClashVerge.yaml` -> `Mihomo_Override.js` / `FlClash_Override.js` -> `Stash_Override.stoverride`.

## 3. Maintenance & Deployment
- **Pushing Updates**: 
  - Run in `g:\Git\Clash\`:
    ```powershell
    git add .
    git commit -m "feat: sync rules v1.xx"
    git push origin main
    ```
- **Consistency Checks**:
  - **Rule Providers**: Ensure new providers (e.g., `ai_services`) in YAML are injected in JS/Stoverride.
  - **Proxy Groups**: Maintain consistent naming (e.g., "🇭🇰 香港 Gemini") and ordering.
  - **Testing Logs**:
    - Mihomo: `✅ 加载脚本 v1.xx...`
    - FlClash: `🔵 [Script] 正在应用 FlClash 覆写脚本 v1.xx...`

## 4. Platform Specifics

### Mihomo Party (PC)
- **Engine**: `Mihomo_Override.js`
- **Safeguard**: MUST check `if (!config) return {};` at start to prevent crash on null config.
- **Tun Stack**: `mixed` (Auto).
- **DNS**: Fake-IP mode (Range `198.18.0.1/16`).
- **Optimization**: `tcp-concurrent: true`, `find-process-mode: strict`.

### FlClash (PC)
- **Engine**: `FlClash_Override.js`
- **Safeguard**: MUST check `if (!config) return {};`.
- **Features**: 
  - `tun`: `stack: mixed`, `auto-route: true`.
  - `dns`: Split DNS for domestic domains (AliDNS/Tencent) vs Foreign (Fake-IP).
- **Differences**: Explicitly handles `127.0.0.1/8` skip-auth.

### Stash (iOS/macOS)
- **Engine**: `Stash_Override.stoverride` (YAML-based override).
- **Battery**: `lazy: true` MANDATORY for all rule groups using `url-test`.
- **Visuals**: Use `config.script.tiles` for widgets.
- **Helpers**: Exclude `quic` sniffer to save battery.

### Hardware Ecosystem (Bambu Lab)
- **Domains**: `*.bambulab.cn`, `*.bambulab.com`
- **Policy**: 
  - **DNS**: Force use of Tencent (`119.29.29.29`) or AliDNS for these domains.
  - **Routing**: Force `DIRECT`.
  - **Fake-IP**: Exclude from Fake-IP to allow mDNS/local discovery.

## 5. Coding Standards
- **Versioning**: Increment version (e.g., `v1.56`) and Date (YYYY-MM-DD) in file header.
- **Safety**: 
  - JS: Guard `if (!config) return {};`.
  - Stoverride: Ensure correct YAML indentation for injected script sections.
- **Variables**: `const` for static lists (proxies, rules), avoid global scope pollution.
