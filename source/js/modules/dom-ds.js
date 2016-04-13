"use strict";

/**
 * DOM manipulating
 *
 * @note  NodeList means that it is DomDS Object with array of Elements
 *
 *
 */
(function(window, document, undefined)
{
    /**
     * DomDS Object
     */
    var DomDS = (function()
    {
        /**
         * Constructor with array emulation for NodeList
         * @param arr
         * @returns {DomDS}
         * @constructor
         */
        var DomDS = function(arr)
            {
                var _this = this, i;

                for (i = 0; i < arr.length; i++) {
                    _this[i] = arr[i];
                }
                _this.length = arr.length;

                return this;
            },
            /**
             * General Selector with chaining methods
             */
            $ = function(selector, context)
            {
                var arr = [], i = 0;
                if (selector && !context) {
                    if (selector instanceof DomDS) {
                        return selector;
                    }
                }
                if (selector) {
                    if (isString(selector)) {
                        var els, tempParent, html = selector.trim();
                        if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                            var toCreate = 'div';

                            // If html is children of list,table or select create temporary parent
                            if (html.indexOf('<li') === 0) {
                                toCreate = 'ul';
                            }
                            if (html.indexOf('<tr') === 0) {
                                toCreate = 'tbody';
                            }
                            if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) {
                                toCreate = 'tr';
                            }
                            if (html.indexOf('<tbody') === 0) {
                                toCreate = 'table';
                            }
                            if (html.indexOf('<option') === 0) {
                                toCreate = 'select';
                            }

                            tempParent = document.createElement(toCreate);
                            tempParent.innerHTML = selector;
                            for (i = 0; i < tempParent.childNodes.length; i++) {
                                arr.push(tempParent.childNodes[i]);
                            }
                        }
                        else {
                            // if id without other selectors use pure getElementById
                            if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                                els = [document.getElementById(selector.split('#')[1])];
                            }
                            // if class without other selectors use pure getElementsByClassName
                            else {
                                if (selector[0] === '#' && !selector.match(/[#<>:~]/)) {
                                    els = (context || document).getElementsByClassName(selector.replace(/[\. ]+/gi, '').replace(/[,]+/gi, ' '));
                                }
                                else {
                                    // css selectors
                                    els = (context || document).querySelectorAll(selector);
                                }
                            }
                            for (i = 0; i < els.length; i++) {
                                if (els[i]) {
                                    arr.push(els[i]);
                                }
                            }
                        }
                    }
                    // Node/element
                    else {
                        if (selector.nodeType || isWindow(selector) || isDocument(selector)) {
                            arr.push(selector);
                        }
                        //Array of elements or instance of Dom
                        else {
                            if (selector.length > 0 && selector[0].nodeType) {
                                for (i = 0; i < selector.length; i++) {
                                    arr.push(selector[i]);
                                }
                            }
                        }
                    }
                }
                return new DomDS(arr);
            };

        DomDS.prototype = {
            /**
             * forEach for NodeList
             */
            each: function(callback)
            {
                for (var i = 0; i < this.length; i++) {
                    callback.call(this[i], i, this[i]);
                }

                return this;
            },
            /**
             * NodeList class manipulation
             */
            addClass: function(className)
            {
                if (typeof className === 'undefined') {
                    return this;
                }

                className = className.replace(/\./gi, '');
                var classes = className.split(' ');
                for (var i = 0, l = classes.length; i < l; i++) {
                    for (var j = 0, h = this.length; j < h; j++) {
                        if (isDefined(this[j].classList)) {
                            this[j].classList.add(classes[i]);
                        }
                        else {
                            if (!$(this[j]).hasClass(classes[i])) {
                                this[j].className += " " + classes[i];
                            }
                        }
                    }
                }

                return this;
            },
            removeClass: function(className)
            {
                className = className.replace(/\./g, '');
                var classes = className.split(' ');
                for (var i = 0, l = classes.length; i < l; i++) {
                    for (var j = 0, h = this.length; j < h; j++) {
                        if (isDefined(this[j].classList)) {
                            this[j].classList.remove(classes[i]);
                        }
                        else {
                            if ($(this[j]).hasClass(classes[i])) {
                                var reg = new RegExp('(\\s|^)' + classes[i] + '(\\s|$)');
                                this[j].className = this[j].className.replace(reg, ' ');
                            }
                        }
                    }
                }

                return this;
            },
            changeClass: function(classNameOld, classNameNew)
            {
                this.removeClass(classNameOld);
                this.addClass(classNameNew);

                return this;
            },
            hasClass: function(className)
            {
                className = className.replace(/\./g, '');
                if (!this[0]) {
                    return false;
                }
                if (isDefined(this[0].classList)) {
                    return this[0].classList.contains(className);
                }

                return !!this[0].className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
            },
            toggleClass: function(className)
            {
                className = className.replace(/\./g, '');
                var classes = className.split(' ');
                for (var i = 0, l = classes.length; i < l; i++) {
                    for (var j = 0, h = this.length; j < h; j++) {
                        if (isDefined(this[j].classList)) {
                            this[j].classList.toggle(classes[i]);
                        }
                        else {
                            if ($(this[j]).hasClass(classes[i])) {
                                $(this[j]).removeClass(classes[i]);
                            }
                            else {
                                $(this[j]).addClass(classes[i]);
                            }
                        }

                    }
                }

                return this;
            },
            /**
             * Events for NodeList
             */
            on: function(eventName, targetSelector, listener, capture)
            {
                function handleLiveEvent(e)
                {
                    var target = e.target;
                    if ($(target).is(targetSelector)) {
                        listener.call(target, e);
                    }
                    else {
                        var parents = $(target).parents();
                        for (var k = 0; k < parents.length; k++) {
                            if ($(parents[k]).is(targetSelector)) {
                                listener.call(parents[k], e);
                            }
                        }
                    }
                }

                var events = eventName.split(' '),
                    i,
                    l,
                    j,
                    h;
                for (i = 0, l = this.length; i < l; i++) {
                    if (isFunction(targetSelector) || targetSelector === false) {
                        if (isFunction(targetSelector)) {
                            listener = arguments[1];
                            capture = arguments[2] || false;
                        }
                        for (j = 0, h = events.length; j < h; j++) {
                            this[i].addEventListener(events[j], listener, capture);
                        }
                    }
                    else {
                        for (j = 0, h = events.length; j < h; j++) {
                            if (!this[i].domDSListeners) {
                                this[i].domDSListeners = [];
                            }
                            this[i].domDSListeners.push({
                                listener: listener,
                                liveListener: handleLiveEvent
                            });
                            this[i].addEventListener(events[j], handleLiveEvent, capture);
                        }
                    }
                }

                return this;
            },
            off: function(eventName, targetSelector, listener, capture)
            {
                var events = eventName.split(' ');

                for (var i = 0, l = events.length; i < l; i++) {
                    for (var j = 0, h = this.length; j < h; j++) {
                        if (isFunction(targetSelector) || targetSelector === false) {
                            if (isFunction(targetSelector)) {
                                listener = arguments[1];
                                capture = arguments[2] || false;
                            }
                            this[j].removeEventListener(events[i], listener, capture);
                        }
                        else {
                            if (this[j].domDSListeners) {
                                for (var k = 0; k < this[j].domDSListeners.length; k++) {
                                    if (this[j].domDSListeners[k].listener === listener) {
                                        this[j].removeEventListener(events[i], this[j].domDSListeners[k].liveListener, capture);
                                    }
                                }
                            }
                        }
                    }
                }

                return this;
            },
            one: function(eventName, targetSelector, listener, capture)
            {
                var dom = this;

                if (isFunction(targetSelector)) {
                    listener = arguments[1];
                    capture = arguments[2];
                    targetSelector = false;
                }

                function proxy(e)
                {
                    listener.call(e.target, e);
                    dom.off(eventName, targetSelector, proxy, capture);
                }

                return dom.on(eventName, targetSelector, proxy, capture);
            },
            trigger: function(eventName, eventData)
            {
                var events = eventName.split(' ');

                for (var i = 0, l = events.length; i < l; i++) {
                    for (var j = 0, h = this.length; j < h; j++) {
                        var evt;
                        try {
                            evt = (function()
                            {
                                function CustomEvent(event, params)
                                {
                                    params = params || {
                                            bubbles: false,
                                            cancelable: false,
                                            detail: undefined
                                        };
                                    var _event = document.createEvent('CustomEvent');
                                    _event.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                                    return _event;
                                }

                                CustomEvent.prototype = window.Event.prototype;

                                return new CustomEvent(events[i], {
                                    detail: eventData,
                                    bubbles: eventData.bubbles || false,
                                    cancelable: true
                                });
                            })();
                        }
                        catch (e) {
                            evt = document.createEvent('Event');
                            evt.initEvent(events[i], true, true);
                            evt.detail = eventData;
                        }

                        this[j].dispatchEvent(evt);
                    }
                }

                return this;
            },
            /**
             * NodeList Attributes
             */
            attr: function(attrs, value)
            {
                if (arguments.length === 1 && isString(attrs)) {
                    // Get attr
                    if (this[0]) {
                        return this[0].getAttribute(attrs);
                    }
                    return undefined;
                }
                for (var i = 0; i < this.length; i++) {
                    if (arguments.length === 2) {
                        // String
                        this[i].setAttribute(attrs, value);
                    }
                    else {
                        if (isObject(attrs)) {
                            for (var attrName in attrs) {
                                this[i][attrName] = attrs[attrName];
                                this[i].setAttribute(attrName, attrs[attrName]);
                            }
                        }
                    }
                }

                return this;
            },
            removeAttr: function(attr)
            {
                for (var i = 0; i < this.length; i++) {
                    this[i].removeAttribute(attr);
                }

                return this;
            },
            prop: function(props, value)
            {
                if (arguments.length === 1 && isString(props)) {
                    // Get prop
                    if (this[0]) {
                        return this[0][props];
                    }

                    return undefined;
                }
                for (var i = 0; i < this.length; i++) {
                    if (arguments.length === 2) {
                        // String
                        this[i][props] = value;
                    }
                    else {
                        // Object
                        for (var propName in props) {
                            this[i][propName] = props[propName];
                        }
                    }
                }

                return this;
            },
            /**
             * NodeList data
             */
            data: function(key, value)
            {
                if (typeof value === 'undefined') {
                    // Get value
                    if (this[0]) {
                        if (this[0].domDSdata && (key in this[0].domDSdata)) {
                            return this[0].domDSdata[key];
                        }

                        var dataKey = this[0].getAttribute('data-' + key);
                        if (dataKey) {
                            this.data(key, dataKey);

                            return dataKey;
                        }

                        return undefined;
                    }

                    return undefined;
                }

                for (var i = 0; i < this.length; i++) {
                    var el = this[i];
                    if (!el.domDSdata) {
                        el.domDSdata = {};
                    }
                    el.domDSdata[key] = value;
                }

                return this;
            },
            removeData: function(key)
            {
                for (var i = 0; i < this.length; i++) {
                    var el = this[i];

                    if (el.domDSdata && el.domDSdata[key]) {
                        el.domDSdata[key] = null;
                    }

                    if (el.getAttribute('data-' + key)) {
                        el.removeAttribute('data-' + key);
                    }
                }
            },
            dataset: function()
            {
                var el = this[0];
                if (el) {
                    var dataset = {};
                    if (el.dataset) {
                        for (var dataKey in el.dataset) {
                            dataset[dataKey] = el.dataset[dataKey];
                        }
                    }
                    else {
                        for (var i = 0; i < el.attributes.length; i++) {
                            var attr = el.attributes[i];
                            if (attr.name.indexOf('data-') >= 0) {
                                dataset[toCamelCase(attr.name.split('data-')[1])] = attr.value;
                            }
                        }
                    }
                    for (var key in dataset) {
                        if (dataset[key] === 'false') {
                            dataset[key] = false;
                        }
                        else {
                            if (dataset[key] === 'true') {
                                dataset[key] = true;
                            }
                            else {
                                if (parseFloat(dataset[key]) === dataset[key] * 1) {
                                    dataset[key] = dataset[key] * 1;
                                }
                            }
                        }
                    }
                    return dataset;
                }
                return undefined;
            },
            /**
             *
             * NodeList first element value
             */
            val: function(value)
            {
                if (typeof value === 'undefined') {
                    if (this[0]) {
                        return this[0].value;
                    }
                    return undefined;
                }
                for (var i = 0; i < this.length; i++) {
                    this[i].value = value;
                }
                return this;
            },
            /**
             * NodeList size
             */
            width: function()
            {
                if (isWindow(this[0])) {
                    return window.innerWidth;
                }
                if (this.length > 0) {
                    return parseFloat(this.css('width'));
                }
                return null;
            },
            height: function()
            {
                if (isWindow(this[0])) {
                    return window.innerHeight;
                }
                if (this.length > 0) {
                    return parseFloat(this.css('height'));
                }
                return null;
            },
            outerWidth: function(includeMargins)
            {
                if (this.length > 0) {
                    if (includeMargins) {
                        var styles = this.styles();
                        return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
                    }
                    return this[0].offsetWidth;
                }
                return null;
            },
            outerHeight: function(includeMargins)
            {
                if (this.length > 0) {
                    if (includeMargins) {
                        var styles = this.styles();
                        return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
                    }
                    return this[0].offsetHeight;
                }
                return null;
            },
            /**
             * NodeLists first Element offsets
             */
            offset: function()
            {
                if (this.length > 0) {
                    var element = this[0];

                    var offsetTop = 0;
                    var offsetLeft = 0;

                    do {
                        if (!isNaN(element.offsetTop)) {
                            offsetTop += element.offsetTop;
                        }
                        if (!isNaN(element.offsetLeft)) {
                            offsetLeft += element.offsetLeft;
                        }
                    } while (element = element.offsetParent);

                    return {
                        top: offsetTop,
                        left: offsetLeft
                    };
                }

                return null;
            },
            /**
             * Return true if element is visible in viewport
             * @param offset
             */
            visible: function(offset)
            {
                if (this.length < 1) {
                    return this;
                }

                offset = offset || 0;

                var _this = this.length > 1 ? this.eq(0) : this;

                var elementWidth = _this.width();
                var elementHeight = _this.height();
                var elementOffset = _this.offset();

                var _window = $(window);
                var viewportHeight = _window.height();
                var viewportWidth = _window.width();
                var scrollTop = _window[0].pageYOffset;
                var scrollLeft = _window[0].pageXOffset;


                return (scrollTop < elementOffset.top + elementHeight + offset) && // element above top
                    (viewportWidth + scrollLeft > elementOffset.left - offset) && // element above right
                    (viewportHeight + scrollTop > elementOffset.top - offset) && // element above bottom
                    (scrollLeft < elementOffset.left + elementWidth + offset); // element above left
            },
            /**
             * Show all elements of NodeList
             */
            show: function(boost)
            {
                return this.css('display') === 'none' && !boost ? this.css('display', '') : this.css('display', 'block');
            },
            /**
             * Hide all elements of NodeList
             */
            hide: function()
            {
                return this.css('display', 'none');
            },
            /**
             * NodeList styles manipulation
             *
             * Get all styles
             * @returns {*}
             */
            styles: function()
            {
                if (this[0]) {
                    return window.getComputedStyle(this[0], null);
                }
                return undefined;
            },
            /**
             * Get or set css properties
             * @param props
             * @param value
             * @returns {*}
             */
            css: function(props, value)
            {
                var i;
                if (arguments.length === 1) {
                    if (isString(props)) {
                        props = vendorCss(props);
                        if (this[0]) {
                            return window.getComputedStyle(this[0], null).getPropertyValue(props);
                        }
                    }
                    else {
                        for (i = 0; i < this.length; i++) {
                            for (var prop in props) {
                                this.css(prop, props[prop]);
                            }
                        }
                        return this;
                    }
                }
                if (arguments.length === 2 && isString(props)) {
                    props = vendorCss(toCamelCase(props));
                    for (i = 0; i < this.length; i++) {
                        this[i].style[props] = value;
                    }
                    return this;
                }
                return this;
            },
            /**
             * Map trought NodeList
             */
            map: function(callback)
            {
                return $(map(this, function(elem, i)
                {
                    return callback.call(elem, i, elem);
                }));
            },
            /**
             * Get new filtered NodeList
             */
            filter: function(callback)
            {
                var matchedItems = [];
                var dom = this;
                for (var i = 0; i < dom.length; i++) {
                    if (callback.call(dom[i], i, dom[i])) {
                        matchedItems.push(dom[i]);
                    }
                }

                return $(matchedItems);
            },
            /**
             * innerHTML for NodeList
             */
            html: function(html)
            {
                if (typeof html === 'undefined') {
                    return this[0] ? this[0].innerHTML : undefined;
                }
                for (var i = 0; i < this.length; i++) {
                    this[i].innerHTML = html;
                }
                return this;
            },
            /**
             * innerText for NodeList
             */
            text: function(text)
            {
                if (typeof text === 'undefined') {
                    if (this[0]) {
                        return trim(this[0].textContent);
                    }
                    return null;
                }
                for (var i = 0; i < this.length; i++) {
                    this[i].textContent = text;
                }

                return this;
            },
            /**
             * Test NodeList for matching selector
             */
            is: function(selector)
            {
                if (!this[0] || typeof selector === 'undefined') {
                    return false;
                }
                var compareWith, i;
                if (isString(selector)) {
                    var el = this[0];

                    if (isDocument(el)) {
                        return isDocument(selector);
                    }

                    if (isWindow(el)) {
                        return isWindow(selector);
                    }

                    if (el.matches) {
                        return el.matches(selector);
                    }

                    var matches = vendorJs('matchesSelector', el);
                    if (el[matches]) {
                        return el[matches](selector);
                    }
                    compareWith = $(selector);
                    for (i = 0; i < compareWith.length; i++) {
                        if (compareWith[i] === this[0]) {
                            return true;
                        }
                    }
                    return false;
                }

                if (isDocument(selector)) {
                    return isDocument(this[0]);
                }
                if (isWindow(selector)) {
                    return isWindow(this[0]);
                }
                if (selector.nodeType || selector instanceof DomDS) {
                    compareWith = selector.nodeType ? [selector] : selector;
                    for (i = 0; i < compareWith.length; i++) {
                        if (compareWith[i] === this[0]) {
                            return true;
                        }
                    }
                    return false;
                }
                return false;
            },
            /**
             * Get index of element from NodeList
             */
            indexOf: function(el)
            {
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === el) {
                        return i;
                    }
                }
            },
            /**
             * Get relative to siblings position of the first element from NodeList
             */
            index: function()
            {
                if (this[0]) {
                    var child = this[0];
                    var i = 0;
                    while ((child = child.previousSibling) !== null) {
                        if (child.nodeType === 1) {
                            i++;
                        }
                    }
                    return i;
                }
                return undefined;
            },
            /**
             * Get new NodeList with element, that has index in NodeList
             */
            eq: function(index)
            {
                if (typeof index === 'undefined') {
                    return this;
                }

                var length = this.length;
                var returnIndex;
                if (index > length - 1) {
                    return new DomDS([]);
                }
                if (index < 0) {
                    returnIndex = length + index;
                    if (returnIndex < 0) {
                        return new DomDS([]);
                    }
                    return new DomDS([this[returnIndex]]);
                }
                return new DomDS([this[index]]);
            },
            /**
             * Get first element
             * @returns {*}
             */
            first: function()
            {
                return this.eq(0);
            },
            /**
             * Get last element
             * @returns {*}
             */
            last: function()
            {
                return this.eq(-1);
            },
            /**
             * Clone DomDS object
             * @returns {DomDS}
             */
            clone: function()
            {
                var clones = [];
                this.each(function()
                {
                    clones.push(this.cloneNode(true));
                });
                return new DomDS(clones);
            },
            /**
             * Insert newChild as the last child of each element in NodeList
             */
            append: function(newChild)
            {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (isString(newChild)) {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        while (tempDiv.firstChild) {
                            this[i].appendChild(tempDiv.firstChild);
                        }
                    }
                    else {
                        if (newChild instanceof DomDS) {
                            for (j = 0; j < newChild.length; j++) {
                                this[i].appendChild(newChild[j]);
                            }
                        }
                        else {
                            this[i].appendChild(newChild);
                        }
                    }
                }
                return this;
            },
            appendTo: function(newParent)
            {
                $(newParent).append(this);

                return this;
            },
            /**
             * Insert newChild as the first child of each element in NodeList
             */
            prepend: function(newChild)
            {
                var i, j;
                for (i = 0; i < this.length; i++) {
                    if (isString(newChild)) {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newChild;
                        for (j = tempDiv.childNodes.length - 1; j >= 0; j--) {
                            this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
                        }
                    }
                    else {
                        if (newChild instanceof DomDS) {
                            for (j = 0; j < newChild.length; j++) {
                                this[i].insertBefore(newChild[j], this[i].childNodes[0]);
                            }
                        }
                        else {
                            this[i].insertBefore(newChild, this[i].childNodes[0]);
                        }
                    }
                }
                return this;
            },
            prependTo: function(newParent)
            {
                $(newParent).prepend(this);

                return this;
            },
            /**
             * insert NodeList before element(s) matched by selector
             */
            insertBefore: function(selector)
            {
                var before = $(selector);
                for (var i = 0; i < this.length; i++) {
                    if (before.length === 1) {
                        before[0].parentNode.insertBefore(this[i], before[0]);
                    }
                    else {
                        if (before.length > 1) {
                            for (var j = 0; j < before.length; j++) {
                                before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
                            }
                        }
                    }
                }
            },
            /**
             * insert NodeList after element(s) matched by selector
             */
            insertAfter: function(selector)
            {
                var after = $(selector);
                for (var i = 0; i < this.length; i++) {
                    if (after.length === 1) {
                        after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
                    }
                    if (after.length > 1) {
                        for (var j = 0; j < after.length; j++) {
                            after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
                        }
                    }
                }
            },
            /**
             * Get next sibling of first element in NodeList
             */
            next: function(selector)
            {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
                            return new DomDS([this[0].nextElementSibling]);
                        }
                        return new DomDS([]);
                    }
                    if (this[0].nextElementSibling) {
                        return new DomDS([this[0].nextElementSibling]);
                    }
                }
                return new DomDS([]);
            },
            /**
             * Get all next siblings of first element in NodeList
             */
            nextAll: function(selector)
            {
                var nextEls = [],
                    el = this[0];
                if (!el) {
                    return new DomDS([]);
                }
                while (el.nextElementSibling) {
                    var next = el.nextElementSibling;
                    if (selector) {
                        if ($(next).is(selector)) {
                            nextEls.push(next);
                        }
                    }
                    else {
                        nextEls.push(next);
                    }
                    el = next;
                }
                return new DomDS(nextEls);
            },
            /**
             * Get previous sibling of first element in NodeList
             */
            prev: function(selector)
            {
                if (this.length > 0) {
                    if (selector) {
                        if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) {
                            return new DomDS([this[0].previousElementSibling]);
                        }
                        return new DomDS([]);
                    }
                    if (this[0].previousElementSibling) {
                        return new DomDS([this[0].previousElementSibling]);
                    }
                }
                return new DomDS([]);
            },
            /**
             * Get all previous siblings of first element in NodeList
             */
            prevAll: function(selector)
            {
                var prevEls = [],
                    el = this[0];
                if (!el) {
                    return new DomDS([]);
                }
                while (el.previousElementSibling) {
                    var prev = el.previousElementSibling;
                    if (selector) {
                        if ($(prev).is(selector)) {
                            prevEls.push(prev);
                        }
                    }
                    else {
                        prevEls.push(prev);
                    }
                    el = prev;
                }
                return new DomDS(prevEls);
            },
            /**
             * Get all children of NodeList
             */
            children: function(selector, all)
            {
                var children = [];
                for (var i = 0; i < this.length; i++) {
                    var childNodes = this[i].childNodes;

                    for (var j = 0; j < childNodes.length; j++) {
                        if (!selector) {
                            if (childNodes[j].nodeType === 1 || all) {
                                children.push(childNodes[j]);
                            }
                        }
                        else {
                            if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) {
                                children.push(childNodes[j]);
                            }
                        }
                    }
                }
                return new DomDS(unique(children));
            },
            /**
             * Get parent Element(s) of NodeList
             *
             * @parameter optional {string} selector If set, will return only matched parent
             */
            parent: function(selector)
            {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode !== null) {
                        if (selector) {
                            if ($(this[i].parentNode).is(selector)) {
                                parents.push(this[i].parentNode);
                            }
                        }
                        else {
                            parents.push(this[i].parentNode);
                        }
                    }
                }
                return $(unique(parents));
            },
            /**
             * Get all parents of NodeList
             * @parameter optional {string} selector If set, will return only matched parent
             */
            parents: function(selector)
            {
                var parents = [];
                for (var i = 0; i < this.length; i++) {
                    var parent = this[i].parentNode;
                    while (parent) {
                        if (selector) {
                            if ($(parent).is(selector)) {
                                parents.push(parent);
                            }
                        }
                        else {
                            parents.push(parent);
                        }
                        parent = parent.parentNode;
                    }
                }
                return $(unique(parents));
            },
            /**
             * Get new NodeList Object of matched Elements by selector, that are children of NodeList
             */
            find: function(selector)
            {
                var foundElements = [];
                for (var i = 0; i < this.length; i++) {
                    var found = this[i].querySelectorAll(selector);
                    for (var j = 0; j < found.length; j++) {
                        foundElements.push(found[j]);
                    }
                }
                return new DomDS(foundElements);
            },
            /**
             * Replace NodeList with element argument
             * @param selector
             * @returns {DomDS}
             */
            replaceWith: function(selector)
            {
                selector = $(selector);

                for (var i = 0; i < this.length; i++) {
                    var parent = this[i].parentNode;

                    if (parent) {
                        parent.replaceChild(selector[0], this[i]);
                    }
                }

                return this;
            },
            /**
             * remove NodeList
             */
            remove: function()
            {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode) {
                        this[i].parentNode.removeChild(this[i]);
                    }
                }
                return this;
            },
            /**
             * Add set of matched elements to NodeList
             */
            add: function()
            {
                var dom = this;
                var i, j;
                for (i = 0; i < arguments.length; i++) {
                    var toAdd = $(arguments[i]);
                    for (j = 0; j < toAdd.length; j++) {
                        dom[dom.length] = toAdd[j];
                        dom.length++;
                    }
                }
                return dom;
            }
        };

        /**
         * Shortcats for events
         */
        (function()
        {
            var shortcuts = ('click blur focus focusin focusout keyup keydown keypress submit change mousedown mousemove mouseup mouseenter mouseleave mouseout mouseover touchstart touchend touchmove resize scroll load').split(' ');
            var notTrigger = ('resize scroll load').split(' ');

            var methodToCreate = function(name)
            {
                DomDS.prototype[name] = function(targetSelector, listener, capture)
                {
                    var i;
                    if (typeof targetSelector === 'undefined') {
                        for (i = 0; i < this.length; i++) {
                            if (notTrigger.indexOf(name) < 0) {
                                if (name in this[i]) {
                                    this[i][name]();
                                } else {
                                    $(this[i]).trigger(name);
                                }
                            }
                        }
                        return this;
                    }
                    else {
                        return this.on(name, targetSelector, listener, capture);
                    }
                };
            };

            for (var i = 0; i < shortcuts.length; i++) {
                methodToCreate(shortcuts[i]);
            }
        })();

        /**
         * outerClick for element
         */

        DomDS.prototype.outerClick = function(targetSelector, listener, remove)
        {
            var $element = this;
            if (typeof targetSelector === 'undefined') {
                this.trigger('outerClick');

                return this;
            }

            if (isFunction(targetSelector) || targetSelector === false) {
                targetSelector = this;
                listener = arguments[0];
                remove = arguments[1] || false;
            }

            targetSelector = $(targetSelector);
            remove = remove || false;

            var check = function(event)
            {
                event.stopPropagation();

                var target = $(event.target);

                if (target.is(targetSelector)) {
                    return false;
                }
                var parents = target.parents();

                for (var i = 0, l = parents.length; i < l; i++) {
                    if (targetSelector.is(parents[i])) {
                        return false;
                    }
                }

                $element.trigger('outerClick', event);
            };

            if (remove === true) {
                $(document).off('click', check);

                return $element.off('outerClick', targetSelector, listener, false);
            }

            $(document).click(check);

            return $element.on('outerClick', targetSelector, listener, false);
        };

        /**
         * Hover/unhover event
         */
        DomDS.prototype.hover = function(hover, unHover)
        {
            if (hover) {
                return this.mouseenter(hover).mouseleave(unHover || hover);
            }

            return this.mouseenter().mouseleave();
        };

        /**
         * Document ready function
         */
        var readyFired = false,
            readyList = [],
            readyInstalled = false,
            ready = function()
            {
                if (!readyFired) {
                    readyFired = true;

                    for (var i = 0, l = readyList.length; i < l; i++) {
                        readyList[i].call(window);
                    }

                    readyList = [];
                }
            };

        DomDS.prototype.ready = function(listener)
        {
            if (isDocument(this[0])) {
                if (readyFired) {
                    setTimeout(listener, 1);
                }
                else {
                    readyList.push(listener);
                }

                if (document.readyState === 'complete') {
                    setTimeout(ready, 1);
                }
                else {
                    if (!readyInstalled) {
                        this.on('DOMContentLoaded', ready);

                        readyInstalled = true;
                    }
                }
            }
        };

        /**
         * set shortcut for prototype
         * It's for DomDS extending
         */
        $.fn = DomDS.prototype;

        /**
         * Return DomDS object
         */
        return $;

    })();

    window['$'] = DomDS;
    window['DomDS'] = DomDS;
    return DomDS;
})(window, window.document, undefined);