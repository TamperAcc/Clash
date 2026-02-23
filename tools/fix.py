import re

with open('Mihomo_Override.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove auto-update from profile
content = re.sub(r'    "store-fake-ip": true,\r?\n    "auto-update": true', r'    "store-fake-ip": true // 优化：持久化 Fake-IP 缓存，重启后秒连', content)

# 2. Remove route-exclude-address from tun
content = re.sub(r'    "dns-hijack": \["any:53"\],\r?\n    "route-exclude-address": \[.*?\] // 优化：增加组播和广播地址排除，彻底解决局域网发现问题\r?\n', r'    "dns-hijack": ["any:53"]\n', content)

# 3. Add unified-delay and keep-alive-interval to global config
content = re.sub(r'  config\["client-fingerprint"\] = "chrome"; // 升级指纹以更好地支持 HTTP/3\r?\n', r'  config["client-fingerprint"] = "chrome"; // 升级指纹以更好地支持 HTTP/3\n  config["unified-delay"] = true; // 开启统一延迟，更准确\n  config["keep-alive-interval"] = 15; // 优化：空闲连接探测间隔\n', content)

# 4. Remove unified-delay from proxy-groups
content = re.sub(r'      "unified-delay": true, // 开启统一延迟，更准确\r?\n', r'', content)
content = re.sub(r'      "unified-delay": true,\r?\n', r'', content)

with open('Mihomo_Override.js', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
