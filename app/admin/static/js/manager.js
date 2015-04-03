(function(){
    "use strict";
    var grid = document.getElementById('grid');


        if (grid){

            var gallleryBtn = document.getElementById('gallery-btn');

            // Grid listener
            grid.addEventListener('click', function(e){
                if(e.target && e.target.classList.contains('grid-item')){
                    e.target.classList.toggle('active');
                }
            });



            // Gallery listener
            gallleryBtn.addEventListener('click', function(){
                var selected = document.querySelectorAll('.active'),
                    gallery = document.getElementById('image-gallery'),
                    options = {
                        closeOnScroll: false,
                        showHideOpacity:true,
                        hideAnimationDuration:true

                    },
                    slides = [];

                // Add slide per image
                [].forEach.call(selected, function(item){
                    var slide = {};
                    slide.src = item.dataset.image;
                    slide.msrc = item.dataset.url;
                    slide.h = item.dataset.height;
                    slide.w = item.dataset.width;
                    slides.push(slide);
                });

                // If no images, cancel
                if (!slides[0]){
                    return;
                }

                var slider = new PhotoSwipe( gallery, PhotoSwipeUI_Default, slides, options);
                slider.init();

            });
        }
})();