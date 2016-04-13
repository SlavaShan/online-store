require('./../modules/ajax.js');
require('./../modules/cookie.js');

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
        var subscribeBlock = $('.footer_input > form');


        /**
         * Subscribe form
         */

        subscribeBlock.each(function(i, el)
        {
            var form = $(el);


            var onBeforeSubmit = function()
            {

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

                            addError('login', 'Thank you for subscribing!');

                            /**
                             * Change Login status and change Login form to success message
                             */
                            if (lowercase(this.nodeName) === 'form') {
                                //setSuccessLogInBlocks();
                            }
                        }
                    }
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
             * Form
             */
            form.on('beforeSubmit', form, onBeforeSubmit);
            form.on('complete', form, onComplete);
        });


    });

})(window);