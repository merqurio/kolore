(function(){
    "use strict";
    document.addEventListener('click', function(e){

        function isInt(value) {
            return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
        }

        if(e.target.id && e.target.id === 'more-posts'){
            var request = new XMLHttpRequest(),
                tbody = document.getElementById('posts-table-body');

            // Get the raltive path // IE9 Hack included
            var pathname = (window.location.pathname.charAt(0) == "/") ? window.location.pathname : "/" + window.location.pathname;
            var parts = pathname.split("/"),
                page_num = (isInt(parts[3]))? parseInt(parts[3]) : 1;

            console.log(page_num);

            // Get HTML
            request.open('GET', '/admin/'+ parts[2] + '/xhr/' + page_num, true);
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {

                    // Count the number of post, to know if last request or not
                    var post_number = 0;

                    // Success!
                    window.history.pushState(null,null, '/admin/'+ parts[2] + '/' + (page_num+1));

                    // make the shit happen
                    tbody.insertAdjacentHTML('beforeEnd', request.responseText);
                    [].forEach.call(document.querySelectorAll('.added-post'), function(item){
                        item.classList.remove('hide');
                        post_number++;
                    });

                    // Set Dates
                    [].forEach.call(document.querySelectorAll('.date'), function(item){
                        item.innerHTML = moment(item.dataset.date, "YYYY-MM-DD HH:mm:ss.SSSSSS").add(2, 'h').fromNow();
                    });

                    // Check if more post to come
                    if (request.responseText === "" || post_number%5 !== 0){
                        document.getElementById('more-posts').remove();
                    }

                } else {
                    // We reached our target server, but it returned an error
                    window.alert("There was an error while requesting more posts. Please reload the page.");
                }
            };
            request.send();
        }
    });
})();