var lang_uri = window.userLang;

var language = {};
language.en = {

};
language.ru = {

};
language.cn = {

};
language.ar = {

};

module.exports = function(key)
{
    if(isDefined(window.language)) {
        language[lang_uri] = window.language;
    }

    return language[lang_uri][key];
};