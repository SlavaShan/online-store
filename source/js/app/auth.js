require('./../modules/ajax.js');
var Cookies = require('./../modules/cookie.js');

var template = require('./../modules/template');
var gettext = require('./language');

(function(window)
{
    var $ = window.DomDS;


    $(document).ready(function()
    {
        /**
         * Get auth block in pricing
         */
        var pricingLogInBlock = $('.log_sec_input');
        var headerLogInBlock = $('.keeps_id_popup_lnk');
        var headerUserStatusBlock = $('.keeps_id_hover_blc');
        var popupLogIn = $('.auth-popup');
        var pricingUserStatusBlock = $('.log_sec_logged_in');


        var pricingSuccessLogInTemplate = '' +
            '<div class="log_sec_logged_in">' +
            '<div class="log_sec_input_cnt left_tab active-tab tab-content">' +
            '<p class="logged_in_header">' + gettext('You are authorized') + '</p>' +
            '<div class="logged_in_image">' +
            '<img src="/static/img/logged_in_img.svg" alt="' + gettext('You are authorized') + '">' +
            '</div> ' +
            '<span class="logged_in_your_email">' + gettext('Your email') + '</span> ' +
            '<span class="logged_in_email">' +
            '{{username}}' +
            '</span> ' +
            '<a href="#" class="h_user_logout icon-font-logout button-logout" target="_blank" title="' + gettext('Logout') + '">' + gettext('Logout') + '</a> ' +
            '</div>' +
            '</div>';

        var globalSuccessLogInTemplate = '' +
            '<a href="#" class="keeps_id keeps_id_active keeps_id_hover_link collapsed" data-target=".keeps_id_hover_blc">' +
            '<img src="/static/img/icon_user_logined.svg" alt="' + gettext('You are authorized') + '">' +
            '</a>' +
            '<div class="nav_sol_inn keeps_id_hover_blc collapse disable-on-max-size" data-max-size="1200">' +
            '<span class="arrow-up"></span>' +
            '<img src="/static/img/icon_user_dropdown.svg" alt="' + gettext('You are authorized') + '"><span class="h_user_mail">{{username}}</span>' +
            '<span class="h_user_expiration"></span>' +
            '<hr>' +
            '<a href="/{{lang_uri}}/pricing" title="' + gettext('Prolong subscription') + '" class="h_user_prolong icon-font-ok">' + gettext('Prolong subscription') + '</a>' +
            '<a href="/{{lang_uri}}/download" title="' + gettext('Start using VPN') + '" class="h_user_prolong h_user_start_using icon-font-ok">' + gettext('Start using VPN') + '</a>' +
            '<a href="{{autologin_url}}" class="enter_to_cabinet icon-font-config" title="' + gettext('User Office') + '" target="_blank">' + gettext('User Office') + '</a>' +
            '<a href="#" class="h_user_logout icon-font-logout" target="_blank" title="' + gettext('Logout') + '">' + gettext('Logout') + '</a>' +
            '</div>';

        /**
         * Logout
         */

        var onLogOutClick = function(e)
        {
            e.preventDefault();

            $.get('/api/logout', function(xhr)
            {
                var xhrResult = JSON.parse(xhr);

                if (xhrResult.type === 'success') {
                    location.reload();
                }
            });
        };

        var logOut = $('.h_user_logout');
        logOut.click(logOut, onLogOutClick);

        /**
         * Set succes LogIn blocks
         */
        var setSuccessLogInBlocks = function()
        {
            /**
             * For pricing
             */
            if (pricingLogInBlock.length > 0) {
                pricingLogInBlock.hide();
                pricingUserStatusBlock = $(template(pricingSuccessLogInTemplate, {username: window.userInfo.username}));
                pricingUserStatusBlock.insertAfter(pricingLogInBlock);
            }

            /**
             * for header
             */
            headerLogInBlock.hide();
            headerLogInBlock.removeClass('hide');

//            var curStatusLogInBlock = $('.keeps_id_active, .keeps_id_hover_blc');
//            console.log(curStatusLogInBlock)
//            if(curStatusLogInBlock.length > 0) {
//                curStatusLogInBlock.remove();
//            }

            headerUserStatusBlock = $(template(globalSuccessLogInTemplate, {username: window.userInfo.username, lang_uri: window.userLang, autologin_url: window.userInfo.autologin_url}));

            if (window.userInfo.expired_status) {
                headerUserStatusBlock.children('.h_user_expiration').text(window.userInfo.expired_status);

                headerUserStatusBlock.children('.h_user_prolong').show();
                headerUserStatusBlock.children('.h_user_prolong').removeClass('hide');

                headerUserStatusBlock.children('.h_user_start_using').hide();
            } else {
                headerUserStatusBlock.children('.h_user_prolong').hide();
                headerUserStatusBlock.children('.h_user_start_using').show();
                headerUserStatusBlock.children('.h_user_start_using').removeClass('hide');
            }

            headerUserStatusBlock.appendTo(headerLogInBlock.parent());

            new Collapser('.keeps_id_active.collapsed');

            if(popupLogIn.length > 0 && popupLogIn.hasClass('show-block-open')) {
                popupLogIn.removeClass('.show-block-open');
                $('html').removeClass('no-scroll');
            }

            $('#top-header-state').prop('checked', false);

            var logOut = $('.h_user_logout');
            logOut.off('click', logOut, onLogOutClick);
            logOut.on('click', logOut, onLogOutClick);
        };
        /**
         * Set window if user is logged in
         */
        if(!isUndefined(window.userInfo)) {
            setSuccessLogInBlocks();
        }

        /**
         * Login / Registration
         */

        $('.ds-form').filter(function(i, el)
        {
            return $(el).find('[name="password"]').length > 0;
        }).each(function(i, el)
        {
            var form = $(el);

            var onBlurEmail = function()
            {
                var value = emailValidate.val();
                var data = {login: value};

                var csrfToken = Cookies.get('csrf_token');

                if (csrfToken) {
                    data['csrf_token'] = csrfToken;
                }

                var xhr = $.ajax({
                    method: 'POST',
                    url: '/api/login_validate',
                    contentType: 'multipart/form-data',
                    dataType: 'json',
                    data: data,
                    beforeSend: function(xhr)
                    {
                        emailValidate.trigger('beforeSubmit', {data: data, xhr: xhr});
                    },
                    error: function(xhr)
                    {
                        emailValidate.trigger('submitError', {data: data, xhr: xhr});
                    },
                    success: function(data)
                    {
                        emailValidate.trigger('submitted', {data: data, xhr: xhr});
                    },
                    complete: function(data)
                    {
                        emailValidate.trigger('complete', {data: data, xhr: xhr});
                    }
                });
            };

            var onBeforeSubmit = function()
            {
                $('<div class="loading-bounce"><div></div><div></div><div></div></div>').appendTo(form);
                form.addClass('form-loading');
            };

            var onComplete = function(event)
            {
                var xhrResult = JSON.parse(event.detail.xhr.responseText);

                if (xhrResult.type) {
                    if (xhrResult.type === 'error') {
                        /**
                         * Remove all errors
                         */
                        form.prev('.field-error').remove();
                        form.find('.field-error').remove();

                        /**
                         * Add error
                         */
                        forEach(xhrResult.result, function(name, msg)
                        {
                            addError(name, msg);
                        });
                    } else {
                        if (xhrResult.type === 'success') {
                            /**
                             * Remove all errors
                             */
                            removeError.call(this);

                            if (lowercase(this.nodeName) === 'form') {
                                removeError.call(this, 'form');
                            }

                            /**
                             * Set Global logged in status
                             */
                            window.isLoggedIn = true;

                            /**
                             * UserInfo:
                             * - expired_status
                             * - login_type
                             * - trial
                             * - username
                             * @type {Object}
                             */
                            window.userInfo = xhrResult.result;

                            /**
                             * Change Login status and change Login form to success message
                             */
                            if (lowercase(this.nodeName) === 'form') {
                                setSuccessLogInBlocks();
                            }
                        }
                    }
                }

                /**
                 * Remove loading status from form
                 */
                if (lowercase(this.nodeName) === 'form') {
                    form.removeClass('form-loading');
                    form.children('.loading-bounce').remove();
                }
            };

            var addError = function(field, msg)
            {
                var errorField;

                // If form - add error for form
                if (field === 'form') {
                    if (form.prev('.field-error').length === 0) {
                        errorField = $('<p class="field-error"></p>');
                        errorField.insertBefore(form);
                    }

                    form.prev('.field-error').text(msg);

                    form.find('.field-error').remove();

                    return;
                }

                // Find field
                field = form.find('[name="' + field + '"]');

                // Add error for field
                errorField = $('<p class="field-error"></p>');
                errorField.text(msg);
                errorField.insertAfter(field.parent());
            };

            var removeError = function(field)
            {
                var errorField;

                // If form remove all errors
                if (field === 'form') {
                    form.prev('.field-error').remove();
                    form.find('.field-error').remove();

                    return;
                }

                // If form is scope - remove all errors
                if (lowercase(this.nodeName) === 'form') {
                    form.find('.field-error').remove();

                    // Else remove onli login error
                } else {
                    form.find('[name="login"]').parent().next('.field-error').remove()
                }
            };


            /**
             * Email validate using API
             */
            var emailValidate = form.find('[name="login"]');
            emailValidate.blur(emailValidate, onBlurEmail);

            emailValidate.on('complete', emailValidate, onComplete);


            /**
             * Set confirmation password
             */
            var passwordConfirm = form.find('.user_pass_blc_confirm');
            var passwordFirst = passwordConfirm.parents('.user_pass').find('.user_pass_blc > input');

            var onBlurPassword = function(){
                var value = passwordFirst.val();

                if(value && value != '' && !passwordConfirm.hasClass('active')) {
                    passwordConfirm.addClass('active');
                } else if(value == '' && passwordConfirm.hasClass('active')) {
                    passwordConfirm.removeClass('active');
                }
            };

            passwordFirst.keyup(passwordFirst, onBlurPassword);



            /**
             * Form
             */
            form.on('beforeSubmit', form, onBeforeSubmit);
            form.on('complete', form, onComplete);
        });


    });

})(window);