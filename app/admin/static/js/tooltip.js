[].forEach.call(document.querySelectorAll('.tooltip-it'), function(item){

    var theme = "tooltip-theme-"+item.dataset.theme,
        title = document.createTextNode(item.dataset.title),
        tooltip = document.createElement('div');

    // Edit tooltip
    tooltip.classList.add("tooltip");
    tooltip.classList.add(theme);
    tooltip.appendChild(title);

    // Show tooltip
    item.addEventListener('mouseover', function(){

        var item_top = item.getBoundingClientRect().top + item.offsetHeight+1,
            item_left = item.getBoundingClientRect().left;

        // Position
        tooltip.style.top = item_top + 'px';
        tooltip.style.left = item_left + 'px';

        // Create tooltip
        document.body.appendChild(tooltip);
    });
    // Hide tooltip
    item.addEventListener('mouseout', function(){
        // Create tooltip
        document.body.removeChild(tooltip);
    });
});