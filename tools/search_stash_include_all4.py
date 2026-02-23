import urllib.request, urllib.parse, re, sys
try:
    req = urllib.request.Request('https://html.duckduckgo.com/html/?q=' + urllib.parse.quote('Stash proxy-groups include-all true'), headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    for match in re.findall(r'<a class="result__url" href="([^"]+)">.*?class="result__snippet[^>]*">(.*?)</a>', html, re.IGNORECASE | re.DOTALL):
        print(match[0] + '\n' + re.sub(r'<[^>]+>', '', match[1]).strip() + '\n')
except Exception as e:
    print(e, file=sys.stderr)
