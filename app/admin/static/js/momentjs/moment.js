(function(){
    "use strict";

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2){ return parts.pop().split(";").shift();}
    }

    // set Locale Lang
    moment.locale(getCookie('lang'));

    // Set dates (Initial)
    [].forEach.call(document.querySelectorAll('.date'), function(item){
        item.innerHTML = moment(item.dataset.date, "YYYY-MM-DD HH:mm:ss.SSSSSS").add(2, 'h').fromNow();
    });
})();