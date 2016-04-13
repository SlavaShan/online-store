(function (window) {
    var $ = window.DomDS,
        namespace = '.ds-drop-down';

    /**
     * Slider constructor
     * @constructor
     */
    $.fn.dropdown = function (settings) {
        var dropdown = this;


        if (dropdown.length === 0) {
            return dropdown;
        }

        if (dropdown.length > 1) {
            dropdown.each(function () {
                $(this).dropdown();
            });

            return dropdown;
        }

        // read options
        var main_settings = {
            namespace: namespace,
            wrap: '-wrap',
            select: '-select',
            optionsBlock: '-options',
            option: '-option',
            active: '.active',
            disable: '-disable',
            disabled: '-select-disable',
            arrow: true,
            reverse: false
        };

        var cur_namespace = dropdown.data('namespace') || namespace;

        for (var name in main_settings) {
            if (name != 'namespace' && name != 'active' && name != 'arrow' && name != 'reverse') {
                main_settings[name] = cur_namespace + main_settings[name];
            } else if (name == 'reverse' || name == 'arrow') {
                main_settings[name] = main_settings[name];
            }
        }

        settings = extend({}, main_settings, dropdown.dataset(), settings);


        var originalItems = dropdown.children('option');
        var dropDownItems = originalItems.clone();
        var dropdownBlock;

        if (dropDownItems.length == 0) {
            return dropdown;
        }

        // Build DropDown
        var title = $('<div>').addClass(settings.select),
            wrapper = $('<div>'),
            optionsBlock = $('<div>').addClass(settings.optionsBlock);

        dropdownBlock = $('<div>').addClass(settings.wrap);

        var option,
            newOption,
            optionText,
            optionVal;

        title.data('value', dropDownItems[0].value);
        title.text(dropDownItems[0].textContent);

        dropDownItems.each(function () {
            option = $(this);

            newOption = $('<div>').addClass(settings.option);

            optionVal = option.val();
            optionText = option.text();

            if (option.prop('selected')) {
                title.data('value', optionVal);
                title.text(optionText);
                newOption.data('selected', true);

                if (option.prop('disabled')) {
                    newOption.hide();
                }
            }

            if (option.prop('disabled') && !option.prop('selected')) {
                newOption.addClass(settings.disable)
            }

            if (option.data('link')) {
                var href = option.val(),
                    target = option.data('target'),
                    link = $('<a>');

                link.attr('href', href).text(optionText);
                target && link.attr('target', target);

                link.appendTo(newOption);
            } else {
                newOption.data('value', optionVal).text(optionText);
            }

            newOption.appendTo(optionsBlock);
        });

        if (!!settings.reverse) {
            dropdownBlock.addClass('reversed');
            optionsBlock.appendTo(wrapper);
            title.appendTo(wrapper);

            if (settings.arrow) {
                $('<i>').addClass('icon-font-arrow').appendTo(wrapper);
            }
        } else {
            title.appendTo(wrapper);

            if (settings.arrow) {
                $('<i>').addClass('icon-font-arrow').appendTo(wrapper);
            }

            optionsBlock.appendTo(wrapper);
        }

        wrapper.appendTo(dropdownBlock);

        // Append after real select
        dropdown.addClass(settings.disabled);
        dropdownBlock.insertAfter(dropdown);
        dropdownBlock.addClass('expanded');

        var onDropDownFilter = function(e) {
            var array = e.detail.values;

            var options = dropdownBlock.find(settings.option);

            options.each(function () {
                var item = $(this);

                if (!item.hasClass(settings.disable)) {
                    item.show();
                }

                if (array.in_array(item.data('value'))) {
                    if (!item.hasClass(settings.disable)) {
                        item.hide();
                    }

                    return true;
                }
            });
        };

        var openSelect = function() {
            if (!dropdownBlock.hasClass('expanded')) {
                return;
            }

            dropdownBlock.toggleClass(settings.active).removeClass('expanded');

            dropdownBlock.find(settings.optionsBlock).transitionEnd(function () {
                dropdownBlock.addClass('expanded');
            }, 400);
        };


        var onOpenSelect = function(e) {
            if (e.detail && e.detail.target) {
                return false;
            }

            openSelect();
        };

        var closeSelect = function() {
            if (!dropdownBlock.hasClass('expanded') || !dropdownBlock.hasClass(settings.active)) {
                return;
            }

            dropdownBlock.removeClass(settings.active).removeClass('expanded');

            dropdownBlock.find(settings.optionsBlock).transitionEnd(function () {
                dropdownBlock.addClass('expanded');
            }, 400);
        };

        var onSelectChange = function(e) {
            var target = $(e.target);

            var selectValue = 0;

            if (e.detail && e.detail.value) {
                selectValue = e.detail.value;
            } else {
                selectValue = target[0].value;
            }

            var options = dropdownBlock.find(settings.option);

            var option = options.filter(function(){
                var item = $(this);

                if (item.data('value') == selectValue) {
                    if (!item.hasClass(settings.disable)) {
                        target = item;

                        return true;
                    }
                }
            });

            option.trigger('click', {target: option[0], bubbles: true});
        };

        var onOptionClick = function(e) {

            var target = $(e.target);

            if (e.detail && e.detail.target) {
                target = $(e.detail.target);
            }

            if(!$(target).is(settings.option)) {
                return;
            }

            if (target.hasClass(settings.disable)) {
                return false;
            }

            var title = dropdownBlock.find(settings.select);

            var curData = title.data('value');

            var options = dropdownBlock.find(settings.option);
            options.each(function () {
                var item = $(this);

                if (item.data('value') === curData) {
                    if (!item.hasClass(settings.disable)) {
                        item.show();
                    }

                    return true;
                }
            });

            title.data('value', target.data('value'));
            title.text(target.text());
            target.hide();

            closeSelect();

            dropdown.trigger('changeOption', {value: target.data('value')});
        };

        // Enable events
        dropdownBlock.on('click', dropdownBlock, onOpenSelect);

        dropdown.change(onSelectChange);

        dropdownBlock.on('click', onOptionClick);

        dropdownBlock.outerClick(closeSelect);

        dropdown.on('DropDown.filter', onDropDownFilter);


        return dropdown;
    };

})(window);