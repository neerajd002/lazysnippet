(()=>{function c(t){let e=document.createElement("div");return e.classList.add("interscroller-bar"),e.classList.add("interscroller-bottom"),e.textContent=t,e}function a(){let t=document.createElement("div");return t.classList.add("container"),t.innerHTML=`
        <div class="bg"></div>
            <div class="content">
                <div class="logo">
                    <img src="./logo.png" />
                </div>
                <div class="text">
                    Your programmatic<br>deserves better ai<br>Let's reimagine it together
                </div>
                <div class="cta">Get Started</div>
            </div>
        </div>
    `,t}function s(){let t=document.createElement("div");t.classList.add("interscroller-content");let e=document.createElement("div");e.classList.add("interscroller-clipper");let o=document.createElement("div");return o.classList.add("interscroller-wrapper"),o.appendChild(a()),e.appendChild(o),t.appendChild(e),t}function p(t){let e=document.createElement("div");return e.classList.add("interscroller-bar"),e.classList.add("interscroller-top"),e.textContent=t,e}var u={".interscroller-bar":`{
        position: relative;
        flex: 0 0 auto;
        text-align: center;
        padding: 3px 0;
        font-size: 14px;
        font-weight: bold;
        border-width: 1px 0;
        border-style: solid;
        border-color: var(--ad-text-1);
        background-color: var(--ad-bg-1);
    }`,".interscroller-top":"{ }",".interscroller-bottom":"{ }",".interscroller-content":`{
        position: relative;
        flex: 1 1 auto;
    }`,".interscroller-clipper":`{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        clip: rect(auto, auto, auto, auto);
    }`,".interscroller-wrapper":`{
        position: fixed !important;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background-color: var(--ad-bg-2);
    }`,".container":`{
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }`,".container > div":`{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }`,".bg":`{
        background-color: var(--ad-bg-1);
        background-image: url(./hero_banner.jpeg);
        background-size: cover;
        background-position: top;
        opacity: 0.6;
    }`,".bg::before":`{
        content: "";
        background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) -27%, #10232D 85%);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }`,".content":`{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 1rem;
    }`,".logo":`{

    }`,".text":`{
        font-size: 2rem;
        text-shadow: 0 0 20px #00000075;
        padding: 2rem 10%;
        font-weight: bold;
        color: #ddd;
    }`,".cta":`{
        padding: 1rem 1.5rem;
        border-radius: 50px;
        background: white;
        transition: scale ease 0.2s;
        cursor: pointer;
    }`,".cta:hover":`{
        scale: 1.03;
    }`};function g(t){let e=document.createElement("style"),o=`
        #${t} {
            --ad-text-1: #316F84;
            --ad-bg-1: #10232d;
            --ad-bg-2: #091419;
            color: var(--ad-text-1);
            font-family: sans-serif;
        }
        #${t} * {
            box-sizing: content-box !important;
            user-select: none;
        }
    `;return Object.keys(u).forEach(i=>{o+=`
            #${t} ${i} ${u[i]}
        `}),e.innerHTML=o,e}function m(){return Math.round(Math.random()*1e7).toString(36)+Date.now().toString(36)}var h=t=>{new Image().src=t};function l(){let t=v();return Math.floor(window.visualViewport?.width||window.innerWidth-t)}function d(){return Math.floor(window.visualViewport?.height||window.innerHeight)}function v(){let t=document.createElement("div");t.style.visibility="hidden",t.style.overflow="scroll",t.style.msOverflowStyle="scrollbar",document.body.appendChild(t);let e=document.createElement("div");t.appendChild(e);let o=t.offsetWidth-e.offsetWidth;return t.parentNode.removeChild(t),o}function f(t,e=500){let o;return(...i)=>{clearTimeout(o),o=setTimeout(()=>{t.apply(this,i)},e)}}var x="https://www.lazysnippet.com/ads/1x1.png",w=document.querySelector("#acunx"),n=document.createElement("div"),y=n.id="ad"+m(),r=document.createElement("div"),b=s();r.appendChild(p("Advertisement"));r.appendChild(b);r.appendChild(c("Scroll to continue with content"));n.appendChild(r);n.appendChild(g(y));w.appendChild(n);Object.assign(n.style,{width:"100%",height:d()+"px",position:"relative"});Object.assign(r.style,{width:l()+"px",height:"100%",position:"absolute",top:0,left:-n.offsetLeft+"px",display:"flex",flexDirection:"column"});var C=()=>{Object.assign(n.style,{height:d()+"px"}),Object.assign(r.style,{left:-n.offsetLeft+"px",width:l()+"px"})};window.addEventListener("resize",function(){C()});var E=f(t=>{let e=window.pageYOffset||document.documentElement.scrollTop,o=n.offsetTop;console.log(e,o),d()*.2>Math.abs(e-o)&&window.scrollTo({top:n.offsetTop,behavior:"smooth"})});window.addEventListener("scroll",E);b.onclick=function(t){let e="http://acunexus.com/";h(`${x}?click=${encodeURIComponent(e)}`),window.open(e,"_blank")};})();
