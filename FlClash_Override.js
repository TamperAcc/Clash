// FLClash / Mihomo Party �����ļ���д�ű�
// ��������: https://raw.githubusercontent.com/TamperAcc/Clash/main/FlClash_Override.js
// ��������: https://cdn.jsdelivr.net/gh/TamperAcc/Clash@main/FlClash_Override.js
// �汾: v1.22 (�Զ����°�) | ��������: 2026-02-17
// ��ֲ�� ClashVerge.yaml "PC ���ռ��Ż���"

function main(config) {
  // ��ӡ��־������� (��������־�пɼ�)
  console.log("?? [Script] ����Ӧ�� FlClash ��д�ű� v1.22 (���� Mihomo v1.9.1)...");



  // 1. ���������Ż�
  config["tcp-concurrent"] = true;
  config["client-fingerprint"] = "edge";
  config["unified-delay"] = true; // 开启统一延迟，更准确
  config["keep-alive-idle"] = 15;
  config["keep-alive-interval"] = 15;
  config["allow-lan"] = true;
  config["bind-address"] = "*";
  config["find-process-mode"] = "strict"; // �Ż���Windows �¸���׼�Ľ���ƥ��
  config["profile"] = {
    "store-selected": true // �Ż�����ס�ֶ�ѡ��Ľڵ�
  };
  
  // �޸����ػػ�����
  config["skip-auth-prefixes"] = ["127.0.0.1/8", "::1/128"];
  
  // GeoData �Ż�
  config["geo-auto-update"] = true;
  config["geo-update-interval"] = 24;
  config["geox-url"] = {
    "geoip": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.metadb",
    "geosite": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
    "mmdb": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat"
  };

  // 2. DNS ����
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
      "*.lan", "*.local", "+.msftconnecttest.com", "+.msftncsi.com",
      "+.ntp.org", "+.pool.ntp.org", "+.stun.protocol.org",
      "stun.*", "+.stun.*.*", "+.stun.*",
      "+.nintendo.net", "+.playstation.net", "+.xboxlive.com",
      "time.*.com", "time.*.gov", "time.*.edu.cn", "time.*.apple.com", "time1.cloud.tencent.com",
      "*.bambulab.com", "*.bambulab.cn"
    ],
    "nameserver": [
      "223.5.5.5",
      "119.29.29.29",
      "quic://dns.alidns.com:853" // DoQ
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
    // DNS ��������
    "nameserver-policy": {
      "+.apple.com": "system",
      "+.icloud.com": "system",
      "geosite:cn": "119.29.29.29",
      "+.qq.com": "119.29.29.29",
      "+.aliyun.com": "223.5.5.5",
      "+.taobao.com": "223.5.5.5",
      "+.baidu.com": "180.76.76.76",
      "+.jd.com": "119.29.29.29",
      "+.bilibili.com": "119.29.29.29",
      "+.163.com": "223.5.5.5",
      "+.netease.com": "223.5.5.5",
      "+.douyin.com": "180.76.76.76",
      "+.tiktok.com": "180.76.76.76",
      "+.bambulab.cn": "119.29.29.29",
      "+.bambulab.com": "119.29.29.29"
    }
  };

  // 3. Tun ģʽ
  config["tun"] = {
    "enable": true,
    "stack": "mixed",
    "auto-route": true,
    "auto-detect-interface": true,
    "strict-route": true,
    "dns-hijack": ["any:53"]
  };

  // 4. Sniffer ���� (�ر� QUIC ��̽)
  config["sniffer"] = {
    "enable": true,
    "parse-pure-ip": true,
    "override-destination": true,
    "sniff": {
      "HTTP": { "ports": [80, 8080, 8880], "override-destination": true },
      "TLS": { "ports": [443, 8443] }
    }
  };

  // 5. Rule Providers ����
  const providers = {
    "reject": { "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt", "format": "text", "behavior": "domain" },
    "icloud": { "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt", "format": "text", "behavior": "domain" },
    "apple": { "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt", "format": "text", "behavior": "domain" },
    "microsoft": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geosite/microsoft.yaml", "format": "yaml", "behavior": "domain" },
    "telegram": { "url": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo/geoip/telegram.yaml", "format": "yaml", "behavior": "ipcidr" },
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

  // 6. Proxy Groups ����
  // ע�⣺����ʹ�� overwrite �߼����Ḳ�Ƕ����Դ�������
  config["proxy-groups"] = [
    {
      "name": "�Զ�ѡ��",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Urltest.png",
      "include-all": true,
      "exclude-filter": "(?i)IEPL|������|Lithuania|LT|����˹|Russia|RU|����|����|����|����|ʣ��|�ײ�|expire|traffic|reset|Ⱥ��|Ƶ��|@|��ϵ|��վ|��Ⱥ|��ע|����|����",
      "url": "https://www.gstatic.com/generate_204",
      "interval": 300,
      "tolerance": 100,
      
      "lazy": true
    },
    {
      "name": "AI�Զ���ѡ",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/OpenAI.png",
      "include-all": true,
      "exclude-filter": "(?i)������|Lithuania|LT|����˹|Russia|RU|���|hongkong|hk|HK|Hong|Kong|����|Macau|����|Korea|KP|�Ű�|Cuba|CU|ʥ����|����|����|����|����|ʣ��|�ײ�|expire|traffic|reset|Ⱥ��|Ƶ��|@|��ϵ|��վ|��Ⱥ|��ע|����|����",
      "url": "https://www.youtube.com", // �������/Captcha IP
      "interval": 300,
      "tolerance": 50,
      "expected-status": 200,
      "unified-delay": true
    },
    {
      "name": "Telegram",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Telegram.png",
      "include-all": true,
      "exclude-filter": "(?i)����˹|Russia|RU|������|Lithuania|LT|����|����|����|����|ʣ��|�ײ�|expire|traffic|reset|Ⱥ��|Ƶ��|@|��ϵ|��վ|��Ⱥ|��ע|����|����",
      "url": "https://api.telegram.org",
      "interval": 300,
      "tolerance": 100,
      "unified-delay": true
    },
    
    {
      "name": "����",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/CN.png",
      "proxies": ["DIRECT", "�Զ�ѡ��"]
    },
    {
      "name": "Google",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Google.png",
      "proxies": ["AI�Զ���ѡ", "�Զ�ѡ��"] 
    },
    {
      "name": "��Ϸ����",
      "type": "url-test",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/GAME.png",
      "include-all": true,
      "filter": "(?i)���|̨��|�¼���|�ձ�|����",
      "url": "https://www.gstatic.com/generate_204",
      "interval": 180,
      "tolerance": 100
    },
    {
      "name": "YouTube",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/YouTube.png",
      "proxies": ["AI�Զ���ѡ", "�Զ�ѡ��"]
    },
    {
      "name": "����ͨ��",
      "type": "select",
      "icon": "https://cdn.jsdelivr.net/gh/Orz-3/mini@master/Color/Global.png",
      "proxies": ["AI�Զ���ѡ", "�Զ�ѡ��"]
    }
  ];

  // 7. Rules ����
  config["rules"] = [
    // ����
    "GEOIP,PRIVATE,DIRECT,no-resolve",
    "DOMAIN-SUFFIX,lan,DIRECT",
    "DOMAIN-SUFFIX,local,DIRECT",
    "DOMAIN-SUFFIX,home.arpa,DIRECT",
    "DOMAIN,ipv6.msftconnecttest.com,REJECT",
    "DOMAIN,ipv6.msftncsi.com,REJECT",
    "DOMAIN-SUFFIX,yfjc.xyz,DIRECT",
    "DOMAIN-SUFFIX,msftconnecttest.com,DIRECT",
    "DOMAIN-SUFFIX,msftncsi.com,DIRECT",
    "RULE-SET,reject,REJECT",
    
    // Brave (�������)
    "DOMAIN-SUFFIX,brave.com,�Զ�ѡ��",

    // AI ���� - ����������©
    "DOMAIN-SUFFIX,openai.com,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,chatgpt.com,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,gemini.google.com,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,bard.google.com,AI�Զ���ѡ",
    "DOMAIN,generativelanguage.googleapis.com,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,proactivebackend-pa.googleapis.com,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,opa-pa.googleapis.com,AI�Զ���ѡ",
    
    // AI ���� - ԭ�й���
    "DOMAIN,copilot-proxy.githubusercontent.com,AI�Զ���ѡ",
    "DOMAIN,api.github.com,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,githubcopilot.com,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,github.com,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,githubusercontent.com,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,github.io,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,visualstudio.com,AI�Զ���ѡ",
    "DOMAIN,sydney.bing.com,AI�Զ���ѡ",
    "DOMAIN,edgeservices.bing.com,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,claude.ai,AI�Զ���ѡ",
    "DOMAIN-SUFFIX,anthropic.com,AI�Զ���ѡ",
    "RULE-SET,ai_services,AI�Զ���ѡ",
    "RULE-SET,huggingface,AI�Զ���ѡ",

    // ���� (Windows)
    "PROCESS-NAME,WeChat.exe,DIRECT",
    "PROCESS-NAME,WeChatAppEx.exe,DIRECT",
    "PROCESS-NAME,QQ.exe,DIRECT",
    "PROCESS-NAME,Telegram.exe,Telegram",
    "PROCESS-NAME,Discord.exe,����ͨ��",
    "PROCESS-NAME,Slack.exe,����ͨ��",
    "PROCESS-NAME,Zoom.exe,����ͨ��",
    "PROCESS-NAME,BambuStudio.exe,����",
    "PROCESS-NAME,bambu-studio.exe,����",
    "PROCESS-NAME,Thunder.exe,DIRECT",
    "PROCESS-NAME,DownloadSdk.exe,DIRECT",
    "PROCESS-NAME,baidunetdisk.exe,DIRECT",
    "PROCESS-NAME,BitComet.exe,DIRECT",
    "PROCESS-NAME,uTorrent.exe,DIRECT",
    "PROCESS-NAME,IDMan.exe,DIRECT",
    "PROCESS-NAME,git.exe,����ͨ��",
    "PROCESS-NAME,Code.exe,�Զ�ѡ��",
    "PROCESS-NAME,cursor.exe,�Զ�ѡ��",
    "PROCESS-NAME,idea64.exe,�Զ�ѡ��",
    "PROCESS-NAME,pycharm64.exe,�Զ�ѡ��",
    "PROCESS-NAME,Steam.exe,��Ϸ����",
    "PROCESS-NAME,steamwebhelper.exe,��Ϸ����",
    "PROCESS-NAME,EpicGamesLauncher.exe,��Ϸ����",
    "PROCESS-NAME,Origin.exe,��Ϸ����",
    "PROCESS-NAME,Uplay.exe,��Ϸ����",
    "PROCESS-NAME,cloudmusic.exe,DIRECT",
    "PROCESS-NAME,QQMusic.exe,DIRECT",
    "PROCESS-NAME,DouYinLive.exe,DIRECT",

    // ����ֱ���Ż�
    "DOMAIN-SUFFIX,cdn.jsdelivr.net,DIRECT",
    "DOMAIN-SUFFIX,unpkg.com,DIRECT",
    "DOMAIN-SUFFIX,staticfile.org,DIRECT",
    "DOMAIN-SUFFIX,bootcdn.cn,DIRECT",
    "DOMAIN-SUFFIX,bilibili.com,DIRECT",
    "DOMAIN-SUFFIX,hdslb.com,DIRECT",
    "DOMAIN-SUFFIX,acgvideo.com,DIRECT",
    "DOMAIN-SUFFIX,iqiyi.com,DIRECT",
    "DOMAIN-SUFFIX,youku.com,DIRECT",
    "DOMAIN-SUFFIX,163.com,DIRECT",
    "DOMAIN-SUFFIX,music.163.com,DIRECT",
    "DOMAIN-SUFFIX,qqmusic.qq.com,DIRECT",
    "DOMAIN-SUFFIX,jd.com,DIRECT",
    "DOMAIN-SUFFIX,taobao.com,DIRECT",
    "DOMAIN-SUFFIX,tmall.com,DIRECT",

    // ������/΢��
    "DOMAIN-SUFFIX,stackoverflow.com,����ͨ��",
    "DOMAIN-SUFFIX,stackexchange.com,����ͨ��",
    "DOMAIN-SUFFIX,npmjs.com,����ͨ��",
    "DOMAIN-SUFFIX,pypi.org,����ͨ��",
    "DOMAIN-SUFFIX,docker.com,����ͨ��",
    "DOMAIN-SUFFIX,docker.io,����ͨ��",
    "DOMAIN-SUFFIX,windowsupdate.com,DIRECT",
    "DOMAIN-SUFFIX,update.microsoft.com,DIRECT",
    "DOMAIN-SUFFIX,delivery.mp.microsoft.com,DIRECT",
    "DOMAIN-SUFFIX,dl.delivery.mp.microsoft.com,DIRECT",
    "DOMAIN-SUFFIX,tlu.dl.delivery.mp.microsoft.com,DIRECT",
    "RULE-SET,microsoft,�Զ�ѡ��",
    "RULE-SET,icloud,DIRECT",
    "RULE-SET,apple,DIRECT",

    // ��Ϸ�� Bambu
    "DOMAIN-SUFFIX,steamserver.net,DIRECT",
    "DOMAIN-SUFFIX,steamcontent.com,DIRECT",
    "DOMAIN-SUFFIX,steamstatic.com,DIRECT",
    "DOMAIN-SUFFIX,epicgames.com,DIRECT",
    "RULE-SET,games,��Ϸ����",
    "DOMAIN-SUFFIX,bambulab.com,����",
    "DOMAIN-SUFFIX,bambulab.cn,����",
    "DOMAIN-SUFFIX,bambulab.co,����",

    // �罻
    "RULE-SET,social_media,����ͨ��",
    "RULE-SET,telegram_domain,Telegram",
    "RULE-SET,telegram,Telegram",
    "RULE-SET,youtube_domain,YouTube",

    // ��˽�붵��
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
    "DOMAIN-SUFFIX,speedtest.net,DIRECT",
    "DOMAIN-SUFFIX,ookla.com,DIRECT",
    "DOMAIN-SUFFIX,fast.com,����ͨ��",
    "DST-PORT,123,DIRECT",
    "DST-PORT,3478,DIRECT",
    "DST-PORT,51413,DIRECT",
    
    // ����ƥ��
    "RULE-SET,google_domain,Google",
    "RULE-SET,cn_domain,����",
    "RULE-SET,cn_ip,����",
    "RULE-SET,geolocation_no_cn,����ͨ��",
    "GEOIP,CN,����",
    "MATCH,����ͨ��"
  ];

  return config;
}
