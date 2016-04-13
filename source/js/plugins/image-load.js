(function(window)
{
    var $ = window.DomDS;

    var width = 0;
    var isXS = false;
    var isSM = false;
    var isMD = false;
    var isLG = false;
    var curGrid = 'xl';

    var devicePixelRatio = window.devicePixelRatio || ((window.screen.systemXDPI !== undefined && window.screen.logicalXDPI) && (window.screen.deviceXDPI / window.screen.logicalXDPI));

    var isX2 = devicePixelRatio && devicePixelRatio > 1;

    $(window).on('orientationchange', triggerResize);
    $(window).resize(updateWindowSizes);
    $(document).ready(updateWindowSizes);

    function triggerResize()
    {
        $(window).trigger('resize');
    }

    function updateWindowSizes()
    {
        width = $(window).width();
        isXS = width < 480;
        isSM = width < 768;
        isMD = width < 992;
        isLG = width < 1200;

        curGrid = isXS && 'xs' || isSM && 'sm' || isMD && 'md' || isLG && 'lg' || 'xl';
    }

    $.fn.imageLoad = function(options)
    {
        var images = this;

        var settings = {
            placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", // transparent 1px gif placeholder
            threshold: 300,
            throttle: 50,
            loading_class: 'loading',
            loaded_class: 'loaded',
            show_while_loading: true,
            container: window
        };

        if (options) {
            settings = extend(settings, options);
        }

        images = images.filter(function(i, image)
        {
            image = $(image);

            return image.data('src');
        });

        images.each(function(i, image)
        {
            image = $(image);

            /**
             * add placeholder if image without src
             */
            if (!image.prop('src') && image.is('img')) {
                image.prop('src', settings.placeholder);
            }

            /**
             * read grid parameters from image
             */
            var sources = image.data('src-sizes');

            if (!sources) {
                sources = {
                    xs: isX2 && image.data('xs-x2') || image.data('xs') || false,
                    sm: isX2 && image.data('sm-x2') || image.data('sm') || false,
                    md: isX2 && image.data('md-x2') || image.data('md') || false,
                    lg: isX2 && image.data('lg-x2') || image.data('lg') || false,
                    xl: isX2 && image.data('xl-x2') || image.data('xl') || image.data('src') || false
                };

                image.data('src-sizes', sources);
            }
        });

        $(window).resize(update);
        $(document).ready(update);

        function update()
        {
            images.each(function(i, image)
            {
                image = $(image);

                image.one('load', imageLoad);

                if (image[0].complete) {
                    image.trigger('load');
                }

                function imageLoad()
                {
                    var src = checkCurSrc(image);

                    if (!src) {
                        return false;
                    }

                    setUrl(image, src);
                }
            });
        }

        function checkCurSrc(image)
        {
            var curImageGrid = image.data('cur-size');

            if (curImageGrid) {
                if (curImageGrid.grid === curGrid) {
                    return false;
                }
            }

            curImageGrid = {grid: curGrid};

            var src = false;

            var sources = image.data('src-sizes');

            var i = 0;
            var keysArray = Object.keys(sources);


            forEach(sources, function(key, val)
            {
                if (key === curGrid) {
                    if(!val) {
                        return false;
                    }

                    src = val;
                }

                i++;
            });

            if(!src) {
                if(image.css('display') !== 'none') {
                    if (image.data('img-absolute')) {
                        src = sources.xl || false;
                    } else {
                        while (i >= 0) {
                            if (keysArray[i]) {
                                src = sources[keysArray[i]] || false;
                            }

                            i--;
                        }
                    }
                }
            }

            image.data('cur-size', curImageGrid);

            return src;
        }

        function setUrl(image, src)
        {
            image.hide();

            if (image.is('img')) {
                image.prop('src', src);
            } else {

                image.css('background-image', 'url(' + src + ')');
            }

            image.show();
        }

        return this;
    };

    $(document).ready(function()
    {
        $('img').imageLoad();
    });

})(window);