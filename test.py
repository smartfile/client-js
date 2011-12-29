#!/bin/env python

import os, string, cgi, time, webbrowser, threading, socket
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

JSON = '{ text: "This is the response." }'
PORT = 8000

class LaunchBrowser(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.start()

    def run(self):
        while True:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            try:
                s.connect(('localhost', PORT))
                s.shutdown(2)
                break
            except:
                time.sleep(0.5)
        webbrowser.open('file://%s' % os.path.join(os.getcwd(), 'test.html'))


class TestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            try:
                self.path, qs = self.path.split('?', 2)
                qs = cgi.parse_qs(qs)
            except ValueError:
                qs = {}
            if self.path == '/ajax/':
                self.send_response(200)
                self.send_header('Content-type', 'text/javascript')
                if 'callback' in qs: #jsonp:
                    self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                if 'callback' in qs: #jsonp:
                    self.wfile.write('%s(%s);' % (qs['callback'][0], JSON))
                else:
                    self.wfile.write(JSON)
                return
        except Exception, e:
            self.send_error(500, str(e))
        self.send_error(404, 'File Not Found: %s' % self.path)

    def do_POST(self):
        self.send_error(404, 'File Not Found: %s' % self.path)


def main():
    try:
        launch = LaunchBrowser()
        server = HTTPServer(('localhost', PORT), TestHandler)
        server.serve_forever()
    except KeyboardInterrupt:
        server.socket.close()

if __name__ == '__main__':
    main()
