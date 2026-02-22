import urllib.request, urllib.parse, re, sys
try:
    req = urllib.request.Request('https://stash.wiki/proxies/protocol', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    print(html[:1000])
except Exception as e:
    print(e, file=sys.stderr)
