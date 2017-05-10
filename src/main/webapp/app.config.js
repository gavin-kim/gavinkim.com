"use strict";

angular
    .module("app")
    .config(Config);

Config.$inject = [
    "$locationProvider",
    "$routeProvider"
];

function Config($locationProvider, $routeProvider) {

    $locationProvider.html5Mode({
        enabled: true,    // enable html5mode
        requireBase: true, // require <base href="/base/">
        rewriteLinks: "internal-link" // only if internal-link attribute is given, rewrite
                                      // otherwise the browser will perform a full page reload
    });

    $routeProvider
        .when("/about", {
            template: "<home-header></home-header>" +
            "<div class='home-body' body-template='about.html'></div>"
        })
        .when("/portfolio", {
            template: "<home-header></home-header>" +
            "<div class='home-body' body-template='portfolio.html'></div>"
        })
        .when("/contact", {
            template: "<home-header></home-header>" +
            "<div class='home-body' body-template='contact.html'></div>"
        })
        .when("/portfolio/super-monkey", {
            template: "<home-header></home-header>" +
            "<super-monkey class='home-body'></super-monkey>"
        })
        .when("/portfolio/chess", {
            template: "<home-header></home-header>" +
            "<chess class='home-body'></chess>"
        })
        .otherwise({
            redirectTo: "/portfolio"
        })
}
