SmartFile API Client (JavaScript)
=======

About
-----
This is a fully working API client for SmartFile. It allows you to interact with all objects within the SmartFile system via the REST API. This client library can be used as-is for your integration projects.

At this moment, we are still putting together the building blocks of the API client. For now, the library consists solely of an Ajax library that handles cross-domain calls using CORS or JSONP (whichever is available).

This will be the basic feature that allows the SmartFile API to be consumed by any other web application at any domain.

Usage
-----

To test the Ajax library:

python test.py
http://localhost:8000/test.html

Contributors
------------
 * Ben Timby <btimby@gmail.com>
