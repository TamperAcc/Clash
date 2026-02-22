import urllib.request, sys
try:
    req = urllib.request.Request('https://stash.wiki/proxy-protocols/proxy-groups', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    print(html[:2000])
except Exception as e:
    print(e, file=sys.stderr)
