// Mihomo Party 专用配置文件覆写脚本
// 引用链接: https://raw.githubusercontent.com/TamperAcc/Clash/main/Mihomo_Override.js
// 加速链接: https://cdn.jsdelivr.net/gh/TamperAcc/Clash@main/Mihomo_Override.js
// 版本: v1.46  | 更新日期: 2026-01-29
// 移植自 ClashVerge.yaml "PC 端终极优化版"

function main(config) {
  // 打印版本号，用于确认是否下载到了最新版
  console.log("✅ 加载脚本 v1.46 (Fix: Restore Missing Proxy Group '国外通用')...");

  // 关键修复：如果 config 为空，必须返回空对象 {} 而不是 null
  if (!config) {
    return {}; 
  }

  // 1. 基础设置优化
  config["tcp-concurrent"] = true; // ✅ 恢复并发 (已有 Tun 排除保护，重新测试开启)
  config["global-client-fingerprint"] = "edge";
  config["keep-alive-interval"] = 30;
  config["allow-lan"] = true;
  config["bind-address"] = "*";
  config["find-process-mode"] = "strict";
  config["profile"] = {
    "store-selected": true,
    "auto-update": true
  };
  
  // 修复本地回环和 Google 连接问题 (恢复精简列表，因 Tun 已排除内网，此处不再需要冗余配置)
  config["skip-auth-prefixes"] = ["127.0.0.1/8", "::1/128"];
  // Tun 模式下已排除内网流量，此项理论不需要，但保留以防 Local 软件验证问题
  
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

  // 2. DNS 设置
  config["dns"] = {
    "enable": true,
    "ipv6": false,
    "listen": "0.0.0.0:1053",
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "respect-rules": true,
    "proxy-server-nameserver": [
      "223.5.5.5",
      "119.29.29.29"
    ],
    "fake-ip-filter": [
      // "*.lan", "*.local",  <-- 已通过 inet4-route-exclude-address 在路由层排除，此处不再需要
      "+.msftconnecttest.com", "+.msftncsi.com",
      "+.ntp.org", "+.pool.ntp.org", "+.stun.protocol.org",
      "stun.*", "+.stun.*.*", "+.stun.*",
      "+.nintendo.net", "+.playstation.net", "+.xboxlive.com",
      "time.*.com", "time.*.gov", "time.*.edu.cn", "time.*.apple.com", "time1.cloud.tencent.com",
      "*.bambulab.com", "*.bambulab.cn"
    ],
    "nameserver": [
      "223.5.5.5",
      "119.29.29.29",
      "quic://dns.alidns.com:853"
    ],
    "fallback": [
      "https://doh.pub/dns-query",
      "https://1.0.0.1/dns-query",
      "tcp://208.67.222.222:443",
      "tls://8.8.4.4:853"
    ],
    "fallback-filter": {
      "geoip": true,
      "geoip-code": "CN",
      "ipcidr": ["240.0.0.0/4"]
    },
    // DNS 分流策略
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
    "stack": "gvisor", // 🔥 兼容性修复：使用 gvisor 栈代替 mixed，提高复杂网络下稳定性
    "auto-route": true,
    "auto-detect-interface": true,
    "strict-route": true, // ✅ 调整：保持开启严格路由，防止复杂网络环境下流量泄露
    "dns-hijack": ["any:53"],
    // 🔥 核心修复：直接从 Tun 路由中排除局域网流量，让 OS 自动处理，彻底解决 ERR_EMPTY_RESPONSE
    "inet4-route-exclude-address": ["192.168.0.0/16", "10.0.0.0/8", "172.16.0.0/12"]
  };

  // 4. Sniffer 设置
  config["sniffer"] = {
    "enable": true,
    "parse-pure-ip": true, // ✅ 恢复为 true。因内网流量已不经过内核，开启此项不再影响内网，且能增强外网分流
    "override-destination": true,
    "sniff": {
      "HTTP": { "ports": [80, 8080, 8880], "override-destination": true },
      "TLS": { "ports": [443, 8443] }
    }
  };

  // 5. Rule Providers 定义
  config["rule-providers"] = {
    "reject": {
      "type": "http",
      "behavior": "domain",
      "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
      "path": "./ruleset/reject.yaml",
      "interval": 86400
    },
    "icloud": {
      "type": "http",
      "behavior": "domain",
      "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
      "path": "./ruleset/icloud.yaml",
      "interval": 86400
    },
    "apple": {
      "type": "http",
      "behavior": "domain",
      "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt",
      "path": "./ruleset/apple.yaml",
      "interval": 86400
    },
    "google": {
      "type": "http",
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml",
      "path": "./ruleset/Google.yaml",
      "interval": 86400
    },
    "github": {
      "type": "http",
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GitHub/GitHub.yaml",
      "path": "./ruleset/GitHub.yaml",
      "interval": 86400
    },
    "openai": {
      "type": "http",
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OpenAI/OpenAI.yaml",
      "path": "./ruleset/OpenAI.yaml",
      "interval": 86400
    },
    "copilot": {
      "type": "http",
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Copilot/Copilot.yaml",
      "path": "./ruleset/Copilot.yaml",
      "interval": 86400
    },
    "gemini": {
      "type": "http",
      "behavior": "classical",
      "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Gemini/Gemini.yaml",
      "path": "./ruleset/Gemini.yaml",
      "interval": 86400
    },
    "microsoft": {
      "type": "http",
      "behavior": "domain",
      "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/microsoft.yaml",
      "path": "./ruleset/microsoft.yaml",
      "interval": 86400
    },
    "ai_services": {
      "type": "http",
      "behavior": "domain",
      "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-ai-chat-!cn.yaml",
      "path": "./ruleset/ai_services.yaml",
      "interval": 86400
    },
    "telegram": {
      "type": "http",
      "behavior": "ipcidr",
      "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/telegram.yaml",
      "path": "./ruleset/telegram.yaml",
      "interval": 86400
    },
    "telegram_domain": {
      "type": "http",
      "behavior": "domain",
      "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/telegram.yaml",
      "path": "./ruleset/telegram_domain.yaml",
      "interval": 86400
    },
    "youtube_domain": {
      "type": "http",
      "behavior": "domain",
      "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/youtube.yaml",
      "path": "./ruleset/youtube_domain.yaml",
      "interval": 86400
    },
    "cn_domain": {
      "type": "http",
      "behavior": "domain",
      "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/cn.yaml",
      "path": "./ruleset/cn_domain.yaml",
      "interval": 86400
    },
    "cn_ip": {
      "type": "http",
      "behavior": "ipcidr",
      "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/cn.yaml",
      "path": "./ruleset/cn_ip.yaml",
      "interval": 86400
    },
    "geolocation_no_cn": {
      "type": "http",
      "behavior": "domain",
      "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/geolocation-!cn.yaml",
      "path": "./ruleset/geolocation-!cn_domain.yaml",
      "interval": 86400
    }
  };

  // Proxy Groups 定义
  // 基础地区正则定义
  const regions = [
    { name: "🇭🇰 香港", filter: "(?i)香港|HK|HongKong" },
    { name: "🇹🇼 台湾", filter: "(?i)台湾|TW|Taiwan" },
    { name: "🇯🇵 日本", filter: "(?i)日本|JP|Japan" },
    { name: "🇰🇷 韩国", filter: "(?i)韩国|KR|Korea" },
    { name: "🇸🇬 新加坡", filter: "(?i)新加坡|SG|Singapore" },
    { name: "🇺🇸 美国", filter: "(?i)美国|US|United States" },
    { name: "🇬🇧 英国", filter: "(?i)英国|UK|United Kingdom" },
    { name: "🇩🇪 德国", filter: "(?i)德国|DE|Germany" },
    { name: "🇨🇦 加拿大", filter: "(?i)加拿大|CA|Canada" },
    { name: "🇦🇺 澳大利亚", filter: "(?i)澳大利亚|AU|Australia" },
    { name: "🇷🇺 俄罗斯", filter: "(?i)俄罗斯|RU|Russia" },
    { name: "🇹🇭 泰国", filter: "(?i)泰国|TH|Thailand" },
    { name: "🇻🇳 越南", filter: "(?i)越南|VN|Vietnam" },
    { name: "🇲🇾 马来西亚", filter: "(?i)马来西亚|MY|Malaysia" },
    { name: "🇮🇳 印度", filter: "(?i)印度|IN|India" },
    // 补齐用户提到的新地区
    { name: "🇫🇷 法国", filter: "(?i)法国|FR|France" },
    { name: "🇳🇱 荷兰", filter: "(?i)荷兰|NL|Netherlands" },
    { name: "🇱🇹 立陶宛", filter: "(?i)立陶宛|LT|Lithuania" }
  ];

  // 辅助函数：生成一套包含所有地区的策略组 (Level 1: Region Groups)
  // suffix: 组名后缀 (如 " Gemini"), url: 测速地址, hidden: 是否隐藏
  // baseInterval: 基础间隔(秒), offset: 组间偏移(秒), unifiedDelay: 是否开启统一延迟计算
  // excludeRegex: 需要排除的地区名称正则 (如 "俄罗斯|香港")
  function createRegionSets(suffix, url, hidden = true, baseInterval = 100, offset = 0, unifiedDelay = true, excludeRegex = null) {
     // 预先过滤地区
     const targetRegions = excludeRegex 
        ? regions.filter(r => !new RegExp(excludeRegex).test(r.name)) 
        : regions;

     return targetRegions.map((r, index) => ({
      "name": r.name + suffix,
      "type": "url-test",
      "hidden": hidden,
      "include-all": true,
      "filter": r.filter,
      "exclude-filter": "(?i)流量|到期|重置|官网|剩余|套餐|expire|traffic|reset|群组|频道|@|联系|网站|入群|关注|反馈|更新",
      "url": url,
      // 错开时间核心逻辑: 基础间隔 + 服务偏移 + (地区索引 * 步长)
      // 使用 index * 13 确保地区间充分错开，offset 确保服务间错开
      "interval": baseInterval + offset + (index * 13),
      "tolerance": 50,
      "unified-delay": unifiedDelay,
      "lazy": true
    }));
  }

  // 生成 5 套底层地区组 - 引入时间错开机制 (防止并发测速拥堵)
  // 改为 100s 以获得更快的节点故障响应速度 (配合 lazy: true 使用性能可控)
  const groupsAuto    = createRegionSets("",          "http://www.gstatic.com/generate_204", true,  100, 0, true); 
  // AI 分组特别优化：排除不支持的地区 (俄罗斯 RU) 及部分 (香港 HK)
  const groupsGemini  = createRegionSets(" Gemini",   "https://gemini.google.com",           true,  100, 6, false, "俄罗斯|香港");
  const groupsCopilot = createRegionSets(" Copilot",  "https://www.bing.com",                true,  100, 12, false, "俄罗斯");
  const groupsGithub  = createRegionSets(" GitHub",   "https://api.github.com",              true,  100, 18, false, "俄罗斯");
  const groupsGPT     = createRegionSets(" GPT",      "https://chatgpt.com",                 true,  100, 24, false, "俄罗斯|香港");

  // 将所有底层组展平，准备加入 config["proxy-groups"]
  const allRegionGroups = [
    ...groupsAuto,
    ...groupsGemini,
    ...groupsCopilot,
    ...groupsGithub,
    ...groupsGPT
  ];
  config["proxy-groups"] = [
    // === Level 2: 核心组中组 (包含各自的地区组) ===
    {
      "name": "自动选择",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Urltest.png",
      "proxies": groupsAuto.map(g => g.name),
      "url": "http://www.gstatic.com/generate_204",
      "interval": 100,
      "tolerance": 100,
      "lazy": true
    },
    {
      "name": "Gemini",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Google.png",
      "proxies": groupsGemini.map(g => g.name),
      "url": "https://gemini.google.com",
      "interval": 100,
      "tolerance": 100,
      "unified-delay": false,
      "lazy": true
    },
    {
      "name": "Copilot",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Microsoft.png",
      "proxies": groupsCopilot.map(g => g.name),
      "url": "https://www.bing.com",
      "interval": 100,
      "tolerance": 100,
      "unified-delay": false,
      "lazy": true
    },
    {
      "name": "GitHub Copilot",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/github.png",
      "proxies": groupsGithub.map(g => g.name),
      "url": "https://api.github.com",
      "interval": 100,
      "tolerance": 100,
      "unified-delay": false,
      "lazy": true
    },
    {
      "name": "ChatGPT",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/OpenAI.png",
      "proxies": groupsGPT.map(g => g.name),
      "url": "https://chatgpt.com",
      "interval": 100,
      "tolerance": 100,
      "unified-delay": false,
      "lazy": true
    },

    // === Level 1: 底层地区组 (由辅助函数生成) ===
    ...allRegionGroups,

    // === Manual Select Groups (上层手动选择组) ===
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

    // 进程 (Windows)
    "PROCESS-NAME,WeChat.exe,DIRECT",
    "PROCESS-NAME,WeChatAppEx.exe,DIRECT",
    "PROCESS-NAME,QQ.exe,DIRECT",
    "PROCESS-NAME,Telegram.exe,自动选择",
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
    "RULE-SET,openai,ChatGPT",
    "RULE-SET,copilot,Copilot",
    "RULE-SET,gemini,Gemini",
    
    // AI 服务 - 兜底
    "RULE-SET,google,Google",

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
    "RULE-SET,microsoft,自动选择",
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
    "RULE-SET,social_media,自动选择",
    "RULE-SET,telegram_domain,自动选择",
    "RULE-SET,telegram,自动选择",
    "RULE-SET,youtube_domain,YouTube",

    // 测速与其他兜底
    "DOMAIN-SUFFIX,speedtest.net,DIRECT",
    "DOMAIN-SUFFIX,ookla.com,DIRECT",
    "DOMAIN-SUFFIX,fast.com,自动选择",
    "DST-PORT,123,DIRECT",
    
    // 最终匹配
    // Google Rule (blackmatrix7) 优先于 google_domain
    "RULE-SET,cn_domain,国内",
    "RULE-SET,cn_ip,国内",
    "RULE-SET,geolocation_no_cn,自动选择",
    "GEOIP,CN,国内",
    "MATCH,自动选择"
  ];

  return config;
}
