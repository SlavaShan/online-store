/**
 * Nav button and hide scroll
 */

(function(window)
{
    var $ = window.DomDS;

    $(document).ready(function()
    {
        var navCheckbox = $('#top-header-state');
        var menuTimeout;

        var unCollapseMenuIn = function()
        {
            $('.nav_sol_par > a').trigger('collapser.close');
        };

        var checkCheckboxNav = function()
        {
            if ($(window).width() >= 1200) {
                navCheckbox.prop('checked', false);
            }

            if (navCheckbox[0].checked) {
                $('html').addClass('no-scroll');
                clearTimeout(menuTimeout);
            } else {
                $('html').removeClass('no-scroll');
                clearTimeout(menuTimeout);
                menuTimeout = setTimeout(unCollapseMenuIn, 350);
            }
        };

        var hoverTimeout;
        var displayHoverTimeout;

        var unHoverLinkMenu = function()
        {
            if ($(window).width() < 1200) {
                return;
            }

            var el = this;
            var child = $(el).children('.nav_sol_inn');

            clearTimeout(hoverTimeout);
            clearTimeout(displayHoverTimeout);

            displayHoverTimeout = setTimeout(function()
            {
                if ($(child).css('display') === 'block') {
                    $(child).hide()
                }
            }, 300);

            $(el).removeClass('hovered');
        };

        var hoverLinkMenu = function()
        {
            if ($(window).width() < 1200) {
                return;
            }

            var el = this;
            var child = $(el).children('.nav_sol_inn');

            clearTimeout(hoverTimeout);
            clearTimeout(displayHoverTimeout);

            child.show(true);
            hoverTimeout = setTimeout(function()
            {
                $(el).addClass('hovered')
            }, 30);
        };

        var timeoutForResize;

        /**
         * on load remove checked state
         */
        navCheckbox.prop('checked', false);

        navCheckbox.change(checkCheckboxNav);


        var hoverMenuEl = $('.nav_sol_par');

        var onResizeMenuLink = function()
        {
            clearTimeout(timeoutForResize);
            var resizeFunction = function()
            {
                checkCheckboxNav();

                hoverMenuEl.removeClass('hovered');
                hoverMenuEl.children('.nav_sol_inn').css('display', '');
            };

            timeoutForResize = setTimeout(resizeFunction, 100);
        };

        hoverMenuEl.hover(hoverLinkMenu, unHoverLinkMenu);


        $(window).resize(onResizeMenuLink);
    });

})(window);