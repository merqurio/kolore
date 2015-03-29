(function() {
    function showTooltip(item) {

        var theme = "tooltip-theme-" + item.dataset.theme,
            title = document.createTextNode(item.dataset.title),
            item_top = item.getBoundingClientRect().top + item.offsetHeight + 1,
            item_left = item.getBoundingClientRect().left,
            tooltip = document.createElement('div');

        // Edit tooltip
        tooltip.classList.add("tooltip");
        tooltip.classList.add(theme);
        tooltip.appendChild(title);

        // Position
        tooltip.style.top = item_top + 'px';
        tooltip.style.left = item_left + 'px';

        // Create tooltip
        document.body.appendChild(tooltip);
    }

    function hideTooltip() {
        document.querySelector('.tooltip').remove();
    }

    document.addEventListener('mouseover', function(e) {
        if (e.target && e.target.classList.contains('tooltip-it')) {
            showTooltip(e.target);
        }
        if (e.target.parentNode.classList) {
            if (e.target && e.target.parentNode.classList.contains('tooltip-it')) {
                showTooltip(e.target.parentNode);
            }
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target && e.target.classList.contains('tooltip-it')) {
            hideTooltip();
        }
        if (e.target.parentNode.classList) {
            if (e.target && e.target.parentNode.classList.contains('tooltip-it')) {
                hideTooltip();
            }
        }

    });
})();
