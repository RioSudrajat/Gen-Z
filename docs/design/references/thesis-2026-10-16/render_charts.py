"""Render research figures from the saved public-data snapshot, not from AI mockups."""
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter, MultipleLocator

ROOT = Path(__file__).resolve().parent
data = json.loads((ROOT / "data.json").read_text(encoding="utf-8"))
INK, TEAL, GRAY, MUTED = "#111827", "#0F766E", "#667085", "#4B5563"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 12,
                     "text.color": INK, "axes.labelcolor": MUTED,
                     "xtick.color": MUTED, "ytick.color": INK,
                     "axes.spines.top": False, "axes.spines.right": False})

def finish(fig, name):
    fig.savefig(ROOT / f"{name}.png", dpi=170, facecolor="white")
    fig.savefig(ROOT / f"{name}.svg", facecolor="white")
    plt.close(fig)

countries = {row["code"]: row for row in data["countries"]}
rows = [("Indonesia", countries["IDN"]["kwh"]), ("World average", data["worldKwh"])]
rows += [(countries[c]["name"], countries[c]["kwh"]) for c in ["MYS", "CHN", "SGP", "USA"]]
fig, ax = plt.subplots(figsize=(12, 6.8))
fig.subplots_adjust(left=.18, right=.93, top=.79, bottom=.19)
ax.barh(range(len(rows)), [r[1] for r in rows], height=.48,
        color=[TEAL] + [GRAY] * (len(rows) - 1), zorder=3)
ax.set_yticks(range(len(rows)), [r[0] for r in rows])
ax.invert_yaxis()
ax.set_xlim(0, 14500)
ax.xaxis.set_major_locator(MultipleLocator(2000))
ax.xaxis.set_major_formatter(FuncFormatter(lambda x, _: f"{x:,.0f}"))
ax.set_xlabel("Electric power consumption (kWh per person per year)", labelpad=14)
ax.grid(axis="x", color="#E5E7EB", zorder=0)
ax.spines[["left", "bottom"]].set_visible(False)
ax.tick_params(axis="both", length=0, pad=9)
for y, (_, value) in enumerate(rows):
    ax.text(value + 160, y, f"{value:,.0f}", va="center", color=TEAL if y == 0 else INK)
fig.text(.18, .94, "Electricity consumed per person", fontsize=23, weight="bold")
fig.text(.18, .88, "2023 | Selected economies and world benchmark", color=MUTED)
fig.text(.18, .045, "Source: World Bank WDI, EG.USE.ELEC.KH.PC. Snapshot: 16 Oct 2026.\n"
         "Comparisons describe context; they do not establish a national consumption target.", fontsize=10, color=MUTED)
finish(fig, "chart-electricity-per-person")

fig, ax = plt.subplots(figsize=(12, 8.2))
fig.subplots_adjust(left=.13, right=.96, top=.81, bottom=.21)
offsets = {"IDN": (-5, 21), "VNM": (15, -13), "THA": (-2, 19),
           "MYS": (-55, 18), "CHN": (12, 0), "SGP": (-12, 18), "USA": (-85, -24)}
for row in data["countries"]:
    highlight = row["code"] == "IDN"
    ax.scatter(row["kwh"], row["gdp"], s=88, color=TEAL if highlight else GRAY,
               edgecolor="white", linewidth=1, zorder=4)
    ax.annotate(row["name"], (row["kwh"], row["gdp"]), xytext=offsets[row["code"]],
                textcoords="offset points", fontsize=11, color=TEAL if highlight else INK,
                weight="bold" if highlight else "normal",
                arrowprops={"arrowstyle": "-", "lw": .6, "color": GRAY}, zorder=5)
