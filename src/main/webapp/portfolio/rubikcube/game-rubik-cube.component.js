"use strict";

angular
    .module("app")
    .component("gameRubikCube", {
        templateUrl: "/resources/app/game/rubikcube/game-rubik-cube.html",
        controllerAs: "ctrl",
        controller: RubikCubeController
    });

function RubikCubeController() {

    var ctrl = this;

    var init = function () {

    };

    init();
}