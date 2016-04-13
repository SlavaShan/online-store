/**
 * Nav button and hide scroll
 */

(function(window)
{
    var $ = window.DomDS;

    $(document).ready(function()
    {
        /**
         * KS popul login
         * @type {*|DomDS|HTMLElement}
         */
        var popUpLink = $(".keeps_id_popup_lnk");
        var popUp = $(".modal-popup");
        var popClose = $(".icon-font-close, .popup_wrapper, .payment_modal_try-again");

        popUpLink.click(popUpLink, function(event) {
            event.preventDefault();
            popUp.addClass("show-block-open");
            $('html').addClass('no-scroll');
        });

        popClose.click(popClose, function(event) {
            event.preventDefault();
            popUp.removeClass("show-block-open");
            if(!$('#top-header-state').prop('checked')) {
                $('html').removeClass('no-scroll');
            }
        });

        if($('.purchase-popup').length > 0) {
            $('html').addClass('no-scroll');
        }
    });

})(window);