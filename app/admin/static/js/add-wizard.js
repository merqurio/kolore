$(document).ready(function () {

    // Set wizard parts
    var upNumbers = $('ul.wizard-steps li'),
        wizPanels = $('.tab-pane'),
        allNextBtn = $('.next');
        allPrevBtn = $('.previous');

    wizPanels.hide();


    // Function when an upper number of wizard is clicked
    upNumbers.click(function (e) {
        e.preventDefault();
        // Gets tabs id based in the href of the anchor
        var $target = $($(this).attr('data-target')),
            $item = $(this);

        if (!$item.hasClass('disabled')){
            upNumbers.removeClass('active');
            $item.addClass('active');
            wizPanels.hide();
            $target.show();
        }
    });

    // Function called if NEXT button is clicked
    allNextBtn.click(function(){
        // Gets all the data for next tab
        var curStep = $(this).closest(".tab-pane"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('ul.wizard-steps li a[href="#' + curStepBtn + '"]').parent().next().children("a");
            curInputs = curStep.find("input[type='text']"),
            isValid = true;

        $(".form-group").removeClass("has-error");
        for(var i=0; i<curInputs.length; i++){
            if (!curInputs[i].validity.valid){
                isValid = false;
                $(curInputs[i]).closest(".form-group").addClass("has-error");
            }
        }

        if (isValid){
            nextStepWizard.parent('li').removeClass('disabled');
            nextStepWizard.trigger('click');
        }
    });

    // Function called if PREVIOUS button is clicked
    allPrevBtn.click(function(e) {
        e.preventDefault();
    
        var curStep = $(this).closest(".tab-pane"),
            curStepBtn = curStep.attr("id"),
            prevStepWizard = $('ul.wizard-steps li a[href="#' + curStepBtn + '"]').parent().prev().children("a");
        prevStepWizard.trigger('click')
    });

    // Initiliace first tab
    $('ul.wizard-steps li.active').trigger('click');
});