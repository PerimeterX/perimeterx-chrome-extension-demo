const baseUrl = 'https://www.whackabot.xyz';

async function makeNetworkCall(path, method = 'GET', body) {
    const options = {
        method,
        headers: {
            Accept: 'application/json',
        },
    };
    if (method === 'POST') {
        options['body'] = JSON.stringify(body);
        options['headers']['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${baseUrl}${path}`, options);
    return {
        status: response.status,
        body: await response.json(),
    };
}

function generatePXContent(body, parent, cb) {
    // Some text explaining whats going on
    const challengeDiv = document.createElement('div');
    challengeDiv.classList.add('challenge');

    const header = document.createElement('h2');
    header.textContent = 'Whoa, Slow Down There, Buddy!';
    challengeDiv.appendChild(header);

    // PerimeterX challenge will be rendered inside this div
    const pxDiv = document.createElement('div');
    pxDiv.id = 'px-captcha';
    challengeDiv.appendChild(pxDiv);

    // Some text explaining whats going on
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('reasons');
    const span1 = document.createElement('span');
    span1.textContent =
        'You might have received this message if JavaScript or cookies were disabled in your browser settings.';
    contentDiv.appendChild(span1);
    const br = document.createElement('br');
    contentDiv.appendChild(br);
    const span2 = document.createElement('span');
    span2.textContent =
        'Occasionally a plugin or extension may be at fault. If you would like to learn more just reference ';
    contentDiv.appendChild(span2);
    const a = document.createElement('a');
    a.href = 'https://www.perimeterx.com/whywasiblocked/#';
    a.textContent = 'Why Was I Blocked';
    contentDiv.appendChild(a);
    const span3 = document.createElement('span');
    span3.textContent = ' for more details.';
    contentDiv.appendChild(span3);
    challengeDiv.appendChild(contentDiv);
    parent.appendChild(challengeDiv);

    // Mandatory window properties
    window._pxAppId = body.appId; // PerimeterX's application id
    window._pxJsClientSrc = body.jsClientSrc; // PerimeterX's JavaScript sensor url
    window._pxFirstPartyEnabled = body.firstPartyEnabled; // A boolean flag indicating wether first party is enabled or not
    window._pxVid = body.vid; // PerimeterX's visitor id
    window._pxUuid = body.uuid; // PerimeterX's unique user id
    window._pxHostUrl = body.hostUrl; // PerimeterX's cloud component URL
    window.pxRenderRecaptcha();
    window._pxOnCaptchaSuccess = function (isValid) {
        if (isValid) {
            cb();
        }
    };
    parent.querySelector('.loader').classList.add('hidden');
}
