// ==UserScript==
// @name          Adtrafik SEO QA Plugin
// @version       0.1
// @namespace     http://www.adtrafik.com/
// @description   Shows important SEO head information for QA.
// @icon          http://www.fullstackoptimization.com/assets/ico/apple-touch-icon.png
// @include       *.pokerstars.*
// @include       *.fulltiltpoker.*
// ==/UserScript==


var b, c, r, box, msg, actns, btnmr, btnmn;
b = document.body;
c = document.querySelectorAll('link[rel="canonical"]');
r = document.querySelectorAll('meta[name="robots"]');


GM_addStyle('\
    #canonicaldebug-s dl, #canonicaldebug-s dd, #canonicaldebug-s dt, #canonicaldebug-s p, #canonicaldebug-s a, #canonicaldebug-s a:hover, #canonicaldebug-s button {\
        margin:0;\
        padding:0;\
        font-size:10px;\
        line-height: 12px\
    }\
    #canonicaldebug-s a {text-decoration:none; color:#323232;}\
    #canonicaldebug-s {\
        background:#323232;\
        position:fixed;\
        font-family:"Helvetica Neue", Helvetica;\
        font-size:10px;\
        left:10px;\
        top:10px;\
        z-index:100000;\
        border-radius:5px;\
        box-shadow:0px 2px 10px rgba(0,0,0,0.48);\
        opacity:0.985;\
        color:white;\
        max-width: 25%;\
        min-width: 250px;\
        background-image: -webkit-gradient(linear,left bottom,left top,color-stop(0,#323232),color-stop(1,#545454));\
    }\
    #canonicaldebug-s #canonical {\
    }\
    #canonicaldebug-s .cdb_message dt {\
        display:none;\
    }\
    #canonicaldebug-s .cdb_message dt.cdb_more {\
        display:block;\
        text-transform:uppercase;\
        letter-spacing:1px;\
        border-bottom:1px solid #FF9914;\
        color:#FF9914;\
        font-style:normal;\
        font-weight:bold;\
        padding-bottom:2px;\
        margin-bottom:4px;\
        font-size:10px;\
        padding-top:10px;\
    }\
    #canonicaldebug-s .cdb_message:first-child dt.cdb_more {\
        padding-top:0;\
    }\
    #canonicaldebug-s .cdb_message dd {\
        font-family:Monaco, Consolas, "Courier New", monospace;\
        word-wrap:break-word;\
        font-size:10px;\
        color:#fff;\
    }\
    #canonicaldebug-s .msgs {\
        padding:10px 10px 0px 10px;\
    }\
    #canonicaldebug-s .actns {\
        margin-top:5px;\
        padding:5px 10px;\
        background:#FF9914;\
        color: #323232;\
        text-align: right;\
        border-bottom-left-radius: 5px;\
        border-bottom-right-radius: 5px;\
    }\
    #canonicaldebug-s .cdb_alert{\
        color: #FF3737 !important;\
        font-weight:bold;\
    }\
    #canonicaldebug-s dd a {\
        color:#FF3737;\
        font-weight:bold;\
    }\
    #canonicaldebug-s dd a:hover {\
        color:#FF3737;\
        font-weight:bold;\
    }\
    #canonicaldebug-s .actns .cdb-brand{\
        float:left;\
    }\
    #canonicaldebug-s .actions .cdb-nav{\
        float:right;\
    }\
    #canonicaldebug-s .actns span {\
        margin-left:5px;\
    }\
    #canonicaldebug-s button {\
        font-size:10px;\
        padding-left:10px;\
        margin:0;\
        background:none;\
        border:none;\
        color: #323232;\
        cursor: pointer;\
    }\
    .canonicaldebug-min {\
        -webkit-transform: rotate(-90deg) !important;\
        -webkit-transform-origin: 0 100% !important;\
        top: 280px !important;\
        left: 22px !important;\
        max-width: 250px !important;\
    }\
    #canonicaldebug-s .hdcode{\
        white-space: pre-wrap;\
        line-height: 15px;\
    }');

function get_canonical() {
    var can = document.createElement('dl');
    can.setAttribute('class', 'cdb_message');
    can.setAttribute('id', 'canonical');
    can.innerHTML = '<dt>Canonical</dt>';
    if (c.length == 0) {
        can.dd = document.createElement('dd');
        can.dd.setAttribute('class', 'cdb_alert');
        can.dd.innerHTML = '<span class="cdb_alert">⚠ </span>No canonical found!';
        can.appendChild(can.dd);
        msg.appendChild(can);
    } else {
        for (var i = 0; i < c.length; i++) {
            can.dd = document.createElement('dd');
            if (c[i].href != document.location){
                can.dd.innerHTML = '<span class="cdb_alert">⚠ </span><a href="' + c[i].href + '">' + c[i].href + '</a>';
            } else {
                can.dd.appendChild(document.createTextNode(c[i].href));
            }
            can.appendChild(can.dd);
            msg.appendChild(can);
        }
    }
}

