# GitHub Copilot Instructions (Clash Profile)

## 1. Project Context
Network proxy configurations for **Mihomo (PC)**, **FlClash (PC)**, and **Stash (iOS/macOS)**.
- **Repository**: `Clash/` folder in workspace maps to `TamperAcc/Clash` remote root.
- **Production URLs**: 
  - Source: `raw.githubusercontent.com/TamperAcc/Clash/main/...`
  - CDN (Live): `cdn.jsdelivr.net/gh/TamperAcc/Clash@main/...`
- **Core Mission**: Optimize connectivity for Developer Tools (GitHub, AI Models) and domestic Hardware Ecosystem (Bambu Lab).
- **Files**:
  - `Mihomo_Override.js`: **Source of Truth**. Primary PC config (Mihomo Party). Stable.
  - `FlClash_Override.js`: Alternative PC config (FlClash).
  - `Stash_Override.js`: iOS/macOS config (Stash). Battery-conscious.
  - `ClashVerge.yaml`: Reference YAML.

## 2. Maintenance & Deployment
- **Pushing Updates**: 
  - **Context**: `Clash/` is a nested Git repository.
  - **Action**: Run Git commands in `g:\Git\Clash\`:
    ```powershell
    git add .
    git commit -m "feat: update social media rules"
    git push origin main
    ```
  - **Propagation**: Code changes propagate to jsDelivr CDN (~5-10 mins).
- **Sync Requirement**: Logic MUST be mirrored across `Mihomo`, `FlClash`, and `Stash`.
  - **Rule Providers**: Ensure new providers (e.g., `ai_services`, `social_media`) are added to **ALL** files.
  - **Proxy Groups**: Maintain consistent group naming ("🇭🇰 香港 Gemini") and ordering.
  - **Testing**: Check console logs in client apps for version string:
    - Mihomo: `✅ 加载脚本 v1.xx...`
    - FlClash/Stash: `🔵 [Script]...`

## 3. Architecture & Patterns

### Proxy Group Hierarchy (Two-Tier)
1.  **Level 2 (Service Groups)**: User-facing static groups (e.g., "GitHub Copilot").
    -   *Strategy*: `unified-delay: false` (Allow connection hopping).
2.  **Level 1 (Region Groups)**: Geographic auto-select groups (e.g., "🇭🇰 香港 Gemini").
    -   *Strategy*: `unified-delay: true` (Minimize latency).
    -   *Generator*: `createRegionSets()` with staggered intervals.

### Platform Specifics
| Feature | Mihomo (PC) | FlClash (PC) | Stash (iOS) |
| :--- | :--- | :--- | :--- |
| **Tun Stack** | `gvisor` (Stable) | `mixed` | `mixed` |
| **LAN Strategy** | `strict-route` + Exclude | Auto | Auto |
| **Battery** | N/A | N/A | `lazy: true` (Mandatory) |
| **Parsing** | `parse-pure-ip: true` | Auto | `parse-pure-ip: true` |

- **Mihomo Critical**: `inet4-route-exclude-address` (`192.168.0.0/16`) prevents `ERR_EMPTY_RESPONSE` in local traffic.
- **Stash UI**: Use `config["script"]["tiles"]` for dashboard widgets.

## 4. Key Technologies
- **Traffic Interception**: 
  - **Fake-IP**: `198.18.0.1/16`.
  - **Exclusions**: `*.bambulab.cn`, `*.bambulab.com` (Essential for mDNS/SSDP).
- **DNS**: 
  - **DoQ**: `quic://dns.alidns.com:853` (Alibaba) preferred for stability.
  - **Policy**: Explicitly route BBL domains to Tencent DNS (`119.29.29.29`).
- **Hardware Ecosystem (Bambu Lab)**:
  - **Routing**: Force `DIRECT` for `BambuStudio.exe` and `bambulab` domains.
  - **Reason**: Fixes Cloud Slicing uploads and LAN camera streaming.

## 5. Coding Standards
-   **Versioning**: Increment version (e.g., `v1.53`) and Date (YYYY-MM-DD) in file header.
-   **Safety**: Guard `if (!config) return {};` at entry.
-   **JS Compliance**: ES6 features allowed.
