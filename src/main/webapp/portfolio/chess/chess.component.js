"use strict";

angular
    .module("app")
    .component("chess", {
        templateUrl: "portfolio/chess/chess.html",
        controllerAs: "ctrl",
        controller: [ChessController]
    });

function ChessController() {
    var ctrl = this;
    var chess;

    // in case forEach() not supported: forEach(function(obj, index, arr){} )
    var checkForEach = function () {

        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function (fn, scope) {
                for (var i = 0, len = this.length; i < len; ++i) {
                    fn.call(scope, this[i], i, this);
                }
            }
        }

        if (!NodeList.prototype.forEach) {
            NodeList.prototype.forEach = function (fn, scope) {
                for (var i = 0, len = this.length; i < len; ++i) {
                    fn.call(scope, this[i], i, this);
                }
            }
        }
    };

    var init = function () {

        checkForEach();

        chess = new Chess();

        window.addEventListener("click", clickEvent);

        function clickEvent(event) {

            if (!chess.whoseTurn)
                return;

            if (event.target.tagName == "IMG") {
                var row = parseInt(event.target.parentElement.id.charAt(1));
                var column = parseInt(event.target.parentElement.id.charAt(2));
                chess.unitAction(event.target, row, column);
            }
            else if (event.target.tagName == "TD") {
                var row = parseInt(event.target.id.charAt(1));
                var column = parseInt(event.target.id.charAt(2));
                chess.boardAction(row, column);
            }
        }
    };

    init();
}