import urllib.request
req = urllib.request.Request(
    'https://upload.wikimedia.org/wikipedia/commons/e/ec/G._Kishan_Reddy_in_2021_%28cropped%29.jpg', 
    headers={'User-Agent': 'Mozilla/5.0'}
)
with urllib.request.urlopen(req) as response:
    with open('../frontend/public/minister.jpg', 'wb') as out_file:
        out_file.write(response.read())

try:
    req2 = urllib.request.Request(
        'https://bcclweb.in/wp-content/uploads/2021/08/samiran-dutta.jpg',
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    with urllib.request.urlopen(req2) as response:
        with open('../frontend/public/cmd.jpg', 'wb') as out_file:
            out_file.write(response.read())
except Exception as e:
    print("Failed CMD", e)
