var problems = Array(4).fill();
var solutions = {
    sudoku: Array(4).fill(),
    hyperSudoku: Array(4).fill(),
    sudokuX: Array(4).fill()
}
var socket = io();
//get all the prolog data from the node server
socket.on('connect', function () {
    socket.emit('prolog', function (data) {
        for(let i = 0; i < 4; i++) {
            problems[i] = data.problems[i];
            solutions.sudoku[i] = data.solutions.r[i];
            solutions.hyperSudoku[i] = data.solutions.h[i];
            solutions.sudokuX[i] = data.solutions.x[i];
        }
        draw(problems[0]);
        activateButtons();
    });
});

function activateButtons() {
    d3.select("#solve").on("click", () => {
        let gameNum = d3.select("#number").node().value;
        switch(d3.select("#game").node().value) {
            case "sudoku":
                draw(solutions.sudoku[gameNum]);
                return;
            case "hyperSudoku":
                if (gameNum == 0 || gameNum == 2) {
                    draw(solutions.hyperSudoku[gameNum]);
                } else {
                    draw(problems[0]);
                }
                return;
            case "sudokuX":
                if (gameNum == 0 || gameNu == 3) {
                    draw(solutions.sudokuX[0]);
                } else {
                    draw(problems[0]);
                }
                return;
            default:
                return;
        }
    });

    d3.select("#init").on("click", () => {
        let gameNum = d3.select("#number").node().value;
        draw(problems[gameNum]);
    });

    d3.select("#clear").on("click", () => {
        draw(problems[0]);
    });
}

function getData(data) {
    var game = data.substring(0, data.length-2).split(".");
    var matrix = Array(9).fill().map(()=>Array(9).fill());
    for(let i = 0; i < 9; i++) {
        let row = JSON.parse(game[i]);
        for(let j = 0; j < 9; j++) {
            matrix[i][j] = {
                number: row[j],
                row: i,
                column: j
            }
        }
    }
    return matrix;
}

function draw(game) {
    var height = window.self.innerHeight;
    var boardSize = height  * 0.8;
    var gridSize = boardSize / 9;
    var boxSize = gridSize * 3;
    var container = d3.select(".container");
    var data = getData(game);
    d3.select(".container").html("");
    var wrapper = container.append("svg")
        .attr("width", boardSize)
        .attr("height", boardSize)
        .classed("wrapper", true)
        .append("g")

    var rows = wrapper.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .classed("row" , true)
        .attr("transform", function(d, i){
            return "translate("+ 0 + "," + (i * gridSize) + ")";
        });
    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
            wrapper.append("rect")
                .attr("height", boxSize)
                .attr("width", boxSize)
                .attr("transform", "translate("+ (i * boxSize) + "," + (j * boxSize) + ")")
                .attr("fill-opacity", "0")
                .attr("pointer-events", "none")
                .classed("box", true);
        }
    }

    var allGrids = rows.selectAll("g")
        .data(function(d, i){
            d.row = i;
            return d;
        });
    var grids = allGrids.enter()
        .append("g")
        .attr("height", gridSize)
        .attr("width", gridSize)
        .attr("transform", function(d, i){
            return "translate("+ (i * gridSize) + "," + 0 + ")";
        });

    grids.append("rect")
        .classed("grid" , true)
        .attr("height", gridSize)
        .attr("width", gridSize)

    grids.append("text")
        .classed("number", true)
        .attr("dominant-baseline", "central")
        .attr("x", gridSize/2)
        .attr("y", gridSize/2)
        .attr("pointer-events", "none");


    allGrids.select(".number")
        .text((d) => {
            if(d.number <= 9 && d.number >= 1) {
                return d.number;
            } else {
                return "";
            }
        });
};

