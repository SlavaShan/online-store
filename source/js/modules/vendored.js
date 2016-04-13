"use strict";

/**
 * Get vendor-prefixed property for css and js
 * And check for css transform and 3D transform support
 */
module.exports = (function(window)
{
    var testEl = document.createElement('div'),
        wildEvents = 'animationEnd transitionEnd'.split(' '),
        cssTestProperties = 'animation transform perspective'.split(' '),
        vendorPrefixes = ' moz ms o webkit khtml Moz MS O WebKit op Khtml'.split(' '),
        vendoredJsCache = {},
        vendoredCssCache = {};

    /**
     * test for supporting some css properties and add class to body such as Modernizr
     */
    var testCSS = function(properties)
        {
            var docEl = document.documentElement,
                length = 0,
                prop,
                pass;

            properties = properties || [];
            /**
             * Add new properties for testing
             */
            if (isString(properties)) {
                cssTestProperties.push(properties);
            }
            else {
                length = properties.length;
                while (length--) {
                    cssTestProperties.push(properties[length]);
                }
            }

            length = cssTestProperties.length;

            /**
             * Loop over testing properties
             */
            while (length--) {
                prop = cssTestProperties[length];
                pass = vendoredCss(prop);

                if (prop == 'perspective') {
                    prop = 'transform3d';
                }
                /**
                 * If test is goot add className to html document
                 */
                if (pass) {
                    docEl.className += ' ' + prop;
                }
            }

        },
        /**
         * Get vendored JS properties
         *
         * @param property
         * @param context
         * @returns {*}
         */
        vendoredJs = function(property, context)
        {
            return (property in vendoredJsCache) ? vendoredJsCache[property] : vendored(property, false, context);
        },
        /**
         * Get vendored CSS properties
         *
         * @param property
         * @returns {*}
         */
        vendoredCss = function(property)
        {
            return (property in vendoredCssCache) ? vendoredCssCache[property] : vendored(property, true);
        },
        /**
         * get vendored property
         * @param {string} property
         * @param {bool} isStyle   if true return vendored property for style
         * @param {object} [context]
         */
        vendored = function(property, isStyle, context)
        {
            var length = vendorPrefixes.length,
                i,
                newProperty,
                vendor;

            /**
             * Set context. Default is window object
             */
            context = context || isStyle ? testEl.style : window;

            /**
             * Looping over vendor prefixes
             */
            for (i = 0; i < length * 2; i++) {
                vendor = vendorPrefixes[(i >= length) ? i - length : i];

                /**
                 * set newProperty to something like webkitTransitionEnd
                 */
                newProperty = property;
                if (vendor.length > 0) {
                    newProperty = vendor + ucfirst(property);
                }

                /**
                 * In second looping - check for some wildest properties such as {otransitionend} under {oTransitionEnd}
                 */
                newProperty = (i >= length) ? lowercase(newProperty) : newProperty;

                if (isStyle && (newProperty in context)) {
                    vendoredCssCache[property] = newProperty;

                    return newProperty;
                }


                if (!isStyle && ( (newProperty in context) || ( 'on' + lowercase(newProperty) in context ) )) {
                    if (vendor.length < 1 && in_array(property, wildEvents)) {
                        newProperty = lowercase(newProperty);
                    }
                    vendoredJsCache[property] = newProperty;

                    return newProperty;
                }
            }

            /**
             * If not support, set cache for this property to false
             */
            if (isStyle) {
                vendoredCssCache[property] = false;
            }
            else {
                vendoredJsCache[property] = false
            }
            /**
             * And return false
             */
            return false;

        };

    testCSS();
    window['testCSS'] = testCSS;
    window['vendorCss'] = vendoredCss;
    window['vendorJs'] = vendoredJs;

    return {
        testCSS: testCSS,
        vendoredCss: vendoredCss,
        vendoredJs: vendoredJs
    };

})(window);