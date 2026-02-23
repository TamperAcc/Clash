import urllib.request, re
url = 'https://stash.wiki/proxy-protocols/proxy-groups'
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    if 'tolerance' in html:
        print('tolerance found')
    else:
        print('tolerance not found')
except Exception as e:
    print(e)
