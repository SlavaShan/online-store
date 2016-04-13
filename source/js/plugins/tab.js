(function(window)
{
    var $ = window.DomDS;


    $.fn.tab = function(options)
    {
        var tab = this;

        if (tab.length === 0) {
            return tab;
        }

        if(tab.length > 1) {
            tab.each(function(){
                $(this).tab(options);
            });

            return tab;
        }

        var tab_links = tab.find(".tab-link");
        var tab_content = tab.find(".tab-content");

        var contentWrap = tab_content.parent();

        contentWrap.transitionDuration(300);

        contentWrap.transitionProperty('height, min-height');

        var curIndex = 0;

        var useDropDown = tab.data('use-dropdown'); // ds-tab" data-use-dropdown="true"

        if(useDropDown) {
            var dropdown = $('<select>');
            dropdown.addClass('ds-drop-down');

            dropdown.insertAfter(tab_links.parent());

            for (var i = 0, l = tab_links.length; i < l; i++) {
                var option = $('<option>');

                if (i === 0) {
                    option.attr('selected', 'selected');
                    option.prop('disabled', 'disabled');
                }

                option.val(i);
                option.text($(tab_links[i]).text());

                dropdown.append(option);
            }

            dropdown.dropdown();

            dropdown.trigger('change', {value: 0});

            dropdown.on('changeOption', function(e)
            {
                changeTab(toInt(e.detail.value));
            });
        }

        tab_links.click(function(e)
        {
            e.preventDefault();
            var target = $(this);

            var index = target.index();

            if(useDropDown) {
                dropdown.trigger('change', {value: index});
            }

            changeTab(index);
        });

        function changeTab(index)
        {
            if(curIndex === index) {
                return;
            }

            curIndex = index;

            var target = tab_links.eq(index);
            var content = tab_content.eq(index);

            tab_links.removeClass("active-tab");
            tab_content.removeClass("active-tab");

            target.addClass("active-tab");
            content.addClass("active-tab");


            if(!tab.data('no-height')) {
                contentWrap.css('min-height', content.height() + 'px');
            }

            target.trigger('tab.change', {value: index});
        }

        changeTab(0);

        function onTabUpdate(e) {
            var index = e.detail && e.detail.value || 0;

            changeTab(index);
        }

        tab_links.on('tab.update', onTabUpdate);


        return this;
    };


    $(document).ready(function()
    {
        $('.ds-tab').tab();
    });

})(window);