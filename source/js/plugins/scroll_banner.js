(function(window)
{
    var $ = window.DomDS;

    var mainOptions = {
        speed: 2
    };

    $.fn.parallax = function(options)
    {
        var container = this;

        if (container.length === 0) {
            return container;
        }

        if (container.length > 1) {
            container.each(function()
            {
                $(this).parallax(options);
            });

            return container;
        }


        options = extend({}, mainOptions, container.dataset(), options);

        var windowHeight = $(window).height();
        var containerHeight = container.height();
        var containerOffsetTop = container.offset().top;

        var timeout, bodyScroll, opacityContainer;

        if(options.opacity) {
            opacityContainer = container.find('h2');
            opacityContainer.addClass('accelerate');
        }

        container.addClass('accelerate');

/*
        var mousewheelToggle = function(e)
        {
            if (e.preventDefault) {
                e.preventDefault();
            }

            var mouseDelta = 0;
            if (e.wheelDelta) {
                mouseDelta = e.wheelDelta / 120;
            } else if (e.detail) {
                mouseDelta = -e.detail / 3;
            }

            window.scrollBy(0, -mouseDelta * 50);
        };
*/

        var scrollToggle = function()
        {
            bodyScroll = $('body').scrollTop();
            var scrollTop = bodyScroll - containerOffsetTop;

            if (container.visible()) {
                var position = scrollTop / +options.speed;

                container.translate(0, bodyScroll < 0 ? 0 : position);

                if(opacityContainer) {
                    position = position - scrollTop / +options.opacity;
                    opacityContainer.translate(0, -(position < 0 ? 0 : position));
                    position = (containerOffsetTop + containerHeight - bodyScroll)/(containerOffsetTop + containerHeight);
                    opacityContainer.css('opacity', position);
                }
            }
        };

        var resizeToggle = function()
        {
            clearTimeout(timeout);

            windowHeight = $(window).height();
            containerHeight = container.height();
            containerOffsetTop = container.offset().top;

            timeout = setTimeout(scrollToggle, 50);
        };


        scrollToggle();

        $(window).on('scroll', scrollToggle);
        $(window).on('resize', resizeToggle);


        return this;
    };


    $(document).ready(function()
    {
        $('.scroll-banner').parallax();
    });

})(window);