import urllib.request, re, sys
try:
    req = urllib.request.Request('https://stash.wiki/proxy-protocols/proxy-groups', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'\s+', ' ', text)
    print(text[:2000])
    if 'include-all' in text:
        print('\nFOUND include-all')
except Exception as e:
    print(e, file=sys.stderr)
