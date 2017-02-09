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

    ctrl.previousList = function() {
        var dom = document.querySelector(".image-viewer-list");
        dom.scrollLeft -= dom.offsetWidth;
    };

    ctrl.nextList = function() {

        var dom = document.querySelector(".image-viewer-list");
        dom.scrollLeft += dom.offsetWidth;
    };

    ctrl.showImage = function(index) {
        if (index >= 0 && index < ctrl.list.length) {
            ctrl.currentIndex = index;
            document.querySelector(".image-viewer-container")
                .style.backgroundImage = "url(" + ctrl.list[index].src + ")";
        }
    };

    ctrl.showViewer = function(list, index) {

        document.querySelector(".fog").style.display = "block";
        ctrl.list = list;
        ctrl.showImage(index);
        document.querySelector(".image-viewer").style.display = "flex";

    };

    ctrl.hideViewer = function() {
        document.querySelector(".fog").style.display = "none";
        document.querySelector(".image-viewer").style.display = "none";
    };


    ctrl.location = function(path) {
        $window.location.href = path;    // reload a full web page
    };

    var getData = function() {

        var data = JSON.parse(sessionStorage.getItem("kwanii.com/portfolio"));

        if (data) {
            ctrl.projects = data;
        }
        else {
            $http.post("/portfolio").then(
                function (success) {
                    ctrl.projects = success.data;

                    // store data in the local storage
                    sessionStorage.setItem("kwanii.com/portfolio", JSON.stringify(ctrl.projects));
                },
                function (error) {
                    console.log(error);
                }
            )
        }
    };

    var init = function() {
        if ($location.path() == "/" || $location.path() == "/portfolio")
            getData();

    };

    init();
}