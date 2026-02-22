# GitHub Copilot Instructions (Clash Profile)

## 1. Project Context
Network proxy configurations for **Mihomo Party**, **FlClash**, and **Stash (iOS/macOS)**.
- **Repository**: Maps to `TamperAcc/Clash` remote root.
- **Production URLs**: 
  - Source: `aw.githubusercontent.com/TamperAcc/Clash/main/...`
  - CDN (Live): `cdn.jsdelivr.net/gh/TamperAcc/Clash@main/...`
- **Core Mission**: Optimize connectivity for Developer Tools (GitHub, AI Models) and domestic Hardware Ecosystem (Bambu Lab).
- **Active Development**:
  - `Mihomo_Override.js`: v1.65+
  - `Stash_Override.stoverride`: v1.30+

## 2. File Architecture & Logic Flow
The configuration logic flows from Reference YAMLs to Implementation Scripts.

| File | Role | Description |
| :--- | :--- | :--- |
| **ClashVerge.yaml** | **Reference Logic** | The "Source of Truth" for rules and groups logic. |
| **Mihomo_Override.js** | **Primary Implement** | PC (Mihomo Party) config. Ported from ClashVerge.yaml. |
| **FlClash_Override.js** | **Primary Implement** | PC (FlClash) config. Variation of Mihomo script. |
| **Stash_Override.stoverride**| **Stash Implement** | iOS/macOS Stash specific override. Ported from Mihomo/FlClash. |
| **Stash.yaml** | **Secondary Base** | Standalone Stash profile for non-override users. |

**Critical**: Logic should generally be mirrored across files (`ClashVerge.yaml` -> `Mihomo_Override.js` / `FlClash_Override.js` -> `Stash_Override.stoverride`), **BUT** you MUST ONLY modify the specific file the user requests. Do NOT automatically sync changes to other files unless explicitly instructed to do so.

## 3. Maintenance & Deployment
- **Pushing Updates**: 
  - Run in `g:\Git\Clash\`:
    ```powershell
    git add .
    git commit -m "feat: sync rules v1.xx"
    git push origin main
    ```
- **Consistency Checks**:
  - **Rule Providers**: Ensure new providers (e.g., `telegram_domain`, `ai_services`) are injected in JS/Stoverride.
  - **Proxy Groups**: Maintain consistent naming (e.g., "🇭🇰 香港 Gemini") and ordering.
  - **Region Logic**: `Mihomo` uses a Level 1 (Regions) -> Level 2 (Services) tiered Group structure.
  - **Testing Logs**:
    - Mihomo: `✅ 加载脚本 v1.xx (Tolerance: 100ms)...`
    - FlClash: `🔵 [Script] 正在应用 FlClash 覆写脚本 v1.xx...`

## 4. Platform Specifics

### Mihomo Party (PC)
- **Engine**: `Mihomo_Override.js`
- **Safeguard**: MUST check `if (!config) return {};` at start.
- **Tun Stack**: `gvisor` (Changed from mixed in v1.65 for stability).
- **Routing**: `strict-route: true`.
- **Optimization**: 
  - `inet4-route-exclude-address`: Exclude LAN (`192.168.0.0/16` etc) to solve `ERR_EMPTY_RESPONSE`.
  - `tcp-concurrent: true`.

### FlClash (PC)
- **Engine**: `FlClash_Override.js`
- **Safeguard**: MUST check `if (!config) return {};`.
- **Features**: 
  - `tun`: `stack: mixed`, `auto-route: true`.
  - `dns`: Split DNS for domestic domains (AliDNS/Tencent) vs Foreign (Fake-IP).
  - Explicitly handles `127.0.0.1/8` skip-auth.

### Stash (iOS/macOS)
- **Engine**: `Stash_Override.stoverride` (YAML-based override).
- **Battery**: `lazy: true` MANDATORY for all rule groups using `url-test`.
- **Visuals**: Use `config.script.tiles` for widgets.
- **Helpers**: Exclude `quic` sniffer to save battery.
- **Sync**: Ensure `fake-ip-filter` includes new entries from Mihomo (e.g., `+.ntp.org`).

### Hardware Ecosystem (Bambu Lab)
- **Domains**: `*.bambulab.cn`, `*.bambulab.com`
- **Policy**: 
  - **DNS**: Force use of Tencent (`119.29.29.29`) or AliDNS for these domains.
  - **Routing**: Force `DIRECT`.
  - **Fake-IP**: Exclude from Fake-IP to allow mDNS/local discovery.
  - **Process**: `BambuStudio.exe`, `bambu-studio.exe` -> `DIRECT`.

## 5. Coding Standards
- **Versioning**: Increment version (e.g., `v1.65`) and Date (YYYY-MM-DD) in file header.
- **Safety**: 
  - JS: Guard `if (!config) return {};`.
  - Stoverride: Ensure correct YAML indentation for injected script sections.
- **Variables**: `const` for static lists (proxies, rules), avoid global scope pollution.
- **Patterns**: Use `createRegionSets` helper in JS for creating auto-test groups.

