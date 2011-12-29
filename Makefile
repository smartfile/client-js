VERSION=1.0

min: smartfileapi.js
	yuicompressor -o smartfileapi.min.js smartfileapi.js

dist: min
	mkdir smartfileapi-$(VERSION)
	cp smartfileapi.min.js smartfileapi-$(VERSION)
	tar czf smartfileapi-$(VERSION).tar.gz smartfileapi-$(VERSION)/smartfileapi.min.js

clean:
	rm -rf smartfileapi-$(VERSION) smartfileapi.min.js smartfileapi-$(VERSION).tar.gz