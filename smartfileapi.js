
/* A class that emulates the XmlHttpRequest and XmlDomainRequest object.
 Used when neither can be used for cross-domain requests.
*/
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
        _this.onreadystatechange(json);
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
};

/* Creates a Request object of the correct type and performs an ajax call.
*/
var makeRequest = function(method, url, data, callback) {
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
        request.onreadystatechange = function(xhr) {
            if (request.readyState == 4)
                callback(eval('(' + request.responseText + ')'));
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
