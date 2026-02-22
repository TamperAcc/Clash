import urllib.request, re, sys
try:
    req = urllib.request.Request('https://stash.wiki/proxy-protocols/proxy-groups', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'\s+', ' ', text)
    idx = text.find('include-all')
    print(text[max(0, idx-200):idx+500])
except Exception as e:
    print(e, file=sys.stderr)
