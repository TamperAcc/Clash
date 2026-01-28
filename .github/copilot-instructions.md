# GitHub Copilot Instructions (Clash Profile)

## 1. Project Context
Network proxy configurations for **Mihomo (PC)** and **Stash (iOS)**.
- **Repository**: This folder (`Clash/`) maps to the root of the remote `TamperAcc/Clash` repository via subtree.
- **Core Mission**: Optimize connectivity for Developer Tools (GitHub, AI Models) and domestic Hardware Ecosystem (Bambu Lab).

## 2. Maintenance (Critical)
- **Repo Structure**: Local files are in `Git/Clash/`. Remote raw links (`raw.githubusercontent.com/...`) MUST reference the repo root.
- **Pushing Updates**: **DO NOT** use `git push` inside this folder directly.
  - **Standard Workflow**: Execute from the workspace root (`g:\Git\`):
    ```powershell
    git subtree push --prefix Clash origin main
    ```

## 3. Platform Patterns

### PC/Mihomo (`Mihomo_Override.js`)
- **Format**: JavaScript dynamic config generation.
- **Entry Point**: `function main(config) { if (!config) return {}; ... }`
- **Method**: Direct object manipulation (e.g., `config["dns"]["enable"] = true`).
- **Safety**: Robustly check for existing keys before assignment.

### iOS/Stash (`Stash_Override.stoverride`)
- **Format**: Declarative YAML with Stash-specific override directives.
- **Directives**: Use `#!replace` to overwrite lists/dictionaries (e.g., `proxy-groups: #!replace`).
- **Optimization**:
  - `lazy: true`: Enable for ALL policy groups to reduce resource usage.
  - `keep-alive-interval: 600`: Critical for iOS battery life.
  - **Start Strategy**: Use `on-demand` or `background` fetch carefully.

## 4. Key Technologies & Conventions

### DNS & Connectivity
- **DoQ Strategy**: User `quic://dns.alidns.com:853` for low latency and anti-blocking.
- **Fallback Mechanism**:
  - Avoid `1.1.1.1` UDP.
  - Use `https://1.0.0.1` (CF) + `tcp://208.67.222.222` (OpenDNS) + `tls://8.8.4.4`.
- **Anti-Pollution**: Ensure domestic domains resolve to domestic IPs to bypass proxy overhead.

### AI & Developer Routing
- **AI Services**: Dedicated groups for `OpenAI`, `Claude`, `Gemini`.
  - **Routing**: Prioritize `SG` (Singapore) or `US` (United States) nodes.
  - **Block**: Avoid `HK` or generic nodes for generative AI to prevent bans.
- **GitHub**: Accelerate specifically via proxy; ensure `raw.githubusercontent.com` is optimized.

### Hardware Ecosystem
- **Bambu Lab (拓竹)**: 
  - **Rule**: MUST exclude `*.bambulab.cn` and `*.bambulab.com` from Fake-IP.
  - **Action**: Add to `fake-ip-filter` and force `DIRECT`.
  - **Reason**: Ensures local LAN discovery (SSDP/mDNS) and cloud slice transmission stability.

## 5. Work Rules
- **Validation**:
  - **JS**: Check syntax for ES6 compliance.
  - **YAML**: Strict indentation checks; ensure no tab characters.
- **Dates**: Use ISO 8601 `YYYY-MM-DD` for all changelogs.
