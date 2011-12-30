
// Don't pollute the namespace or double-init.
var SmartFile = SmartFile || (function() {
    Function.prototype.proxy = function(a, b) {
        b = this;
        return function() {
            b.apply(a,arguments);
        }
    };

    /* A class that emulates the XmlHttpRequest and XmlDomainRequest object.
     Used when neither can be used for cross-domain requests. */
    var JSONPRequest = function(options) {
        if (options.method != 'GET')
            throw "Method not supported.";
        this.options = options;
        this.timer = null;
        // Generate random identifier for this call.
        this.random = 'jsonp_';
        for (var i = 0; i < 10; i++) {
            var r = Math.floor(Math.random() * 26);
            this.random += String.fromCharCode(65+r);
        }
    };

    JSONPRequest.prototype.open = function() {
        return;
    };

    JSONPRequest.prototype.send = function(data) {
        // Set up callback.
        window[this.random] = (function(json) {
            this.onsuccess(json);
        }).proxy(this);
        // Create script tag.
        var url = this.options.url;
        var prefix = '?';
        if (url.indexOf(prefix) != -1)
            prefix = '&';
        url += prefix + 'callback=' + this.random;
        var sTag = document.createElement('script');
        sTag.setAttribute('id', this.random);
        sTag.setAttribute('type', 'text/javascript');
        sTag.setAttribute('src', url);
        // Insert script tag to start the request.
        document.getElementsByTagName('body')[0].appendChild(sTag);
        // Set timeout to handle error conditions.
        this.timer = window.setTimeout((function() {
            this.onfailure();
        }).proxy(this), 10000);
    };

    JSONPRequest.prototype.onsuccess = function(json) {
        if (typeof this.options.success == "function") {
            // Don't let errors in the callback derail us.
            try {
                this.options.success(json);
            } catch (e) {}
        }
        this.done();
    };

    JSONPRequest.prototype.onfailure = function() {
        if (typeof this.options.failure == "function") {
            // Don't let errors in the callback derail us.
            try {
                this.options.failure();
            } catch (e) {}
        }
        this.done();
    };

    JSONPRequest.prototype.done = function() {
        // Cleanup, don't die if we cleanup twice.
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
        if (window[this.random])
            delete window[this.random];
        var sTag = document.getElementById(this.random);
        if (sTag)
            document.getElementsByTagName('body')[0].removeChild(sTag);
    };

    var XHRRequest = function(options, request) {
        this.options = options;
        if (!request)
            request = new XMLHttpRequest();
        this.request = request;
    };

    XHRRequest.prototype.open = function() {
        this.request.open(this.options.method, this.options.url, true);
        this.request.withCredentials = true;
        this.request.onreadystatechange = (function() {
            this.onreadystatechange();
        }).proxy(this);
    };

    XHRRequest.prototype.send = function() {
        this.request.send(this.options.data);
    };

    XHRRequest.prototype.onreadystatechange = function(e) {
        if (this.request.readyState == 4) {
            var failure = false;
            if (200 >= this.request.status < 300) {
                var json;
                try {
                    json = eval('(' + this.request.responseText + ')');
                } catch (e) {
                    failure = true;
                }
                if (!failure)
                    this.onsuccess(json);
            } else
                failure = true;
            if (failure)
                this.onfailure();
        }
    };

    XHRRequest.prototype.onsuccess = function(json) {
        if (typeof this.options.success == "function") {
            // Don't let errors in the callback derail us.
            try {
                this.options.success(json);
            } catch (e) {}
        }
    };

    XHRRequest.prototype.onfailure = function() {
        if (typeof this.options.failure == "function") {
            // Don't let errors in the callback derail us.
            try {
                this.options.failure();
            } catch (e) {}
        }
    };

    return {
        /* Creates a Request object of the correct type and performs an ajax call. */
        makeRequest: function(options) {
            if (!options.method)
                throw "Missing required parameter method";
            if (!options.url)
                throw "Missing required parameter url";
            if (options.data && options.method == 'GET') {
                var prefix = '?';
                if (options.url.indexOf(prefix) != -1)
                    prefix = '&';
                options.url += prefix + data;
                options.data = null;
            }
            var local = false;
            var prot = new RegExp('^https://');
            if (prot.test(options.url)) {
                var host = new RegExp(location.host);
                if (!host.test(options.url))
                    local = false;
            }
            var request = new XMLHttpRequest();
            if (local || request.withCredentials !== undefined)
                request = new XHRRequest(options, request);
            else
                request = new JSONPRequest(options);
            request.open();
            request.send();
            return request;
        },

        User: {
        },

        Site: {
        },

        Path: {
        }
    };
})();