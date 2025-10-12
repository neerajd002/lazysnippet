const getElement = (selector) => document.querySelector(selector)
const setStyles = (elements, styles) => elements.forEach((element) => Object.assign(element.style, styles))
const fireEvent = (url) => { (new Image()).src = url }
const addScript = (element, scriptUrl, callback) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    element.appendChild(script);
    script.onload = callback;
}
const hide = (element) => { element.style.display = 'none'; }
const show = (element) => { element.style.display = ''; }

const commands = {
    'exp-ovr': 'expand',
    'collapse': 'collapse'
}

const metaViewport = document.createElement('meta');
metaViewport.setAttribute('name', 'viewport');
metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
document.head.appendChild(metaViewport);

const adScroll = (() => {
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    const keys = {37: 1, 38: 1, 39: 1, 40: 1};
    
    function preventDefault(e) { e.preventDefault(); }
    
    function preventDefaultForScrollKeys(e) {
        console.log('AcunX Ad - key ', e)
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }
    
    // modern Chrome requires { passive: false } when adding event
    let supportsPassive = false;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () { supportsPassive = true; } 
        }));
    } catch(e) {}
    
    const wheelOpt = supportsPassive ? { passive: false } : false;
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    
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
    return {
        enable: () => enableScroll(),
        disable: () => disableScroll()
    }
})();



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
adContainer.id = 'adContainer';
adContainer.dataset.ad = COLLAPSED;
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
            padding: 10px;
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
            border-radius: 50%;
        }
        .close-ad:hover {
            opacity: 0.7;
        }
        [data-ad="collapsed"] .close-ad {
            display: none;
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
    <style>
        html::-webkit-scrollbar, body::-webkit-scrollbar{
            display: none;
        }
        
        html, body {
            scrollbar-width: none;
            -ms-overflow-style: none;
            overflow: hidden;
        }
        canvas {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            /* width: 100%;
            height: 100vh; */ 
        }
        [data-ad="collapsed"] canvas {
            top: 85%;
        }
        #scrollTopContent {
            height: 1000px;
        }
        #scrollAdContent {
            height: 250px;
        }
        #scrollBottomContent {
            height: 1000px;
        }
    </style>
    <div class="ad-wrapper">
        <div class="ad-container" tabindex="0">
            <canvas id="images"></canvas>
            <button id="expandButton">expand</button>
            <div class="close-ad">&#10005;</div>
            <div class="overlay"></div>
        </div>
    </div>
    <div id="scrollWrapper">
        <div id="scroller">
            <div id="scrollTopContent"></div>
            <div id="scrollAdContent"></div>
            <div id="scrollBottomContent"></div>
        </div>
    </div>
