"""Export original website monogram and OFL Manrope wordmark as outlined SVG.
Optional local authoring tool: requires fontTools and Brotli. Not part of production builds.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
root = Path(__file__).resolve().parent.parent
font = instantiateVariableFont(TTFont(root / 'assets/fonts/Manrope.woff2'), {'wght': 700})
glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
upem = font['head'].unitsPerEm
out = root / 'public/brand'
out.mkdir(exist_ok=True)
def word(text, baseline):
    result = []
    x = 170
    size = 72 / upem
    for letter in text:
        glyph = glyphs[cmap[ord(letter)]]
        pen = SVGPathPen(glyphs)
        glyph.draw(pen)
        result.append(f'<path d="{pen.getCommands()}" transform="translate({x:.4f} {baseline}) scale({size:.7f} {-size:.7f})"/>')
        x += glyph.width * size
    return ''.join(result)
for tone, colour in [('light', '#f5f2ea'), ('dark', '#283b31')]:
    mark = f'<g fill="none" stroke="{colour}" transform="translate(0 14) scale(4)"><path d="M6 6h10c14 0 20 26 0 26H6V6Z" stroke-width="2"/><path d="M13 32 27 6M19 22h11" stroke-width="1.3"/></g>'
    for kind in ['symbol', 'logo']:
        width = round(170 + max(sum(glyphs[cmap[ord(c)]].width for c in text) * 72 / upem for text in ["STUDIO", "DA'LO"]) + 24) if kind == 'logo' else 160
        paths = f'<g fill="{colour}">{word("STUDIO", 80)}{word("DA\u0027LO", 156)}</g>' if kind == 'logo' else ''
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="180" viewBox="0 0 {width} 180" role="img" aria-label="Studio Da’lo {kind}">{mark}{paths}</svg>'
        (out / f'{kind}-{tone}.svg').write_text(svg)
print('Four original, outlined logo SVG assets exported.')
