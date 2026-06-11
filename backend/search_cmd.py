import urllib.request
import re

req = urllib.request.Request('https://www.psuconnect.in/news/manoj-kumar-agarwal-takes-charge-as-cmd-bccl/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    images = re.findall(r'<img[^>]+src=\"([^\"]+)\"', html)
    print([img for img in images if 'agarwal' in img.lower() or 'cmd' in img.lower() or 'bccl' in img.lower() or '172' in img.lower()])
except Exception as e:
    print(e)
