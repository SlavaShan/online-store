var Cookies = require('./../modules/cookie.js');

(function(window)
{
    var $ = window.DomDS;


    $(document).ready(function()
    {
        var initTraffic = function()
        {
            var trafficBlock = $('.traffic_num');

            if (trafficBlock.length == 0) {
                return;
            }

            var sec = $('.co_hid')[0].value,
                arr_val = [],
                value,
                c_nums = $('.c_num');


            for (var i = 0; i < c_nums.length; i++) {
                arr_val[i] = $('span', c_nums[i]);
                arr_val[i] = arr_val[i][arr_val[i].length - 1].textContent;
                c_nums[i].innerHTML = "";
                c_nums[i].innerHTML = '<span class="count_blocks">0 1 2 3 4 5 6 7 8 9 0</span>';
                elposition($('.count_blocks', c_nums[i])[0], arr_val[i] - 1, 50);
            }

            arr_val.reverse();

            sec = sec == 0 ? 400 : sec;
            sec = 1000 / sec;

            setInterval(increment, sec);

            setInterval(function()
            {
                value = arr_val.reversedCopy();
                var oldVal = Cookies.getJSON('unn');
                if(oldVal) {
                    oldVal.old = +value.join('');
                    Cookies.set('unn', oldVal, {expires: 1, path: '/', domain: window.cerrentDomain});
                }


            }, 500);

            function increment()
            {
                var x,
                    elem = $('.c_num .count_blocks'),
                    elem_l = elem.length - 1, y;

                for (x = 0, y = arr_val.length - 1; x <= y; x++) {
                    if (++arr_val[x] > 9) {
                        arr_val[x] = 0;

                        elposition(elem[elem_l - x], 9, x == 0 ? 4 : x == 1 ? 40 : 160);
                        if (y == x) {
                            add_num();
                        }
                    }
                    else {
                        elposition(elem[elem_l - x], arr_val[x] - 1, x == 0 ? 4 : x == 1 ? 40 : 160);
                        break;
                    }
                }
            }

            function elposition(el, pos, speed)
            {
                var top_new = pos * -34;

                el = $(el);
                el.transitionDuration(speed);
                el.translate(0, top_new - 34);

                var onComplete = function()
                {
                    el.transitionDuration(0);
                    el.translate(0, 0);
                };

                if(++pos == 10) {
                    el.transitionEnd(onComplete, speed);
                }

            }

            function add_num()
            {
                arr_val.push(1);
                var len = arr_val.length - 1,
                    new_num = $("<span>"),
                    first_num = $('.c_num'),
                    new_num_dot = $("<span>");

                new_num.addClass("count_numb c_num");
                new_num_dot.addClass("count_numb c_break");
                new_num.html('<span class="count_blocks">0 1 2 3 4 5 6 7 8 9 0</span>');
                new_num_dot.html("<span>.</span>");

                new_num.insertBefore(first_num);
                if (len % 3 == 0) {
                    new_num_dot.insertBefore(first_num);
                }
            }
        };

        initTraffic();
    });

})(window);