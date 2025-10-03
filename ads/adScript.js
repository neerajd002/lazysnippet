const getElement = (selector) => document.querySelector(selector)
const setStyles = (elements, styles) => elements.forEach((element) => Object.assign(element.style, styles))
const fireEvent = (url) => { (new Image()).src = url }
const hide = (element) => { element.style.display = 'none'; }
const show = (element) => { element.style.display = ''; }

const commands = {
    'exp-ovr': 'expand',
    'collapse': 'collapse'
}


// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    console.log('AcunX Ad - key ', e)
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}


const EXPANDED = "expanded";
const COLLAPSED = "collapsed";
const GEOM_UPDATE = "geom-update";

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
        .ad-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            /* background-color: #00000080; */
        }
        .ad-container {
            position: relative;
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
            width: 970px;
            height: 500px;
            background-image: radial-gradient(#0d1d23 var(--radial-percentage-1), rgb(27 67 82 / var(--radial-opacity)) var(--radial-percentage-2));
            color: var(--text-color);
            font-family: Arial, Helvetica, sans-serif;
            cursor: pointer;
        }
        #expand #logo {
            top: 18px;
            left: 50%;
            transform: translateX(-50%);
        }
        #expand #title {
            top: 85px;
            left: 50%;
            width: 768px;
            height: 50px;
            font-size: 32px;
            font-style: italic;
            font-weight: bold;
            text-align: center;
            transform: translateX(-50%);
        }
        #expand #subtitle {
            top: 133px;
            left: 50%;
            width: 700px;
            height: 40px;
            font-size: 18px;
            line-height: 1.2;
            text-align: center;
            transform: translateX(-50%);
        }
        #expand #processImage {
            bottom: 0;
            width: inherit;
            padding: 0 30px;
            box-sizing: border-box;
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
        element: document.querySelector('#banner')
    },
    expand: { 
        width: 970, 
        height: 500,
        element: document.querySelector('#expand')
    },
    expandAd: () => {
        disableScroll();
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
        // acunx.expandUpdate();
        // const expansionParams = {
        //     l: -(acunx.expand.width - acunx.banner.width), 
        //     t: -(acunx.expand.height - acunx.banner.height),
        //     r: 0,
        //     b: 0,
        //     push: false
        // };
        // $sf.ext.expand(expansionParams);
        

        
    },
    expandUpdate: () => {
        const geom = $sf.ext.geom();
        // const { w:windowWidth, h:windowHeight } = geom.win;
        const adWidth = window.innerWidth;
        const adHeight = window.innerHeight;
        const windowWidth = geom.exp.l + adWidth + geom.exp.r;
        const windowHeight = geom.exp.t + adHeight + geom.exp.b;
        console.log('AcunX Ad - geom ', geom);
        console.log('AcunX Ad - dimension ', geom.exp);
        console.log('AcunX Ad - required ', windowWidth, windowHeight);
        const rowGutter = (windowWidth-acunx.expand.width)/2;
        const columnGutter = (windowHeight-acunx.expand.height)/2;
        const l = geom.exp.l - rowGutter;
        const r = (acunx.expand.width - acunx.banner.width) - l;
        const t = geom.exp.t - columnGutter;
        const b = (acunx.expand.height - acunx.banner.height) - t;
        // $sf.ext.expand({ ...geom.exp, l, r, t, b });
        // console.log('AcunX Ad - expand ', { 
        //     ...geom.exp, 
        //     l: 0, 
        //     r: acunx.expand.width - acunx.banner.width, 
        //     t: 0, 
        //     b: acunx.expand.height - acunx.banner.height 
        // });
        // $sf.ext.expand({ ...geom.exp });
        
        // $sf.ext.expand({
        //     ...$sf.ext.geom().exp,
        //     l: -(acunx.expand.width - acunx.banner.width), 
        //     t: -(acunx.expand.height - acunx.banner.height),
        //     r: 0,
        //     b: 0,
        // });
    },
    requestExpansion: () => {
        const geom = $sf.ext.geom();
        console.log('AcunX Ad - geom ', geom);
        // $sf.ext.expand({ l: 100, r: -200, t: 100 });
        $sf.ext.expand({ ...geom.exp });
    },
    collapseAd: () => {
        enableScroll();
        acunx.banner.element.focus();
        expandedAnimation.progress(1);
        show(acunx.banner.element);
        hide(acunx.expand.element);
        acunx.expand.element.style.display = 'none';
    },
    requestCollapse: () => {
        if (!isSafeFrame()) {
            console.log("Not in SafeFrame, collapse disabled.");
            return;
        }
        $sf.ext.collapse();
    },
} 
hide(acunx.expand.element);
acunx.expand.element.onkeydown = function(e) {
    if(e.key === 'Escape') acunx.requestCollapse();
};
let expandedAnimation;
const trackingUrl = 'https://www.lazysnippet.com/ads/1x1.png';

let hasAdResized = false;
const status_update = (status, data) => {
    console.log('AcunX Ad - ', status, data);
    if(status == EXPANDED) {
        if(hasAdResized) {
            hasAdResized = false;
            return; 
        }
        acunx.expandAd();
    }  
    else if(status == COLLAPSED) { 
        if(hasAdResized) return acunx.requestExpansion();
        acunx.collapseAd();
    } 
    else if (status == GEOM_UPDATE) {
        // update viewability
        if($sf.ext.status() == EXPANDED) {
            console.log('AcunX Ad - ' + ' updated');
            // acunx.expandUpdate();
            hasAdResized = true;
            acunx.requestCollapse();
            // acunx.expandAd();
        }
    }
    else if (status == "failed") {
        acunx.requestCollapse();
        hasAdResized = false
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
    expandedAnimation = gsap.timeline({defaults: {ease: "power2.Out", duration:0.7}})
    .from('#expand', { autoAlpha: 0 }, 'initial')
    .from('#expand #logo', { autoAlpha: 0 }, 'initial')
    .from('#expand', { '--radial-percentage-1': '15%', '--radial-opacity': '0%', '--radial-percentage-2': '15%', duration: 0.3 }, 'start')
    .from('#expand #logo', { top: 225 }, 'start')
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
    if(event.target.id === 'expandButton') { acunx.requestExpansion(); } 
    else if(event.target.classList.contains('ad-wrapper')) { acunx.requestCollapse(); } 
    else if(event.target.classList.contains('close-ad')) { acunx.requestCollapse(); } 
    else {
        const clickUrl = 'http://acunexus.com/';
        fireEvent(`${trackingUrl}?click=${encodeURIComponent(clickUrl)}`);
        // fireEvent(trackingUrl);
        window.open(adClickUrl + encodeURIComponent(clickUrl), '_blank');
    }
}