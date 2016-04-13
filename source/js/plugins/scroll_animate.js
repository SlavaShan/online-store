"use strict";

(function(window)
{
    var $ = window.DomDS,
        options = {
            animateClass: 'animated',
            recursiveClass: 'animated-recursive',
            offset: 20,
            delay: 100
        },
        /**
         * ScrollAnimate constructor
         * @constructor
         */
        ScrollAnimate = function()
        {
            this.init();
        }, _ScrollAnimate = {};

    ScrollAnimate.prototype = {
        init: function()
        {
            _ScrollAnimate = this;

            _ScrollAnimate.items = [];

            _ScrollAnimate.enable();
        },
        enable: function()
        {
            _ScrollAnimate.findItems();

            _ScrollAnimate.scrolled = true;

            $(window).on('scroll', _ScrollAnimate.scrollToggleHandler);
            $(window).on('resize', _ScrollAnimate.scrollToggleHandler);
            _ScrollAnimate.interval = setInterval(_ScrollAnimate.scrollToggle, 80);
        },
        disable: function()
        {
            _ScrollAnimate.items = [];

            $(window).off('scroll', _ScrollAnimate.scrollToggleHandler);
            $(window).off('resize', _ScrollAnimate.scrollToggleHandler);
            clearInterval(_ScrollAnimate.interval);
        },

        reinit: function()
        {
            _ScrollAnimate.disable();

            _ScrollAnimate.enable();
        },
        findItems: function()
        {
            _ScrollAnimate.items = $('.animated, .animated-recursive');
        },
        scrollToggleHandler: function()
        {
            _ScrollAnimate.scrolled = true;
        },
        scrollToggle: function()
        {
            if (_ScrollAnimate.scrolled) {
                _ScrollAnimate.scrolled = false;

                _ScrollAnimate.items.each(function(i, item)
                {
                    item = $(item);

                    if (item.visible(options.offset)) {
                        if (item.hasClass(options.recursiveClass)) {
                            _ScrollAnimate.recursive(item);
                        }
                        else {
                            _ScrollAnimate.toggle(item);
                            arrayRemove(_ScrollAnimate.items, item);
                        }
                    }
                });
            }
        },
        toggle: function(item)
        {
            setTimeout(function()
            {
                item.addClass('animated-in');
            }, options.delay);
        },
        recursive: function(recursiveItem)
        {
            var animation = recursiveItem.data('recursive'),
                delay = recursiveItem.data('delay') || options.delay,
                delayEach = 0;

            var items = recursiveItem.find('.' + animation);

            if (items.length == recursiveItem.find('.animated-in.' + animation)) {
                arrayRemove(_ScrollAnimate.items, recursiveItem);
                return;
            }

            items.each(function(i, item)
                {
                    delayEach += +delay;
                    item = $(item);

                    setTimeout(function()
                    {
                        _ScrollAnimate.toggle(item);
                    }, delayEach);
                }
            );
        }
    };

    $(document).ready(function()
    {
        new ScrollAnimate();
    });

})(window);