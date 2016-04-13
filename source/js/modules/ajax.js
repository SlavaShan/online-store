(function(window)
{
    var $ = window.DomDS,
        globalOptions = {};

    $.ajaxSetup = function(options)
    {
        if (options.type) {
            options.method = options.type;
        }
        forEach(options, function(option, value)
        {
            globalOptions[option] = value;
        });
    };

    $.ajax = function(options)
    {
        var defaults = {
            method: 'GET',
            data: false,
            async: true,
            cache: true,
            user: '',
            password: '',
            headers: {},
            xhrFields: {},
            statusCode: {},
            processData: true,
            dataType: 'text',
            contentType: 'application/x-www-form-urlencoded',
            timeout: 0
        };
        var callbacks = ['beforeSend', 'error', 'complete', 'success', 'statusCode'];

        if (options.type) {
            options.method = options.type;
        }

        // Merge global and defaults
        forEach(globalOptions, function(globalOptionName, globalOptionValue)
        {
            if (callbacks.indexOf(globalOptionName) < 0) {
                defaults[globalOptionName] = globalOptionValue;
            }
        });

        // Function to run XHR callbacks and events
        function fireAjaxCallback(eventName, eventData, callbackName)
        {
            var a = arguments;
            if (eventName) {
                $(document).trigger(eventName, eventData);
            }
            if (callbackName) {
                // Global callback
                if (callbackName in globalOptions) {
                    globalOptions[callbackName](a[3], a[4], a[5], a[6]);
                }
                // Options callback
                if (options[callbackName]) {
                    options[callbackName](a[3], a[4], a[5], a[6]);
                }
            }
        }

        // Merge options and defaults
        forEach(defaults, function(prop, defaultValue)
        {
            if (!(prop in options)) {
                options[prop] = defaultValue;
            }
        });

        // Default URL
        if (!options.url) {
            options.url = window.location.toString();
        }
        // Parameters Prefix
        var paramsPrefix = options.url.indexOf('?') >= 0 ? '&' : '?';

        // UC method
        var _method = options.method.toUpperCase();
        // Data to modify GET URL
        if ((_method === 'GET' || _method === 'HEAD' || _method === 'OPTIONS' || _method === 'DELETE') && options.data) {
            var stringData;
            if (isString(options.data)) {
                // Should be key=value string
                if (options.data.indexOf('?') >= 0) {
                    stringData = options.data.split('?')[1];
                } else {
                    stringData = options.data;
                }
            }
            else {
                // Should be key=value object
                stringData = serializeObject(options.data);
            }

            if (stringData.length) {
                options.url += paramsPrefix + stringData;
                if (paramsPrefix === '?') {
                    paramsPrefix = '&';
                }
            }
        }

        // Cache for GET/HEAD requests
        if (_method === 'GET' || _method === 'HEAD' || _method === 'OPTIONS' || _method === 'DELETE') {
            if (options.cache === false) {
                options.url += (paramsPrefix + '_nocache=' + Date.now());
            }
        }

        // Create XHR
        var xhr = new XMLHttpRequest();

        // Save Request URL
        xhr.requestUrl = options.url;
        xhr.requestParameters = options;

        // Open XHR
        xhr.open(_method, options.url, options.async, options.user, options.password);

        // Create POST Data
        var postData = null;

        if ((_method === 'POST' || _method === 'PUT') && options.data) {
            if (options.processData) {
                var postDataInstances = [ArrayBuffer, Blob, Document, FormData];
                // Post Data
                if (postDataInstances.indexOf(options.data.constructor) >= 0) {
                    postData = options.data;
                }
                else {
                    // POST Headers
                    var boundary = '---------------------------' + Date.now().toString(16);

                    if (options.contentType === 'multipart\/form-data') {
                        xhr.setRequestHeader('Content-Type', 'multipart\/form-data; boundary=' + boundary);
                    }
                    else {
                        xhr.setRequestHeader('Content-Type', options.contentType);
                    }
                    postData = '';
                    var _data = serializeObject(options.data);
                    if (options.contentType === 'multipart\/form-data') {
                        _data = _data.split('&');
                        var _newData = [];
                        for (var i = 0; i < _data.length; i++) {
                            _newData.push('Content-Disposition: form-data; name="' + _data[i].split('=')[0] + '"\r\n\r\n' + _data[i].split('=')[1] + '\r\n');
                        }
                        postData = '--' + boundary + '\r\n' + _newData.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';
                    }
                    else {
                        postData = options.contentType === 'application/x-www-form-urlencoded' ? _data : _data.replace(/&/g, '\r\n');
                    }
                }
            }
            else {
                postData = options.data;
            }

        }

        // Additional headers
        if (options.headers) {
            forEach(options.headers, function(headerName, headerCallback)
            {
                xhr.setRequestHeader(headerName, headerCallback);
            });
        }

        // Check for crossDomain
        if (typeof options.crossDomain === 'undefined') {
            options.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(options.url) && RegExp.$2 !== window.location.host;
        }

        if (!options.crossDomain) {
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }

        if (options.xhrFields) {
            forEach(options.xhrFields, function(fieldName, fieldValue)
            {
                xhr[fieldName] = fieldValue;
            });
        }

        var xhrTimeout;

        // Handle XHR
        xhr.onload = function(e)
        {
            if (xhrTimeout) {
                clearTimeout(xhrTimeout);
            }
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
                var responseData;
                if (options.dataType === 'json') {
                    try {
                        responseData = JSON.parse(xhr.responseText);
                        fireAjaxCallback('ajaxSuccess', {xhr: xhr}, 'success', responseData, xhr.status, xhr);
                    }
                    catch (err) {
                        fireAjaxCallback('ajaxError', {xhr: xhr, parseerror: true}, 'error', xhr, 'parseerror');
                    }
                }
                else {
                    responseData = xhr.responseType === 'text' || xhr.responseType === '' ? xhr.responseText : xhr.response;
                    fireAjaxCallback('ajaxSuccess', {xhr: xhr}, 'success', responseData, xhr.status, xhr);
                }
            }
            else {
                fireAjaxCallback('ajaxError', {xhr: xhr}, 'error', xhr, xhr.status);
            }
            if (options.statusCode) {
                if (globalOptions.statusCode && globalOptions.statusCode[xhr.status]) {
                    globalOptions.statusCode[xhr.status](xhr);
                }
                if (options.statusCode[xhr.status]) {
                    options.statusCode[xhr.status](xhr);
                }
            }
            fireAjaxCallback('ajaxComplete', {xhr: xhr}, 'complete', xhr, xhr.status);
        };

        xhr.onerror = function(e)
        {
            if (xhrTimeout) {
                clearTimeout(xhrTimeout);
            }
            fireAjaxCallback('ajaxError', {xhr: xhr}, 'error', xhr, xhr.status);
        };

        // Ajax start callback
        fireAjaxCallback('ajaxStart', {xhr: xhr}, 'start', xhr);
        fireAjaxCallback(undefined, undefined, 'beforeSend', xhr);


        // Send XHR
        xhr.send(postData);

        // Timeout
        if (options.timeout > 0) {

            xhr.onabort = function()
            {
                if (xhrTimeout) {
                    clearTimeout(xhrTimeout);
                }
            };
            xhrTimeout = setTimeout(function()
            {
                xhr.abort();
                fireAjaxCallback('ajaxError', {xhr: xhr, timeout: true}, 'error', xhr, 'timeout');
                fireAjaxCallback('ajaxComplete', {xhr: xhr, timeout: true}, 'complete', xhr, 'timeout');
            }, options.timeout);
        }

        // Return XHR object
        return xhr;
    };
    var methods = ['get', 'post', 'getJSON'];

    function createMethod(method)
    {
        $[method] = function(url, data, success, error)
        {
            return $.ajax({
                url: url,
                method: method === 'post' ? 'POST' : 'GET',
                data: isFunction(data) ? undefined : data,
                success: isFunction(data) ? data : success,
                error: isFunction(data) ? success : error,
                dataType: method === 'getJSON' ? 'json' : undefined
            });
        };
    }

    for (var i = 0; i < methods.length; i++) {
        createMethod(methods[i]);
    }

})(window);