(function(){
    "use strict";
    document.addEventListener('click', function(e){

            var page = 0;

            if(e.target.id && e.target.id === 'more-posts'){
                var request = new XMLHttpRequest(),
                    tbody = document.getElementById('posts-table-body');

                // Add 1
                page++;

                // Get HTML
                request.open('GET', '/admin/posts/'+page, true);
                request.onload = function() {
                  if (request.status >= 200 && request.status < 400) {

                    // Count the number of post, to know if last request or not
                    var post_number = 0;

                    // Success!
                    tbody.insertAdjacentHTML('beforeEnd', request.responseText);
                    [].forEach.call(document.querySelectorAll('.added-post'), function(item){
                        item.classList.remove('hide');
                    });

                    // Set Dates
                    [].forEach.call(document.querySelectorAll('.date'), function(item){
                        item.innerHTML = moment(item.dataset.date, "YYYY-MM-DD HH:mm:ss.SSSSSS").add(1, 'h').fromNow();
                        post_number++;
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