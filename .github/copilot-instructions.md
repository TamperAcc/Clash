# GitHub Copilot Instructions (Clash Profile)

## 1. Project Context
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
    ```powershell
    git subtree push --prefix Clash origin main
    ```
- **Sync Requirement**: Logic changes (e.g., new `proxy-groups`, routing rules) MUST be manually mirrored across:
  1. `Mihomo_Override.js` (Source of Truth)
  2. `FlClash_Override.js`
  3. `Stash_Override.stoverride` (YAML) AND `Stash_Override.js` (JS)

## 3. Platform Patterns

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
