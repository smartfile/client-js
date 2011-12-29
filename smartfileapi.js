
// Don't pollute the namespace or double-init.
var SmartFile = SmartFile || (function() {
    /* A class that emulates the XmlHttpRequest and XmlDomainRequest object.
     Used when neither can be used for cross-domain requests. */
    function JSONPRequest() {
    };

    JSONPRequest.prototype.open = function(method, url, async) {
        if (method != 'GET')
            throw "Method not supported.";
        // Generate random identifier for this call.
        this.random = 'jsonp_';
        for (var i = 0; i < 10; i++) {
            var r = Math.floor(Math.random() * 26);
            this.random += String.fromCharCode(65+r);
        }
        var prefix = '?';
        if (url.indexOf('?') != -1)
            prefix = '&';
        this.url = url + prefix + 'callback=' + this.random;
    };

    JSONPRequest.prototype.send = function(data) {
        // Set up callback.
        var _this = this;
        window[this.random] = function(json) {
            // Call the user's callback.
            _this.onreadystatechange(json);
            // Cleanup.
            delete window[_this.random];
            var sTag = document.getElementById(_this.random)
            document.getElementsByTagName('body')[0].removeChild(sTag);
        };
        // Create script tag.
        var sTag = document.createElement('script');
        sTag.setAttribute('id', this.random);
        sTag.setAttribute('type', 'text/javascript');
        sTag.setAttribute('src', this.url);
        // Insert script tag to start the request.
        document.getElementsByTagName('body')[0].appendChild(sTag);
        // TODO: handle failure by using onload? setTimeout()?
    };

    return {
        JSONPRequest: JSONPRequest,

        /* Creates a Request object of the correct type and performs an ajax call. */
        makeRequest: function(method, url, data, callback) {
            // TODO: determine if the call is cross-domain or not. If not, just use XmlHttpRequest.
            var request = null;
            if (XMLHttpRequest) {
                var request = new XMLHttpRequest();
                if (request.withCredentials === undefined) {
                    if (XDomainRequest)
                        request = XDomainRequest();
                    else
                        request = null;
                }
            }
            if (request == null) {
                request = JSONPRequest();
                request.onreadystatechange = callback;
            } else {
                request.onreadystatechange = function(e) {
                    if (request.readyState == 4) {
                        if (request.status >= 200 && request.status < 300)
                            callback(eval('(' + request.responseText + ')'));
                        // TODO: handle failure.
                    }
                }
            }
            if (request == 'GET')
                url += '?' + data;
            request.open(method, url, true);
            if (data && request != 'GET')
                request.send(data);
            else
                request.send();
            return request;
        }
    };
})();