function get_robots() {
    var rob = document.createElement('dl');
    rob.setAttribute('class', 'cdb_message');
    rob.setAttribute('id', 'robots');
    rob.innerHTML = '<dt>Meta Robots</dt>';
    for (var i = 0; i < r.length; i++){
        rob.dd = document.createElement('dd');
        if((r[i].content.search('noindex')!=-1) || (r[i].content.search('nofollow')!=-1)){
            rob.dd.setAttribute('class', 'cdb_alert');
            rob.dd.innerHTML = '<span class="cdb_alert">⚠ </span>' + r[i].content.toLowerCase();
        } else {
            rob.dd.appendChild(document.createTextNode(r[i].content.toLowerCase()));
        }
        rob.appendChild(rob.dd);
        msg.appendChild(rob);
    }
}

function show_more() {
    var req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    var hd = req.getAllResponseHeaders().toLowerCase();
    var el = document.createElement('dl');
    el.setAttribute('class', 'cdb_message');
    el.setAttribute('id', 'headers');
    el.innerHTML = '<dt>Header Information</dt>';
    el.dd = document.createElement('dd');
    el.dd.setAttribute('class', 'hdcode')
    el.dd.appendChild(document.createTextNode(hd));
    el.appendChild(el.dd);
    msg.appendChild(el);
    var titles = document.querySelectorAll('#canonicaldebug-s dt');
    for (var i = 0; i < titles.length; i ++){
        titles[i].setAttribute('class', 'cdb_more');
    }
}

function minimize() {
    if (document.getElementById('headers')) {
        msg.removeChild(document.getElementById('headers'));
        var titles = document.querySelectorAll('#canonicaldebug-s dt');
        for (var i = 0; i < titles.length; i ++){
            titles[i].removeAttribute('class', 'cdb_more');
        }
    }
    var box = document.getElementById('canonicaldebug-s');
    if (box.hasAttribute('class', 'canonicaldebug-min')) {
        box.removeAttribute('class', 'canonicaldebug-min');
        localStorage.setItem('state', 'def')
        btnmr.setAttribute('style', 'display:inline');
        msg.setAttribute('style', 'display:block');
    } else {
        box.setAttribute('class', 'canonicaldebug-min');
        localStorage.setItem('state', 'min')
        btnmr.setAttribute('style', 'display:none');
        msg.setAttribute('style', 'display:none');
    }
    
}

function set_actions() {
    var brnd = document.createElement('div');
    brnd.setAttribute('class', 'cdb-brand');
    brnd.innerHTML = 'Adtrafik QA Bar';
    var nav = document.createElement('div');
    nav.setAttribute('class', 'cdb-nav');
    // show more button
    btnmr = document.createElement('button');
    btnmr.setAttribute('type', 'button');
    btnmr.setAttribute('id', 'morebutton');
    btnmr.appendChild(document.createTextNode('show more'));
    btnmr.addEventListener('click', show_more, true);
    nav.appendChild(btnmr);
    // toggle min / max
    btnmn = document.createElement('button');
    btnmn.setAttribute('type', 'button');
    btnmn.setAttribute('id', 'hidebutton');
    btnmn.appendChild(document.createTextNode('on/off'));
    btnmn.addEventListener('click', minimize, true);
    nav.appendChild(btnmn);
    actns.appendChild(brnd);
    actns.appendChild(nav);
    box.appendChild(actns);
}

function base() {
    box = document.createElement('div');
    box.setAttribute('id', 'canonicaldebug-s');
    msg = document.createElement('div');
    msg.setAttribute('class', 'msgs');
    actns = document.createElement('div');
    actns.setAttribute('class', 'actns');
    box.appendChild(msg);
    set_actions();
    b.parentNode.insertBefore(box, b);
    if(localStorage.getItem('state') == 'min'){
        box.setAttribute('class', 'canonicaldebug-min');
    }
}

if (r.length > 0) {
    if (window.top != window.self)  //don't run on frames or iframes
        return;
    base();
    get_canonical();
    get_robots();
}

if (r.length == 0) {
    if (window.top != window.self)  //don't run on frames or iframes
        return;
    base();
    get_canonical();
}