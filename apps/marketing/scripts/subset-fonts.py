"""Derive smaller WOFF2 files from the existing brand fonts; keep originals intact.

Optional asset maintenance tool, not part of the JavaScript build.
Requires fonttools and brotli; --dependencies can point to an isolated pip target.
"""
from pathlib import Path
import argparse
import sys

parser = argparse.ArgumentParser()
parser.add_argument('--dependencies', type=Path)
args = parser.parse_args()
if args.dependencies:
    sys.path.insert(0, str(args.dependencies.resolve()))

from fontTools import subset
from fontTools.ttLib import TTFont

assets = Path(__file__).resolve().parents[1] / 'public' / 'assets'
destination = assets / 'fonts'
destination.mkdir(exist_ok=True)
sources = {
    'display-latin.woff2': 'reference-fonts/ondo-sans-medium.woff2',
    'ui-latin.woff2': 'reference-fonts/gellix-medium.woff2',
    'editorial-latin.woff2': 'reference-fonts/arizona-regular.woff2',
    'audience-display-latin.woff2': 'serve-fonts/sora-semibold.ttf',
    'audience-regular-latin.woff2': 'serve-fonts/geist-regular.ttf',
    'audience-semibold-latin.woff2': 'serve-fonts/geist-semibold.ttf',
}
characters = set(range(0x20, 0x100)) | set(range(0x2000, 0x2070)) | set(range(0x2190, 0x2200)) | {0x20AC, 0x2212, 0xFEFF}
for name, source in sources.items():
    font = TTFont(assets / source)
    metrics = {codepoint: font['hmtx'].metrics[glyph] for codepoint, glyph in font.getBestCmap().items() if codepoint in characters}
    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_legacy = True
    options.name_languages = ['*']
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=characters)
    subsetter.subset(font)
    font.flavor = 'woff2'
    target = destination / name
    font.save(target)
    result = TTFont(target)
    for codepoint, glyph in result.getBestCmap().items():
        assert result['hmtx'].metrics[glyph] == metrics[codepoint], f'Changed glyph advance: {name} U+{codepoint:04X}'
    print(f'{source}: {(assets / source).stat().st_size} -> {target.stat().st_size} bytes; glyph metrics preserved')
