![image](https://storage.googleapis.com/perimeterx-logos/primary_logo_red_cropped.png)

# [PerimeterX](http://www.perimeterx.com) Whack-a-Bot Chrome Extension Demo

> This repository contains a sample Chrome Extension demonstrating how to integrate PerimeterX Bot Defender JavaScript sensor with Chrome Extension.

![demo](https://whackabot.xyz/whackabot.gif)

## Table of Contents

-   [Getting Started](#gettingStarted)
-   [Advanced Blocking Response](#advancedBlockingResponse)
    -   [What Is Advanced Blocking Response?](#whatIsAdavancedBlockingResponse)
    -   [Integration](#integration)
    -   [Challenge Result Callback](#challengeResultCallback)
-   [Optional Configuration](#optionalConfiguration)

## Getting Started

To integrate the PerimeterX JavaScript sensor and Human Challenge, add the following snippet to the Chrome Extension main .js file:

```javascript
(function () {
    // set according to your PerimeterX appid
    window._pxAppId = '<PerimeterX App id>';
    // sets PerimeterX captcha mode to on demand
    window.pxHumanChallengeOnDemand = true;
    // required PerimeterX scripts
    let pxCaptcha = document.createElement('script');
    pxCaptcha.type = 'text/javascript';
    pxCaptcha.src = '/scripts/captcha.js';
    let s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(pxCaptcha, s);
    let sensor = document.createElement('script');
    sensor.type = 'text/javascript';
    sensor.src = '/scripts/main.min.js';
    s.parentNode.insertBefore(sensor, null);
})();
```

> Make sure to replace `<PerimeterX App id>` with your PerimeterX application id. You can find this code snippet in the `popup.js` file in this repository.

## Advanced Blocking Response Integration

### What Is Advanced Blocking Response?

In special cases, (such as XHR post requests) a full Captcha page render might not be an option. In such cases, the Advanced Blocking Response returns a JSON object containing all the information needed to render your own Captcha challenge implementation, be it a popup modal, a section on the page, etc.
Advanced Blocking Response occurs when a request that is marked for blocking contains an `Accept` header with the value of `application/json`. It returns a JSON with the following structure:

```json
{
    "appId": String,
    "jsClientSrc": String,
    "firstPartyEnabled": Boolean,
    "vid": String,
    "uuid": String,
    "hostUrl": String,
    "blockScript": String
}
```

### Integration

To render the challenge element upon receving an Advanced Blocking Response (ABR) follow these steps:

1. In your networking layer, make sure you handle errors and verify the response code received. An ABR will always have the 403 status code. The example in this repository uses `fetch`, and always sends back the status code and body in response to network calls (`networkManager.js` lines 16-19)
2. Add the following `window` properties:

    ```javascript
     window._pxAppId = '<appId>'; // PerimeterX's application id
     window._pxJsClientSrc = '<jsClientSrc>'; // PerimeterX's JavaScript sensor url
     window._pxFirstPartyEnabled = <firstPartyEnabled>; // A boolean flag indicating whether first party is enabled or not
     window._pxVid = '<vid>'; // PerimeterX's visitor id
     window._pxUuid = '<uuid>'; // PerimeterX's unique user id
     window._pxHostUrl = '<hostUrl>'; // PerimeterX's cloud component URL
    ```

    > The values for the properties can be found in the ABR object. See `networkManager.js` lines 60-65 for an implementation example.

3. Add an empty `div` element with an `id` attribute of `px-captcha` to the location in the page where the Captcha will be rendered. For example:

    ```javascript
    const pxDiv = document.createElement('div');
    pxDiv.id = 'px-captcha';
    challengeDiv.appendChild(pxDiv);
    ```

    > `challengeDiv` is the HTML element you want to append the challenge element to.

4. Call the `window.pxRenderHumanChallenge();` global method to render the challenge.

### Challenge Result Callback

Once a challenge is solved, it will refresh the page by default. If you want to implement your own challenge success logic, use the `_pxOnCaptchaSuccess` callback. The callback can be used as follows:

```javascript
window._pxOnCaptchaSuccess = function (isValid) {
    if (isValid) {
        // challenge was solved successfully.
        // do something here.
    }
};
```

## Optional Configuration

### Challenge Element Langauge

To set the element's language code, use the `window._pxSelectedLocale = '<languageCode>';` property.

> A list of supported languages can be found [here](https://docs.perimeterx.com/pxconsole/docs/human-challenge#section-18-n-internationalization-and-localization)

### Customizing the Challenege

To customize the Human Challenge element, refer to the guide [here](https://docs.perimeterx.com/pxconsole/docs/human-challenge#section-customization)
