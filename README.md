![SmartFile](https://www.smartfile.com/assets/img/logos/smartfile-logo-secondary.png)

SmartFile API Client (JavaScript)
====
Depreciated
-----
Development on this client will not continue. In the future, we will be working on a node client as an alternative.

About
-----
This is a fully working API client for SmartFile. It allows you to interact with all objects within the SmartFile system via the REST API. This client library can be used as-is for your integration projects.

At this moment, we are still putting together the building blocks of the API client. For now, the library consists solely of an Ajax library that handles cross-domain calls using CORS or JSONP (whichever is available).

This will be the basic feature that allows the SmartFile API to be consumed by any other web application at any domain.

Usage
-----

To test the Ajax library:

    $ python test.py

This will start a server for handling the ajax call. Your browser will be started and test.html will be loaded from the file system. This sets up a cross-domain ajax call (localsystem -> localhost).

Contributors
----
 * Ben Timby <btimby@gmail.com>
