/*! Chroma - v0.2.0 - 2015-02-26
* http://chromabranding.com
* Copyright (c) 2015 ; Licensed  */
(function () {
    'use strict';

    function toogleMenu(event) {
        var secondMenu = document.querySelector('.menu-bottom'),
            open = document.querySelector('.open'),
            lang = document.querySelector('.menu-icon-lang'),
            main = document.querySelector('.menu-icon'),
            that = event.currentTarget,
            selectedMenu = ((that.classList.contains('menu-icon') === true) ? 'left-opened' : 'right-opened'),
            nonSelectedMenu = ((that.classList.contains('menu-icon') === false) ? 'left-opened' : 'right-opened'),
            opened = ((open === lang) ? lang : main);

        // Check if any menu is opened
        if (open) {
            // Check if that opened one and the clicked one are the same and close
            if (open === that) {
                that.classList.remove('open');
                secondMenu.classList.remove(selectedMenu);
            } else {

                // Close the menu
                opened.classList.remove('open');
                secondMenu.classList.remove(nonSelectedMenu);

                // Open the othe one
                that.classList.add('open');
                setTimeout(function () {
                    secondMenu.classList.add(selectedMenu);
                }, 500);
            }

        } else {
            that.classList.add('open');
            secondMenu.classList.add(selectedMenu);
        }
    }

    function closeMenu(event) {
        var open = document.querySelector('.open'),
            secondMenu = document.querySelector('.menu-bottom');

        if (event.which === 27 && open) {

            // Must check that open exists first
            var openedMenu = ((open.classList.contains('menu-icon') === true) ? 'left-opened' : 'right-opened');

            open.classList.remove('open');
            secondMenu.classList.remove(openedMenu);
        }
    }

    // Attach the listeners
    document.querySelector('.menu-icon').addEventListener('click', toogleMenu);
    document.querySelector('.menu-icon-lang').addEventListener('click', toogleMenu);
    // Close with keyboard
    document.addEventListener('keyup', closeMenu);
}());
// Language ----------------------------------

function SetCookie(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();
    if (nDays == null || nDays == 0) nDays = 1;
    expire.setTime(today.getTime() + 3600000 * 24 * nDays);
    document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString() + ";path=/";
}


document.addEventListener("DOMContentLoaded", function() {
    
    // Show the main card
    document.querySelector('.card').classList.remove('hide');

    
    // Event listeners
    document.querySelector(".menu-bottom-lang").addEventListener("click", function(e) {

        if (e.target && e.target.nodeName == "LI") {
            var lang = e.target.className;

            SetCookie('lang',lang, 365);
            location.reload();
        } else if(e.target && e.target.nodeName == "A") {
            var parent = e.target.parentNode,
                lang = parent.className;

            SetCookie('lang',lang, 365);
            location.reload();
        }
    });

});

var upNumbers = document.querySelectorAll('.wizard-steps li'),
    wizPanels = document.querySelectorAll('.step-tab'),
    allNextBtn = document.querySelectorAll('.next'),
    allPrevBtn = document.querySelectorAll('.previous');

// Upper number of wizard is clicked
[].forEach.call(upNumbers, function (item) {

    item.addEventListener('click', function(event) {

        event.preventDefault();
        var targetData = this.dataset.target,
            target = document.querySelector(targetData),
            self = this;

        if (!self.classList.contains('disabled')) {

            self.classList.add('active');

            for (var i = wizPanels.length - 1; i >= 0; i--) {
                wizPanels[i].classList.add('hide');
            }

            target.classList.remove('hide');
        }
    });
});

// Next is clicked
[].forEach.call(allNextBtn, function (item) {
    item.addEventListener('click', function(event) {
        var self = this,
            targetNum = parseInt(this.parentNode.id.substr(3))+1,
            targetTab = document.querySelector('#step-'+targetNum);

        // remove class
        targetTab.parentNode.classList.remove('disabled');
        // click new target
        targetTab.click();

    });
});

// Next is clicked
[].forEach.call(allPrevBtn, function (item) {
    item.addEventListener('click', function(event) {
        var self = this,
            targetNum = parseInt(this.parentNode.id.substr(3))-1,
            targetTab = document.querySelector('#step-'+targetNum);

        // remove class
        targetTab.parentNode.classList.remove('disabled');
        // click new target
        targetTab.click();

    });
});

document.querySelector('#tab1').classList.remove('hide');