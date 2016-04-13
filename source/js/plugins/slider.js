/*

 <div class="flexslider" data-nav="true" data-dots="true" data-autoscroll="true">

 <div class="flex-viewport" style="overflow: hidden; position: relative;">

 <ul class="slides" style="width: 1000%; transition-duration: 0.6s; transform: translate3d(-2742px, 0px, 0px);">
 <li class="clone" aria-hidden="true" style="width: 1371px; float: left; display: block;">
 <img src="/static/img/banner_home.jpg" draggable="false">
 <div class="slider_info">
 <div class="container">
 <h4>Install the app <br> and register <br> <span>a Keepsolid id </span></h4>
 </div>
 </div>
 </li>
 <li class="" style="width: 1371px; float: left; display: block;">
 <img src="/static/img/banner_home.jpg" draggable="false">
 <div class="slider_info">
 <div class="container">
 <h4>Install the app <br> and register <br> <span>a Keepsolid id </span></h4>
 </div>
 </div>
 </li>
 <li style="width: 1371px; float: left; display: block;" class="flex-active-slide">
 <img src="/static/img/banner_home.jpg" draggable="false">
 <div class="slider_info">
 <div class="container">
 <h4>Install the app <br> and register <br> <span>a Keepsolid id </span></h4>
 </div>
 </div>
 </li>
 <li style="width: 1371px; float: left; display: block;">
 <img src="/static/img/banner_home.jpg" draggable="false">
 <div class="slider_info">
 <div class="container">
 <h4>Install the app <br> and register <br> <span>a Keepsolid id </span></h4>
 </div>
 </div>
 </li>
 <li class="clone" aria-hidden="true" style="width: 1371px; float: left; display: block;">
 <img src="/static/img/banner_home.jpg" draggable="false">
 <div class="slider_info">
 <div class="container">
 <h4>Install the app <br> and register <br> <span>a Keepsolid id </span></h4>
 </div>
 </div>
 </li>
 </ul>

 </div>
 <ol class="flex-control-nav flex-control-paging">
 <li><a class="">1</a></li>
 <li><a class="flex-active">2</a></li>
 <li><a>3</a></li>
 </ol>
 <ul class="flex-direction-nav">
 <li class="flex-nav-prev"><a class="flex-prev" href="#">Previous</a></li>
 <li class="flex-nav-next"><a class="flex-next" href="#">Next</a></li>
 </ul>
 </div>

 */

