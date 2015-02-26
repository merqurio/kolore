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
            targetNum = parseInt(self.parentNode.id.substr(3))+1,
            targetTab = document.querySelector('#step-'+targetNum),
            curInputs = self.parentElement.querySelectorAll('input'),
            isValid = true;

        // Check if all inputs are filled
        if (curInputs) {
            for (var i = curInputs.length - 1; i >= 0; i--) {
                if (curInputs[i].value === null || curInputs[i].value === ""){
                    isValid = false;
                    curInputs[i].classList.add('input-error');
                } else if(curInputs[i].classList.contains('input-error')){
                    curInputs[i].classList.remove('input-error');
                }
            }
        }
        
        // everythong ok
        if (isValid) {
            // remove class
            targetTab.parentNode.classList.remove('disabled');
            // click new target
            targetTab.click();
        }

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