/**
 * Router module
 */

/* TODO
 *
 *  History manipulation
 *  GET-parameters manipulation
 *  More info about current path
 *
 */
module.exports = function(routes, languages)
{
    var location = window.location;
    this.languages = languages || [];
    this.useLanguage = false;
    this.routes = routes || [];
    this.domain = location.host;
    this.hash = location.hash.substr(1);
    this.path = location.href.replace(new RegExp("^" + location.protocol + "\/\/" + location.host), '');
    this.segments = location.pathname.substr(1).split('/');

    this.segment = function(segment)
    {
        if (!this.useLanguage && !in_array(this.segments[0], this.languages)) {
            segment = segment - 1;
        }

        return this.segments[segment] || '';
    };

    return this;
};