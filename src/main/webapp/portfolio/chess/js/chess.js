/**
 *  class        property
 *
 *  Chess - tableMap: array for each cell in the table
 *             - playerW : player white
 *             - playerB : player black
 *
 *  Player     - tableMap
 *             - teamName  : white or black
 *             - isChecked : the king is in check
 *             - units     : chess units
 *             - hasKing   : check if the king is alive
 *             - turn      : player turn
 *
 *  Units
 * */
var IMG = "game/chess/img/";

"use strict";
class Chess {

    constructor() {
        this.init();
    }

    init() {
        this.tableMap = [];
        this.playerW = new Player(this.tableMap, "White");
        this.playerB = new Player(this.tableMap, "Black");
        this.whoseTurn = "W";
        this.unitOnShowing = null;

        this.setupBoard();
        this.playerW.setupUnits();
        this.playerB.setupUnits();
        this.dialog = document.querySelector("#dialog");
        this.dialogBtnContainer = document.querySelector("#dialog-btn-container");

        var self = this;

        document.querySelector("#btn-restart").onclick = function () {
            self.init();
            document.querySelector("#info").innerText = "White Player's Turn";
        };
    }

    setupBoard() {

        var chessBoard = document.querySelector("#chess-board");
        chessBoard.innerHTML = "";
        var table = document.createElement("table");
        table.setAttribute("cellpadding", "0");

        table.style.margin = "auto";
        table.style.height = 480 + "px";
        table.style.width = 480 + "px";

        chessBoard.appendChild(table);

        for (var i = 0; i < 8; i++) {
            var tr = document.createElement("tr");

            table.appendChild(tr);
            var array = [];

            for (var j = 0; j < 8; j++) {
                var td = document.createElement("td");
                td.style.height = 60 + "px";
                td.style.width = 60 + "px";

                td.setAttribute("class", "Board");
                td.setAttribute("id", "T" + i + j);

                if ((i + j) % 2 != 0)
                    td.style.backgroundColor = "black";

                array.push(td);
                tr.appendChild(td);
            }
            this.tableMap.push(array);
        }
    };

    // when units are clicked
    unitAction(element, row, column) {
        // not on showing ways -> just show ways
        if (this.unitOnShowing == null) {
            if (this.whoseTurn != element.id.charAt(0))
                return false;

            if (this.whoseTurn == "W")
                this.unitOnShowing = this.playerW.show(element);
            else
                this.unitOnShowing = this.playerB.show(element);
        }
        // when on showing ways
        else {
            // player clicked player's unit : reset ways
            if (this.whoseTurn == element.id.charAt(0)) {
                Unit.removeWays();
                this.unitOnShowing = (this.whoseTurn == "W") ?
                    this.playerW.show(element) : this.playerB.show(element);
            }
            // player clicked enemy's unit
            else {
                if (this.whoseTurn == "W") {
                    if (this.playerW.attack(this.unitOnShowing, row, column)) {
                        if (this.unitOnShowing.isInCheck())
                            this.playerB.isChecked = true;

                        this.changeTurn();
                        this.unitOnShowing = null;

                        return true;
                    }
                    else
                        return false;
                }
                else {
                    if (this.playerB.attack(this.unitOnShowing, row, column)) {
                        if (this.unitOnShowing.isInCheck())
                            this.playerW.isChecked = true;

                        this.changeTurn();
                        this.unitOnShowing = null;

                        return true;
                    }
                    else
                        return false;
                }

            }
        }
    }

    // when the board is clicked
    boardAction(row, column) {
        if (this.unitOnShowing == null)
            return false;
        else {
            if (this.whoseTurn == "W") {
                if (this.playerW.move(this.unitOnShowing, row, column)) {
                    if (this.unitOnShowing.isInCheck())
                        this.playerB.inCheck = true;
                    this.changeTurn();
                    this.unitOnShowing = null;
                }
                else
                    return false;
            }
            else if (this.whoseTurn == "B") {
                if (this.playerB.move(this.unitOnShowing, row, column)) {
                    if (this.unitOnShowing.isInCheck())
                        this.playerW.inCheck = true;
                    this.changeTurn();
                    this.unitOnShowing = null;
                }
                else
                    return false;
            }
        }
    }

