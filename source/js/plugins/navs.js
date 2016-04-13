"use strict";

(function(window)
{
    var $ = window.DomDS,
        options = {
            header: 'header',
            nav: '#masthead',
            fixed: '.fixed',
            scroll: '.scrolled'
        },
        /**
         * Navs constructor
         * @constructor
         */
        Navs = function()
        {
            this.init();
        }, _Navs = {};

    Navs.prototype = {
        init: function()
        {
            _Navs = this;

            _Navs.setEvent();
        },
        setEvent: function()
        {
            $(window).on('scroll', _Navs.onScroll);
        },
        onScroll: function()
        {
            var nav = $(options.nav),
                header = $(options.header),
                scrollTop = $('body').scrollTop(),
                headerOffset = nav.offset().top;

            if (scrollTop > headerOffset) {
                nav.addClass(options.fixed);
                header.css('height', nav.outerHeight(true) + 'px')
            }
            else if (scrollTop == 0) {
                nav.removeClass(options.fixed);
                header.css('height', '')
            }
            if (scrollTop > nav.outerHeight(true) + 40) {
                nav.addClass(options.scroll);
            }
            else if (scrollTop < nav.outerHeight(true) + 40) {
                nav.removeClass(options.scroll);
            }
        }
    };
    $(document).ready(function()
    {
        new Navs();
    });

})(window);