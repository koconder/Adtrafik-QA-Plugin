// ==UserScript==
// @name          Canonicals & Robots
// @namespace     http://www.fullstackoptimization.com/
// @description   Shows important SEO head information (canonical, meta robots, http response headers).
// @include       *
// ==/UserScript==


var b, c, r, req, hd, box, msg, btncl, btnmr, btnls;
b = document.body;
c = document.querySelectorAll('link[rel="canonical"]');
r = document.querySelectorAll('meta[name="robots"]');

function getHeaders() {
    req = new XMLHttpRequest();
    req.open('GET', document.location, false);
    req.send(null);
    hd = req.getAllResponseHeaders().toLowerCase();
    if(document.getElementById('morebutton')){box.removeChild(btnmr);}
    msg = document.createElement('dl');
    msg.setAttribute('class', 'cdb_message');
    msg.setAttribute('id', 'headers');
    msg.innerHTML = '<dt>Header Information</dt>';
    msg.dd = document.createElement('dd');
    msg.dd.setAttribute('class', 'hdcode')
    msg.dd.appendChild(document.createTextNode(hd));
    msg.appendChild(msg.dd);
    box.appendChild(msg);
    box.appendChild(btnls);
    localStorage.setItem('state','more');
}

function removeHeaders() {
    if(document.getElementById('lessbutton')){box.removeChild(btnls);}
    box.removeChild(document.getElementById('headers'))
    localStorage.setItem('state','default');
    box.appendChild(btnmr);
}

if (c.length>0 || r.length>0){
    GM_addStyle('\
        #canonicaldebug {\
            background:#323232;\
            border:1px solid #859900;\
            position:fixed;\
            font-family:"Helvetica Neue", Helvetica;\
            font-size:10px;\
            left:-5px;\
            top:50px;\
            z-index:10000;\
            padding:20px 20px 20px 20px;\
            border-radius:4px;\
            box-shadow:0px 2px 10px rgba(0,0,0,0.48);\
            opacity:0.985;\
            color:white;\
            max-width:25%;\
        }\
        #canonicaldebug a {\
            color:#00A8DD;\
            font-weight:bold;\
            font-size:10px;\
        }\
        #canonicaldebug a:hover {\
            color:#00C2FF;\
            font-weight:bold;\
            font-size:10px;\
        }\
        #canonicaldebug .cdb_message dt {\
            text-transform:uppercase;\
            letter-spacing:1px;\
            border-bottom:1px solid #859900;\
            color:#859900;\
            font-style:normal;\
            font-weight:bold;\
            padding-bottom:2px;\
            margin-bottom:4px;\
            font-size:10px;\
        }\
        #canonicaldebug .cdb_message dd {\
            font-family:Menlo, Monaco, Consolas, "Courier New", monospace;\
            margin-left:10px;\
            word-wrap:break-word;\
            font-size:10px;\
            color:#fff;\
        }\
        #canonicaldebug .cdb_alert{\
            color:orange;\
            font-weight:bold;\
            font-size:12px;\
            font-family:Helvetica;\
        }\
        #canonicaldebug .canonicalbutton {\
            float:right;\
            font-size:20px;\
            padding:0;\
            margin:0;\
            background:none;\
            color:#859900;\
            border:none;\
            font-family:"Helvetica";\
            position:absolute;\
            top:0;\
            right:4px;\
            font-weight:normal;\
        }\
        #canonicaldebug #morebutton {\
            font-size:10px;\
            padding:0;\
            margin:0;\
            background:none;\
            color:#859900;\
            border:none;\
            font-family:"Helvetica";\
            font-weight:normal;\
            text-align:center;\
        }\
        #canonicaldebug #lessbutton {\
            font-size:10px;\
            padding:0;\
            margin:0;\
            background:none;\
            color:#859900;\
            border:none;\
            font-family:"Helvetica";\
            font-weight:normal;\
            text-align:center;\
        }\
        #canonicaldebug .display {\
            display:block;\
        }\
        #canonicaldebug .hdcode{\
            white-space: pre-wrap;\
            line-height: 15px;\
        }');
    }

