(function(window)
{
    var $ = window.DomDS;

    var downloadArray = ['ios', 'android', 'mac', 'windows', 'linux', 'windows-phone', 'apple-tv'];

    $(document).ready(function()
    {
        var downloadTabs = $('.download-tabs > li.tab-link');

        var changeHashOnClick = function(e) {
            var index = e.detail && e.detail.value || 0;

            window.location.hash = '#' + downloadArray[index];
        };

        if(downloadTabs.length > 0) {

            // Read hash value
            if(window.location.hash) {
                var index = downloadArray.indexOf(window.location.hash.replace('#', ''));

                if(index != -1) {
                    downloadTabs.eq(index).click();
                }
            } else{
                downloadTabs.trigger('tab.update', {value: 0});
            }


            downloadTabs.on('tab.change', changeHashOnClick);
        }

        /**
         * Download increment
         */
        window.downloadIncrement = function(value){
            $.ajax({
                method: 'POST',
                url: '/api/downloadincrement',
                dataType: 'json',
                data: {platform: value}
            });
        }
    });

})(window);