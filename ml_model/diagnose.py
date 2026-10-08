import pandas as pd
import numpy as np
import joblib

profiles = joblib.load('crop_profiles.pkl')
pp = profiles.get('Pigeon Peas (Tur/Arhar)')
print('Pigeon Peas (Tur/Arhar) crop profile:')
for feat, v in pp.items():
    print(f"  {feat:15s}: mean={v['mean']:7.2f} std={v['std']:6.2f} p10={v['p10']:7.2f} p90={v['p90']:7.2f}")

print()
mapped = {'N':20,'P':47,'K':17,'temperature':35,'humidity':49.5,'ph':6.0,'rainfall':220}
print('Mapped inputs:', mapped)
print()
print('Per-feature ACI contribution for Pigeon Peas:')
for feat in ['N','P','K','temperature','humidity','ph','rainfall']:
    val = mapped[feat]
    p10 = pp[feat]['p10']
    p90 = pp[feat]['p90']
    std = pp[feat]['std']
    if p10 <= val <= p90:
        score = 1.0
        flag = 'IN RANGE'
    else:
        dist = min(abs(val-p10), abs(val-p90))
        score = np.exp(-0.5*(dist/(std+1e-5))**2)
        flag = f'OUT (dist={dist:.1f})'
    print(f"  {feat:15s}: val={val:7.1f}  p10={p10:7.1f}  p90={p90:7.1f}  score={score:.4f}  {flag}")

# Now check how many other crops have ACI < 0.5 (meaning the ACI layer is amplifying Pigeon Peas)
le = joblib.load('label_encoder.pkl')
weights = {'N':1.0,'P':1.0,'K':1.0,'temperature':2.0,'humidity':1.5,'ph':2.0,'rainfall':2.0}
total_weight = sum(weights.values())

all_crops = le.classes_
count_below_04 = 0
count_below_05 = 0
count_above_08 = 0
for crop in all_crops:
    profile = profiles.get(crop)
    if not profile:
        continue
    aci = 0.0
    for feat, w in weights.items():
        val = float(mapped[feat])
        p10 = profile[feat]['p10']
        p90 = profile[feat]['p90']
        std = profile[feat]['std']
        if p10 <= val <= p90:
            f_score = 1.0
        else:
            dist = min(abs(val-p10), abs(val-p90))
            f_score = np.exp(-0.5*(dist/(std+1e-5))**2)
        aci += w * f_score
    aci /= total_weight
    if aci < 0.4:
        count_below_04 += 1
    if aci < 0.5:
        count_below_05 += 1
    if aci > 0.8:
        count_above_08 += 1

print(f"\nTotal crops: {len(all_crops)}")
print(f"Crops with ACI < 0.4 (heavily penalised): {count_below_04}")
print(f"Crops with ACI < 0.5: {count_below_05}")
print(f"Crops with ACI > 0.8 (amplified): {count_above_08}")
