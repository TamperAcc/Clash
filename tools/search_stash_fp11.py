import urllib.request, urllib.parse, re, sys
try:
    req = urllib.request.Request('https://stash.wiki/proxy-protocols/proxy-types', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    idx = html.find('client-fingerprint')
    if idx != -1:
        print(html[max(0, idx-200):min(len(html), idx+200)])
except Exception as e:
    print(e, file=sys.stderr)
