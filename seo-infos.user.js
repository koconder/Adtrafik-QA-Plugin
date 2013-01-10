// ==UserScript==
// @name          Canonicals & Robots
// @version       0.1
// @namespace     http://www.fullstackoptimization.com/
// @description   Shows important SEO head information (canonical, meta robots, http response headers).
// @include       *
// ==/UserScript==


var b, c, r, req, hd, box, msg, btnmr, btnls;
b = document.body;
c = document.querySelectorAll('link[rel="canonical"]');
r = document.querySelectorAll('meta[name="robots"]');

if (c.length>0 || r.length>0){
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
            border-bottom:1px solid #859900;\
            color:#859900;\
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
            background:#859900;\
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
    }

function get_canonical() {
    can = document.createElement('dl');
    can.setAttribute('class', 'cdb_message');
    can.setAttribute('id', 'canonical');
    can.innerHTML = '<dt>Canonical</dt>';
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

function get_robots() {
    rob = document.createElement('dl');
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
    req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    hd = req.getAllResponseHeaders().toLowerCase();
    el = document.createElement('dl');
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
    brnd = document.createElement('div');
    brnd.setAttribute('class', 'cdb-brand');
    brnd.innerHTML = '<a href="http://www.fullstackoptimization.com"><img width="10" height="10" alt="logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAQtQTFRFf5IAcIEAaHgAZXQAZHMAZHMAY3IAYG4AV2QAPEYASlUAVGAAdIUAfpEAQUsAQUoAQ00AUV0AfpEAhZgAiJwAh5sASVQARlEAgpUAf5IARVAAgpYAQkwAhpoAS1YAS1YAfpAAfZAAQ00ASFMASVQAU18Ae44AfpAAgJMAhZkAQ00AhZkAhZkAQ00AQ00ARE8AQEoATVkAhJgAhZkAhJgAhZkAhZkBXGoAYnAAZXQAY3IAZ3YAbH0AP0gAiZ0ASlUAQEoASlYAh5sAhZkAf5IASVQATFgAS1cAU18Ae44AfI8AQUoATVkAg5cAhpsAiJwAh5wATVgARU8AgZQAQkwAP0kAhZoAhpoA////4MNIlAAAADd0Uk5TDzlzrufutHQ2C+P+/d79/Pz+/vz8/eb+/ub6+fn65v7+5v38/P7+/Pz93v7jCzZ0tO7nrnM5D19uDC0AAAABYktHRFjttcSOAAAACXBIWXMAAABIAAAASABGyWs+AAAAdklEQVQI12NgYGRiZmFlY+fgZODiNrewtLK24eFl4LPlFxAUEhaxE2UQsxd3cHRylnCRZJBydXP38PT0cpFmkPH2dvDx9fMPkGWQC5QPCvQNVvBUZFAKUlZRVVPX8NVk0FIKCXUPcwrX1mHQ1dM3MDQyNjE1AwBQBhI+0tE5gQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMi0xMi0yMVQxNjowNTozMy0wNTowMLqNURAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTItMTItMjFUMTY6MDU6MzMtMDU6MDDL0OmsAAAAAElFTkSuQmCC" />f19n.com</a>';
    nav = document.createElement('div');
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

if (c.length > 0 && r.length > 0) {
    base();
    get_canonical();
    get_robots();
}

if (c.length == 0 && r.length > 0) {
    base();
    get_robots();
}

if (c.length > 0 && r.length == 0) {
    base();
    get_canonical();
}