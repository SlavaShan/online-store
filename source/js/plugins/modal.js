"use strict";

(function(window)
{
    var DEFAULT = {
            item: '.figure-image',
            toggle: '.modal-toggle',
            modalImg: '.modal-image',
            show: '.modal-show',
            block: '.modal-block',
            title: '.figure-title'
        },
        Modal = function(toggle)
        {
            toggle = toggle.toggle;
            this.options = extend(DEFAULT, toggle);

            this.init();
        },
        _Modal = {},
        $ = window.DomDS;

    Modal.prototype = {
        init: function()
        {
            _Modal = this;

            var modalLinks = $(_Modal.options.toggle).find(_Modal.options.item);

            _Modal.totalCount = modalLinks.length;

            modalLinks.each(function(i){
                $(this).attr('data-id', i+1);
                _Modal.setEvent(this);
            });

        },
        setEvent: function(link)
        {
            $(link).on('click', _Modal.options.item, _Modal.onClick);
        },
        onClick: function(event)
        {
            event.stopPropagation();
            event.preventDefault();

            _Modal.curModal = $(this);

            _Modal.buildModal();
        },
        onClose: function(event)
        {
            event.preventDefault();
            event.stopPropagation();

            var modal = $('.modal-bg, .modal-wrap');

            _Modal.modalFigure.outerClick(_Modal.onClose, true);
            $('.modal-close').off('click', _Modal.onClose);

            $('body').css({
                'overflow': '',
                'margin-right': ''
            });
            modal.removeClass(_Modal.options.show).transitionEnd(function()
            {
                modal.removeClass(_Modal.options.block).remove();

            }, 350);
        },
        disableScroll: function(event)
        {
            event.preventDefault();
        },
        buildModal: function()
        {
            var currentBlock = _Modal.curModal;

            var html = '<div class="modal-bg"></div>'
                + '<div class="modal-wrap">'
                + '<div class="modal-container">'
                + '<div class="modal-content">'
                + '<div class="modal-figure">'
                + '<button class="modal-close" title="Close (Esc)" type="button">x</button>'
                + '<figure>'
                + '</figure>'
                +'</div></div></div></div>';

            var link = currentBlock.attr('href');

            var title = currentBlock.data('title');

            var titleCount = currentBlock.attr('data-id');

            var modal = $(html);
            $('body').append(modal);

            var img = $('<img/>')
                .addClass('modal-image')
                .attr('src', link);

            _Modal.modalFigure = modal.find('.modal-figure');
            _Modal.modalImage = img;
            _Modal.figure = modal.find('figure');

            if(titleCount) {
                _Modal.modalCount = $('<div>').addClass('modal-count');
                _Modal.modalCount
                    .text(titleCount + " / " + _Modal.totalCount)
                    .appendTo(_Modal.figure);

                var navigation = $('<div>').addClass('modal-nav');

                var navLeft = $('<div>').addClass('modal-nav-left');
                var navRight = $('<div>').addClass('modal-nav-right');

                navLeft.appendTo(navigation);
                navRight.appendTo(navigation);

                navigation.appendTo(_Modal.figure);

                navLeft.click(_Modal.prevModal);
                navRight.click(_Modal.nextModal);
            }

            _Modal.figure.append(img);

            if(title) {
                _Modal.modalTitle = $('<div>').addClass('modal-title');
                _Modal.modalTitle
                    .text(title)
                    .appendTo(_Modal.figure);
            }

            setTimeout(function()
            {
                modal.on('touchmove', _Modal.disableScroll);

                modal.addClass(_Modal.options.block)
                    .addClass(_Modal.options.show);

                $('body').css({
                    'overflow': 'hidden',
                    'margin-right': getScrollBarWidth() + 'px'
                });

                

                var diff = toInt(_Modal.modalFigure.css('padding-top')) + toInt(_Modal.modalFigure.css('padding-bottom'));

                var siblings = $(img).nextAll();

                // Check for siblings
                if(siblings) {
                    siblings.each(function(){
                        diff += this.scrollHeight;
                    });
                }

                siblings = $(img).prevAll();

                // Check for siblings
                if(siblings) {
                    siblings.each(function(){
                        diff += this.scrollHeight;
                    });
                }

                img.css('max-height', $(window).height() - diff + 'px');
                $(window).on('resize', function()
                {
                    img.css('max-height', $(window).height() - diff + 'px');
                });
                $('.modal-close').click(_Modal.onClose);
                _Modal.modalFigure.outerClick(_Modal.onClose);
            }, 10);
        },
        updateModal: function(where) {
            var curId = toInt(_Modal.curModal.attr('data-id'));

            where = where <= 0 ? curId-1 : curId+1;

            where = (where > _Modal.totalCount) ? 1 : ((where <= 0) ? _Modal.totalCount : where);

            var nextModal = $(_Modal.options.toggle).find("[data-id='" + where + "']");

            var link = nextModal.attr('href') || '';

            var title = nextModal.data('title') || '';

            var titleCount = nextModal.attr('data-id') || '';

            _Modal.modalImage.attr('src', link);
            _Modal.modalCount.text(titleCount + " / " + _Modal.totalCount);
            _Modal.modalTitle.text(title);

            _Modal.curModal = nextModal;
        },
        nextModal: function()
        {
            _Modal.updateModal(1);
        },
        prevModal: function() {
            _Modal.updateModal(-1);
        }
    };

    $(document).ready(function()
    {
        new Modal('.figure-image');
    });

    window['Modal'] = Modal;
})(window);