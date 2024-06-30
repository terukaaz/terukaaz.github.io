addEventListener("DOMContentLoaded", (event) => {
    function init() {

        setInterval(() => { // update
            update();
        }, 1);

        var scrambleButton = document.getElementById("scramble-button")
        scrambleButton.addEventListener('click', function(){
            simulScramble = !simulScramble;
            simulScramble ? scrambleButton.innerHTML = "S" : scrambleButton.innerHTML = "NS";
        });

        var resetButton = document.getElementById("reset-button")
        resetButton.addEventListener('click', function(){
            resetTimer();
        });

        addEventListener("keydown", (event) => {
            onKey(event);
        });

        document.getElementById("main").addEventListener("click", (event) => {
            onKey(new KeyboardEvent('keydown', { keyCode: 32 }))
        });
    }

    init();
});


let timerState = 0;


let started = null;
let time = 0;

let solveIndex = 0;

let times = [];
let currentSolveTimeStarted = 0;

let simulScramble = false;


function onKey(event) {

    if (event.keyCode === 32) {

        if (timerState === 1) {

            if (solveIndex % 2 === 0) {

                times.push(Date.now() - currentSolveTimeStarted);

                document.getElementsByClassName("scramble")[0].style.textAlign = "center";
                document.getElementsByClassName("scramble")[0].innerHTML = "Solve.";

                document.getElementsByClassName("time-list")[0].innerHTML = times.map(element => `${new Date(element).toISOString().slice(14, 22).toString()}`).join("\n").toString();
            } else {

                currentSolveTimeStarted = Date.now();

                document.getElementsByClassName("scramble")[0].style.textAlign = "left";
                document.getElementsByClassName("scramble")[0].innerHTML = randomScramble(simulScramble);
            }

            solveIndex++;

            if (solveIndex >= 10) {
                stopTimer();
                document.getElementsByClassName("scramble")[0].style.textAlign = "center";
                document.getElementsByClassName("scramble")[0].innerHTML = `You've finished ao5 in ${new Date(time).toISOString().slice(14, 22)}!`
            }

        } else if (timerState === 0) {

            startTimer();

            currentSolveTimeStarted = Date.now();

            document.getElementsByClassName("scramble")[0].style.textAlign = "left";
            document.getElementsByClassName("scramble")[0].innerHTML = randomScramble(simulScramble);
        }

    } else if (event.keyCode === 82) {
        resetTimer();
    }
}

function resetTimer() {

    timerState = 0;
    solveIndex = 0;

    times = [];

    document.getElementsByClassName("scramble")[0].style.textAlign = "center";
    document.getElementsByClassName("scramble")[0].innerHTML = "Hi there! press space or click to start.";
    document.getElementsByClassName("time-list")[0].innerHTML = null;
}

function startTimer() {
    timerState = 1;
    started = Date.now();
}

function stopTimer() {
    timerState = -1;
}

function updateTimer() {

    if (timerState !== 1) {
        return
    }

    time = Date.now() - started;
    document.getElementsByClassName("timer")[0].innerHTML = `${(time / 1000).toFixed(0).toString()}`
}

function update() {
    updateTimer();
}

/*

    From here, the code is just generating random scrambles. I know that the code sucks but I just made it(?)

 */

function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randNumStr() {

    let out = "";
    let n = randRange(-5, 6);

    if (n >= 0) {
        out += n.toString();
        out += "+";
    } else {
        out += n.toString().substring(1);
        out += "-";
    }

    return out;
}

function randomScramble(simul) {

    let MOVE_SET = !simul
        ? ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "ALL", "y2", "U", "R", "D", "L", "ALL"]
        : ["UR", "DR", "DL", "UL", "U", "R", "D", "L", "ALL", "all"];


    let scramble = "";

    function addSpace(k, l) {
        if (k < l) {
            scramble += " ";
        }
    }

    for (let j = 0; j < MOVE_SET.length; j++) {

        let move = MOVE_SET[j]

        scramble += move;

        if (move === "y2") {
            addSpace(j, MOVE_SET.length);
        } else {

            if (simul) {

                if (
                    move === "U"
                    || move === "R"
                    || move === "D"
                    || move === "L"
                ) {
                    scramble += `(${randNumStr()}, ${randNumStr()})`;
                    addSpace(j, MOVE_SET.length);
                } else {
                    scramble += `${randNumStr()}`;
                    addSpace(j, MOVE_SET.length);
                }

            } else {
                scramble += `${randNumStr()}`;
                addSpace(j, MOVE_SET.length);
            }
        }
    }

    return scramble;
}
