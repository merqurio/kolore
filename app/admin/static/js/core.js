(function() {

    'use strict';
    /*global escape: true */

    // Language cookie
    function SetCookie(cookieName, cookieValue, nDays) {
        var today = new Date();
        var expire = new Date();
        if (nDays === null || nDays === 0){ nDays = 1;}
        expire.setTime(today.getTime() + 3600000 * 24 * nDays);
        document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString() + ";path=/";
    }

    document.addEventListener("DOMContentLoaded", function() {
        // Show the main card
        document.querySelector('.card').classList.remove('hide');
    });

    // Event listeners
    document.querySelector(".menu-bottom-lang").addEventListener("click", function(e) {

        if (e.target && e.target.nodeName === "LI") {
            var lang = e.target.className;

            SetCookie('lang', lang, 365);
            location.reload();
        } else if (e.target && e.target.nodeName === "A") {
            var parent = e.target.parentNode;

            lang = parent.className;

            SetCookie('lang', lang, 365);
            location.reload();
        }
    });
})();
