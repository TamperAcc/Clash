# GitHub Copilot Instructions

## Project Overview
This repository contains:
1. **ESP32 Firmware** (`ESP32/esp32x_V2.0/`): A smart home control system (Light, Valve, Pump) using PlatformIO and ESP-IDF.
2. **Clash Configuration** (`Clash/`): Configuration files for Clash proxy.

## ESP32 Firmware Architecture
- **Framework**: PlatformIO with `espressif32` platform and `espidf` framework.
- **Structure**: Modular C code.
  - `src/`: Source files (`.c`).
  - `include/`: Header files (`.h`).
  - `lib/`: Private libraries.
- **Key Modules**:
  - `main.c`: Application entry, initialization, and main loop.
  - `config.h` & `config_load.c`: Centralized configuration and NVS storage.
  - `mqtt_*.c`: MQTT connection, publishing, and message handling.
  - `wifi_init.c`: WiFi connection and event handling.
  - `gpio_init.c`: Hardware pin configuration.

## Development Guidelines (ESP32)
- **Language**: C.
- **Style**:
  - Use `snake_case` for functions and variables.
  - Use `ESP_LOGx` macros for logging (e.g., `ESP_LOGI(TAG, "Message")`).
  - Use `esp_err_t` for error codes and `ESP_ERROR_CHECK()` or explicit checks.
- **State Management**:
  - Global state variables are declared in `config.h` (extern) and defined in `main.c`.
  - Configuration is stored in `sys_config_t` and persisted to NVS.
- **Concurrency**:
  - Uses FreeRTOS tasks implicitly via ESP-IDF components (WiFi, MQTT).
  - Ensure thread safety when accessing shared global state if adding new tasks.

## Build & Test
- **Build**: `pio run` (or VS Code PlatformIO extension).
- **Flash**: `pio run --target upload`.
- **Monitor**: `pio device monitor` (Baud: 115200).
- **Configuration**: `platformio.ini` defines build flags (e.g., `-Os` for size optimization).

## Clash Configuration
- Located in `Clash/`.
- `Clash.yaml`: Main configuration file.
- `Clash.conf`: Alternative or backup configuration.

## Common Tasks
- **Adding a new sensor**:
  1. Create `src/sensor_name.c` and `include/sensor_name.h`.
  2. Initialize in `main.c`.
  3. Add data reading logic and update global state.
  4. Add MQTT publishing in `mqtt_publish.c`.
- **Adding a new config parameter**:
  1. Update `sys_config_t` or relevant struct in `config.h`.
  2. Update `config_load.c` to read/write from NVS.
  3. Update `mqtt_message_handler.c` to handle remote updates.
