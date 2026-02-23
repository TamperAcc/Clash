import re

with open('Mihomo_Override.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove unified-delay from proxy-groups
content = re.sub(r'      "unified-delay": true, // 开启统一延迟，更准确\r?\n', r'', content)
content = re.sub(r'      "unified-delay": true,\r?\n', r'', content)

with open('Mihomo_Override.js', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)