if (c.length>0 && r.length>0) {
    box = document.createElement('div');
    box.setAttribute('id', 'canonicaldebug');
    btncl = document.createElement('button');
    btncl.setAttribute('type', 'button');
    btncl.setAttribute('class', 'canonicalbutton');
    btncl.setAttribute('onclick', 'document.getElementById("canonicaldebug").style.display = "none";');
    btncl.appendChild(document.createTextNode('⊗'));
    box.appendChild(btncl);
    msg = document.createElement('dl');
    msg.setAttribute('class', 'cdb_message');
    msg.setAttribute('id', 'canonical');
    msg.innerHTML = '<dt>Canonical</dt>';
    for (var i = 0; i < c.length; i++){
        if(c[i].href != document.location){
            var link = true;
        } else {
            var link = false;
        }
        msg.dd = document.createElement('dd');
        if (link == true){
            msg.dd.innerHTML = '<span class="cdb_alert">⚠ </span><a href="' + c[i].href + '">' + c[i].href + '</a>';
        } else {
            msg.dd.appendChild(document.createTextNode(c[i].href));
        }
        msg.appendChild(msg.dd);
        box.appendChild(msg);
    }
    msg = document.createElement('dl');
    msg.setAttribute('class', 'cdb_message');
    msg.setAttribute('id', 'robots');
    msg.innerHTML = '<dt>Meta Robots</dt>';
    for (var i = 0; i < r.length; i++){
        msg.dd = document.createElement('dd');
        if((r[i].content.search('noindex')!=-1) || (r[i].content.search('nofollow')!=-1)){
            msg.dd.innerHTML = '<span class="cdb_alert">⚠ </span>' + r[i].content.toLowerCase();
        } else {
            msg.dd.appendChild(document.createTextNode(r[i].content.toLowerCase()));
        }
        msg.appendChild(msg.dd);
        box.appendChild(msg);
    }
    btnmr = document.createElement('button');
    btnmr.setAttribute('type', 'button');
    btnmr.setAttribute('id', 'morebutton');
    btnmr.appendChild(document.createTextNode('Show More'));
    btnmr.addEventListener('click', getHeaders, true);
    btnls = document.createElement('button');
    btnls.setAttribute('type', 'button');
    btnls.setAttribute('id', 'lessbutton');
    btnls.appendChild(document.createTextNode('Show Less'));
    btnls.addEventListener('click', removeHeaders, true);
    if(localStorage.getItem('state') == 'default'){
        box.appendChild(btnmr);
    } else {
        getHeaders();
        box.appendChild(btnls);
    }
    b.parentNode.insertBefore(box, b);
} else if (c.length > 0 && r.length == 0) {
    box = document.createElement('div');
    box.setAttribute('id', 'canonicaldebug');
    btncl = document.createElement('button');
    btncl.setAttribute('type', 'button');
    btncl.setAttribute('class', 'canonicalbutton');
    btncl.setAttribute('onclick', 'document.getElementById("canonicaldebug").style.display = "none";');
    btncl.appendChild(document.createTextNode('⊗'));
    box.appendChild(btncl);
    msg = document.createElement('dl');
    msg.setAttribute('class', 'cdb_message');
    msg.setAttribute('id', 'canonical');
    msg.innerHTML = '<dt>Canonical</dt>';
    for (var i = 0; i < c.length; i++){
        if(c[i].href != document.location){
            var link = true;
        } else {
            var link = false;
        }
        msg.dd = document.createElement('dd');
        if (link == true){
            msg.dd.innerHTML = '<span class="cdb_alert">⚠ </span><a href="' + c[i].href + '">' + c[i].href + '</a>';
        } else {
            msg.dd.appendChild(document.createTextNode(c[i].href));
        }
        msg.appendChild(msg.dd);
        box.appendChild(msg);
    }
    b.parentNode.insertBefore(box, b);
} else if (r.length > 0 && c.length == 0){
    box = document.createElement('div');
    box.setAttribute('id', 'canonicaldebug');
    btncl = document.createElement('button');
    btncl.setAttribute('type', 'button');
    btncl.setAttribute('class', 'canonicalbutton');
    btncl.setAttribute('onclick', 'document.getElementById("canonicaldebug").style.display = "none";');
    btncl.appendChild(document.createTextNode('⊗'));
    box.appendChild(btncl);
    msg = document.createElement('dl');
    msg.setAttribute('class', 'cdb_message');
    msg.setAttribute('id', 'robots');
    msg.innerHTML = '<dt>Meta Robots</dt>';
    for (var i = 0; i < r.length; i++){
        msg.dd = document.createElement('dd');
        if((r[i].content.search('noindex')!=-1) || (r[i].content.search('nofollow')!=-1)){
            msg.dd.innerHTML = '<span class="cdb_alert">⚠ </span>' + r[i].content.toLowerCase();
        } else {
            msg.dd.appendChild(document.createTextNode(r[i].content.toLowerCase()));
        }
        msg.appendChild(msg.dd);
        box.appendChild(msg);
    }
    b.parentNode.insertBefore(box, b);
}
