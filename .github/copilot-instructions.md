# GitHub Copilot Instructions (Clash Profile)

## 1. Project Context
<<<<<<< Updated upstream
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
=======
Network proxy configurations for **Mihomo (PC)**, **FlClash (PC)**, and **Stash (iOS/macOS)**.
- **Repository**: `Clash/` folder in workspace maps to `TamperAcc/Clash` remote root.
- **Core Mission**: Optimize connectivity for Developer Tools (GitHub, AI Models) and domestic Hardware Ecosystem (Bambu Lab).
- **Files**:
  - `Mihomo_Override.js`: Primary PC config (Mihomo Party).
  - `FlClash_Override.js`: Alternative PC config (FlClash).
  - `ClashVerge.yaml`: Reference YAML config (Basis for JS ports).
  - `Stash_Override.stoverride` & `Stash_Override.js`: iOS/macOS configs (Stash).

## 2. Maintenance (Critical)
- **Pushing Updates**: 
  - **NEVER** use `git push` inside `Clash/` folder.
  - **ALWAYS** execute from workspace root (`g:\Git\`):
>>>>>>> Stashed changes
    ```powershell
    git add .
    git commit -m "feat: sync rules v1.xx"
    git push origin main
    ```
<<<<<<< Updated upstream
- **Consistency Checks**:
  - **Rule Providers**: Ensure new providers (e.g., `telegram_domain`, `ai_services`) are injected in JS/Stoverride.
  - **Proxy Groups**: Maintain consistent naming (e.g., "🇭🇰 香港 Gemini") and ordering.
  - **Region Logic**: `Mihomo` uses a Level 1 (Regions) -> Level 2 (Services) tiered Group structure.
  - **Testing Logs**:
    - Mihomo: `✅ 加载脚本 v1.xx (Tolerance: 100ms)...`
    - FlClash: `🔵 [Script] 正在应用 FlClash 覆写脚本 v1.xx...`
=======
- **Sync Requirement**: Logic changes (e.g., new `proxy-groups`, routing rules) MUST be manually mirrored across:
  1. `Mihomo_Override.js` (Source of Truth)
  2. `FlClash_Override.js`
  3. `Stash_Override.stoverride` (YAML) AND `Stash_Override.js` (JS)
>>>>>>> Stashed changes

## 4. Platform Specifics

<<<<<<< Updated upstream
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
## 6. Critical Operational Warnings
- **PowerShell File Encoding (乱码警告)**: When manipulating files using Windows PowerShell tools like `Set-Content` or `Out-File`, **you MUST explicitly specify `-Encoding UTF8`**. PowerShell 5.1 defaults to ANSI/Default encoding, which WILL DESTROY all Chinese characters in configuration files, causing catastrophic parser failures (乱码) for Clash/Stash parsing. 
  - **Wrong**: `Get-Content file.txt | % { $_ -replace 'A', 'B' } | Set-Content file.txt`
  - **Correct**: `(Get-Content file.txt -Raw) -replace 'A', 'B' | Set-Content file.txt -Encoding UTF8`
  - *Note*: Using `replace_string_in_file` tool or Node.js (`fs.writeFileSync`) is always preferred over PowerShell scripting for file modifications due to newline (`\n` vs `\r\n`) and encoding issues.

=======
### PC (Mihomo/FlClash)
- **Format**: JavaScript dynamic config generation (ES6).
- **Generator Pattern**: Use `createRegionSets(suffix, url, ...)` (found in Mihomo) to generate region groups.
  - **Time Staggering**: `interval: base + offset + (index * step)` to prevent concurrent speed-test congestion.
- **Process Rules**:
  - Strict matching for Windows `.exe` (e.g., `BambuStudio.exe`).
  - `find-process-mode: "strict"`.
- **Safety**: Robustly check input config: `if (!config) return {};`.

### iOS/macOS (Stash)
- **Formats**: Supports both YAML (`.stoverride`) and JavaScript (`.js`).
- **Optimization**:
  - `lazy: true`: **MANDATORY** for ALL groups to save battery/reduce resource usage.
  - `keep-alive-interval`: 30s.
  - **Process**: Remove `.exe` suffixes for cross-platform compatibility.
- **Directives (YAML)**: Use `#!replace` to overwrite lists (e.g., `proxy-groups: #!replace`).

## 4. Key Technologies

### DNS & Connectivity
- **DoQ Strategy**: `quic://dns.alidns.com:853` (Alibaba) for low latency/anti-blocking.
- **Fake-IP**: Range `198.18.0.1/16`.
- **Exclusions (`fake-ip-filter`)**:
  - `*.bambulab.cn`, `*.bambulab.com` (Vital for LAN discovery).
  - `+.msftconnecttest.com` (Windows connectivity).

### AI & Developer Routing
- **Groups**: `Gemini`, `Copilot`, `GitHub`, `ChatGPT`.
- **Routing**:
  - AI Services -> `SG` (Singapore) or `US` (USA).
  - **Block**: Avoid `HK` for Generative AI.
- **GitHub**: Accelerate via proxy (including `raw.githubusercontent.com`).

### Hardware Ecosystem (Bambu Lab)
- **Rule**: Force `DIRECT` for `BambuStudio.exe` and `bambulab` domains.
- **Reason**: Ensures local LAN discovery (SSDP/mDNS) and cloud slice transmission stability.
- **Implementation**: Listed in both `fake-ip-filter` and `rules`.

## 5. Coding Standards
- **Versioning**: Increment version (e.g., `v1.32`) and Update Date (YYYY-MM-DD) in file headers on every change.
- **Validation**:
  - **JS**: Check ES6 compliance and null safety.
  - **YAML**: Strict indentation, no tabs.
>>>>>>> Stashed changes
