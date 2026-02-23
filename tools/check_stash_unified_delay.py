import urllib.request, re, sys
try:
    req = urllib.request.Request('https://stash.wiki/proxy-protocols/proxy-groups', headers={'User-Agent': 'Mozilla/5.0'})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    if 'unified-delay' in html:
        print('unified-delay found in Stash wiki!')
        idx = html.find('unified-delay')
        print(html[max(0, idx-200):idx+500])
    else:
        print('unified-delay NOT found in Stash wiki proxy-groups page.')
except Exception as e:
    print(e, file=sys.stderr)
