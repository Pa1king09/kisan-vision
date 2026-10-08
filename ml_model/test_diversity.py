"""
Full-suite test: runs 8 diverse soil+season combinations against the local Flask server
and prints the Top-3 recommendations for each to verify diversity and realism.
"""
import urllib.request, json

def predict(payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        'http://127.0.0.1:5001/predict',
        data=data,
        headers={'Content-Type': 'application/json'}
    )
    res = urllib.request.urlopen(req).read()
    return json.loads(res.decode())

scenarios = [
    ("Sandy soil, Summer heat (Rajasthan-like)",
     dict(soil_type='Sandy', season='Summer', temperature=38, humidity=22, rainfall=0)),
    ("Clay soil, Monsoon (Kerala/Konkan)",
     dict(soil_type='Clay', season='Monsoon', temperature=28, humidity=88, rainfall=18)),
    ("Black soil, Winter (Madhya Pradesh)",
     dict(soil_type='Black', season='Winter', temperature=18, humidity=55, rainfall=2)),
    ("Loamy soil, Monsoon (Punjab)",
     dict(soil_type='Loamy', season='Monsoon', temperature=30, humidity=72, rainfall=12)),
    ("Red soil, Summer (Karnataka)",
     dict(soil_type='Red', season='Summer', temperature=33, humidity=40, rainfall=1)),
    ("Alluvial, Post-Monsoon (UP/Bihar)",
     dict(soil_type='Alluvial', season='Post-Monsoon', temperature=26, humidity=60, rainfall=4)),
    ("Raw numeric: rice-like conditions",
     dict(N=90, P=42, K=43, temperature=21, humidity=82, ph=6.5, rainfall=200)),
    ("Raw numeric: dry dryland pulse conditions",
     dict(N=20, P=20, K=20, temperature=38, humidity=28, ph=7.5, rainfall=60)),
]

print(f"{'SCENARIO':50s}  {'#1 CROP':30s} {'CONF':6s}  {'#2 CROP':30s} {'CONF':6s}  {'#3 CROP':30s} {'CONF':6s}")
print("-" * 175)
for label, payload in scenarios:
    r = predict(payload)
    crops = r.get('recommended_crops', [])
    def g(idx):
        if idx < len(crops):
            return crops[idx]['crop'], crops[idx]['confidence']
        return ('—', 0.0)
    c1, v1 = g(0); c2, v2 = g(1); c3, v3 = g(2)
    print(f"{label:50s}  {c1:30s} {v1:.3f}   {c2:30s} {v2:.3f}   {c3:30s} {v3:.3f}")
