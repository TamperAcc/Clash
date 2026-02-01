# GitHub Copilot Instructions (Clash Profile)

## 1. Project Context
Network proxy configurations for **Mihomo (PC)**, **FlClash (PC)**, and **Stash (iOS/macOS)**.
- **Repository**: `Clash/` folder in workspace maps to `TamperAcc/Clash` remote root.
- **Core Mission**: Optimize connectivity for Developer Tools (GitHub, AI Models) and domestic Hardware Ecosystem (Bambu Lab).
- **Files**:
  - `Mihomo_Override.js`: **Source of Truth**. Primary PC config (Mihomo Party).
  - `FlClash_Override.js`: Alternative PC config (FlClash).
  - `Stash_Override.js`: iOS/macOS config (Stash).
  - `ClashVerge.yaml`: Reference YAML.

## 2. Maintenance (Critical)
- **Pushing Updates**: 
  - **Context**: `Clash/` is a nested Git repository within the workspace.
  - **Action**: Execute Git commands directly inside the `Clash/` folder:
    ```powershell
    # Run from g:\Git\Clash\
    git add .
    git commit -m "update message"
    git push origin main
    ```
- **Sync Requirement**: Logic changes must be manually mirrored across `Mihomo`, `FlClash`, and `Stash` files.
  - **Rule Providers**: Ensure new providers (e.g., `social_media`) are added to all files.
  - **Proxy Groups**: Maintain consistent group naming and ordering.

## 3. Architecture & Patterns

### Proxy Group Hierarchy (Two-Tier)
1.  **Level 2 (Service Groups)**: User-facing static groups (e.g., "Gemini", "GitHub Copilot").
    -   *Type*: `url-test`.
    -   *Content*: Selects from Level 1 groups.
    -   *Strategy*: `unified-delay: false` to allow hopping.
2.  **Level 1 (Region Groups)**: Geographic auto-select groups (e.g., "🇭🇰 香港 Gemini").
    -   *Type*: `url-test`.
    -   *Strategy*: `unified-delay: true`.
    -   *Generator*: Use `createRegionSets()` with staggered `interval` to prevent speed-test congestion.

### Platform Specifics

#### PC (Mihomo)
-   **Tun Stack**: `gvisor` (Higher stability).
-   **LAN Strategy**: 
    -   `auto-route: true`, `strict-route: true`.
    -   **Critical**: Use `inet4-route-exclude-address` (e.g., `192.168.0.0/16`) to bypass Tun for local traffic, fixing `ERR_EMPTY_RESPONSE`.
-   **Sniffer**: `parse-pure-ip: true`, `override-destination: true`.

#### iOS (Stash)
-   **Tun Stack**: `mixed`.
-   **Optimization**: `lazy: true` is **MANDATORY** for battery life.
-   **UI**: Use `config["script"]["tiles"]` for dashboard widgets.
-   **Compatibility**: Remove `.exe` from process names.

## 4. Key Technologies

### DNS & Connectivity
-   **DoQ**: `quic://dns.alidns.com:853` (Alibaba).
-   **Fake-IP**: `198.18.0.1/16`.
-   **Exclusions**: `*.bambulab.cn`, `*.bambulab.com` (mDNS/SSDP discovery).

### Hardware Ecosystem (Bambu Lab)
-   **Routing**: Force `DIRECT` for `BambuStudio.exe` and `bambulab` domains.
-   **Reason**: Cloud Slicing and LAN camera streaming stability.

## 5. Coding Standards
-   **Versioning**: Increment version (e.g., `v1.47`) and Date (YYYY-MM-DD) in file header.
-   **Safety**: Always start with `if (!config) return {};`.
-   **JS Compliance**: ES6 features allowed (Arrow functions, spreading).
