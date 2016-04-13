var gettext = require('./language');

(function(window)
{
    var $ = window.DomDS;

    $(document).ready(function()
    {
        var faqForm = $('.faq_finder_form');

        if (faqForm.length == 1) {
            var faqButton = $('.faq_finder_submit');
            var faqButtonClear = $('.faq_finder_clear');
            var faqInput = $('.faq_finder_input');
            var faqContent = $('.faq_page_cnt_info');

            var errorBlock = $('<div class="faq_finder-error"><h4></h4></div>');
            var errorMessage = gettext('Sorry, no results found for') + ' ';
            errorBlock.insertAfter(faqContent);
            errorBlock.hide();

            var faqBlocks = [];

            var faqTabs = faqContent.find('.tab-content');
            var faqTabLinks = faqContent.find('.tab-link');

            faqTabs.each(function(i)
            {
                var tab = $(this);

                var questionBlock = tab.find('.faq_quest');

                faqBlocks[i] = [];

                questionBlock.each(function(j)
                {
                    faqBlocks[i][j] = $(this);
                })
            });

            var skipTags = new RegExp("^(?:EM|SCRIPT|FORM)$");
            var highlightColor = 'rgba(252, 168, 126, 0.5)';
            var regex = "";


            var setRegex = function(value)
            {
                value = value.replace(/[^\w0-9\\u ]+/, "").replace(/[ ]+/g, "|");

                regex = new RegExp("(" + value + ")", 'i');
            };

            var highlightingWords = function(curNode)
            {
                if (curNode === undefined || !curNode) {
                    console.log('undefined node');
                    return false;
                }

                if (skipTags.test(uppercase(curNode.nodeName))) {
                    return false;
                }

                var nodeValue, regexps;

                if (curNode.childNodes && curNode.childNodes.length > 0) {
                    var found = false;

                    for (var i = 0; i < curNode.childNodes.length; i++) {
                        if (highlightingWords(curNode.childNodes[i])) {
                            found = true;
                        }
                    }

                    return found;
                }

                if (curNode.nodeType == 3) { // NODE_TEXT

                    if ((nodeValue = curNode.nodeValue) && (regexps = regex.exec(nodeValue))) {

                        var match = document.createElement('EM');
                        match.appendChild(document.createTextNode(regexps[0]));
                        match.style.backgroundColor = highlightColor;
                        match.style.fontStyle = "inherit";
                        match.style.color = "inherit";

                        var after = curNode.splitText(regexps.index);
                        after.nodeValue = after.nodeValue.substring(regexps[0].length);
                        curNode.parentNode.insertBefore(match, after);


                        return true;
                    }
                }

                return false;
            };

            var removeHighlighting = function(target)
            {
                var arr = target.getElementsByTagName('EM');
                var el;
                while (arr.length && (el = arr[0])) {
                    var parent = el.parentNode;
                    parent.replaceChild(el.firstChild, el);
                    parent.normalize();
                }
            };

            var findTextInOneNode = function(target, value)
            {
                removeHighlighting(target);

                if (!value || value == '') {
                    return false;
                }

                setRegex(value);

                return highlightingWords(target);
            };

            var findText = function(value)
            {
                var firstFoundTab = false;

                forEach(faqBlocks, function(tabIndex)
                {
                    var tabBlocks = this;

                    var tabFound = false;

                    forEach(tabBlocks, function()
                    {
                        var curQuestion = this;
                        var curQuestionFound = false;
                        var inAnswer = false;

                        var allChildren = curQuestion.children();

                        var answer = $(allChildren[0]);

                        /**
                         * Find in Question and Answer
                         */
                        for (var i = 0, l = allChildren.length; i < l; ++i) {
                            var result = findTextInOneNode(allChildren[i], value);

                            if (result) {
                                if (i === 1) {
                                    inAnswer = true;
                                }

                                if (curQuestionFound === false) {
                                    curQuestionFound = true;
                                }

                                if (tabFound === false) {
                                    tabFound = true;
                                    if (firstFoundTab === false) {
                                        firstFoundTab = tabIndex;
                                    }
                                }
                            }
                        }

                        /**
                         * Q-A processing
                         */
                        if (!curQuestionFound && value && value !== '') {
                            curQuestion.hide();

                            answer.trigger('collapser.close', true);
                        } else {
                            curQuestion.show();

                            if (inAnswer) {
                                answer.trigger('collapser.open', {noAccordion: true, noAnimate: true});
                            } else {
                                answer.trigger('collapser.close', true);
                            }
                        }
                    });

                    /**
                     * Tab process
                     */
                    if (!tabFound) {
                        faqTabLinks.eq(tabIndex).hide();
                    } else {
                        faqTabLinks.eq(tabIndex).show();
                    }
                });

                /**
                 * Current tab change
                 */
                if (firstFoundTab !== false) {
                    errorBlock.hide();
                    errorBlock.children('h4').text('');

                    faqTabLinks.trigger('tab.update', {value: firstFoundTab});
                } else {
                    errorBlock.show();
                    errorBlock.children('h4').text(errorMessage + '"' + value + '"');
                }

                if (value === '') {
                    errorBlock.hide();
                    errorBlock.children('h4').text('');

                    faqTabLinks.show();
                    faqTabLinks.trigger('tab.update', {value: 0});
                }
            };


            var onSearchSubmit = function(e)
            {
                e.preventDefault();

                var value = trim(faqInput[0].value);

                faqInput.blur();
                faqInput.outerClick();

                findText(value);
            };

            var onButtonClearClick = function(e)
            {
                e.preventDefault();

                faqInput[0].value = '';
                onSearchSubmit(e);
            };

            var onInputFocus = function(e)
            {
                e.preventDefault();

                faqButtonClear.removeClass('active');
                faqButton.addClass('active');
            };

            var onInputBlur = function(e)
            {
                e.preventDefault();

                var value = trim(faqInput[0].value);

                if (value != '') {
                    faqButtonClear.addClass('active');
                    faqButton.removeClass('active');
                } else {
                    faqButtonClear.removeClass('active');
                    faqButton.addClass('active');
                }
            };

            faqForm.submit(onSearchSubmit);

            faqInput.focus(onInputFocus);
            faqInput.outerClick(onInputBlur);

            faqButtonClear.click(faqButtonClear, onButtonClearClick);
        }
    });

})(window);