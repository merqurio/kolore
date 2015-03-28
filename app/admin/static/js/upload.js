function dropUpload(dropElement){
    // Variables
    var dropArea = document.querySelector(dropElement),
        progressBar = document.getElementById('manager-progress');

    // Dropped file manager
    function fileSelectHandler(e) {
        e.preventDefault();

        // cancel event and hover styling
        dropArea.classList.remove('drag-hover');
        dropArea.classList.remove('active');


        // fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // Unable interaction in the meanwhile
        document.getElementById('modal-overlay').classList.remove('hide');

        // Add loading bar
        if (!progressBar){
            document.body.insertAdjacentHTML('beforeEnd', '<div id="manager-progress"><span></span></div>');
            progressBar = document.getElementById('manager-progress');
        } else {
            progressBar.classList.remove('hide');
        }

        // process all File objects
        for (var i = 0, f; f = files[i]; i++) {
            // Start upload callback
            uploadFileGCS(f);
        }

        // Enable interaction again
        document.getElementById('modal-overlay').classList.add('hide');

        // Remove Loading bar
        progressBar.classList.add('hide')
    }

    function uploadFileGCS(file) {
        console.log(file);
        gcsExecuteOnUrl(file, function (finalURL) {
            gcsUploadToGCS(file, finalURL)
        });
    }

    function gcsExecuteOnUrl(file, callback) {

        var request = new XMLHttpRequest(),
            that = this;

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
            formData = new FormData(),
            that = this;

        formData.append("file", file);
        request.open('POST', finalURL, true);
        request.onreadystatechange = function (e) {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText)
            } else if (this.readyState == 4 && this.status != 200) {
                console.log("Something went wrong")
            }
        };
        request.send(formData);
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