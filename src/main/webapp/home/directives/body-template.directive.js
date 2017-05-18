"use strict";

angular
    .module("app")
    .directive("bodyTemplate", bodyTemplate);

function bodyTemplate() {
    return {
        scope: {},
        templateUrl: function (element, attr) {
            return "home/templates/" + attr.bodyTemplate;
        },
        controllerAs: "ctrl",
        controller: ["$location", "$http", "$window",
            TemplateController
        ]
    }
}

function TemplateController($location, $http, $window) {

    var ctrl = this;

    ctrl.projects = {};
    ctrl.currentIndex = 0;
    ctrl.list = [];

    // Image viewer previous button
    ctrl.previousList = function () {
        var dom = document.querySelector(".image-viewer-list");
        dom.scrollLeft -= dom.offsetWidth;
    };

    // Image viewer next button
    ctrl.nextList = function () {

        var dom = document.querySelector(".image-viewer-list");
        dom.scrollLeft += dom.offsetWidth;
    };

    // Show a selected image in the list of images
    ctrl.showImage = function (index) {
        if (index >= 0 && index < ctrl.list.length) {
            ctrl.currentIndex = index;
            document.querySelector(".image-viewer-container")
                .style.backgroundImage = "url(" + ctrl.list[index].url + ")";
        }
    };

    // Show image viewer
    ctrl.showViewer = function (list, index) {

        document.querySelector(".fog").style.display = "block";
        ctrl.list = list;
        ctrl.showImage(index);
        document.querySelector(".image-viewer").style.display = "flex";

    };

    // Hide image viewer
    ctrl.hideViewer = function () {
        document.querySelector(".fog").style.display = "none";
        document.querySelector(".image-viewer").style.display = "none";
    };

    // change location
    ctrl.location = function (link, linkOption) {
        var options = linkOption.split(":");
        $window.open(link, options[0], options[1]);
        //$window.location.href = link;    // reload a full web page
    };

    ctrl.sendMessage = function() {
        if (!ctrl.name) {

        }
        if (!ctrl.email) {

        }
        if (!ctrl.message) {

        }
        console.log("SEND MESSAGE");
    };

    var getData = function () {

        var data = JSON.parse(sessionStorage.getItem("gavinkim.com/projects.json"));

        if (data) {
            ctrl.projects = data;
        }
        else {
            $http.get("/projects.json").then(
                function (success) {
                    ctrl.projects = success.data;
                    // store data in the local storage
                    sessionStorage.setItem("gavinkim.com/projects.json", JSON.stringify(ctrl.projects));
                },
                function (error) {
                    console.log(error);
                }
            )
        }
    };

    var init = function () {
        if ($location.path() === "/" || $location.path() === "/portfolio")
            getData();

    };

    init();
}