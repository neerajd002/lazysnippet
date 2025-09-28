const getElement = (selector) => document.querySelector(selector)
const setStyles = (elements, styles) => elements.forEach((element) => Object.assign(element.style, styles))
const fireEvent = (url) => { (new Image()).src = url }
const hide = (element) => { element.style.opacity = 0; element.style.visibility = 'hidden'; }
const show = (element) => { element.style.opacity = 1; element.style.visibility = 'visible'; }

const EXPANDED = "expanded";
const COLLAPSED = "collapsed";

function isSafeFrame() {
    try {
        return typeof $sf !== 'undefined' && $sf.ext;
    } catch (e) {
        return false;
    }
}
const adContainer = document.createElement('div');
adContainer.innerHTML = `
    <style id="adStyles">
        :root {
            --max-z-index: 2147483647;
            --text-color: #fff;
            --border-color: #1b4352;
            --icon-color: #fff;
            --radial-percentage-1: 0%;
            --radial-percentage-2: 100%;
            --radial-opacity: 100%;
        }
        body {
            margin: 0;
            padding: 0;
        }
        #acunX {
            width: 100%;
            height: 100vh;
            background-color: #00000040;
        }
        .ad-wrapper {
            position: relative;
            width: inherit;
            height: inherit;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .ad-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            backface-visibility: hidden;
        }
        .ad-container  > * {
            position: absolute;
        }
        button {
            font-weight: bold;
            text-align: center;
            color: #fff;
            border: none;
            border-radius: 10px;
            background-color: #2e647c;
            cursor: pointer;
        }
        button:hover {
            background-color: #2e647ccc;
        }
        .close-ad {
            top: 12px;
            right: 12px;
            width: 20px;
            height: 20px;
            padding: 5px;
            font-size: 20px;
            line-height: 20px;
            text-align: center;
            border: 1px solid var(--icon-color);
            border-radius: 50%;
        }
        .close-ad:hover {
            opacity: 0.7;
        }
        .ad-border {
            width: inherit;
            height: inherit;
            border: 1px solid #1b4352;
            box-sizing: border-box;
            pointer-events: none;
        }
        .overlay {
            top: 0;
            left: 0;
            width: inherit;
            height: inherit;
            background-color: #fff;
        }
    </style>
    <style id="bannerStyles">
        #banner {
            width: 300px;
            height: 250px;
            background-image: radial-gradient(#0d1d23, #1b4352);
            color: var(--text-color);
            font-family: Arial, Helvetica, sans-serif;
            cursor: pointer;
        }
        #banner #logo {
            top: 20px;
            left: 20px;
            width: 80px;
        }
        #banner #logo img { width: inherit; }
        #banner #title {
            top: 92px;
            left: 20px;
            width: 260px;
            height: 30px;
            font-size: 22px;
            text-transform: uppercase;
            font-style: italic;
            font-weight: bold;
            text-align: center;
        }
        #banner #subtitle {
            top: 150px;
            left: 20px;
            width: 260px;
            height: 24px;
            font-size: 16px;
            text-align: center;
        }
        #banner button {
            bottom: 24px;
            left: 90px;
            width: 120px;
            height: 30px;
        }
    </style>
    <style id="expandedStyles">
        #expand {
            width: 1382px;
            height: 730px;
            background-image: radial-gradient(#0d1d23 var(--radial-percentage-1), rgb(27 67 82 / var(--radial-opacity)) var(--radial-percentage-2));
            color: var(--text-color);
            font-family: Arial, Helvetica, sans-serif;
            cursor: pointer;
        }
        #expand #logo {
            top: 35px;
            left: 50%;
            transform: translateX(-50%);
        }
        #expand #title {
            top: 143px;
            left: 50%;
            width: 768px;
            height: 50px;
            font-size: 36px;
            font-style: italic;
            font-weight: bold;
            text-align: center;
            transform: translateX(-50%);
        }
        #expand #subtitle {
            top: 195px;
            left: 50%;
            width: 700px;
            height: 40px;
            font-size: 20px;
            line-height: 1.2;
            text-align: center;
            transform: translateX(-50%);
        }
        #expand #processImage {
            bottom: 0;
            width: inherit;
        }
        #expand #processImage img {
            width: 100%;
        }
    </style>
    <div class="ad-wrapper">
        <div id="banner" class="ad-container" tabindex="0">
            <div id="logo"><img src="https://www.lazysnippet.com/ads/logo.png" /></div>
            <div id="title">Your programmatic deserves better ai</div>
            <div id="subtitle">Let's reimagine it together</div>
            <button id="expandButton">Explore more</button>
            <div class="ad-border"></div>
            <div class="overlay"></div>
        </div>
        <div id="expand" class="ad-container" tabindex="0">
            <div id="logo"><img src="https://www.lazysnippet.com/ads/logo.png" /></div>
            <div id="title">Driving Innovation Where It's Needed Most</div>
            <div id="subtitle">A unified platform where media intelligence, creative innovation, and<br>AI-powered delivery come together to drive impactful storytelling</div>
            <div id="processImage"><img src="https://www.lazysnippet.com/ads/process-flow.png" /></div>
            <div class="close-ad">&#10005;</div>
            <div class="ad-border"></div>
            <!-- <div class="overlay"></div> -->
        </div>
    </div>
`;
const adElement = document.querySelector("#acunx")
adElement.appendChild(adContainer)

