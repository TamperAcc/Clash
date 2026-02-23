import urllib.request
import re
import sys

query = urllib.parse.quote('Sub-Store "Cannot GET /my"')
url = f'https://html.duckduckgo.com/html/?q={query}'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    snippets = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.DOTALL)
    for s in snippets:
        text = re.sub(r'<[^>]+>', '', s).strip()
        print(text)
        print('---')
except Exception as e:
    print(e)
