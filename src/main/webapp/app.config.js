"use strict";

angular
    .module("app")
    .config(Config);

Config.$inject = [
    "$locationProvider",
    "$routeProvider",
    "$window"
];

function Config($locationProvider, $routeProvider, $window) {

    $locationProvider.html5Mode({
        enabled: true,    // enable html5mode
        requireBase: true, // require <base href="/base/">
        rewriteLinks: "internal-link" // only if internal-link attribute is given, rewrite
                                      // otherwise the browser will perform a full page reload
    });

    $routeProvider
        .when("/about", {
            template:
            "<home-header></home-header>" +
            "<div class='home-body' body-template='about.html'></div>"
        })
        .when("/portfolio", {
            template:
            "<home-header></home-header>" +
            "<div class='home-body' body-template='portfolio.html'></div>"
        })
        .when("/contact", {
            template:
            "<home-header></home-header>" +
            "<div class='home-body' body-template='contact.html'></div>"
        })
        .when("/portfolio/super-monkey", {
            template:
            "<home-header></home-header>" +
            "<game-super-monkey class='home-body'></game-super-monkey>"
        })
        .when("/portfolio/chess", {
            template:
            "<home-header></home-header>" +
            "<game-chess class='home-body'></game-chess>"
        })
        .when("/portfolio/health-matters", {
            resolve: function() {
                $window.location.href = "/portfolio/health-matters";
            }
        })
        .otherwise({
            redirectTo: "/portfolio"
        })
}
