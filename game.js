let lastHole;
let timeUp = false;
let score = 0;
let scoreBoard;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function generateHole(holes) {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === lastHole) {
        return generateHole(holes);
    }
    lastHole = hole;
    return hole;
}

function displayBot(holes) {
    const time = randomTime(200, 1000);
    const hole = generateHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) {
            displayBot(holes);
        }
    }, time);
}

function hit(e) {
    if (!e.isTrusted) {
        return;
    }
    score++;
    this.classList.remove('up');
    scoreBoard.textContent = score;
}

function startTimer(endGame) {
    const holes = document.querySelectorAll('.hole');
    scoreBoard = document.querySelector('.score');
    const bots = document.querySelectorAll('.bot');
    const endScoreBoard = document.querySelector('.endScore');

    scoreBoard.textContent = 0;

    displayBot(holes);
    setTimeout(() => {
        timeUp = true;
        endScoreBoard.textContent = score;
        endGame();
    }, 10000);

    bots.forEach((bot) => bot.addEventListener('click', hit));
}