    changeTurn() {
        // right after playerW action
        if (this.whoseTurn == "W") {
            for (var i = 0; i < this.playerW.units.length; i++)
                this.playerW.units[i].unit.setAttribute("class", "disabled");

            for (i = 0; i < this.playerB.units.length; i++)
                this.playerB.units[i].unit.removeAttribute("class");

            document.querySelector("#info").innerText = "Black player turn";
            this.whoseTurn = "B";
        }
        // right after playerB action
        else {
            for (i = 0; i < this.playerW.units.length; i++)
                this.playerB.units[i].unit.setAttribute("class", "disabled");

            for (i = 0; i < this.playerB.units.length; i++)
                this.playerW.units[i].unit.removeAttribute("class");

            document.querySelector("#info").innerText = "White player turn";
            this.whoseTurn = "W";
        }
    }

    showDialog(message, arr) {

        document.querySelector("#dialog-message").innerHTML = message;

        this.dialogBtnContainer.innerHTML = ""; // reset buttons

        arr.forEach(function (obj) {
            var btn = document.createElement("button");
            btn.classList.add("dialog-btn");
            btn.innerHTML = obj.label;
            btn.onclick = function () {
                this.dialog.style.display = "none";
                obj.event();
            };

            this.dialogBtnContainer.appendChild(btn);
        });

        this.dialog.style.display = "flex"; // show dialog
    }


    gameOver(winner) {
        if (winner == "W")
            document.querySelector("#info").innerText = "Black Player Win!";
        else
            document.querySelector("#info").innerText = "White Player Win!";

        for (var i = 0; i < this.playerW.units.length; i++)
            this.playerB.units[i].unit.setAttribute("class", "disabled");

        for (i = 0; i < this.playerB.units.length; i++)
            this.playerW.units[i].unit.setAttribute("class", "disabled");


        this.whoseTurn = null;
    }
}

class Player {
    constructor(tableMap, teamName) {
        this.tableMap = tableMap;
        this.teamName = teamName;
        this.units = [];
        this.hasKing = true;
        this.isChecked = false;
    }

    setupUnits() {
        if (this.teamName == "White") {
            for (var i = 0; i < 8; i++) {
                this.units.push(new Pawn("WP" + (i + 1), 6, i, this.tableMap));
            }
            this.units.push(new Rook("WRL", 7, 0, this.tableMap));
            this.units.push(new Rook("WRR", 7, 7, this.tableMap));
            this.units.push(new Knight("WNL", 7, 1, this.tableMap));
            this.units.push(new Knight("WNR", 7, 6, this.tableMap));
            this.units.push(new Bishop("WBL", 7, 2, this.tableMap));
            this.units.push(new Bishop("WBR", 7, 5, this.tableMap));
            this.units.push(new Queen("WQ", 7, 3, this.tableMap));
            this.units.push(new King("WK", 7, 4, this.tableMap));
        }
        else {
            for (i = 0; i < 8; i++) {
                this.units.push(new Pawn("BP" + (i + 1), 1, i, this.tableMap));
            }
            this.units.push(new Rook("BRL", 0, 0, this.tableMap));
            this.units.push(new Rook("BRR", 0, 7, this.tableMap));
            this.units.push(new Knight("BNL", 0, 1, this.tableMap));
            this.units.push(new Knight("BNR", 0, 6, this.tableMap));
            this.units.push(new Bishop("BBL", 0, 2, this.tableMap));
            this.units.push(new Bishop("BBR", 0, 5, this.tableMap));
            this.units.push(new Queen("BQ", 0, 3, this.tableMap));
            this.units.push(new King("BK", 0, 4, this.tableMap));
        }
    }

    findUnit(element) {
        for (var i = 0; i < this.units.length; i++)
            if (element.id == this.units[i].id)
                return this.units[i];
    }

    show(element) {
        var unit = this.findUnit(element);
        unit.showWays();
        return unit;
    }

    move(unit, row, column) {
        return unit.moveUnit(row, column);
    }

    attack(unit, row, column) {
        return unit.attackEnemy(row, column);
    }
}


class Unit {
    constructor(id, row, column, tableMap) {
        // unit img
        this.unit;

        // WRL -> White Rook Left
        this.id = id;

        // current position of unit in the tableMap
        this.row = row;
        this.column = column;

        // tableMap 8 x 8 array
        this.tableMap = tableMap;
        this.moveCount = 0;
        this.isDead = false;

        this.putUnit((id.charAt(0) == 'W') ? "White" : "Black", id, row, column, tableMap);
    }

