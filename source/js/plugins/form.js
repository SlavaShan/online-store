require('./../modules/ajax.js');
var Cookies = require('./../modules/cookie.js');


/**
 * TODO
 * - add support for file uploading using iframe if no FileApi anf FormData
 * - add progress of uploading
 * - add autorefresh of input names
 *
 * // can help https://github.com/malsup/form/blob/master/jquery.form.js
 */
(function(window)
{
    var $ = window.DomDS;

    var submitterTypes = ['submit', 'button', 'reset', 'image', 'file'];
    var checkableTypes = ['checkbox', 'radio'];


    /**
     * Serializer for form inputs
     * @param form form
     * @param dataPairs serialized data Array (serializeArray)
     * @returns {{}}
     */
    var serializer = function(form, dataPairs)
    {
        var patternValidate = /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i;
        var patternKey = /[a-z0-9_]+|(?=\[\])/gi;
        var patternPush = /^$/;
        var patternFixed = /^\d+$/;
        var patternNamed = /^[a-z0-9_]+$/i;

        var data = {};
        var pushes = {};

        var build = function(base, key, value)
        {
            base[key] = value;
            return base;
        };

        var makeObject = function(root, value)
        {

            var keys = root.match(patternKey), k;

            while ((k = keys.pop()) !== undefined) {
                // foo[]
                if (patternPush.test(k)) {
                    var idx = incrementPush(root.replace(/\[\]$/, ''));
                    value = build([], idx, value);
                }

                // foo[n]
                else if (patternFixed.test(k)) {
                    value = build([], k, value);
                }

                // foo; foo[bar]
                else if (patternNamed.test(k)) {
                    value = build({}, k, value);
                }
            }

            return value;
        };

        var incrementPush = function(key)
        {
            if (pushes[key] === undefined) {
                pushes[key] = 0;
            }
            return pushes[key]++;
        };

        var encode = function(pair)
        {
            var element = form.find('[name="' + pair.name + '"]')[0];
            var value = pair.value;

            if (in_array(element.type, checkableTypes) && !element.checked) {

                value = undefined;
            }

            return value;
        };

        var addPair = function(pair)
        {
            if (!patternValidate.test(pair.name)) {
                return this;
            }
            var obj = makeObject(pair.name, encode(pair));
            data = extend(true, data, obj);
        };

        var addPairs = function(pairs)
        {
            if (!isArray(pairs)) {
                throw new Error("Serializer.addPairs expects an Array");
            }
            for (var i = 0, len = pairs.length; i < len; i++) {
                addPair(pairs[i]);
            }
        };

        addPairs(dataPairs);

        return data;
    };

    /**
     * serializeArray
     */
    $.fn.serializeArray = function()
    {
        var elements = $(this).prop('elements');

        elements = elements || this;
        elements = $(elements);

        return map(elements.filter(function()
            {
                var input = $(this);

                var type = input.attr('type');

                return input.attr('name') && !input.is(':disabled') && !in_array(type, submitterTypes) &&
                    (this.checked || !in_array(type, checkableTypes));
            }),
            function(element)
            {
                var val = $(element).val();

                return val == null ? null : (isArray(val) ?
                    [].call(val, function(val)
                    {
                        return {name: element.name, value: val.replace(/\r?\n/g, "\r\n")};
                    }) : {name: element.name, value: val.replace(/\r?\n/g, "\r\n")});
            });
    };

    /**
     * serializeObject
     * @returns {{}}
     */
    $.fn.serializeObject = function()
    {
        return serializer(this, this.serializeArray());
    };

    /**
     * serializeJSON
     * @returns JSON
     */
    $.fn.serializeJSON = function()
    {
        return JSON.stringify(this.serializeObject());
    };


    /**
     * Form submitter
     * @param settings
     * @returns {$.fn}
     */
    $.fn.form = function(settings)
    {
        var form = this;

        if (form.length === 0) {
            return form;
        }

        if (form.length > 1) {
            form.each(function()
            {
                $(this).form(settings);
            });

            return form;
        }

        if (form[0].nodeName.toLowerCase() !== 'form') {
            return form;
        }

        /**
         * Add show/hide for password input
         */

        var eyeClass = '.icon-font-eye';
        var eyeClassClose = eyeClass + '-off';

        var passwordInput = form.find('[type="password"]');
        var passwordShowHide = form.find(eyeClass);

        var onPasswordShowHide = function()
        {
            var curShowHide = $(this);
            var curPasswordInput = curShowHide.prevAll(passwordInput).first();

            if(curShowHide.hasClass(eyeClass)) {
                curPasswordInput.attr('type', 'text');
                curShowHide.changeClass(eyeClass, eyeClassClose);
            } else {
                curPasswordInput.attr('type', 'password');
                curShowHide.changeClass(eyeClassClose, eyeClass);
            }
        };

        passwordShowHide.click(passwordShowHide, onPasswordShowHide);

        /**
         * On from submit
         * @param event
         * @returns {boolean}
         */
        var onSubmit = function(event)
        {
            if (form.length !== 1) {
                return false;
            }

            var action = form.attr('action');
            if (!action) {
                return false;
            }

            event.preventDefault();

            var method = uppercase(form.attr('method')) || 'GET';
            var contentType = form.prop('enctype') || form.attr('enctype') || 'multipart/form-data';

            var data = form.serializeObject();

            var csrfToken = Cookies.get('csrf_token');

            if (csrfToken) {
                data['csrf_token'] = csrfToken;
            }

            data = method === 'GET' ? serializeObject(data) : data;

            var xhr = $.ajax({
                method: method,
                url: action,
                contentType: contentType,
                dataType: 'json',
                data: data,
                beforeSend: function(xhr)
                {
                    form.trigger('beforeSubmit', {data: data, xhr: xhr});
                },
                error: function(xhr)
                {
                    form.trigger('submitError', {data: data, xhr: xhr});
                },
                success: function(data)
                {
                    form.trigger('submitted', {data: data, xhr: xhr});
                },
                complete: function(data)
                {
                    form.trigger('complete', {data: data, xhr: xhr});
                }
            });
        };

        form.submit(form, onSubmit);


        return form;
    };

    $(document).ready(function()
    {
        $('.ds-form').form();
    });

})(window);