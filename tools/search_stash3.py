import urllib.request, urllib.parse, re
query = 'Stash iOS geodata-mode geodata-loader geox-url memconservative geoip.metadb'
url = f'https://html.duckduckgo.com/html/?q={urllib.parse.quote(query)}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    snippets = re.findall(r'class=\"result__snippet[^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)
    for s in snippets[:10]:
        print(re.sub(r'<[^>]+>', '', s).strip())
except Exception as e:
    print(f'Error: {e}')
