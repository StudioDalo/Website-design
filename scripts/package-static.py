#!/usr/bin/env python3
"""Package only exported public website files for a browser-based static-host upload."""
import argparse
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, default=root.parent / 'studio-dalo-upload.zip')
args = parser.parse_args()
source = root / '.next-static'
if not (source / 'index.html').is_file() or not (source / '404.html').is_file():
    raise SystemExit('Run npm run build:static first.')
projects = list((source / 'work').glob('*/index.html'))
if not projects:
    raise SystemExit('The export contains no project pages.')
for path in source.rglob('*'):
    if path.is_file() and path.suffix in {'.html', '.txt', '.js'}:
        content = path.read_text(errors='replace')
        if 'Unpublished internal study' in content or '/private/unapproved' in content:
            raise SystemExit('Publication check failed: an excluded fixture reached the export.')
headers = '''/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Robots-Tag: noindex, nofollow
'''
with ZipFile(args.output, 'w', ZIP_DEFLATED) as package:
    for path in sorted(source.rglob('*')):
        if path.is_file():
            package.write(path, 'studio-dalo/' + path.relative_to(source).as_posix())
    package.writestr('studio-dalo/_headers', headers)
with ZipFile(args.output) as package:
    if package.testzip() is not None:
        raise SystemExit('Archive integrity check failed.')
    assert 'studio-dalo/index.html' in package.namelist()
    print(f'Upload archive verified: {len(package.namelist())} files, {len(projects)} project pages, {args.output.stat().st_size:,} bytes')
    print(args.output)
