import urllib.request, urllib.parse, re, sys
try:
    req = urllib.request.Request('https://stash.wiki/proxy-protocols/proxy-types', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    if 'client-fingerprint' in html:
        print('Found client-fingerprint')
    if 'global-client-fingerprint' in html:
        print('Found global-client-fingerprint')
except Exception as e:
    print(e, file=sys.stderr)
