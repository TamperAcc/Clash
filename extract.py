import re
html = open('stash_sniff.html', encoding='utf-8').read()
for match in re.findall(r'class="result__snippet[^>]*">(.*?)</a>', html, re.IGNORECASE | re.DOTALL):
    print(re.sub(r'<[^>]+>', '', match).strip())
