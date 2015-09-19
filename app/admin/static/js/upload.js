(function(){
    "use strict";
    var uploader = document.querySelectorAll('.tools-droparea');

    [].forEach.call(uploader, function(item){
        dropUpload(item);
    });

    function dropUpload(dropElement) {

        // Variables
        var dropArea = dropElement,
            fileInput = dropArea.querySelector('.file'),
            progressBar = document.getElementById('tools-progress'),
            formInput = dropArea.querySelector('.form-input'),
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

            if(!allFiles[0]){
                return;
            }

            // Unable interaction in the meanwhile
            document.getElementById('modal-overlay').classList.remove('hide');

            // Add loading bar
            if (!progressBar){
                progressBar = document.getElementById('tools-progress');

                //Try again, if it was programatically already crated
                if (!progressBar) {
                    document.body.insertAdjacentHTML('beforeEnd', '<div id="tools-progress"><span></span></div>');
                    progressBar = document.getElementById('tools-progress');
                } else {
                    progressBar.classList.remove('hide');
                }

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
                gcsUploadToGCS(file, finalURL);
            });
        }

        function gcsExecuteOnUrl(file, callback) {

            var request = new XMLHttpRequest();

            request.open('GET', '/admin/upload_url', true);

            request.onreadystatechange = function (e) {
                if (this.readyState === 4 && this.status === 200) {
                    callback(this.responseText);
                } else if (this.readyState === 4 && this.status !== 200) {
                    window.console.log("Couldn't get the upload URL");
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
                if (this.readyState === 4 && this.status === 200) {
                    file = JSON.parse(this.responseText);
                    addPrevisualization(file);
                } else if (this.readyState === 4 && this.status !== 200) {
                    window.console.log("Something went wrong on server side.");
                    // Enable interaction again
                    document.getElementById('modal-overlay').classList.add('hide');
                    // Remove Loading bar
                    progressBar.classList.add('hide');
                    window.alert('Error');
                }
            };
            request.send(formData);
        }

        // Add the file visualization after the drop
        function addPrevisualization(file){
            var wrapper = nextByClass(dropArea, 'grid');

            // Check if formInput
            if(formInput){
                addURLToForm(file);
            }

            if (typeof file.thumb != 'undefined') {
                //Create wrapper if doesn't exist
                if (!wrapper){
                    dropArea.insertAdjacentHTML('afterend','<div class="grid"></div>');
                    wrapper = nextByClass(dropArea, 'grid');
                }

                // Append the element
                wrapper.insertAdjacentHTML('beforeEnd', '<div class="grid-item uploaded" style="background-image: url('+file.thumb+');"></div>');
            } else {
                console.log('file has no thumb, skipping previsualization...');
            }

            // Check if all uploaded
            if (totalFiles === 0){
                // Enable interaction again
                document.getElementById('modal-overlay').classList.add('hide');

                // Remove Loading bar
                progressBar.classList.add('hide');

                allFiles = null;

            }
            else {
                // Remove one to totalFile
                totalFiles--;

                // Upload next one
                uploadFileGCS();
            }
        }

        // Adds a link to the form input
        function addURLToForm(file){
            if(fileInput.hasAttribute('multiple')){
                var prevInput = formInput.value,
                    links = (prevInput)? JSON.parse(prevInput) : [] ;
                links.push(file.filelink);
                formInput.value = JSON.stringify(links);
            }
            else {
                var nextElement = nextByClass(dropArea, 'grid');
                if(nextElement){
                    var previousPhoto = nextElement.querySelector('.grid-item');
                    if(previousPhoto){
                        nextElement.removeChild(previousPhoto);
                    }
                }
                if (typeof file.thumb == 'undefined') {
                    formInput.value = file.filelink;
                } else {
                    formInput.value = file.thumb;
                }
            }
        }

        // Helper funcs
        function hasClass(elem, cls) {
            var str = " " + elem.className + " ";
            var testCls = " " + cls + " ";
            return(str.indexOf(testCls) !== -1) ;
        }

        function nextByClass(node, cls) {
            while (node.nextSibling) {
                node = node.nextSibling;
                if (hasClass(node, cls)) {
                    return node;
                }
            }
            return null;
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

            // On area click
            dropArea.addEventListener('click', function(e){
                if(e.target !== fileInput){
                    fileInput.click();
                }

            });

            // On file selection
            fileInput.addEventListener('change', fileSelectHandler);

        }

        // Check if previous value
        if (formInput.value){
            var wrapper = nextByClass(dropArea, 'grid');
            //Create wrapper if doesn't exist
            if (!wrapper){
                dropArea.insertAdjacentHTML('afterend','<div class="grid"></div>');
                wrapper = nextByClass(dropArea, 'grid');
            }
            wrapper.insertAdjacentHTML('beforeEnd', '<div class="grid-item" style="background-image: url('+formInput.value+');"></div>');
        }
    }
})();