(function(window)
{
    var $ = window.DomDS,
        namespace = '.ds-slider',
        options = {
            wrap: namespace + '-wrap',
            slides: '.slides',
            dot: namespace + '-dots',
            nav: namespace + '-nav',
            active: namespace + '-active',
            arrows: true,
            toucharrows: false,
            dots: true,
            infinite: true,
            autoscroll: true,
            timeout: 6000,
            duration: 500,
            hoverstop: true,
            touch: true,
            simulate: true
        },
        isTouched,
        isTouchStart,
        isTouchMove,
        touchStartTime,
        isMoved,
        isScrolling,
        startMoving,
        startTranslate,
        currentTranslate,

        /**
         * Slider constructor
         * @constructor
         */
        Slider = function(element)
        {
            element = $(element);

            if (element.length === 0) {
                return;
            }
            if (element.length > 1) {
                element.each(function()
                {
                    new Slider(this);
                });

                return;
            }

            this.init(element);
        },
        self = {};

    Slider.prototype = {
        init: function(element)
        {
            self = this;

            self.slider = element;

            self.enable();

            return self;
        },
        enable: function()
        {
            self.options = extend(options, self.slider.dataset());

            self.createSlider();

            self.enableEvents();

            self.enableTouch();

            self.startAutoScroll();

            return self;
        },
        disable: function()
        {
            self.disableEvents();

            self.pauseAutoScroll();

            self.removeSlider();

            return self;
        },
        /**
         * Set events for slider
         */
        enableEvents: function()
        {
            if (self.options.hoverstop) {
                self.slider.mouseenter(self.pauseAutoScroll);
                self.slider.mouseleave(self.startAutoScroll);
            }

            if (self.options.arrows) {
                self.navPrev.click(self.prev);
                self.navNext.click(self.next);
            }

            if (self.options.dots) {
                self.dots.click(self.onDotClick);
            }

            $(window).resize(self.setWidth);
        },
        disableEvents: function()
        {
            //self.dropdown.off('click', self.dropdown, self.onOpenSelect);

            $(window).off('resize', self.setWidth);
        },

        /**
         * Create slider and configure slider elements
         */
        createSlider: function()
        {
            self.wrap = $('<div>').addClass(self.options.wrap);
            self.slidesBlock = self.slider.find(self.options.slides).appendTo(self.wrap);
            self.slides = self.slidesBlock.children('li');
            self.slidesCount = self.slides.length;

            self.curId = 0;

            self.slidesBlock.css('width', 100 * self.slidesCount + '%');

            if (self.options.infinite) {
                self.slides.eq(0).clone().addClass('clone').appendTo(self.slidesBlock);
                self.slides.eq(self.slidesCount - 1).clone().addClass('clone').prependTo(self.slidesBlock);

                self.slidesBlock.css('width', 100 * (self.slidesCount + 2) + '%');
            }

            self.allSlides = self.slidesBlock.children('li');
            self.allSlidesCount = self.allSlides.length;

            self.slidesPadding = (self.allSlidesCount - self.slidesCount) / 2;

            self.setWrapWidth();

            self.setWidth();

            self.wrap.appendTo(self.slider);

            if (supportTouch || supportIeTouch) {
                self.options.arrows = !!self.options.toucharrows;
            }

            if (self.options.arrows) {
                self.nav = $('<ul></ul>').addClass(self.options.nav).appendTo(self.slider);
                if ((supportTouch || supportIeTouch) && self.options.toucharrows) {
                    self.nav.addClass('active');
                }

                $('<li><a class="ds-slider-prev"></a></li><li><a class="ds-slider-next"></a></li>').appendTo(self.nav);
                self.navPrev = self.nav.find(namespace + '-prev');
                self.navNext = self.nav.find(namespace + '-next');
            }

            // Set dots if you want
            if (self.options.dots) {
                // create block
                self.dotsBlock = $('<ol></ol>').addClass(self.options.dot).appendTo(self.slider);
                // create dots
                for (var i = 0; i < self.slidesCount; i++) {
                    $('<li><a></a></li>').appendTo(self.dotsBlock);
                }
                // set globally dots
                self.dots = self.dotsBlock.find('a');
                // set active dot
                self.setActiveDot();
            }

            self.isSliding = false;
            self.slideTo(self.curId);
        },
        enableTouch: function()
        {
            if (!self.options.touch || (!supportTouch && !self.options.simulate)) {
                return;
            }

            var events = touchEvents(self.options.simulate);

            self.touches = {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                diff: 0
            };

            self.slidesBlock.on(events.start, self.onTouchStart, true);
            self.slidesBlock.on(events.move, self.onTouchMove, true);
            self.slidesBlock.on(events.end, self.onTouchEnd, true);
        },
        onTouchStart: function(e)
        {
            self.pauseAutoScroll();

            if (e.originalEvent) {
                e = e.originalEvent;
            }

            isTouchStart = e.type === 'touchstart';

            if (!isTouchStart && 'which' in e && e.which === 3) {
                return;
            }

            isTouched = true;
            isMoved = false;
            isScrolling = undefined;
            startMoving = undefined;

            self.touches.startX = self.touches.currentX = isTouchStart ? e.targetTouches[0].pageX : e.pageX || e.clientX;
            self.touches.startY = self.touches.currentY = isTouchStart ? e.targetTouches[0].pageY : e.pageY || e.clientY;

            touchStartTime = now();

            if (!isTouchStart) {
                e.preventDefault();
            }

        },
        onTouchMove: function(e)
        {
            if (e.originalEvent) {
                e = e.originalEvent;
            }

            self.pauseAutoScroll();

            if (self.isSliding) {
                return;
            }

            isTouchMove = e.type === 'touchmove';

            if (isTouchStart && e.type === 'mousemove') {
                return;
            }

            if (e.targetTouches && e.targetTouches.length > 1) {
                self.slideTo(self.curId);
                return;
            }

            self.touches.currentX = isTouchMove ? e.targetTouches[0].pageX : e.pageX || e.clientX;
            self.touches.currentY = isTouchMove ? e.targetTouches[0].pageY : e.pageY || e.clientY;
            if (typeof isScrolling === 'undefined') {
                isScrolling = Math.abs(self.touches.startX - self.touches.currentX) < Math.abs(self.touches.currentY - self.touches.startY);
            }

            if (self.touches.currentX !== self.touches.startX || self.touches.currentY !== self.touches.startY) {
                startMoving = true;
            }

            if (!isTouched) {
                return;
            }

            if (isScrolling) {
                isTouched = false;
                self.slideTo(self.curId);
                return;
            }

            if (!startMoving && supportIeTouch) {
                return;
            }

            e.stopPropagation();
            e.preventDefault();

            if (!isMoved) {
                startTranslate = self.curTranslate;

                self.slidesBlock.transitionDuration(0);

                if (self.isSliding) {
                    self.slidesBlock.transitionEnd();
                }

                self.slidesBlock[0].style.cursor = 'move';
                self.slidesBlock[0].style.cursor = '-webkit-grabbing';
                self.slidesBlock[0].style.cursor = '-moz-grabbing';
                self.slidesBlock[0].style.cursor = 'grabbing';
            }

            isMoved = true;

            var diff = self.touches.diff = self.touches.currentX - self.touches.startX;

            currentTranslate = diff + startTranslate;

            self.curTranslate = currentTranslate;

            self.slidesBlock.translate(self.curTranslate, 0, 0);
        },
        onTouchEnd: function(e)
        {
            if (e.originalEvent) {
                e = e.originalEvent;
            }

            if (!isTouched) {
                return;
            }

            if (isMoved && isTouched) {
                self.slidesBlock[0].style.cursor = 'move';
                self.slidesBlock[0].style.cursor = '-webkit-grab';
                self.slidesBlock[0].style.cursor = '-moz-grab';
                self.slidesBlock[0].style.cursor = 'grab';
            }

            var touchEndTime = now();

            var timeDiff = touchEndTime - touchStartTime;

            if (!isTouched || !isMoved || self.touches.diff === 0 || currentTranslate === startTranslate) {
                isTouched = isMoved = false;
                return;
            }

            isTouched = isMoved = false;

            if (currentTranslate > self.slidesTranslate[0] - self.sliderWidth * 0.3) {
                self.slideTo(self.slidesCount - 1);
                return;
            }
            if (currentTranslate < self.slidesTranslate[self.allSlidesCount - 1] - self.sliderWidth * 0.3) {
                self.slideTo(0);
                return;
            }

            var diff = Math.abs(startTranslate) - Math.abs(currentTranslate);
            self.swipeDirection = diff > self.sliderWidth * 0.3 ? 'prev' : (diff < -self.sliderWidth * 0.3 ? 'next' : false);

            if (self.swipeDirection === 'prev') {
                self.prev();
            }

            if (self.swipeDirection === 'next') {
                self.next();
            }

            if (!self.swipeDirection) {
                self.slideTo(self.curId);
            }

            self.touches = {
                startX: null,
                startY: null,
                currentX: null,
                currentY: null,
                diff: null
            };

        },
        /**
         * Set active slide
         */
        setActiveSlide: function()
        {
            self.slidesBlock.find(self.options.active).removeClass(self.options.active);
            self.slides.eq(self.curId).addClass(self.options.active);
        },
        /**
         * Get current active slide index
         */
        getActiveSlide: function()
        {
            return self.slidesBlock.children(self.options.active).index();
        },
        /**
         * Set width of each slide
         */
        setWidth: function()
        {
            self.sliderWidth = self.slider.width();
            self.allSlides.css('width', self.sliderWidth + 'px');

            self.slidesTranslate = [];

            for (var i = 0; i < self.allSlidesCount; i++) {
                self.slidesTranslate.push(i * -self.sliderWidth);
            }

            self.slidesBlock.transitionDuration(0);

            self.curTranslate = self.slidesTranslate[self.curId + self.slidesPadding];

            self.slidesBlock.translate(self.curTranslate, 0, 0);
        },
        setWrapWidth: function()
        {
            self.slidesBlock.css('width', 100 * (self.allSlidesCount) + '%');
        },
        /**
         * Get width of slide
         */
        getWidth: function()
        {
            return toInt(self.slides.css('width'));
        },
        /**
         * Set Arrows state (usefull for non-infinite slider)
         * show/hide arrows
         */
        setArrowsState: function()
        {
            if (self.options.arrows) {
                if (!self.options.infinite) {
                    self.navNext.show();
                    self.navPrev.show();
                    if (self.curId === 0) {
                        self.navPrev.hide();
                    }
                    if (self.curId === (self.slidesCount - 1)) {
                        self.navNext.hide();
                    }
                }
            }
        },
        /**
         * Set active dot by current active slide
         */
        setActiveDot: function()
        {
            self.dotsBlock.find(self.options.active).removeClass(self.options.active);
            self.dots.eq(self.curId).addClass(self.options.active);
        },
        /**
         * Get Index of active dot
         * @returns {*}
         */
        getActiveDot: function()
        {
            return self.dotsBlock.find(self.options.active).parent().index();
        },
        getTransitionDuration: function(el)
        {
            var duration = self.options.duration * (Math.abs(self.curTranslate - (el ? el : 0)) / self.sliderWidth);
            return duration > self.options.duration ? self.options.duration : duration;
        },
        /**
         * Slide to
         * @param index
         */
        slideTo: function(index)
        {
            if (self.isSliding) {
                return;
            }

            self.isSliding = true;

            index = (index >= self.slidesCount) ? 0 : (index < 0) ? self.slidesCount - 1 : index;

            self.pauseAutoScroll();

            if (self.options.infinite && index === 0 && self.curId === (self.slidesCount - 1)) {
                self.slidesBlock.transitionDuration(self.getTransitionDuration(self.slidesTranslate[self.allSlidesCount - 1]));

                self.curTranslate = self.slidesTranslate[self.allSlidesCount - 1];

                self.slidesBlock.translate(self.curTranslate, 0, 0).transitionEnd(function()
                {
                    self.curTranslate = self.slidesTranslate[index + self.slidesPadding];

                    self.slidesBlock.transitionDuration(0);
                    self.slidesBlock.translate(self.curTranslate, 0, 0);

                    setTimeout(function()
                    {
                        self.isSliding = false;
                    }, 30);

                }, self.options.duration);
            } else if (self.options.infinite && index === (self.slidesCount - 1) && self.curId === 0) {
                self.slidesBlock.transitionDuration(self.getTransitionDuration());
                self.slidesBlock.translate(0, 0, 0).transitionEnd(function()
                {
                    self.curTranslate = self.slidesTranslate[index + self.slidesPadding];

                    self.slidesBlock.transitionDuration(0);
                    self.slidesBlock.translate(self.curTranslate, 0, 0);

                    setTimeout(function()
                    {
                        self.isSliding = false;
                    }, 30);

                }, self.options.duration);
            } else {
                self.slidesBlock.transitionDuration(self.getTransitionDuration(self.slidesTranslate[index + self.slidesPadding]));

                self.curTranslate = self.slidesTranslate[index + self.slidesPadding];

                self.slidesBlock.translate(self.curTranslate, 0, 0);

                setTimeout(function()
                {
                    self.isSliding = false;
                }, self.options.duration + 20);
            }

            self.curId = index;

            if (self.options.dots) {
                self.setArrowsState();
            }
            if (self.options.dots) {
                self.setActiveDot();
            }

            self.setActiveSlide();

            self.startAutoScroll();
        },
        prev: function()
        {
            self.slideTo(self.curId - 1);
        },
        next: function()
        {
            self.slideTo(self.curId + 1);
        },
        onDotClick: function()
        {
            var index = $(this).parent().index();
            if (index == self.curId) {
                return;
            }

            self.slideTo(index);

        },
        startAutoScroll: function()
        {
            if (self.options.autoscroll) {
                self.autoscroll = setTimeout(self.next, self.options.timeout);
            }
        },
        pauseAutoScroll: function()
        {
            if (self.options.autoscroll) {
                clearTimeout(self.autoscroll);
            }
        }
    };

    $(document).ready(function()
    {
        /**
         * Create Slider on the fly
         */
        var items = $(namespace);
        items.each(function()
        {
            new Slider($(this));
        });
    });

    window['Slider'] = Slider;

})(window);