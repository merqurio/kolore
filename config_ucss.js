module.exports = {
    "pages": { // (Required) Pages to check. Crawl or include is required.
        "crawl": "http://localhost:8080/admin", // (Optional, if "include" is given).
                                      // Starting point for crawler.
        "exclude": [ // (Optional) List of HTML files/URLs to check.
            "http://localhost:8080/blog/*" // Exclude this specific pages.
        ]
    },
    "headers": { "Accept-Language": "en" }, // (Optional) Headers to send
                                               // to server.
    "css": [ // (Required) List of CSS files to check.
        "app/admin/static/css/themes/custom/style.css"//, "app/admin/static/css/themes/custom/responsive.css"
    ],
    "output": { // (Optional) How to output information from uCSS
        "logger": function(res, originalUrl, loggedIn) {
            // (Optional) Function that is called for each URL that is visited.
            // Use null for if you want it to be silent.
            console.log("Visited: ", originalUrl);
        },
        "result": function(result) {
            // Do something with the result object, e.g. print every rule
            // found, together with positions in CSS file:
            for (var s in result.selectors) {
                // Only unused rules:
                if (result.selectors[s].matches_html === 0) {
                    // Print position(s), given it's only one CSS file:
                    var pos_css = result.selectors[s].pos_css;
                    var key = Object.keys(pos_css)[0];
                    console.log(s);
                }
            }
        } // (Optional)
    }
};