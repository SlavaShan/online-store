var Cookies = require('./../modules/cookie.js');

(function(window)
{
    var $ = window.DomDS;


    $(document).ready(function()
    {
        /**
         * Purchases block
         */
        var purchasesBlock = $('.our_prices_cnt_inner, .our_prices_s_p_2st_blc');
        var secondaryPrice = $('.log_sec_price');
        var selectedPurchaseID;

        if(purchasesBlock.length < 1) {
            return;
        }

        // Read last selected purchase from cookie
        var lastPurchaseID = Cookies.get('last_purch');

        var onPurchaseClick = function(e)
        {
            e.preventDefault();

            var curPurchaseBlock = $(this);

            purchasesBlock.removeClass('active');

            curPurchaseBlock.addClass('active');

            selectedPurchaseID = curPurchaseBlock.data('purchase-id');

            // Save last selected purchase to cookie
            Cookies.set('last_purch', selectedPurchaseID, {expires:2});

            var changeSecondaryPrice = function() {

                var plan = '';

                var priceTitle;
                var priceDescription;
                var priceCost;
                var priceSave;

                if(![7,8].in_array(selectedPurchaseID)) {
                    priceTitle = curPurchaseBlock.find('h4').text();
                    priceDescription = curPurchaseBlock.find('.t_p_per > span').html();

                    if(selectedPurchaseID == 6) {
                        plan = priceTitle + ' (lifetime plan)';
                    } else {
                        plan = priceTitle + ' (' + trim(priceDescription) + ')';
                    }
                } else {
                    priceTitle = window.suitesText;
                    priceDescription = curPurchaseBlock.find('.suit_period_blc > span').text();

                    plan = priceTitle + ' (' + trim(priceDescription) + ')';
                }

                priceCost = curPurchaseBlock.find('.t_p_num').html();
                priceSave = curPurchaseBlock.find('.terms_interest > span > em').text().replace('%', '');


                // Set to payment methods
                $('.m_payment_cost_block').text(curPurchaseBlock.find('.t_p_num').text().replace(/^\s*(\$)\s*([0-9]+)\s*([0-9]{2})$/i, '$1$2,$3'));
                $('.m_payment_plan_block').text(trim(plan));

                // Set to secondary block for price
                secondaryPrice.find('h4').text(priceTitle);
                secondaryPrice.find('.t_p_per').html(priceDescription);
                secondaryPrice.find('.t_p_num').html(priceCost);
                secondaryPrice.find('.t_p_save > span').text(priceSave);
            };

            changeSecondaryPrice();
        };

        purchasesBlock.click(purchasesBlock, onPurchaseClick);

        var salePrice = $('.price-sale');
        // Start purchase position at 4th purchase block
        if(salePrice.length > 0){
            lastPurchaseID = salePrice.data('purchase-id');
        } else {
            lastPurchaseID = lastPurchaseID || 4;
        }

        purchasesBlock.eq(lastPurchaseID-1).click();

        /**
         * Purchase button
         */
        var purchaseButton = $('.m_p_v_cnt_btn');

        var purchasesTypeBlock = $('.m_payment_var_blc');

        /**
         * On before ajax start
         * @param e
         */
        var onPurchaseButtonClick = function(e)
        {
            e.preventDefault();

            var curPurchaseButton = $(this);

            var purchaseTypeBlock = curPurchaseButton.parents('.m_payment_var_blc');

            var purchaseType = purchaseTypeBlock.data('payment-method');

            var showError = function(error) {

                console.log(error);
            };

            /**
             * On ajax beforeSubmit
             */
            var onBeforeSubmit = function()
            {
                if(!window.isLoggedIn) {

                    $('html, body').scrollTop($('.login_sec_title').offset().top - 20, 350);

                    return;
                }
                $('<div class="loading-bounce"><div></div><div></div><div></div></div>').appendTo(purchaseTypeBlock);
                purchaseTypeBlock.addClass('purchase-loading');
            };

            /**
             * On ajax error
             */
            var onError = function()
            {
                /**
                 * Remove loading status from purchase block
                 */
                purchaseTypeBlock.removeClass('purchase-loading');
                purchaseTypeBlock.children('.loading-bounce').remove();
            };

            /**
             * On ajax complete
             * @param event
             */
            var onComplete = function(event)
            {
                var xhrResult = JSON.parse(event.detail.xhr.responseText);

                if (xhrResult.type) {
                    if (xhrResult.type === 'error') {

                        /**
                         * Show error
                         */
                        showError(xhrResult.result);

                        onError();

                    } else {
                        if (xhrResult.type === 'success') {
                            window.location.href = '' + xhrResult.result;
                        }
                    }
                }
            };

            purchaseTypeBlock.on('beforeSubmit', purchaseTypeBlock, onBeforeSubmit);
            purchaseTypeBlock.on('complete', purchaseTypeBlock, onComplete);
            purchaseTypeBlock.on('error', purchaseTypeBlock, onError);


            var data = {
                id: selectedPurchaseID,
                type: purchaseType
            };

            var csrfToken = Cookies.get('csrf_token');

            if (csrfToken) {
                data['csrf_token'] = csrfToken;
            }

            var xhr = $.ajax({
                method: 'POST',
                url: '/api/dopurchase',
                dataType: 'json',
                data: data,
                beforeSend: function(xhr)
                {
                    purchaseTypeBlock.trigger('beforeSubmit', {data: data, xhr: xhr});
                },
                error: function(xhr)
                {
                    purchaseTypeBlock.trigger('submitError', {data: data, xhr: xhr});
                },
                success: function(data)
                {
                    purchaseTypeBlock.trigger('submitted', {data: data, xhr: xhr});
                },
                complete: function(data)
                {
                    purchaseTypeBlock.trigger('complete', {data: data, xhr: xhr});
                }
            });
        };

        purchaseButton.click(purchaseButton, onPurchaseButtonClick);


        /**
         * Change Plan button
         */

        var changePlanButton = $('.log_change_plan_btn').children('a');
        var purchasesTitle = $('.our_prices_title');

        var changePlanButtonClick = function(e) {
            e.preventDefault();

            $('html, body').scrollTop(purchasesTitle.offset().top, 350);
        };

        changePlanButton.click(changePlanButton, changePlanButtonClick);
    });

})(window);