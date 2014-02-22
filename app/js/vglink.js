"use strict";

chrome.storage.sync.get('useShoppingAssist', function(items) {
    if (items.useShoppingAssist == true) {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.innerText = "var vglnk = {api_url: '//api.viglink.com/api', key: '6bd5c05cd90e1902e22081bcaa452f9c'};";
        document.body.appendChild(s);

        s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'http://cdn.viglink.com/api/vglnk.js';
        document.body.appendChild(s);
    }
});
