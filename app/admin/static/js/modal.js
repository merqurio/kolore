var overlay = document.querySelector('#modal-overlay'),
    box = document.querySelector('.modal-box'),
    closeBtn = document.querySelectorAll('.modal-close-action');

// Populate
function populateModal(title, content, action, postId){
    document.querySelector('#modal-header').innerText = title;
    document.querySelector('#modal-text').innerText = content;
    document.querySelector('#modal-action').innerText = action;
    document.querySelector('.modal').dataset['id'] = postId;

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

function deletePostModalRequest(){
    var request = new XMLHttpRequest(),
        postData = {},
        postId = document.querySelector('.modal').dataset['id'],
        url = "/admin/posts";

    postData['post_id'] = postId.toString();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(postData));
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success so remove from table
            var actualNode = document.getElementById(postId);
            actualNode.parentNode.removeChild(actualNode);

        } else {
        // We reached our target server, but it returned an error
            console.log('There was an error trying to delete the post')
        }
    };
    closeModal();
}