"use strict";

/**
 * Animation events for DOM
 */

module.exports = function(string, data) {
    var replacer = function(match, p1)
    {
        return data[p1];
    };

    string = string.replace(/{{([a-z_\-]+)}}/gi, replacer);

    return string;
};