"use strict";

/**
 * Animation events for DOM
 */
(function(window)
{
    var $ = window.DomDS;

    $.requestAnimation = function(callback)
    {
        if (vendorJs('requestAnimationFrame')) {
            return window[vendorJs('requestAnimationFrame')](callback);
        }

        return window.setTimeout(callback, 1000 / 60);
    };

    $.cancelAnimation = function(id)
    {
        if (vendorJs('cancelAnimationFrame')) {
            return window[vendorJs('cancelAnimationFrame')](id);
        }

        return window.clearTimeout(id);

    };

    $.fn.transform = function(transform)
    {
        return this.css('transform', transform);
    };

    $.fn.translate = function(x, y, z)
    {
        x = (x || 0) + 'px';
        y = (y || 0) + 'px';
        z = (z || 0) + 'px';

        var transform = vendorCss('transform');

        if (transform) {
            var translate = vendorCss('perspective') ? 'translate3d(' + [x, y, z].join(',') + ')' : 'translate(' + [x, y].join(',') + ')';

            return this.transform(translate);
        }

        return this.css({
            top: y,
            left: x
        });
    };

    $.fn.transitionDuration = function(duration)
    {
        if (!isString(duration)) {
            duration = duration + 'ms';
        }

        return this.css('transitionDuration', duration);
    };

    $.fn.transitionProperty = function(property)
    {
        return this.css('transitionProperty', property);
    };

    $.fn.transitionFunction = function(func)
    {
        return this.css('transitionTimingFunction', func);
    };

    $.fn.transitionEnd = function(callback, duration)
    {
        // Need for emulating transitionEnd
        duration = duration || 350;

        var eventName = 'transitionEnd',
            event = vendorJs(eventName),
            dom = this,
            fireCallBack = function(e)
            {
                if (e.target !== this) {
                    return;
                }
                callback.call(this, e);

                dom.off(event, fireCallBack);
            },
            /**
             * event handler for transitionEnd emulation
             * @param e
             */
            emulateTransitionEnd = function(e)
            {
                if (e.target !== this) {
                    return;
                }
                callback.call(this, e);

                dom.off('ds' + eventName, emulateTransitionEnd);
            };

        if (callback) {
            /**
             * If support transitionEnd
             */
            if (event) {
                dom.on(event, fireCallBack);
            }
            /**
             * Emulate transitionEnd event by setting timeout
             */
            else {
                dom.on('ds' + eventName, emulateTransitionEnd);

                var newCallBack = function()
                {
                    dom.trigger('ds' + eventName);
                };

                setTimeout(newCallBack, duration);
            }
        } else {
            if (event) {
                dom.trigger(event);
            } else {
                dom.trigger('ds' + eventName);
            }
        }

        return this;
    };
    $.fn.animationEnd = function(callback)
    {
        var event = vendorJs('animationend'),
            dom = this;

        function fireCallBack(e)
        {
            callback(e);
            dom.off(event, fireCallBack);

        }

        if (callback) {
            dom.on(event, fireCallBack);

        }
        return this;
    };

})(window);