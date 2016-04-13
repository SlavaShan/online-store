(function(window)
{
    var $ = window.DomDS;

    var patternEmail = /^(.[^@]+)@(.+)$/i;
    var patternNumber = /^-?[0-9]*(\.[0-9]+)?$/;
    var patternRequired = /\S/;
    var patterUrl = /^(https?:\/\/)?[\da-z\.\-]+\.[a-z\.]{2,6}[#&+_\?\/\w \.\-=]*$/i;
    var patternNTel = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

    var email = function(value) {

    };


    $.fn.validation = function(options)
    {
        var inputs = this;

        if (inputs.length === 0) {
            return inputs;
        }

        if(inputs.length > 1) {
            inputs.each(function(){
                $(this).validation(settings);
            });

            return inputs;
        }

        inputs.each(function()
        {
            var input = $(this);


        });
    };

    $(document).ready(function()
    {
        $('.ds-validate').validation();
    });

})(window);