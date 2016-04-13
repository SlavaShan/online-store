"use strict";

module.exports = (function(global)
{

    /**
     * Get current timestamp
     * @type {Function}
     */
    var now = global.now = Date.now || function()
        {
            return new Date().getTime();
        };

    /**
     * Check if it is undefined value
     * @param value
     * @returns {boolean}
     */
    var isUndefined = global.isUndefined = function(value)
    {
        return value === void 0;
    };

    /**
     * Check if it is defined value
     * @param value
     * @returns {boolean}
     */
    var isDefined = global.isDefined = function(value)
    {
        return value !== 'undefined';
    };

    /**
     * Check if it is Object type
     * @param value
     * @returns {boolean}
     */
    var isObject = global.isObject = function(value)
    {
        return value !== null && typeof value === 'object';
    };

    /**
     * Check if it is String type
     * @param value
     * @returns {boolean}
     */
    var isString = global.isString = function(value)
    {
        return typeof value === 'string';
    };

    /**
     * Check if it is number type
     * @param value
     * @returns {boolean}
     */
    var isNumber = global.isNumber = function(value)
    {
        return typeof value === 'number';
    };

    /**
     * Check if it is Array type
     * @type {Function}
     */
    var isArray = global.isArray = Array.isArray;

    var isArrayLike = global.isArrayLike = function(obj)
    {
        var length = !!obj && "length" in obj && obj.length;

        if (isFunction(obj) || isWindow(obj)) {
            return false;
        }

        return isArray(obj) || length === 0 ||
            typeof isNumber(length) && length > 0 && ( length - 1 ) in obj;
    };

    /**
     * Check for function type
     * @param value
     * @returns {boolean}
     */
    var isFunction = global.isFunction = function(value)
    {
        return typeof value === 'function';
    };

    /**
     * Check if object is RegExp
     * @param value
     * @returns {boolean}
     */
    var isRegExp = global.isRegExp = function(value)
    {
        return toString.call(value) === '[object RegExp]';
    };

    /**
     * Check if object is window
     * @param obj
     * @returns {*|boolean}
     */
    var isWindow = global.isWindow = function(obj)
    {
        return obj && obj.window === obj;
    };

    /**
     * Check if object is document
     * @param obj
     * @returns {*|boolean}
     */
    var isDocument = global.isDocument = function(obj)
    {
        return obj && global.document === obj;
    };

    /**
     * Check if object is FormData**
     *   **FormData objects provide a way to easily construct a set of key/value pairs representing form fields and their values,
     *     which can then be easily sent using the XMLHttpRequest send() method
     * @param obj
     * @returns {boolean}
     */
    var isFormData = global.isFormData = function(obj)
    {
        return toString.call(obj) === '[object FormData]';
    };

    /**
     * Check for boolean type
     * @param value
     * @returns {boolean}
     */
    var isBoolean = global.isBoolean = function(value)
    {
        return typeof value === 'boolean';
    };

    /**
     * Converts the specified string to lowercase.
     * @param {string} string String to be converted to lowercase.
     * @returns {string} Lowercased string.
     */
    var lowercase = global.lowercase = function(string)
    {
        return isString(string) ? string.toLowerCase() : string;
    };

    /**
     * Converts the specified string to uppercase.
     * @param {string} string String to be converted to uppercase.
     * @returns {string} Uppercased string.
     */
    var uppercase = global.uppercase = function(string)
    {
        return isString(string) ? string.toUpperCase() : string;
    };

    /**
     * Converts first char in string to uppercase.
     * @param {string} string String to be converted to uppercase.
     * @returns {string} Uppercased string.
     */
    var ucfirst = global.ucfirst = function(string)
    {
        return isString(string) ? uppercase(string.charAt(0)) + string.slice(1) : string;
    };
    /**
     * Converts first char in string to lowercase.
     * @param {string} string String to be converted to uppercase.
     * @returns {string} Uppercased string.
     */
    var lcfirst = global.lcfirst = function(string)
    {
        return lowercase(string.charAt(0)) + string.substr(1);
    };

    /**
     * Converts the specified string to CamelCase.
     * @param {string} string String to be converted to CamelCase.
     * @returns {string} CamelCaseed string.
     */
    var toCamelCase = global.toCamelCase = function(string)
    {
        return string.indexOf('-') > 0 ? lowercase(string).replace(/^-ms-/, "ms-").replace(/-([a-z])/g, function(match, letter)
        {
            return uppercase(letter);
        }) : string;
    };

    /**
     * Noop function
     */
    var noop = global.noop = function()
    {
    };

    /**
     * For function calling
     */
    var slice = global.slice = [].slice,
        splice = global.splice = [].splice,
        push = global.push = [].push,
        toString = global.toString = Object.prototype.toString;

    /**
     * polyfill for Object.keys
     */
    if (!Object.keys) {
        Object.keys = function(object)
        {
            if (object !== Object(object)) {
                throw new TypeError('Object.keys called on a non-object');
            }
            var keys = [], prop;
            for (prop in object) {
                if (Object.prototype.hasOwnProperty.call(object, prop)) {
                    keys.push(prop);
                }
            }
            return keys;
        };
    }

    /**
     * Parse to int
     * @param str
     * @returns {number}
     */
    var toInt = global.toInt = function(str)
    {
        return parseInt(str, 10);
    };

    /**
     * Return rounded number
     * @param val
     * @returns {number}
     */
    var round = global.round = function(val)
    {
        return Math.floor(val);
    };

    /**
     * Trim string
     * @param value
     * @returns {*}
     */
    var trim = global.trim = function(value)
    {
        return isString(value) ? value.trim() : value;
    };

    /**
     * forEach implementation for objects and arrays
     * @param collection an array, nodeList or object
     * @param callback (value, key, array/obkect)
     * @param scope
     */
    var forEach = global.forEach = function(collection, callback)
    {
        if (toString.call(collection) === '[object Object]') {
            for (var prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(collection[prop], prop, collection[prop], collection);
                }
            }
        }
        else {
            for (var i = 0, len = collection.length; i < len; i++) {
                callback.call(collection[i], i, collection[i], collection);
            }
        }
    };

    var map = global.map = function(elements, callback)
    {
        var len,
            value,
            i = 0,
            res = [];

        if(isArrayLike(elements)) {
            len = elements.length;

            for(; i <len; i++) {
                value = callback(elements[i], i);

                if(value != null) {
                    res.push(value);
                }
            }
        } else {
            for (i in elements) {
                value = callback(elements[i], i);

                if(value != null) {
                    res.push(value);
                }
            }
        }

        return res;
    };

    /**
     * Merge arrays
     * @type {Function}
     */
    var merge = global.merge = function(first, second)
    {
        var len = +second.length,
            j = 0,
            i = first.length;

        for (; j < len; j++) {
            first[i++] = second[j];
        }

        first.length = i;

        return first;
    };

    /**
     * Extend object
     * @returns {*}
     */
    var extend = global.extend = function()
    {
        var target = arguments[0];
        var i = 1;
        var length = arguments.length;
        var deep = false;
        var options,
            source,
            copy,
            clone;

        if(isBoolean(target)) {
            deep = true;

            target = arguments[i] || {};
            i++;
        }

        if(!isObject(target) && !isFunction(target)) {
            target = {};
        }

        if(i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {

            if((options = arguments[i]) != null) {
                for (var key in options) {
                    source = target[key];
                    copy = options[key];

                    if ( target === copy ) {
                        continue;
                    }

                    if(deep && copy && isObject(copy) || (isObject(copy) || isArray(copy))) {
                        if(isArray(copy)) {
                            clone = source && isArray(source) ? source : [];
                        } else {
                            clone = source && isObject(source) ? source : {};
                        }

                        target[key] = extend(deep, clone, copy);
                    } else if(copy !== undefined) {
                        target[ key ] = copy;
                    }
                }
            }
        }

        return target;
    };

    /**
     * Same as PHP in_array()
     * @param obj    what you want to find
     * @param array  array where you want to find
     * @returns {boolean}
     */
    var in_array = global.in_array = function(obj, array)
    {
        return Array.prototype.indexOf.call(array, obj) != -1;
    };

    Array.prototype.in_array = function(val)
    {
        var array = this;
        for (var i = 0, l = array.length; i < l; i++) {
            if (array[i] == val) {
                return true;
            }
        }
        return false;
    };

    /**
     * reverse array
     * @returns {Array}
     */
    Array.prototype.reversedCopy = function()
    {
        var arr = [];
        for (var i = this.length; i--;) {
            arr.push(this[i]);
        }
        return arr;
    };

    /**
     * Remove value from array
     * @param array
     * @param value
     * @returns {*}
     */
    var arrayRemove = global.arrayRemove = function(array, value)
    {
        var index = array.indexOf(value);
        if (index >= 0) {
            array.splice(index, 1);
        }
        return index;
    };

    /**
     * Clone object
     * @param obj
     * @returns {{}}
     */
    var cloneObject = global.cloneObject = function(obj)
    {
        var clone = {};
        if (obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clone[key] = obj[key];
                }
            }
        }
        return clone;
    };

    var unique = global.unique = function(arr)
    {
        var unique = [];
        for (var i = 0; i < arr.length; i++) {
            if (unique.indexOf(arr[i]) === -1) {
                unique.push(arr[i]);
            }
        }
        return unique;
    };

    var toArray = global.toArray = function(arr)
    {
        var res = [];

        if (arr != null) {
            if (isArrayLike(Object(arr))) {
                merge(res, isString(arr) ? [arr] : arr);
            } else {
                push.call(res, arr);
            }
        }

        return res;
    };
    /**
     * Size of object like array length
     * @param obj
     * @returns {number}
     */
    Object.size = function(obj)
    {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    };

    /**
     * Parse UEL query to object (key=>value)
     *
     * @type {Function}
     * @returns {object}
     */
    var parseUrlQuery = global.parseUrlQuery = function(url)
    {
        var query = {}, i, params, param;
        if (url.indexOf('?') >= 0) {
            url = url.split('?')[1];
        } else {
            return query;
        }
        params = url.split('&');
        for (i = 0; i < params.length; i++) {
            param = params[i].split('=');
            query[param[0]] = param[1];
        }
        return query;
    };

    /**
     * Serialize object
     * usefull for building queries
     *
     * @type {Function}
     * @returns {string}
     */
    var serializeObject = global.serializeObject = function(obj, parents)
    {
        if (typeof obj === 'string') {
            return obj;
        }
        var resultArray = [];
        var separator = '&';
        parents = parents || [];
        var newParents;
        var varName = function(name)
        {
            if (parents.length > 0) {
                var _parents = '';
                for (var j = 0; j < parents.length; j++) {
                    if (j === 0) {
                        _parents += parents[j];
                    } else {
                        _parents += '[' + encodeURIComponent(parents[j]) + ']';
                    }
                }
                return _parents + '[' + encodeURIComponent(name) + ']';
            }
            else {
                return encodeURIComponent(name);
            }
        };
        var varValue = function(value)
        {
            return encodeURIComponent(value);
        };

        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                var toPush;
                if (isArray(obj[prop])) {
                    toPush = [];
                    for (var i = 0; i < obj[prop].length; i++) {
                        if (!isArray(obj[prop][i]) && typeof obj[prop][i] === 'object') {
                            newParents = parents.slice();
                            newParents.push(prop);
                            newParents.push(i + '');
                            toPush.push(serializeObject(obj[prop][i], newParents));
                        }
                        else {
                            toPush.push(varName(prop) + '[]=' + varValue(obj[prop][i]));
                        }

                    }
                    if (toPush.length > 0) {
                        resultArray.push(toPush.join(separator));
                    }
                }
                else if (typeof obj[prop] === 'object') {
                    // Object, convert to named array
                    newParents = parents.slice();
                    newParents.push(prop);
                    toPush = serializeObject(obj[prop], newParents);
                    if (toPush !== '') {
                        resultArray.push(toPush);
                    }
                }
                else if (typeof obj[prop] !== 'undefined' && obj[prop] !== '') {
                    // Should be string or plain value
                    resultArray.push(varName(prop) + '=' + varValue(obj[prop]));
                }
            }
        }
        return resultArray.join(separator);
    };

    var ua = global.ua = lowercase(navigator.userAgent);

    var browser = global.browser = {
        opera: global.opera,
        safari: (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0),
        webview: (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)),
        firefox: /Firefox/.test(ua),
        ie: /(msie|trident)/i.test(ua) && !this.opera
    };


    /**
     * Check if support touch events
     * @type {boolean}
     */
    var supportIeTouch = global.supportIeTouch = (global.navigator.msPointerEnabled || global.navigator.pointerEnabled);
    var supportTouch = global.supportTouch = !!(('ontouchstart' in global) || (global.DocumentTouch && document instanceof DocumentTouch) || supportIeTouch);

    var device = global.device = {
        ios: function()
        {
            var ipad = ua.match(/(ipad).*os\s([\d_]+)/),
                ipod = ua.match(/(ipod)(.*os\s([\d_]+))?/),
                iphone = !ipad && ua.match(/(iphone\sos)\s([\d_]+)/);
            return ipad || iphone || ipod;
        },
        android: ua.match(/(android);?[\s\/]+([\d.]+)?/)
    };

    var touchEvents = global.touchEvents = function(simulate)
    {
        var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];

        if (global.supportIeTouch) {
            desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
            if (global.navigator.pointerEnabled) {
                desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
            }
        }

        return {
            start: supportTouch || !simulate ? 'touchstart' : desktopEvents[0],
            move: supportTouch || !simulate ? 'touchmove' : desktopEvents[1],
            end: supportTouch || !simulate ? 'touchend' : desktopEvents[2]
        }
    };

    /**
     * Return ScrollBar width
     */
    var getScrollBarWidth = global.getScrollBarWidth = function()
    {
        var outer = document.createElement("div");

        outer.style.visibility = "hidden";
        outer.style.width = "100px";
        outer.style.msOverflowStyle = "scrollbar";

        document.body.appendChild(outer);

        var widthNoScroll = outer.offsetWidth;
        // force scrollbars
        outer.style.overflow = "scroll";

        // add innerdiv
        var inner = document.createElement("div");
        inner.style.width = "100%";
        outer.appendChild(inner);

        var widthWithScroll = inner.offsetWidth;

        // remove divs
        outer.parentNode.removeChild(outer);

        return widthNoScroll - widthWithScroll;
    };


    // deBounce for timeouted function
    var deBounce = global.deBounce = function(fn, delay) {
        var timer = null;

        return function () {
            var context = this;
            var args = arguments;

            window.clearTimeout(timer);

            timer = window.setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }


}(window));