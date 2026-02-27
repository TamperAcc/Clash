import urllib.request, urllib.parse, re
def search(query):
    url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(query)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        snippets = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)
        titles = re.findall(r'<h2 class="result__title">.*?<a[^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL)
        for t, s in zip(titles, snippets):
            t_clean = re.sub(r'<[^>]+>', '', t).strip()
            s_clean = re.sub(r'<[^>]+>', '', s).strip()
            print(f"Title: {t_clean}\nSnippet: {s_clean}\n")
    except Exception as e:
        print(e)
search('Stash 3.3.0 stoverride metadata')