    putUnit(player, id, row, column, tableMap) {
        var unit = document.createElement("img");
        unit.style.display = "block";
        unit.style.height = 60 + "px";
        unit.style.width = 60 + "px";

        unit.setAttribute("src", IMG + player + "_" + id.charAt(1) + ".ico");
        unit.setAttribute("id", id);

        if (id.charAt(0) == "W")
            unit.setAttribute("class", "enabled");
        else
            unit.setAttribute("class", "disabled");

        tableMap[row][column].appendChild(unit);
        this.unit = unit;
    }

    isInCheck() {
        // return boolean
        this.showWays();
        var enemies = document.querySelectorAll(".able-to-attack");
        Unit.removeWays();

        for (var i = 0; i < enemies.length; i++)
            if (enemies[i].children[0].id.charAt(1) == "K")
                return true;

        return false;
    }

    showWays() {
        // show unit ways
    }

    // remove ways
    static removeWays() {
        var ways = document.querySelectorAll(".able-to-move");
        for (var i = 0; i < ways.length; i++)
            ways[i].removeAttribute("class");

        var enemies = document.querySelectorAll(".able-to-attack");
        for (var i = 0; i < enemies.length; i++)
            enemies[i].removeAttribute("class");

    }

    // move the unit or attack enemy unit
    // return true if it's check
    moveUnit(row, column) {
        var ways = document.querySelectorAll(".able-to-move");
        for (var i = 0; i < ways.length; i++) {
            if (ways[i].id.charAt(1) == "" + row &&
                ways[i].id.charAt(2) == "" + column) {
                ways[i].appendChild(this.unit);
                this.row = parseInt(ways[i].id.charAt(1));
                this.column = parseInt(ways[i].id.charAt(2));
                Unit.removeWays();
                this.moveCount++;
                return true;
            }
        }
        return false;
    }

    // attack enemy and remove it
    attackEnemy(row, column) {
        var enemies = document.querySelectorAll(".able-to-attack");

        if (enemies != undefined)
            for (var i = 0; i < enemies.length; i++) {
                if (enemies[i].id.charAt(1) == "" + row &&
                    enemies[i].id.charAt(2) == "" + column) {
                    var enemyUnit = enemies[i].getElementsByTagName("img");

                    enemies[i].removeChild(enemyUnit[0]);
                    enemies[i].appendChild(this.unit);

                    this.row = parseInt(enemies[i].id.charAt(1));
                    this.column = parseInt(enemies[i].id.charAt(2));

                    Unit.removeWays();
                    this.moveCount++;
                    return true;
                }
            }
        else
            return false;
    }

    //  -1: enemy, 0: cannot move, 1: can move
    checkWay(row, column) {

        if (row < 0 || row > 7 || column < 0 || column > 7) {
            return 0;
        }
        else if (this.tableMap[row][column].hasChildNodes()) {
            if (this.checkEnemy(row, column))
                return -1;
            else
                return 0;
        }
        else {
            this.tableMap[row][column].setAttribute("class", "able-to-move");
            return 1;
        }
    }

    // return true if tableMap[row][column] is enemy
    checkEnemy(row, column) {
        if (this.id.charAt(0) != this.tableMap[row][column].children[0].id.charAt(0)) {
            this.tableMap[row][column].setAttribute("class", "able-to-attack");
            return true;
        }
        return false
    }
}

class King extends Unit {
    constructor(id, row, column, tableMap) {
        super(id, row, column, tableMap);
    }

    showWays() {
        // show unit ways
        for (var i = this.row - 1; i <= this.row + 1; i++)
            for (var j = this.column - 1; j <= this.column + 1; j++)
                this.checkWay(i, j);
    }
}
class Queen extends Unit {
    constructor(id, row, column, tableMap) {
        super(id, row, column, tableMap);
    }

    showWays() {
        this.showWays2(this.row + 1, this.column + 1, 1, 1);
        this.showWays2(this.row + 1, this.column - 1, 1, -1);
        this.showWays2(this.row - 1, this.column + 1, -1, 1);
        this.showWays2(this.row - 1, this.column - 1, -1, -1);
        this.showWays2(this.row + 1, this.column, 1, 0);
        this.showWays2(this.row - 1, this.column, -1, 0);
        this.showWays2(this.row, this.column + 1, 0, 1);
        this.showWays2(this.row, this.column - 1, 0, -1);
    }

