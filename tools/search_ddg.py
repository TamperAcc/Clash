import urllib.request, urllib.parse, json, re
query = urllib.parse.quote('"Stash" "unified-delay" "proxy-groups"')
url = f'https://html.duckduckgo.com/html/?q={query}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    results = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)
    if not results:
        print("No results found.")
    for r in results:
        print(re.sub(r'<[^>]+>', '', r).strip())
except Exception as e:
    print(e)