const acunx = {
    element: adElement,
    banner: { 
        width: 300, 
        height: 250,
        element: document.querySelector('#expand')
    },
    expand: { 
        width: 1382, 
        height: 730,
        element: document.querySelector('#expand')
    },
    expandAd: () => {
        show(acunx.expand.element);
        hide(acunx.banner.element);
        acunx.expand.element.style.display = 'block';
        acunx.expand.element.focus();
        if(expandedAnimation) {
            expandedAnimation.restart();
        } else {
            animateExpanded();
        }
        if (!isSafeFrame()) {
            console.log("Not in SafeFrame, collapse disabled.");
            return;
        }
        // const expansionParams = {
        //     l: -(acunx.expand.width - acunx.banner.width), 
        //     t: -(acunx.expand.height - acunx.banner.height),
        //     r: 0,
        //     b: 0,
        //     push: false
        // };
        // $sf.ext.expand(expansionParams);
        $sf.ext.expand($sf.ext.geom().exp);
    },
    collapseAd: () => {
        acunx.banner.element.focus();
        expandedAnimation.progress(1);
        show(acunx.banner.element);
        hide(acunx.expand.element);
        acunx.expand.element.style.display = 'none';
        if (!isSafeFrame()) {
            console.log("Not in SafeFrame, collapse disabled.");
            return;
        }
        $sf.ext.collapse();
    }
} 
hide(acunx.expand.element);
acunx.expand.element.onkeydown = function(e) {
    if(e.key === 'Escape') acunx.collapseAd();
};
let expandedAnimation;
const trackingUrl = 'https://www.lazysnippet.com/ads/1x1.png';

const status_update = (status, data) => {
    console.log(status, data);
    if(status == "expanded") { } 
    else if (status == "geom-update") {
        // update viewability
        if($sf.ext.status() == EXPANDED) {
            console.log('AcunX Ad updated');
            $sf.ext.expand($sf.ext.geom().exp);
        }
    }
}

if(isSafeFrame()) {
    $sf.ext.register(acunx.banner.width, acunx.banner.height, status_update);
}
const animateBanner = () => {
    gsap.timeline({defaults: {ease: "power2.Out", duration:0.7}})
    .to('#banner .overlay', { autoAlpha: 0, delay: 1 })
    .from('#banner #logo', { autoAlpha: 0 })
    .from('#banner #logo', { top: 110, left: 110, delay: 0.5 })
    .from('#banner #title', { y: '+=100%', autoAlpha: 0 })
    .from('#banner #subtitle', { y: '+=100%', autoAlpha: 0 })
    .from('#banner #expandButton', { autoAlpha: 0 })
}
const animateExpanded = () => {
    gsap.set('#expand', { autoAlpha: 1 })
    expandedAnimation = gsap.timeline({defaults: {ease: "power2.Out", duration:0.7}})
    .from('#expand', { autoAlpha: 0 }, 'initial')
    .from('#expand #logo', { autoAlpha: 0 }, 'initial')
    .from('#expand', { '--radial-percentage-1': '10%', '--radial-opacity': '0%', '--radial-percentage-2': '10%', duration: 0.3 }, 'start')
    .from('#expand #logo', { top: 341 }, 'start')
    .from('#expand .ad-border', { autoAlpha: 0, duration: 0.01 })
    .from('#expand .close-ad', { autoAlpha: 0 })
    .from('#expand #title', { y: '+=100%', autoAlpha: 0 })
    .from('#expand #subtitle', { y: '+=100%', autoAlpha: 0 })
    .from('#expand #processImage', { autoAlpha: 0 })
}
fireEvent(`${trackingUrl}?imp=expandableAd`);
const gsapScript = document.createElement('script');
gsapScript.src = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js';
acunx.element.appendChild(gsapScript);
gsapScript.onload = function() {
    animateBanner();
}

acunx.element.onclick = function(event) {
    if(event.target.id === 'expandButton') { acunx.expandAd(); } 
    else if(event.target.classList.contains('close-ad')) { acunx.collapseAd(); } 
    else {
        const clickUrl = 'http://acunexus.com/';
        fireEvent(`${trackingUrl}?click=${encodeURIComponent(clickUrl)}`);
        // fireEvent(trackingUrl);
        window.open(adClickUrl + encodeURIComponent(clickUrl), '_blank');
    }
}