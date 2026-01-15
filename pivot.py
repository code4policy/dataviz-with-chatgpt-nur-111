import pandas as pd
import matplotlib.pyplot as plt

# Change this if your filename is different
df = pd.read_csv("boston_311_2025.csv")

counts = df["reason"].value_counts().reset_index()
counts.columns = ["reason", "Count"]

top10 = counts.sort_values("Count", ascending=False).head(10)

print("\nTop 10 reasons (biggest → lowest):")
for i, row in enumerate(top10.itertuples(index=False), start=1):
    print(f"{i:>2}. {row.reason} — {row.Count:,}")

plt.figure(figsize=(12, 7))
plt.barh(top10["reason"][::-1], top10["Count"][::-1])
plt.xlabel("Number of 311 calls (past year)")
plt.ylabel("Reason")
plt.title("Boston 311 — Top 10 Reasons (Past Year)")
plt.tight_layout()
plt.savefig("top10_311_reasons.png", dpi=200)
plt.show()