    showWays2(row, column, rowV, columnV) {
        if (this.checkWay(row, column) == 1)
            this.showWays2(row + rowV, column + columnV, rowV, columnV);
    }
}
class Rook extends Unit {
    constructor(id, row, column, tableMap) {
        super(id, row, column, tableMap);
    }

    showWays() {
        this.showWays2(this.row + 1, this.column, 1, 0);
        this.showWays2(this.row - 1, this.column, -1, 0);
        this.showWays2(this.row, this.column + 1, 0, 1);
        this.showWays2(this.row, this.column - 1, 0, -1);

    }

    showWays2(row, column, rowV, columnV) {
        if (this.checkWay(row, column) == 1)
            this.showWays2(row + rowV, column + columnV, rowV, columnV);
    }
}
class Bishop extends Unit {
    constructor(id, row, column, tableMap) {
        super(id, row, column, tableMap);
    }

    showWays() {
        // show unit ways
        this.showWays2(this.row + 1, this.column + 1, 1, 1);
        this.showWays2(this.row + 1, this.column - 1, 1, -1);
        this.showWays2(this.row - 1, this.column + 1, -1, 1);
        this.showWays2(this.row - 1, this.column - 1, -1, -1);

    }

    showWays2(row, column, rowV, columnV) {
        if (this.checkWay(row, column) == 1)
            this.showWays2(row + rowV, column + columnV, rowV, columnV);
    }
}
class Knight extends Unit {
    constructor(id, row, column, tableMap) {
        super(id, row, column, tableMap);
    }

    showWays() {
        // show unit ways
        this.checkWay(this.row - 2, this.column - 1);
        this.checkWay(this.row - 2, this.column + 1);
        this.checkWay(this.row + 2, this.column - 1);
        this.checkWay(this.row + 2, this.column + 1);
        this.checkWay(this.row - 1, this.column - 2);
        this.checkWay(this.row - 1, this.column + 2);
        this.checkWay(this.row + 1, this.column - 2);
        this.checkWay(this.row + 1, this.column + 2);
    }

}
class Pawn extends Unit {
    constructor(id, row, column, tableMap) {
        super(id, row, column, tableMap);
    }

    showWays() {
        var row = this.row;
        var column = this.column;
        // show unit ways

        // for the white player
        if (this.id.charAt(0) == "W") {
            // for the first time
            if (this.moveCount == 0) {
                if (!this.tableMap[row - 1][column].hasChildNodes())
                    this.tableMap[row - 1][column].setAttribute("class", "able-to-move");
                if (!this.tableMap[row - 2][column].hasChildNodes())
                    this.tableMap[row - 2][column].setAttribute("class", "able-to-move");
            }

            if (!this.tableMap[row - 1][column].hasChildNodes())
                this.tableMap[row - 1][column].setAttribute("class", "able-to-move");

            if (row - 1 >= 0 && column - 1 >= 0 &&
                this.tableMap[row - 1][column - 1].hasChildNodes())
                this.checkEnemy(row - 1, column - 1);
            if (row - 1 >= 0 && column + 1 <= 7 &&
                this.tableMap[row - 1][column + 1].hasChildNodes())
                this.checkEnemy(row - 1, column + 1);
        }
        // for the black player
        else if (this.id.charAt(0) == "B") {
            // for the first time
            if (this.moveCount == 0) {
                if (!this.tableMap[row + 1][column].hasChildNodes())
                    this.tableMap[row + 1][column].setAttribute("class", "able-to-move");
                if (!this.tableMap[row + 2][column].hasChildNodes())
                    this.tableMap[row + 2][column].setAttribute("class", "able-to-move");
            }

            if (!this.tableMap[row + 1][column].hasChildNodes())
                this.tableMap[row + 1][column].setAttribute("class", "able-to-move");

            if (row + 1 <= 7 && column - 1 >= 0 &&
                this.tableMap[row + 1][column - 1].hasChildNodes())
                this.checkEnemy(row + 1, column - 1);
            if (row + 1 <= 7 && column + 1 <= 7 &&
                this.tableMap[row + 1][column + 1].hasChildNodes())
                this.checkEnemy(row + 1, column + 1);
        }
    }
}





