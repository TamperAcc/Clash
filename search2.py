import urllib.request, urllib.parse, re
req = urllib.request.Request('https://html.duckduckgo.com/html/?q=' + urllib.parse.quote('小幻影视 hills 区别 优缺点'), headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req).read().decode('utf-8')
for match in re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL):
    print(re.sub(r'<[^>]+>', '', match).strip())
