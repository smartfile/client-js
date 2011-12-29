#!/bin/env python

import os, string, cgi, time, webbrowser
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

JSON = '{ text: "This is the response." }'

class TestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            self.path, qs = self.path.split('?', 2)
            qs = cgi.parse_qs(qs)
        except ValueError:
            qs = {}
        try:
            if self.path == '/ajax/':
                self.send_response(200)
                self.send_header('Content-type', 'text/javascript')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                if 'callback' in qs:
                    self.wfile.write('%s(%s);' % (qs['callback'][0], JSON))
                else:
                    self.wfile.write(JSON)
                return
            else:
                f = open(self.path[1:])
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(f.read())
                f.close()
                return
        except IOError:
            pass
        self.send_error(404,'File Not Found: %s' % self.path)

    def do_POST(self):
        self.send_error(404,'File Not Found: %s' % self.path)


def main():
    try:
        webbrowser.open('file://%s' % os.path.join(os.getcwd(), 'test.html'))
        server = HTTPServer(('localhost', 8000), TestHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        server.socket.close()

if __name__ == '__main__':
    main()
