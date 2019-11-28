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
        draw(problems[0], "r");
        activateButtons();
    });
});

function activateButtons() {
    d3.select("#solve").on("click", () => {
        let gameNum = d3.select("#number").node().value;
        switch(d3.select("#game").node().value) {
            case "sudoku":
                draw(solutions.sudoku[gameNum], "r");
                return;
            case "hyperSudoku":
                if (gameNum == 0 || gameNum == 2) {
                    draw(solutions.hyperSudoku[gameNum], "h");
                } else {
                    draw(problems[0], "r");
                }
                return;
            case "sudokuX":
                if (gameNum == 0 || gameNum == 3) {
                    draw(solutions.sudokuX[gameNum], "x");
                } else {
                    draw(problems[0], "r");
                }
                return;
            default:
                return;
        }
    });

    d3.select("#init").on("click", () => {
        let gameNum = d3.select("#number").node().value;
        let gameType = "r";
        switch(d3.select("#game").node().value) {
            case "hyperSudoku":
                gameType = "h";
                break;
            case "sudokuX":
                gameType = "x";
                break;
        }
        draw(problems[gameNum], gameType);
    });

    d3.select("#clear").on("click", () => {
        draw(problems[0], "r");
    });
}

function getData(data, gameType) {
    var game = data.substring(0, data.length-2).split(".");
    var matrix = Array(9).fill().map(()=>Array(9).fill());
    for(let i = 0; i < 9; i++) {
        let row = JSON.parse(game[i]);
        for(let j = 0; j < 9; j++) {
            matrix[i][j] = {
                number: row[j],
                special: () => {
                    if (gameType == "x") {
                        if(i + j == 8 || i == j) {
                            return 1;
                        }
                    }
                    if (gameType == "h") {
                        if (i % 4) {
                            if (j % 4) {
                                return 1;
                            }
                        }
                    }
                    return 0;
                }
            }
        }
    }
    return matrix;
}


function draw(game, gameType) {
    var height = window.self.innerHeight;
    var boardSize = height  * 0.8;
    var gridSize = boardSize / 9;
    var boxSize = gridSize * 3;
    var container = d3.select(".container");
    var data = getData(game, gameType);
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
            d.special = i;
            return d;
        });
    var grids = allGrids.enter()
        .append("g")
        .attr("height", gridSize)
        .attr("width", gridSize)
        .attr("transform", function(d, i){
            return "translate("+ (i * gridSize) + "," + 0 + ")";
        })

    grids.append("rect")
        .attr("height", gridSize)
        .attr("width", gridSize)
        .classed("grid" , true)
        .classed("grid_special", (d) => {
            return d.special();
        })


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