`;
const googleDiv = document.querySelector('#abgcp');
if(googleDiv) {
    googleDiv.style.position = 'fixed';
}
const adElement = document.querySelector("#acunx")
adElement.appendChild(adContainer)

adElement.style.height = '';

const closeAd = adElement.querySelector('.close-ad');
let imageNaturalWidth;
let imageNaturalHeight;
const acunx = {
    element: adElement,
    banner: { 
        width: 300, 
        height: 250,
        // element: document.querySelector('#banner')
    },
    expand: { 
        width: 970, 
        height: 500,
        // element: document.querySelector('#expand')
    },
    expandAd: () => {
        adScroll.disable();
        adContainer.dataset.ad = EXPANDED;
        // show(acunx.expand.element);
        // hide(acunx.banner.element);
        // acunx.expand.element.style.display = 'block';
        // acunx.expand.element.focus();
        if(expandedAnimation) {
            // expandedAnimation.restart();
        } else {
            animateExpanded();
        }
        if (!isSafeFrame()) {
            console.log("Not in SafeFrame, collapse disabled.");
            return;
        }
    },
    requestExpansion: () => {
        $sf.ext.expand({ ...$sf.ext.geom().exp });
    },
    collapseAd: () => {
        adScroll.enable();
        adContainer.dataset.ad = COLLAPSED;
        // acunx.banner.element.focus();
        // expandedAnimation.progress(1);
        // show(acunx.banner.element);
        // hide(acunx.expand.element);
        // acunx.expand.element.style.display = 'none';
    },
    requestCollapse: () => {
        if (!isSafeFrame()) {
            console.log("Not in SafeFrame, collapse disabled.");
            return;
        }
        $sf.ext.collapse();
    },
} 
// hide(acunx.expand.element);
// acunx.expand.element.onkeydown = function(e) {
//     if(e.key === 'Escape') acunx.requestCollapse();
// };
let expandedAnimation;
const trackingUrl = 'https://www.lazysnippet.com/ads/1x1.png';

let hasAdResized = false;
const status_update = (status, data) => {
    const geom = $sf.ext.geom();
    const { self, win, exp } = geom;
    console.log('AcunX Ad - status_update ', status, data, geom);

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
            hasAdResized = true;
            acunx.requestCollapse();
            // acunx.expandAd();
        } else {
            if(exp.t) {
                document.documentElement.scrollTop = self.t - exp.t;
            } else if(exp.b) {
                document.documentElement.scrollTop = self.b - (win.h - exp.b);
            }
        }
    }
    else if (status == "failed") {
        acunx.collapseAd();
        hasAdResized = false
    }
}

if(isSafeFrame()) {
    $sf.ext.register(acunx.banner.width, acunx.banner.height, status_update);
    console.log('AcunX Ad - Ad load ', $sf.ext.geom());
    const geom = $sf.ext.geom()
    acunx.expand.width = geom.win.w;
    acunx.expand.height = geom.win.h;
    document.querySelector('#scrollTopContent').style.height = geom.self.t + 'px';
}
const animateBanner = () => {
    // gsap.timeline({defaults: {ease: "power2.Out", duration:0.7}})
    gsap.to('.overlay', { autoAlpha: 0, delay: 1, ease: "power2.Out", duration: 0.7 });
    console.log('AcunX Ad - Animate Banner');
    gsap.to(frames, {
        frame: 90,
        snap: "frame",
        onUpdate: render,
        onComplete: () => acunx.requestExpansion(),
        scrollTrigger: {
            trigger: "#scrollAdContent",
            start: () => "-=" + acunx.expand.height,
            scrub: 0.5,
            end: () => "+=" + document.querySelector("#scrollTopContent").offsetHeight
        },
        ease: "none"
    });
    
    // gsap.timeline({defaults: {ease: "power2.Out", duration:0.7}})
    // .to('#banner .overlay', { autoAlpha: 0, delay: 1 })
    // .from('#banner #logo', { autoAlpha: 0 })
    // .from('#banner #logo', { top: 110, left: 110, delay: 0.5 })
    // .from('#banner #title', { y: '+=100%', autoAlpha: 0 })
    // .from('#banner #subtitle', { y: '+=100%', autoAlpha: 0 })
    // .from('#banner #expandButton', { autoAlpha: 0 })
}
const animateExpanded = () => {
    // expandedAnimation = gsap.timeline({defaults: {ease: "power2.Out", duration:0.7}})
    // .from('#expand', { autoAlpha: 0 }, 'initial')
    // .from('#expand #logo', { autoAlpha: 0 }, 'initial')
    // .from('#expand', { '--radial-percentage-1': '15%', '--radial-opacity': '0%', '--radial-percentage-2': '15%', duration: 0.3 }, 'start')
    // .from('#expand #logo', { top: 225 }, 'start')
    // .from('#expand .ad-border', { autoAlpha: 0, duration: 0.01 })
    // .from('#expand .close-ad', { autoAlpha: 0 })
    // .from('#expand #title', { y: '+=100%', autoAlpha: 0 })
    // .from('#expand #subtitle', { y: '+=100%', autoAlpha: 0 })
    // .from('#expand #processImage', { autoAlpha: 0 })
}
fireEvent(`${trackingUrl}?imp=expandableAd`);

const canvas = document.getElementById("images");
canvas.width = acunx.expand.width;
canvas.height = acunx.expand.height;
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;
const frames = { frame: 0 };

const filesCount = 3;
let loadedFiles = 0;
const fileLoaded = () => {
    loadedFiles++;
    if(loadedFiles !== filesCount) return;
    gsap.registerPlugin(ScrollTrigger)
    setTimeout(function() {
        render();
        animateBanner();
    }, 1000);
}
const frameCount = 225;
const currentFrame = (index) => `https://www.lazysnippet.com/ads/mobile-expandable/frames-webp/Frame_${index.toString().padStart(5, '0')}.webp`;
const images = [];

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.loading="eager"
    img.src = currentFrame(i);
    images.push(img);
}
images[0].onload = function() {
    fileLoaded();
};
addScript(acunx.element, 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js', fileLoaded);
addScript(acunx.element, 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js', fileLoaded);

// function render() {
//     console.log('AcunX Ad - Render ', canvas, images[frames.frame], frames.frame);
//     context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
//     context.drawImage(images[frames.frame], 0, 0, canvas.offsetWidth, canvas.offsetHeight);
// }

let lastRendered = -1;
function render() {
    const index = frames.frame;
    if (index === lastRendered) return;

    const img = images[index];
    const naturalWidth = img.naturalWidth || img.width;
    const naturalHeight = img.naturalHeight || img.height;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const hRatio = canvas.width/naturalWidth;
    const vRatio = canvas.height/naturalHeight;
    const ratio = Math.min(hRatio, vRatio);
    const dx = (canvas.width - naturalWidth * ratio)/2;
    const dy = (canvas.height - naturalHeight * ratio)/2;
    context.drawImage(
        img, 0, 0, naturalWidth, naturalHeight,
        dx, dy, naturalWidth * ratio, naturalHeight * ratio
    );

    lastRendered = index;
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