var overlay = document.querySelector('#modal-overlay'),
    box = document.querySelector('.modal-box'),
    progressBar = document.getElementById('tools-progress');

// Populate
function populateModal(title, content, action, objects, url){
    document.querySelector('#modal-header').innerText = title;
    document.querySelector('#modal-text').innerText = content;
    document.querySelector('#modal-action').innerText = action;
    document.querySelector('.modal').dataset['id'] = objects;
    document.querySelector('.modal').dataset['url'] = url;

}

// Open modal
function openModal(){
    box.classList.remove('hide');
    overlay.classList.remove('hide');
}

// Close modal
function closeModal(){
    box.classList.add('hide');
    overlay.classList.add('hide');
}

function deleteObjectsRequest(){
    var request = new XMLHttpRequest(),
        postData = {},
        objects = document.querySelector('.modal').dataset['id'],
        url = document.querySelector('.modal').dataset['url'];

    // Add loading bar
    if (!progressBar){
        document.body.insertAdjacentHTML('beforeEnd', '<div id="tools-progress"><span></span></div>');
        progressBar = document.getElementById('tools-progress');
    } else {
        progressBar.classList.remove('hide');
    }

    // Set data
    postData['objects'] = objects.toString();

    // Request
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(postData));
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {

            // Create array it is not
            var nodes = objects.split(',');
            nodes = ( typeof nodes != 'undefined' && nodes instanceof Array ) ? nodes : [nodes];

            // Success so remove from table
            for (var i = 0; i < nodes.length; i++) {
                var actualNode = document.getElementById(nodes[i]);
                actualNode.parentNode.removeChild(actualNode);
            }

            // Hide overlay and loader
            overlay.classList.add('hide');
            progressBar.classList.add('hide');

        } else {
        // We reached our target server, but it returned an error
            console.log('There was an error trying to delete the post')
        }
    };
    // Hide modal
    box.classList.add('hide');
}

if (box){
    // Listeners
    // Set modal closing listeners
    box.addEventListener('click', function(event){
        if (this.classList.contains('modal-box') && event.target.classList.contains('modal-box')) {
            closeModal();
        }
    });

    // Modal closing listener
    document.addEventListener('click', function(e){
        if(e.target && e.target.classList.contains('modal-close-action')){
            closeModal();
        }
    });

    // Set modals action
    document.querySelector('#modal-action').addEventListener('click', deleteObjectsRequest);
}

