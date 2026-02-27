import urllib.request
import urllib.parse
import re

def search(query):
    url = 'https://html.duckduckgo.com/html/?q=' + urllib.parse.quote(query)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        for match in re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.IGNORECASE | re.DOTALL):
            text = re.sub(r'<[^>]+>', '', match).strip()
            print(text)
    except Exception as e:
        print(f"Error: {e}")

search('小幻影视 hills emby 比较 评测')
search('小幻影视 emby 评测')
search('hills emby 评测')
