// Stash iOS 专用配置文件覆写脚本 (JS 版)
// 引用链接: https://raw.githubusercontent.com/TamperAcc/Clash/main/Stash_Override.js
// 加速链接: https://cdn.jsdelivr.net/gh/TamperAcc/Clash@main/Stash_Override.js
// 版本: v1.13 (自动更新版) | 更新日期: 2026-01-24
// 说明: 移植自 Mihomo_Override.js，针对 iOS/macOS 进行了 Stash 特性适配 (Tiles/无 Exe/Sniffer)

function main(config) {
  console.log("🔵 [Script] 正在应用 Stash Override 脚本 v1.13...");

  // 1. 基础设置优化
  config["tcp-concurrent"] = true;
  config["allow-lan"] = true;
  config["bind-address"] = "*";
  
  // GeoData 内存优化
  config["geodata-loader"] = "memconservative";
  config["geodata-mode"] = true;
  config["geox-url"] = {
    "geoip": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.metadb",
    "geosite": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
    "mmdb": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat"
  };

  // 2. DNS 设置 (Stash 优化版)
  config["dns"] = {
    "enable": true,
    "ipv6": false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "respect-rules": true,
    "fake-ip-filter": [
      "*.lan", "*.local", "+.msftconnecttest.com", "+.msftncsi.com",
      "stun.*", "+.stun.*.*", "+.stun.*",
      "time.*.apple.com", "time1.cloud.tencent.com",
      "*.bambulab.com", "*.bambulab.cn"
    ],
    "nameserver": [
      "119.29.29.29",
      "quic://dns.alidns.com:853" // DoQ
    ],
    "fallback": [], // Stash 通常不需要复杂的 fallback，依赖 nameserver-policy
    "nameserver-policy": {
      "+.apple.com": "system",
      "+.icloud.com": "system",
      "geosite:cn": "119.29.29.29",
      "+.bambulab.cn": "119.29.29.29",
      "+.qq.com": "119.29.29.29",
      "+.aliyun.com": "223.5.5.5",
      "+.taobao.com": "223.5.5.5",
      "+.baidu.com": "180.76.76.76",
      "+.jd.com": "119.29.29.29",
      "+.bilibili.com": "119.29.29.29"
    }
  };

  // 3. Tun / MitM / HTTP
  config["tun"] = { "enable": true, "stack": "mixed" };
  
  config["mitm"] = {
    "enable": true,
    "append-system-trust": true,
    "hostname": ["*.google.cn", "*.google.com.cn", "www.google.com"]
  };

  // 4. Sniffer (iOS 必需)
  config["sniffer"] = {
    "enable": true,
    "parse-pure-ip": true,
    "override-destination": true,
    "sniff": {
      "HTTP": { "ports": [80, 8080, 8880], "override-destination": true },
      "TLS": { "ports": [443, 8443] }
    }
  };

  // 5. Stash 特有：Script & Tiles (面板组件)
  config["script"] = {
    "shortcuts": {
        "quic_block": "network == 'udp' and dst_port == 443"
    },
    "tiles": [
        {
            "name": "Network Info",
            "interval": 600,
            "title": "🌍 网络信息",
            "content": "刷新中...",
            "icon": "network",
            "backgroundColor": "#222222",
            "script": `
            function getFlagEmoji(countryCode) {
                const codePoints = countryCode
                  .toUpperCase()
                  .split('')
                  .map(char =>  127397 + char.charCodeAt());
                return String.fromCodePoint(...codePoints);
            }
            $httpClient.get('http://ip-api.com/json/?lang=zh-CN', function(error, response, data){
                var res = JSON.parse(data);
                var flag = getFlagEmoji(res.countryCode);
                $done({
                    title: flag + " " + res.country + " · " + res.regionName,
                    content: "IP: " + res.query + "\\nISP: " + res.isp,
                    icon: "network",
                    backgroundColor: "#222222"
                });
            });`
        },
        {
            "name": "Traffic Stats",
            "interval": 300,
            "title": "📈 流量统计",
            "content": "加载中...",
            "icon": "arrow.up.arrow.down",
            "backgroundColor": "#1a472a",
            "script": `
            let traffic = $surge.traffic();
            let up = (traffic.up / 1024 / 1024).toFixed(2);
            let down = (traffic.down / 1024 / 1024).toFixed(2);
            $done({
                title: "📈 流量统计",
                content: "⬆️ 上行: " + up + " MB\\n⬇️ 下行: " + down + " MB",
                icon: "arrow.up.arrow.down",
                backgroundColor: "#1a472a"
            });`
        }
    ]
  };

  // 6. Rule Providers (保持一致)
  const providers = {
    "reject": { "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt", "format": "text", "behavior": "domain" },
    "icloud": { "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt", "format": "text", "behavior": "domain" },
    "apple": { "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt", "format": "text", "behavior": "domain" },
    "microsoft": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/microsoft.yaml", "format": "yaml", "behavior": "domain" },
    "cn_domain": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/cn.yaml", "format": "yaml", "behavior": "domain" },
    "cn_ip": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/cn.yaml", "format": "yaml", "behavior": "ipcidr" },
    "google_domain": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/google.yaml", "format": "yaml", "behavior": "domain" },
    "ai_services": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-ai-chat-!cn.yaml", "format": "yaml", "behavior": "domain" },
    "huggingface": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/huggingface.yaml", "format": "yaml", "behavior": "domain" },
    "youtube_domain": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/youtube.yaml", "format": "yaml", "behavior": "domain" },
    "games": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-games.yaml", "format": "yaml", "behavior": "domain" },
    "social_media": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/category-communication.yaml", "format": "yaml", "behavior": "domain" },
    "telegram_domain": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/telegram.yaml", "format": "yaml", "behavior": "domain" },
    "geolocation_no_cn": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/geolocation-!cn.yaml", "format": "yaml", "behavior": "domain" }
  };

  config["rule-providers"] = {};
  for (const [key, val] of Object.entries(providers)) {
    config["rule-providers"][key] = {
      ...val,
      "path": `./ruleset/${key}.${val.format === 'text' ? 'list' : 'yaml'}`,
      "interval": 86400,
      "type": "http"
    };
  }

  // 7. Proxy Groups (v1.12 核心修复逻辑)
  config["proxy-groups"] = [
    {
      "name": "自动选择",
      "type": "url-test",
      "include-all": true,
      "exclude-filter": "(?i)香港|hongkong|hk|HK|Hong|Kong|流量|到期|重置|官网|剩余|套餐|expire|traffic|reset|群组|频道|联系|网站|入群|专线",
      "url": "https://www.gstatic.com/generate_204",
      "interval": 300,
      "tolerance": 50,
      "unified-delay": true,
      "lazy": true
    },
    {
      "name": "负载均衡", 
      "type": "url-test",
      "include-all": true,
      "exclude-filter": "(?i)流量|到期|重置|官网|剩余|套餐|expire|traffic|reset|群组|频道|联系|网站|入群",
      "url": "https://www.gstatic.com/generate_204",
      "interval": 300,
      "lazy": true
    },
    {
      "name": "AI自动优选",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/OpenAI.png",
      "include-all": true,
      "exclude-filter": "(?i)香港|hongkong|hk|HK|Hong|Kong|圣何塞|流量|到期|重置|官网|剩余|套餐|expire|traffic|reset|群组|频道|联系|网站|入群",
      "url": "https://www.gstatic.com/generate_204",
      "interval": 300,
      "tolerance": 50,
      "unified-delay": true
    },
    {
      "name": "AI专用",
      "type": "fallback",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/OpenAI.png",
      "proxies": ["AI自动优选"],
      "include-all": true,
      "filter": "(?i)xiejianacc", // v1.12 修复：去除了复杂转义，兼容性极佳
      "url": "https://www.gstatic.com/generate_204",
      "interval": 300,
      "lazy": true
    },
    {
      "name": "国内",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/CN.png",
      "proxies": ["DIRECT", "自动选择", "负载均衡"]
    },
    {
      "name": "Google Search",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Google.png",
      "proxies": ["AI专用", "自动选择"] 
    },
    {
      "name": "游戏服务",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/GAME.png",
      "include-all": true,
      "filter": "(?i)香港|台湾|新加坡|日本|韩国",
      "url": "https://www.gstatic.com/generate_204",
      "interval": 180,
      "tolerance": 100
    },
    {
      "name": "YouTube",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/YouTube.png",
      "proxies": ["负载均衡", "自动选择", "AI自动优选"]
    },
    {
      "name": "国外通用",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Global.png",
      "proxies": ["负载均衡", "自动选择", "AI自动优选"]
    }
  ];

  // 8. Rule 规则 (针对 iOS 优化，去除 .exe)
  config["rules"] = [
    "SCRIPT,quic_block,REJECT",
    "GEOIP,PRIVATE,DIRECT,no-resolve",
    "DOMAIN-SUFFIX,lan,DIRECT",
    "DOMAIN-SUFFIX,local,DIRECT",
    "DOMAIN-SUFFIX,home.arpa,DIRECT",
    "RULE-SET,reject,REJECT",
    
    // 进程 (iOS/Mac 去除 .exe)
    "PROCESS-NAME,WeChat,DIRECT",
    "PROCESS-NAME,QQ,DIRECT",
    "PROCESS-NAME,Telegram,国外通用",
    "PROCESS-NAME,Discord,国外通用",
    "PROCESS-NAME,Slack,国外通用",
    "PROCESS-NAME,Zoom,国外通用",
    "PROCESS-NAME,BambuStudio,国内",
    "PROCESS-NAME,bambu-studio,国内",
    "PROCESS-NAME,Thunder,DIRECT",
    "PROCESS-NAME,git,国外通用",
    "PROCESS-NAME,Code,自动选择",
    "PROCESS-NAME,Cursor,自动选择",
    "PROCESS-NAME,Steam,游戏服务",
    "PROCESS-NAME,steam_osx,游戏服务",
    "PROCESS-NAME,NeteaseMusic,DIRECT",
    "PROCESS-NAME,QQMusic,DIRECT",

    // AI 服务 (全面)
    "DOMAIN,copilot-proxy.githubusercontent.com,AI专用",
    "DOMAIN,api.github.com,AI专用",
    "DOMAIN-SUFFIX,githubcopilot.com,AI专用",
    "DOMAIN-SUFFIX,github.com,AI专用",
    "DOMAIN-SUFFIX,githubusercontent.com,AI专用",
    "DOMAIN-SUFFIX,github.io,AI专用",
    "DOMAIN-SUFFIX,visualstudio.com,AI专用",
    "DOMAIN,sydney.bing.com,AI专用",
    "DOMAIN,edgeservices.bing.com,AI专用",
    "RULE-SET,ai_services,AI专用",
    "RULE-SET,huggingface,负载均衡",

    // 微软/苹果
    "RULE-SET,microsoft,负载均衡",
    "RULE-SET,icloud,DIRECT",
    "RULE-SET,apple,DIRECT",
    
    // 游戏与 Bambu
    "DOMAIN-SUFFIX,steamserver.net,DIRECT",
    "DOMAIN-SUFFIX,steamcontent.com,DIRECT",
    "DOMAIN-SUFFIX,epicgames.com,DIRECT",
    "RULE-SET,games,游戏服务",
    "DOMAIN-SUFFIX,bambulab.com,国内",
    "DOMAIN-SUFFIX,bambulab.cn,国内",

    // 社交
    "RULE-SET,social_media,国外通用",
    "RULE-SET,telegram_domain,国外通用",
    "RULE-SET,telegram,国外通用",
    "RULE-SET,youtube_domain,YouTube",

    // 兜底优化
    "DOMAIN-SUFFIX,speedtest.net,DIRECT",
    "DOMAIN-SUFFIX,ookla.com,DIRECT",
    "DST-PORT,123,DIRECT",
    
    // 最终匹配
    "RULE-SET,google_domain,Google Search",
    "RULE-SET,cn_domain,国内",
    "RULE-SET,cn_ip,国内",
    "RULE-SET,geolocation_no_cn,国外通用",
    "GEOIP,CN,国内",
    "MATCH,国外通用"
  ];

  return config;
}
