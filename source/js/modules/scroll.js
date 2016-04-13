"use strict";

(function(window, document, undefined)
{
    var $ = window.DomDS;

    $.fn.scrollTo = function(left, top, duration, easing, callback)
    {
        if (arguments.length === 4 && isFunction(easing)) {
            callback = easing;
            easing = undefined;
        }
        return this.each(function()
        {
            var el = this;
            var currentTop, currentLeft, maxTop, maxLeft, newTop, newLeft, scrollTop, scrollLeft;
            var animateTop = top > 0 || top === 0;
            var animateLeft = left > 0 || left === 0;
            if (typeof easing === 'undefined') {
                easing = 'swing';
            }
            if (animateTop) {
                currentTop = el.scrollTop;
                if (!duration) {
                    el.scrollTop = top;
                }
            }
            if (animateLeft) {
                currentLeft = el.scrollLeft;
                if (!duration) {
                    el.scrollLeft = left;
                }
            }
            if (!duration) {
                return;
            }
            if (animateTop) {
                maxTop = el.offsetHeight - el.scrollHeight;
                newTop = Math.max(top, maxTop);
            }
            if (animateLeft) {
                maxLeft = el.scrollWidth - el.offsetWidth;
                newLeft = Math.max(Math.min(left, maxLeft), 0);
            }
            var startTime = null;
            if (animateTop && newTop === currentTop) {
                animateTop = false;
            }
            if (animateLeft && newLeft === currentLeft) {
                animateLeft = false;
            }
            function render(time)
            {
                if (typeof time === 'undefined') {
                    time = new Date().getTime();
                }
                if (startTime === null) {
                    startTime = time;
                }
                var done;
                var progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
                var easeProgress = easing === 'linear' ? progress : (0.5 - Math.cos(progress * Math.PI) / 2);
                if (animateTop) {
                    scrollTop = currentTop + (easeProgress * (newTop - currentTop));
                }
                if (animateLeft) {
                    scrollLeft = currentLeft + (easeProgress * (newLeft - currentLeft));
                }
                if (animateTop && newTop > currentTop && scrollTop >= newTop) {
                    el.scrollTop = newTop;
                    done = true;
                }
                if (animateTop && newTop < currentTop && scrollTop <= newTop) {
                    el.scrollTop = newTop;
                    done = true;
                }

                if (animateLeft && newLeft > currentLeft && scrollLeft >= newLeft) {
                    el.scrollLeft = newLeft;
                    done = true;
                }
                if (animateLeft && newLeft < currentLeft && scrollLeft <= newLeft) {
                    el.scrollLeft = newLeft;
                    done = true;
                }

                if (done) {
                    if (callback) {
                        callback();
                    }
                    return;
                }
                if (animateTop) {
                    el.scrollTop = scrollTop;
                }
                if (animateLeft) {
                    el.scrollLeft = scrollLeft;
                }
                $.requestAnimation(render);
            }

            $.requestAnimation(render);
        });
    };
    $.fn.scrollTop = function(top, duration, easing, callback)
    {
        if (arguments.length === 3 && isFunction(easing)) {
            callback = easing;
            easing = undefined;
        }
        if (typeof top === 'undefined') {
            if (this.length > 0) {
                if (this[0].nodeName === 'BODY') {
                    return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
                }

                return this[0].scrollTop;
            }
            else {
                return null;
            }
        }
        return this.scrollTo(undefined, top, duration, easing, callback);
    };

})(window, document, undefined);