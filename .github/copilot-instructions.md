# GitHub Copilot Instructions

## 1. Project Overview & Architecture
This workspace contains a multi-faceted personal infrastructure setup:
- **ESP32 Firmware** (`ESP32/esp32x_V2.0/`): PlatformIO/ESP-IDF project for smart home control (Light, Valve, Pump).
- **Clash Configuration** (`Clash/`): Advanced network proxy configurations for PC and Mobile (iOS).
- **External Data**: BambuStudio profiles (`965782142/`, `BBL/`) - *Read-only reference unless explicitly asked.*

### ESP32 Firmware Architecture
- **Framework**: PlatformIO (`espressif32`) with `espidf` framework.
- **Organization**: "Flat" module structure in `src/`.
  - **Source/Headers**: Both `.c` and `.h` files often reside in `src/` (e.g., `mqtt_init.c/h`) for self-contained modules.
  - **Entry Point**: `src/main.c` handles initialization, main loop, and global state definition.
  - **Configuration**: `src/config.h` defines `sys_config_t` (WiFi/MQTT) and scheduling structs.
  - **Persistence**: `src/config_load.c` manages NVS reading/writing.
- **Key Modules**:
  - `timer_control`: Logic for time-based and cycle-based automation.
  - `mqtt_*`: Connection (TLS/SSL), publishing, subscription handling.
  - `status_monitor`: System health reporting.

### Clash Configuration
- **Core Files**: `Clash.yaml` (General), `AI专用.yaml` (PC Optimized w/ AI rules), `Stash.yaml` (iOS).
- **Key Features**: DNS over QUIC (DoQ), AI service routing (OpenAI/Claude), Anti-pollution fallbacks.

## 2. Developer Workflows

### ESP32 Development
- **Build**: `pio run` (PlatformIO).
- **Flash**: `pio run --target upload`.
- **Monitor**: `pio device monitor` (Baud: 115200). Use for debugging runtime output.
- **Config Changes**:
  - **Defaults**: Hardcoded in `main.c` init or `config_load.c` fallback.
  - **Runtime**: Updates via MQTT are processed in `mqtt_message_handler.c`.

### Network Configuration (Clash)
- **Deployment**: Files are likely pulled by clients via Git raw links.
- **Optimization**: Maintain `AI专用.yaml` structure for `nameserver-policy` and `skip-auth-prefixes`.

## 3. Coding Conventions & Patterns

### C / Embedded (ESP32)
- **Style**: `snake_case` for all symbols.
- **Logging**: **ALWAYS** use `ESP_LOGx(TAG, ...)` macros. Define `static const char *TAG = "MODULE_NAME";`.
- **Error Handling**: Use `esp_err_t`. Check with `ESP_ERROR_CHECK()` for critical inits.
- **State Management**:
  - **Global Vars**: Defined in `main.c`, declared `extern` in `config.h`. Include `config.h` to access.
  - **Structs**: Use `sys_config_t`, `timer_config_t`, `cycle_config_t` defined in `config.h`.

### YAML / Config
- **Clash**: specific keys like `proxies`, `proxy-groups`, `rules`.
- **Comments**: Maintain Chinese comments explaining optimizations (e.g., `# 优化：...`).

## 4. Common Tasks
- **Add New Sensor**:
  1. Create `src/sensor.c` & `src/sensor.h`.
  2. In `main.c`: Include header, init sensor, add to main loop or task.
  3. In `mqtt_publish.c`: Add logic to broadcast sensor data.
- **Add Config Field**:
  1. Add field to `sys_config_t` in `src/config.h`.
  2. Update `src/config_load.c` (NVS read/write logic).
  3. Update `src/mqtt_message_handler.c` to parse update JSON.
