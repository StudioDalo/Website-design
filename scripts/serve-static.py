#!/usr/bin/env python3
"""Local verification server for the exported upload package, including its 404 page."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

class StaticHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Match Netlify's /admin/* SPA fallback for dashboard verification.
        path = self.path.split('?', 1)[0]
        if path.startswith('/admin/') and not Path(self.translate_path(path)).exists():
            self.path = '/admin/index.html'
        super().do_GET()

    def send_error(self, code, message=None, explain=None):
        page = Path(self.directory) / '404.html'
        if code == 404 and page.is_file():
            body = page.read_bytes()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--directory', default='.next-static')
    parser.add_argument('--port', type=int, default=3100)
    args = parser.parse_args()
    root = Path(args.directory).resolve()
    if not (root / 'index.html').is_file():
        raise SystemExit('Build the static export first: npm run build:static')
    server = ThreadingHTTPServer(('127.0.0.1', args.port), partial(StaticHandler, directory=str(root)))
    print(f'Static package verification server ready on port {args.port}', flush=True)
    server.serve_forever()
