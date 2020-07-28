document.addEventListener(
    'DOMContentLoaded',
    function () {
        const startGameButton = document.querySelector('.btnStart');
        startGameButton.addEventListener('click', startGame, false);
        const highscoreButton = document.querySelector('.btnHighscore');
        highscoreButton.addEventListener('click', showHighscore, false);
        const submitScoreButton = document.querySelector('.btnSubmit');
        submitScoreButton.addEventListener('click', submitHighscore, false);
    },
    false
);

function renderHighScore(contentDiv, scores) {
    const header = document.createElement('h2');
    header.textContent = '🏆 High Scores';
    contentDiv.appendChild(header);
    const table = document.createElement('div');
    table.classList.add('highscoreTable');
    // table header
    const tableRowDivHeader = document.createElement('div');
    tableRowDivHeader.classList.add('tableRow');
    const headers = ['Position', 'Name', 'Score'];
    for (let i = 0; i < headers.length; i++) {
        const div = document.createElement('div');
        div.textContent = headers[i];
        tableRowDivHeader.appendChild(div);
    }
    table.appendChild(tableRowDivHeader);
    for (let i = 0; i < scores.length; i++) {
        const tableRowDiv = document.createElement('div');
        tableRowDiv.classList.add('tableRow');
        const posDiv = document.createElement('div');
        posDiv.textContent = i + 1;
        tableRowDiv.appendChild(posDiv);
        const nameDiv = document.createElement('div');
        nameDiv.textContent = scores[i].name;
        tableRowDiv.appendChild(nameDiv);
        const scoreDiv = document.createElement('div');
        scoreDiv.textContent = scores[i].score;
        tableRowDiv.appendChild(scoreDiv);
        table.appendChild(tableRowDiv);
    }

    contentDiv.appendChild(table);
}

async function submitHighscore() {
    const highscoreContent = document.querySelector('.endGame');
    const name = highscoreContent.querySelector('input');
    if (name.value.length == 0) {
        alert('Please enter a name.');
    } else {
        highscoreContent
            .querySelector('.btnSubmit')
            .setAttribute('disabled', 'disabled');
        highscoreContent
            .querySelector('.endGameContent')
            .classList.add('hidden');
        highscoreContent.querySelector('.loader').classList.remove('hidden');
        const body = {
            name: name.value,
            score: score,
        };
        const result = await makeNetworkCall(
            '/api/highscore/submit',
            'POST',
            body
        );
        // PerimeterX block
        if (result.status === 403) {
            highscoreContent
                .querySelector('.endGameContent')
                .classList.add('hidden');
            generatePXContent(result.body, highscoreContent, async () => {
                highscoreContent
                    .querySelector('.challenge')
                    .classList.add('hidden');
                highscoreContent
                    .querySelector('.theEnd')
                    .classList.remove('hidden');
            });
        } else {
            highscoreContent.querySelector('.loader').classList.add('hidden');
            highscoreContent
                .querySelector('.theEnd')
                .classList.remove('hidden');
        }
    }
}

async function showHighscore() {
    document.querySelector('.controls').classList.add('hidden');
    document.querySelector('.highscore').classList.remove('hidden');
    const highscoreContent = document.querySelector('.highscore');
    let result = await makeNetworkCall('/api/highscore');
    if (result.status === 403) {
        generatePXContent(result.body, highscoreContent, async () => {
            highscoreContent
                .querySelector('.loader')
                .classList.remove('hidden');
            result = await makeNetworkCall('/api/highscore');
            renderHighScore(highscoreContent, result.body);
            highscoreContent.querySelector('.loader').classList.add('hidden');
            highscoreContent
                .querySelector('.challenge')
                .classList.add('hidden');
        });
    } else {
        renderHighScore(highscoreContent, result.body);
        highscoreContent.querySelector('.loader').classList.add('hidden');
    }
}

function startGame() {
    document.querySelector('.controls').classList.add('hidden');
    document.querySelector('.playArea').classList.remove('hidden');

    startTimer(endGame);
}

function endGame() {
    document.querySelector('.playArea').classList.add('hidden');
    document.querySelector('.endGame').classList.remove('hidden');
}

(function () {
    // set according to your PerimeterX appid
    window._pxAppId = 'PX1KuevgLk';

    // sets PerimeterX captcha mode to on demand
    window.pxRenderRecaptchaOnDemand = true;

    // required PerimeterX scripts
    let px = document.createElement('script');
    px.type = 'text/javascript';
    px.src = 'https://client.perimeterx.net/PX1KuevgLk/main.min.js';
    let s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(px, s);
    let pxCaptcha = document.createElement('script');
    pxCaptcha.type = 'text/javascript';
    pxCaptcha.src = 'https://captcha.px-cdn.net/PX1KuevgLk/captcha.js?a=c&m=0';
    s.parentNode.insertBefore(pxCaptcha, null);

    // prevents PerimeterX sensor from dynamically loading recaptcha
    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = `https://www.recaptcha.net/recaptcha/api.js?render=explicit`;
    s.insertBefore(recaptchaScript, null);
})();
