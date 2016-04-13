"use strict";

(function(window)
{
    var $ = window.DomDS,
        options = {
            active: '.collapser-active',
            accordion: '.accordion-item',
            accelerate: '.accelerate',
            collapse: '.collapse',
            collapseIn: '.collapse .in',
            collapsing: '.collapsing',
            item: '.collapsed',
            scroll: '.accordion-scroll'
        },
        /**
         * Collapser constructor
         * @constructor
         */
        Collapser = function(element)
        {
            this.init(element);
        }, _Collapser = {};

    Collapser.prototype = {
        /**
         * Method Init Collapser
         */
        init: function(element)
        {
            /**
             * Set current instance
             * @type {Collapser}
             * @private
             */
            _Collapser = this;

            /**
             * Find items for Collapser
             */
            _Collapser.findItems(element);
        },
        /**
         * Method for searching collapser items and setting them  events
         */
        findItems: function(element)
        {
            options.item = element || options.item;

            var collapseItems = [],
                collapse,
                target,
                data;
            $(options.item).each(
                function(i, element)
                {
                    element = $(element);
                    data = element.data('target');

                    collapse = data ? $(data) : element.children(options.collapse);
                    target = data ? element : $(element.children()[0]);

                    if (data) {
                        collapse.addClass(options.accelerate);
                    }

                    element.addClass(options.accelerate);

                    /**
                     * push to array
                     */
                    collapseItems.push(
                        {
                            trigger: element,
                            target: target,
                            collapse: collapse
                        }
                    )
                }
            );

            /**
             * Looping throught collapseItems
             */
            forEach(collapseItems,
                function(i, el)
                {
                    $(el.target).on('click collapser.toggle', el.target,
                        function(e)
                        {
                            var isAccordion;
                            var animate;

                            isAccordion = !e.detail.noAccordion;
                            animate = !e.detail.noAnimate && e.detail !== true;

                            _Collapser.collapserToggle(el, animate, isAccordion);
                        }
                    );

                    $(el.target).on('collapser.open', el.target,
                        function(e)
                        {
                            var isAccordion;
                            var animate;

                            isAccordion = !e.detail.noAccordion;
                            animate = !e.detail.noAnimate && e.detail !== true;

                            _Collapser.collapserOpen(el, animate, isAccordion);
                        }
                    );

                    $(el.target).on('collapser.close', el.target,
                        function(e)
                        {
                            var animate = e.detail !== true;
                            _Collapser.collapserClose(el, animate);
                        }
                    );
                }
            );
        },
        /**
         * Method for triggering click events
         * @param collapseItem
         * @param animate
         * @param isAccordion
         */
        collapserToggle: function(collapseItem, animate, isAccordion)
        {
            /**
             * Search for currently collapsing items
             */
            var collapsingItem = collapseItem.trigger.parent().children(options.item).children(options.collapsing);

            /**
             * if no collapsing items do work
             */
            if (collapsingItem.length == 0) {

                if(collapseItem.collapse.hasClass('disable-on-max-size')) {
                    var maxSize = collapseItem.collapse.data('max-size');

                    if($(window).width() >= maxSize) {

                        return;
                    }
                }

                /**
                 * if collapsed in close item
                 */
                if (collapseItem.trigger.hasClass('in')) {
                    _Collapser.collapserClose(collapseItem, animate);
                }
                else {
                    _Collapser.collapserOpen(collapseItem, animate, isAccordion);
                }
            }
        },
        /**
         * Method for opening clicked item
         * @param collapseItem
         * @param animate
         * @param isAccordion
         */
        collapserOpen: function(collapseItem, animate, isAccordion)
        {
            if (collapseItem.collapse.hasClass(options.collapsing) || collapseItem.trigger.hasClass('in')) {
                return;
            }

            var item = collapseItem.trigger,
                content = collapseItem.collapse,
                /**
                 * Search for opened items
                 */
                expandedItem = item.parent().children(options.accordion + '.in');

            if(content.length === 0) {
                return;
            }

            /**
             * Close opened items
             */
            if (expandedItem.length > 0 && expandedItem.hasClass(options.accordion) && isAccordion) {
                _Collapser.collapserClose({
                    trigger: expandedItem,
                    collapse: expandedItem.children(options.collapse)
                }, animate);
            }

            /**
             * add class in for setting display:block
             */
            item.addClass('in');

            /**
             * If has active attribute add it
             */
            var active;
            if (active = item.data('active')) {
                $(active).addClass(options.active);
            }

            /**
             * check for question item
             * useful for scrolling to it
             */
            var question = ( item.hasClass(options.scroll) && item.hasClass(options.accordion) && isAccordion) ? $(item.children()[0]) : [];

            /**
             * -add class .collapsing (set animating)
             * -remove .collapse classe (set default display)
             * set height to collapsing item
             * -check for transitionEnd
             */

            if(animate) {
                content.addClass(options.collapsing)
                    .removeClass(options.collapse)
                    .css('height', content[0].scrollHeight + 'px')
                    .transitionEnd(function()
                    {
                        /**
                         * -add .collapse.in class (set display:block)
                         * -remove .collapsing class (disable animating)
                         * -set height to auto
                         * -remove height
                         */
                        content.addClass(options.collapseIn)
                            .removeClass(options.collapsing)
                            .css('height', 'auto')
                            .css('height', '');

                        if (content.hasClass('navbar-collapse')) {
                            $('body').css('overflow', 'hidden');
                        }

                        /**
                         * If it's question item scroll to it
                         */
                        if (question.length > 0) {
                            /**
                             * scroll with timeout
                             */
                            setTimeout(function()
                            {
                                $('html, body').scrollTop(question.offset().top - $('#masthead').outerHeight(true), 200);
                            }, 20);
                        }

                        /**
                         * 350ms time of transition
                         * useful for browsers that doesn't support transition
                         */
                    }, 350);
            } else {
                content.css('height', '');
                /**
                 * If it's question item scroll to it
                 */
                if (question.length > 0) {
                    /**
                     * scroll with timeout
                     */
                    setTimeout(function()
                    {
                        $('html, body').scrollTop(question.offset().top - $('#masthead').outerHeight(true), 200);
                    }, 20);
                }
            }

            content.addClass(options.collapseIn);
        },
        /**
         * Method for closing clicked item
         * @param collapseItem
         * @param animate
         */
        collapserClose: function(collapseItem, animate)
        {
            if (collapseItem.collapse.hasClass(options.collapsing) || !collapseItem.trigger.hasClass('in')) {
                return;
            }

            var item = collapseItem.trigger,
                content = collapseItem.collapse;

            if(content.length === 0) {
                return;
            }

            /**
             * set height to collapsing item
             */
            content.css('height', content[0].scrollHeight + 'px');

            /**
             * remove class in for removing display:block
             */
            item.removeClass('in');


            /**
             * If has active attribute add it
             */
            var active;
            if (active = item.data('active')) {
                $(active).removeClass(options.active);
            }

            if(content.hasClass('navbar-collapse')) {
                $('body').css('overflow', '');
            }

            /**
             * -set height to collapsing item(2nd time for hardcode)
             * -remove .collapse.in classes (set default display)
             * -add class .collapsing (set animating)
             * -set height to 0px
             * -check for transitionEnd
             */
            if(animate) {
                content.css('height', content[0].scrollHeight + 'px')
                    .removeClass(options.collapseIn)
                    .addClass(options.collapsing)
                    .css('height', '0px')
                    .transitionEnd(function()
                    {
                        /**
                         * -add .collapse class (set display:none)
                         * -remove .collapsing class (disable animating)
                         * -remove height
                         */
                        content.addClass(options.collapse)
                            .removeClass(options.collapsing)
                            .css('height', '');

                        /**
                         * 350ms time of transition
                         * useful for browsers that doesn't support transition
                         */
                    }, 350);
            } else {
                content.css('height', '');
                content.removeClass('in');
            }
        }
    };

    $(document).ready(function()
    {
        new Collapser();
    });

    window['Collapser'] = Collapser;

})(window);