ax.set(xlim=(0, 14000), ylim=(0, 100000))
ax.xaxis.set_major_locator(MultipleLocator(2000))
ax.yaxis.set_major_locator(MultipleLocator(25000))
ax.xaxis.set_major_formatter(FuncFormatter(lambda x, _: f"{x:,.0f}"))
ax.yaxis.set_major_formatter(FuncFormatter(lambda y, _: f"${y:,.0f}"))
ax.set_xlabel("Electric power consumption (kWh per person per year)", labelpad=14)
ax.set_ylabel("GDP per capita (current US$)", labelpad=14)
ax.grid(color="#E5E7EB", linewidth=.7, zorder=0)
ax.spines[["left", "bottom"]].set_color("#D1D5DB")
fig.text(.13, .94, "Electricity use and GDP per person", fontsize=23, weight="bold")
fig.text(.13, .88, "2023 | Seven selected economies, equal-size markers, linear axes", color=MUTED)
fig.text(.13, .05, "Source: World Bank WDI, EG.USE.ELEC.KH.PC + NY.GDP.PCAP.CD. Snapshot: 16 Oct 2026.\n"
         "Selected-country comparison, not a global regression. Association does not establish causation.\n"
         "Nominal GDP is not PPP-adjusted; energy efficiency and economic structure also matter.", fontsize=10, color=MUTED)
finish(fig, "chart-electricity-gdp")

fig, ax = plt.subplots(figsize=(10, 6.6))
fig.subplots_adjust(left=.13, right=.77, top=.75, bottom=.25)
ax.bar(0, 100, width=.48, color=GRAY, zorder=3)
ax.bar(1, 200, width=.48, facecolor="none", edgecolor=TEAL, linewidth=2, hatch="//", zorder=3)
ax.annotate("", xy=(1, 228), xytext=(1, 196),
            arrowprops={"arrowstyle": "->", "color": TEAL, "linewidth": 2}, zorder=4)
ax.text(0, 109, "100", ha="center", fontsize=16, color=INK)
ax.text(1, 233, ">200", ha="center", fontsize=16, color=TEAL)
ax.set(ylim=(0, 255), xlim=(-.65, 1.65))
ax.set_xticks([0, 1], ["2024\nEstimated baseline", "2030\nBase Case projection"])
ax.set_ylabel("Index (2024 = 100)")
ax.yaxis.set_major_locator(MultipleLocator(50))
ax.grid(axis="y", color="#E5E7EB", zorder=0)
ax.spines[["left", "bottom"]].set_visible(False)
fig.text(.13, .94, "Data-centre electricity demand", fontsize=23, weight="bold")
fig.text(.13, .88, "Southeast Asia | More than double by 2030", fontsize=15, color=MUTED)
fig.text(.79, .47, ">2×", fontsize=34, color=TEAL, weight="bold")
fig.text(.79, .37, "Regional\ndata centres only", fontsize=12, color=MUTED)
fig.text(.13, .075, "Source: IEA, Energy and AI (2025), Base Case. Baseline: 2024.\n"
         "The outlined bar shows a lower bound, not an exact 2030 estimate.\n"
         "Not total regional electricity demand; no intermediate annual values are inferred.", fontsize=10, color=MUTED)
finish(fig, "chart-data-centre-demand")

def luminance(hex_value):
    channels = [int(hex_value[i:i+2], 16) / 255 for i in (1, 3, 5)]
    linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in channels]
    return sum(v * w for v, w in zip(linear, (.2126, .7152, .0722)))

for foreground, background in [(INK, "#FFFFFF"), (TEAL, "#FFFFFF"), (MUTED, "#FFFFFF"),
                               (GRAY, "#FFFFFF"), (TEAL, "#CCFBF1")]:
    a, b = sorted([luminance(foreground), luminance(background)])
    ratio = (b + .05) / (a + .05)
    print(f"{foreground} on {background}: {ratio:.2f}:1")
    assert ratio >= 4.5

assert len(countries) == 7
assert all(r["kwh"] > 0 and r["gdp"] > 0 for r in data["countries"])
print(f"World / Indonesia: {data['worldKwh'] / countries['IDN']['kwh']:.6f}")
print("Rendered all three figures from data.json.")
