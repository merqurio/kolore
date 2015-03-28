function dropUpload(dropElement){
    // Variables
    var dropArea = document.querySelector(dropElement),
        progressBar = document.getElementById('tools-progress'),
        allFiles,
        totalFiles;

    // Dropped file manager
    function fileSelectHandler(e) {
        e.preventDefault();

        // cancel event and hover styling
        dropArea.classList.remove('drag-hover');
        dropArea.classList.remove('active');


        // fetch FileList object
        allFiles = e.target.files || e.dataTransfer.files;
        totalFiles = allFiles.length-1;

        // Unable interaction in the meanwhile
        document.getElementById('modal-overlay').classList.remove('hide');

        // Add loading bar
        if (!progressBar){
            document.body.insertAdjacentHTML('beforeEnd', '<div id="tools-progress"><span></span></div>');
            progressBar = document.getElementById('tools-progress');
        } else {
            progressBar.classList.remove('hide');
        }

        //Upload process begin
        uploadFileGCS();

    }

    // Start the callback hell
    function uploadFileGCS() {

        var file = allFiles[totalFiles];

        gcsExecuteOnUrl(file, function (finalURL) {
            gcsUploadToGCS(file, finalURL)
        });
    }

    function gcsExecuteOnUrl(file, callback) {

        var request = new XMLHttpRequest();

        request.open('GET', '/admin/upload_url', true);

        request.onreadystatechange = function (e) {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText);
            } else if (this.readyState == 4 && this.status != 200) {
                console.log("Couldn't get the upload URL");
            }
        };
        request.send();
    }

    function gcsUploadToGCS(file, finalURL) {

        var request = new XMLHttpRequest(),
            formData = new FormData();

        formData.append("file", file);
        request.open('POST', finalURL, true);
        request.onreadystatechange = function (e) {
            if (this.readyState == 4 && this.status == 200) {
                file = JSON.parse(this.responseText);
                addPrevisualization(file);
            } else if (this.readyState == 4 && this.status != 200) {
                console.log("Something went wrong")
            }
        };
        request.send(formData);
    }

    // Add the file visualization after the drop
    function addPrevisualization(file){
        var wrapper = document.querySelector('.grid');

        //Create wrapper if doesn't exist
        if (!wrapper){
            dropArea.insertAdjacentHTML('afterend','<div class="grid"></div>');
            wrapper = document.querySelector('.grid');
        }

        // Append the element
        wrapper.insertAdjacentHTML('beforeEnd', '<div class="grid-item" style="background-image: url('+file.thumb+');"></div>')



        // Check if all uploaded
        if (totalFiles === 0){
            // Enable interaction again
            document.getElementById('modal-overlay').classList.add('hide');

            // Remove Loading bar
            progressBar.classList.add('hide')
        } else {
            // Remove one to totalFile
            totalFiles--;

            // Upload next one
            uploadFileGCS();
        }


    }

    // Event listeners
    if (dropArea) {

        // On drag hover window prevent drop
        window.addEventListener("dragover", function (e) {
            e = e || event;
            e.preventDefault();
            dropArea.classList.add('drag-hover');
        });

        window.addEventListener("drop", function (e) {
            e = e || event;
            e.preventDefault();
            dropArea.classList.remove('drag-hover');
        });

        document.body.addEventListener("dragleave", function (e) {
            e = e || event;
            e.preventDefault();
            dropArea.classList.remove('drag-hover');
        });

        // On drag hover drop area
        dropArea.addEventListener("dragover", function () {
            dropArea.classList.add('active');
        });

        dropArea.addEventListener("dragleave", function () {
            dropArea.classList.remove('active');
        });

        // On drop in the drop area
        dropArea.addEventListener('drop', fileSelectHandler);

    }
}