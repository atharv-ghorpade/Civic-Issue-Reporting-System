import urllib.request, json, urllib.error
req = urllib.request.Request('http://127.0.0.1:8000/api/v1/auth/register', data=json.dumps({'username': 'test90', 'email': 'test90@admin.com', 'password': 'pass', 'full_name': 'Test User'}).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    res = urllib.request.urlopen(req)
    print("SUCCESS")
    print(res.read().decode())
except urllib.error.HTTPError as e:
    print("ERROR", e.code)
    print(e.read().decode())
except Exception as e:
    print("OTHER ERROR", str(e))
