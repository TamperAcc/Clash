import urllib.request
try:
    req = urllib.request.Request('https://stash.wiki/proxy-protocols/proxy-groups', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    if 'expected-status' in html:
        print('expected-status found')
    else:
        print('expected-status not found')
except Exception as e:
    print(e)
