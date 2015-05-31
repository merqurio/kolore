(function(){
    "use strict";

    var overlay = document.getElementById('modal-overlay'),
        box = document.querySelector('.modal-box'),
        progressBar = document.getElementById('tools-progress');

    // Populate
    function populateModal(trigger){
        var targets = (trigger.getAttribute('data-target').charAt(0) === '#')? [document.getElementById(trigger.getAttribute('data-target').substr(1))] : document.querySelectorAll(trigger.getAttribute('data-target')),
            keys = [];

        // Get the ID of target objects
        [].forEach.call(targets, function(item){
            keys.push(item.id);
        });

        // Cancel if not targets
        if (!keys[0]){
            return;
        }

        // Populate the modal for action
        document.querySelector('#modal-header').textContent = trigger.getAttribute('data-title');
        document.querySelector('#modal-text').textContent = trigger.getAttribute('data-content');
        document.querySelector('#modal-action').textContent = trigger.getAttribute('data-action');
        document.querySelector('.modal').setAttribute('data-id', JSON.stringify(keys));
        document.querySelector('.modal').setAttribute('data-url', trigger.getAttribute('data-url'));

        openModal();
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

    // Delete target objects
    function deleteObjectsRequest(){
        var request = new XMLHttpRequest(),
            postData = {},
            objects = document.querySelector('.modal').getAttribute('data-id'),
            url = document.querySelector('.modal').getAttribute('data-url');

        // Add loading bar
        if (!progressBar){
            document.body.insertAdjacentHTML('beforeEnd', '<div id="tools-progress"><span></span></div>');
            progressBar = document.getElementById('tools-progress');
        } else {
            progressBar.classList.remove('hide');
        }

        // Set data
        postData.objects = JSON.parse(objects);

        // Request
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(JSON.stringify(postData));
        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {

                // Create array it is not
                var nodes = JSON.parse(objects);
                nodes = ( typeof nodes !== 'undefined' && nodes instanceof Array ) ? nodes : [nodes];

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
                window.console.log('There was an error trying to delete the post');
            }
        };
        // Hide modal
        box.classList.add('hide');
    }

    // Set modal closing listeners
    document.addEventListener('click', function(event){
        if (event.target.classList.contains('modal-box')) {
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
    document.addEventListener('click',function(e){
        if(e.target && e.target.id === "modal-action"){
            deleteObjectsRequest();
        }
    });

    // Set modals triggers
    document.addEventListener('click', function(e){

        var isTarget = (e.target && e.target.classList.contains('modal-trigger'))? e.target : null,
            isChildren = (e.target.parentNode.classList && e.target.parentNode.classList.contains('modal-trigger'))? e.target.parentNode : null,
            trigger = isTarget || isChildren;

        if(trigger){
            populateModal(trigger);
        }
    });

})();