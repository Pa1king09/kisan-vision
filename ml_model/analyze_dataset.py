import pandas as pd

df = pd.read_csv('crop_data.csv')

print("=== ALL CROPS ===")
print(sorted(df['label'].unique()))
print()

print("=== PER-CROP MEANS (N, P, K, temp, humidity, ph, rainfall) ===")
means = df.groupby('label')[['N','P','K','temperature','humidity','ph','rainfall']].mean().round(1)
print(means.to_string())
print()

print("=== JUTE ===")
print(df[df['label']=='jute'][['N','P','K','temperature','humidity','ph','rainfall']].describe().round(1).to_string())
print()

print("=== COFFEE ===")
print(df[df['label']=='coffee'][['N','P','K','temperature','humidity','ph','rainfall']].describe().round(1).to_string())
print()

print("=== GLOBAL DATASET RANGES ===")
print(df[['N','P','K','temperature','humidity','ph','rainfall']].describe().round(1).to_string())
