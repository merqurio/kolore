(function() {

    'use strict';

    function showTooltip(item) {

        var theme = "tooltip-theme-" + item.getAttribute('data-theme'),
            title = document.createTextNode(item.getAttribute('data-tooltiptitle')),
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
        var tooltip = document.querySelector('.tooltip');

        tooltip.parentNode.removeChild(tooltip);
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