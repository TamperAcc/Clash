// Mihomo Party 专用配置文件覆写脚本
// 引用链接: https://raw.githubusercontent.com/TamperAcc/Clash/main/Mihomo_Override.js
// 加速链接: https://cdn.jsdelivr.net/gh/TamperAcc/Clash@main/Mihomo_Override.js
// 版本: v1.73  | 更新日期: 2026-02-10
// 移植自 ClashVerge.yaml "PC 端终极优化版" (全扁平化架构 + ES5兼容)

function main(config) {
  // 打印版本号，用于确认是否下载到了最新版
  console.log("✅ 加载脚本 v1.73 (防送中优化)...");

  // 关键修复：如果 config 为空，必须返回空对象 {} 而不是 null
  if (!config) {
    return {}; 
  }

  // 1. 基础设置优化
  config["tcp-concurrent"] = true;
  config["global-client-fingerprint"] = "chrome"; // 升级指纹以更好地支持 HTTP/3
  config["keep-alive-interval"] = 30;
  config["allow-lan"] = true;
  config["bind-address"] = "*";
  config["find-process-mode"] = "strict";
  config["profile"] = {
    "store-selected": true,
    "auto-update": true
  };
  
  // 修复本地回环和 Google 连接问题
  config["skip-auth-prefixes"] = ["127.0.0.1/8", "::1/128"];
  
  // GeoData 优化
  config["geodata-loader"] = "memconservative";
  config["geo-auto-update"] = true;
  config["geo-update-interval"] = 24;
  config["geodata-mode"] = true;
  config["geox-url"] = {
    "geoip": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.metadb",
    "geosite": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
    "mmdb": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat"
  };

  // 2. DNS 设置 (保持不变_optimized)
  config["dns"] = {
    "enable": true,
    "ipv6": false,
    "listen": "0.0.0.0:1053",
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "respect-rules": true,
    "proxy-server-nameserver": ["223.5.5.5", "119.29.29.29"],
    "fake-ip-filter": [
      "+.msftconnecttest.com", "+.msftncsi.com",
      "+.ntp.org", "+.pool.ntp.org", "+.stun.protocol.org",
      "stun.*", "+.stun.*.*", "+.stun.*",
      "+.nintendo.net", "+.playstation.net", "+.xboxlive.com",
      "time.*.com", "time.*.gov", "time.*.edu.cn", "time.*.apple.com", "time1.cloud.tencent.com",
      "*.bambulab.com", "*.bambulab.cn"
    ],
    "nameserver": [
      "223.5.5.5", "119.29.29.29",
      "quic://dns.alidns.com:853" // 尝试使用 QUIC DNS
    ],
    "fallback": [
      "https://doh.pub/dns-query",
      "tcp://208.67.222.222:443",
      "tls://8.8.4.4:853"
    ],
    "fallback-filter": { "geoip": true, "geoip-code": "CN", "ipcidr": ["240.0.0.0/4"] },
    "nameserver-policy": {
      "geosite:cn": "223.5.5.5",
      "geosite:apple": "system",
      "+.bambulab.cn": "119.29.29.29",
      "+.bambulab.com": "119.29.29.29"
    }
  };

  // 3. Tun 模式
  config["tun"] = {
    "enable": true,
    "stack": "gvisor",
    "auto-route": true,
    "auto-detect-interface": true,
    "strict-route": true,
    "endpoint-independent-nat": true,
    "dns-hijack": ["any:53"],
    "inet4-route-exclude-address": ["192.168.0.0/16", "10.0.0.0/8", "172.16.0.0/12"]
  };

  // 4. Sniffer 设置
  config["sniffer"] = {
    "enable": true,
    "parse-pure-ip": true,
    "override-destination": true,
    "sniff": {
      "HTTP": { "ports": [80, 8080, 8880], "override-destination": true },
      "TLS": { "ports": [443, 8443] }
    }
  };

  // 5. Rule Providers (保持不变)
  config["rule-providers"] = {
    "reject": { "type": "http", "behavior": "domain", "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt", "path": "./ruleset/reject.yaml", "interval": 86400 },
    "icloud": { "type": "http", "behavior": "domain", "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt", "path": "./ruleset/icloud.yaml", "interval": 86400 },
    "apple":  { "type": "http", "behavior": "domain", "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt", "path": "./ruleset/apple.yaml", "interval": 86400 },
    "google": { "type": "http", "behavior": "classical", "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml", "path": "./ruleset/Google.yaml", "interval": 86400 },
    "github": { "type": "http", "behavior": "classical", "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.yaml", "path": "./ruleset/GitHub.yaml", "interval": 86400 },
    "openai": { "type": "http", "behavior": "classical", "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml", "path": "./ruleset/OpenAI.yaml", "interval": 86400 },
    "copilot":{ "type": "http", "behavior": "classical", "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Copilot/Copilot.yaml", "path": "./ruleset/Copilot.yaml", "interval": 86400 },
    "gemini": { "type": "http", "behavior": "classical", "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Gemini/Gemini.yaml", "path": "./ruleset/Gemini.yaml", "interval": 86400 }
  };

  // ============================================================
  // proxy-groups 扁平化重构区
  // ============================================================
  
  // 0. 基础排除正则 (排除流量/过期/官网等非节点项目)
  var baseExclude = "(?i)流量|到期|重置|官网|剩余|套餐|expire|traffic|reset|群组|频道|@|联系|网站|入群|关注|反馈|更新";

  // 1. 定义扁平化的 Proxy Groups
  config["proxy-groups"] = [
    {
      "name": "自动选择",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Urltest.png",
      "include-all": true,
      "filter": "^(?!.*(" + baseExclude + "|俄罗斯|Russia|RU|朝鲜|Korea|KP|古巴|Cuba|CU)).*", // 排除过期/流量/RU/KP/CU
      "url": "http://www.gstatic.com/generate_204",
      "interval": 300,
      "tolerance": 50,
      "unified-delay": true, // 开启统一延迟，更准确
      "lazy": true
    },
    {
      "name": "Gemini",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Google.png",
      "include-all": true,
      "filter": "^(?!.*(" + baseExclude + "|俄罗斯|香港|HongKong|HK|Russia|RU|澳门|Macau|朝鲜|Korea|KP|古巴|Cuba|CU)).*", // 排除 HK/RU/Macau/KP/CU
      "url": "https://www.youtube.com", // 改用 YouTube 检测，比 gemini 域名更能有效识别送中/Captcha IP
      "interval": 310, // 错开 10s
      "tolerance": 50,
      "expected-status": 200, // 强制要求 200 OK，排除验证码或重定向页面
      "unified-delay": true,
      "lazy": true
    },
    {
      "name": "Copilot",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Microsoft.png",
      "include-all": true,
      "filter": "^(?!.*(" + baseExclude + "|俄罗斯|Russia|RU|朝鲜|Korea|KP|古巴|Cuba|CU)).*", // 排除 RU/KP/CU
      "url": "https://www.bing.com",
      "interval": 320, // 错开 20s
      "tolerance": 50,
      "unified-delay": true,
      "lazy": true
    },
    {
      "name": "GitHub Copilot",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/github.png",
      "include-all": true,
      "filter": "^(?!.*(" + baseExclude + "|俄罗斯|Russia|RU|朝鲜|Korea|KP|古巴|Cuba|CU)).*",
      "url": "https://api.github.com",
      "interval": 330, // 错开 30s
      "tolerance": 50,
      "unified-delay": true,
      "lazy": true
    },
    {
      "name": "ChatGPT",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/OpenAI.png",
      "include-all": true,
      "filter": "^(?!.*(" + baseExclude + "|香港|HongKong|HK|俄罗斯|Russia|RU|澳门|Macau|朝鲜|Korea|KP|古巴|Cuba|CU)).*",
      "url": "https://chatgpt.com",
      "interval": 340, // 错开 40s
      "tolerance": 50,
      "unified-delay": true,
      "lazy": true
    },
    {
      "name": "Telegram",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Telegram.png",
      "include-all": true,
      "filter": "^(?!.*(" + baseExclude + "|俄罗斯|Russia|RU)).*",
      // 排除立陶宛防止假延迟？扁平化测速会自动剔除假延迟节点，故不再强制正则排除，靠测速说话
      "url": "https://api.telegram.org",
      "interval": 350, // 错开 50s
      "tolerance": 50,
      "unified-delay": true,
      "lazy": true
    },

    // 手动选择区
    {
      "name": "国内",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/CN.png",
      "proxies": ["DIRECT", "自动选择"]
    },
    {
      "name": "Google",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Google.png",
      "proxies": ["Gemini", "自动选择"] 
    },
    {
      "name": "YouTube",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/YouTube.png",
      "proxies": ["自动选择", "Gemini"]
    },
    {
      "name": "国外通用",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Global.png",
      "proxies": ["自动选择", "Gemini"]
    }
  ];

  config["rules"] = [
    // 基础 - 局域网与直连 (Tun 模式路由已排除，但保留作为保险，或供非 Tun 模式使用)
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "GEOIP,PRIVATE,DIRECT,no-resolve",
    "DOMAIN-SUFFIX,lan,DIRECT",
    "DOMAIN-SUFFIX,local,DIRECT",
    "DOMAIN-SUFFIX,home.arpa,DIRECT",
    "DOMAIN-SUFFIX,yfjc.xyz,DIRECT",
    
    // 基础 - 微软连通性测试 (IPv6 需 Reject 以避免卡顿)
    "DOMAIN,ipv6.msftconnecttest.com,REJECT",
    "DOMAIN,ipv6.msftncsi.com,REJECT",
    "DOMAIN-SUFFIX,msftconnecttest.com,DIRECT",
    "DOMAIN-SUFFIX,msftncsi.com,DIRECT",

    // 广告与隐私拦截 (前置以优化性能 - 优先丢弃垃圾流量)
    "RULE-SET,reject,REJECT",
    "DOMAIN-SUFFIX,doubleclick.net,REJECT",
    "DOMAIN-SUFFIX,googleadservices.com,REJECT",
    "DOMAIN-SUFFIX,googlesyndication.com,REJECT",
    "DOMAIN-SUFFIX,google-analytics.com,REJECT",
    "DOMAIN-SUFFIX,googletagmanager.com,REJECT",
    "DOMAIN-SUFFIX,app-measurement.com,REJECT",
    "DOMAIN-SUFFIX,appsflyer.com,REJECT",
    "DOMAIN-SUFFIX,adjust.com,REJECT",
    "DOMAIN-SUFFIX,tracking.miui.com,REJECT",
    "DOMAIN-KEYWORD,adservice,REJECT",
    "DOMAIN-KEYWORD,analytics,REJECT",
    "DOMAIN-KEYWORD,omniture,REJECT",
    "DOMAIN-KEYWORD,adview,REJECT",

    // AI 服务 (前置于进程规则，确保 Copilot/OpenAI 等插件流量不被 Code.exe 截获)
    "RULE-SET,openai,ChatGPT",
    // 修复 Bing 重定向循环：国内版 Bing 强制直连，国际版 Copilot 走代理
    "DOMAIN,cn.bing.com,DIRECT",
    "RULE-SET,copilot,Copilot",
    "RULE-SET,gemini,Gemini",
    "RULE-SET,github,GitHub Copilot",
    // AI 服务 - 兜底
    "RULE-SET,google,Google",

    // 进程 (Windows)
    "PROCESS-NAME,WeChat.exe,DIRECT",
    "PROCESS-NAME,WeChatAppEx.exe,DIRECT",
    "PROCESS-NAME,QQ.exe,DIRECT",
    "PROCESS-NAME,Telegram.exe,Telegram",
    "PROCESS-NAME,Discord.exe,自动选择",
    "PROCESS-NAME,Slack.exe,自动选择",
    "PROCESS-NAME,Zoom.exe,自动选择",
    // 强制 DIRECT 以保证 Bambu 局域网发现 (广播/组播) 正常工作，避免被误分流到代理
    "PROCESS-NAME,BambuStudio.exe,DIRECT",
    "PROCESS-NAME,bambu-studio.exe,DIRECT",
    "PROCESS-NAME,Thunder.exe,DIRECT",
    "PROCESS-NAME,DownloadSdk.exe,DIRECT",
    "PROCESS-NAME,baidunetdisk.exe,DIRECT",
    "PROCESS-NAME,BitComet.exe,DIRECT",
    "PROCESS-NAME,uTorrent.exe,DIRECT",
    "PROCESS-NAME,IDMan.exe,DIRECT",
    "PROCESS-NAME,git.exe,国外通用",
    "PROCESS-NAME,Code.exe,自动选择",
    "PROCESS-NAME,cursor.exe,自动选择",
    "PROCESS-NAME,idea64.exe,自动选择",
    "PROCESS-NAME,pycharm64.exe,自动选择",
    "PROCESS-NAME,Steam.exe,自动选择",
    "PROCESS-NAME,steamwebhelper.exe,自动选择",
    "PROCESS-NAME,EpicGamesLauncher.exe,自动选择",
    "PROCESS-NAME,Origin.exe,自动选择",
    "PROCESS-NAME,Uplay.exe,自动选择",
    "PROCESS-NAME,cloudmusic.exe,DIRECT",

    // 开发者/微软
    "DOMAIN-SUFFIX,stackoverflow.com,自动选择",
    "DOMAIN-SUFFIX,stackexchange.com,自动选择",
    "DOMAIN-SUFFIX,npmjs.com,自动选择",
    "DOMAIN-SUFFIX,pypi.org,自动选择",
    "DOMAIN-SUFFIX,docker.io,自动选择",
    "DOMAIN-SUFFIX,windowsupdate.com,DIRECT",
    "DOMAIN-SUFFIX,update.microsoft.com,DIRECT",
    "DOMAIN-SUFFIX,delivery.mp.microsoft.com,DIRECT",
    "DOMAIN-SUFFIX,dl.delivery.mp.microsoft.com,DIRECT",
    "DOMAIN-SUFFIX,tlu.dl.delivery.mp.microsoft.com,DIRECT",
    "GEOSITE,microsoft,自动选择",
    "RULE-SET,icloud,DIRECT",
    "RULE-SET,apple,DIRECT",

    // 游戏与 Bambu
    "DOMAIN-SUFFIX,steamserver.net,DIRECT",
    "DOMAIN-SUFFIX,steamcontent.com,DIRECT",
    "DOMAIN-SUFFIX,steamstatic.com,DIRECT",
    "DOMAIN-SUFFIX,epicgames.com,DIRECT",
    // Bambu 云服务 & 打印机通信
    "DOMAIN-SUFFIX,bambulab.com,DIRECT",
    "DOMAIN-SUFFIX,bambulab.cn,DIRECT",
    "DOMAIN-SUFFIX,bambulab.co,DIRECT",
    // 社交
    "GEOSITE,category-communication,自动选择",
    "GEOSITE,telegram,Telegram",
    "GEOIP,telegram,Telegram",
    "GEOSITE,youtube,YouTube",

    // 测速与其他兜底
    "DOMAIN-SUFFIX,speedtest.net,DIRECT",
    "DOMAIN-SUFFIX,ookla.com,DIRECT",
    "DOMAIN-SUFFIX,fast.com,自动选择",
    "DST-PORT,123,DIRECT",
    
    // 最终匹配
    // Google Rule (blackmatrix7) 优先于 google_domain
    "GEOSITE,cn,国内",
    "GEOIP,cn,国内",
    "GEOSITE,geolocation-!cn,自动选择",
    "GEOIP,CN,国内",
    "MATCH,自动选择"
  ];

  return config;
}
