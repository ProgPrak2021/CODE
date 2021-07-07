/* COMMENTS / NOTES / DOCUMENTATION / ...
-----------------------------------------------
NOTE: Please refer to local images with chrome.runtime.getURL('images/[name].png')
Access rights already granted in manifest.json
questions to diana. <3


print methode/logik überarbeitet:

- alle domains werden jetzt erkannt (auch mit 'shop.','de.', etc. Prefix)
- obsoleter Aufruf aller domains für jedes Element behoben
- doppelte domains werden jetzt erkannt
- sirene.png per default --> KEIN DATENBANK EINTRAG GEFUNDEN 
- printLabels() wird nur 1 mal für die gesamte Darstellung aufgerufen 
- var output ist unser Anhaltspunkt für die Zuordung der Labels
- jede geladene Domain sucht sich die entsprechenden Informationen aus der Liste (var output)
- Laden der Labels ist nun kein @click event mehr 

#author simon



-----------------------------------------------
*/
const PAGES_KEY = 'pages';

const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        } catch (err) {
            reject(err);
        }
    });
    return promise;
}


class PageService {

    static getPages = () => {
        return toPromise((resolve, reject) => {
            chrome.storage.local.get([PAGES_KEY], (result) => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);

                const researches = result.pages ?? [];
                resolve(researches);
            });
        });
    }

    static savePage = async(key, value) => {
        const pages = await this.getPages();
        var updatedPages;
        var found = false;
        for(var i = 0; i < pages.length; i++) {
            if (pages[i]["key"] == key) {
                pages[i]["value"] = value;
                found = true;
                break;
            }
        }
        if (found){
            updatedPages = [...pages];
        }
        else{
            updatedPages = [...pages, { key, value }];
        }

        return toPromise((resolve, reject) => {
            chrome.storage.local.set({
                [PAGES_KEY]: updatedPages }, () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(updatedPages);
            });
        });
    }

    static clearPages = () => {
        return toPromise((resolve, reject) => {
            chrome.storage.local.remove([PAGES_KEY], () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve();
            });
        });
    }
}
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});
const icons = [
    chrome.runtime.getURL('images/icons/google_icon.png'),
    chrome.runtime.getURL('images/icons/oracle_icon.png'),
    chrome.runtime.getURL('images/icons/spy_icon.png'),
    chrome.runtime.getURL('images/icons/facebook_icon.png'),
    chrome.runtime.getURL('images/icons/amazon_icon.png'),
    chrome.runtime.getURL('images/icons/kaspersky_lab_icon.png'),
    chrome.runtime.getURL('images/icons/wikimedia_icon.png'),
    chrome.runtime.getURL('images/icons/bootstrap_cdn_icon.png'),
    chrome.runtime.getURL('images/icons/microsoft_icon.png'),
    chrome.runtime.getURL('images/icons/cloudflare_icon.png'),
    chrome.runtime.getURL('images/icons/adobe_icon.png'),
    chrome.runtime.getURL('images/icons/twitter_icon.png')
]

var result = $('.LC20lb').closest('div');
var img = $('<img class="code-selector">');
var expert = true;
var coins_as_label = true;

function getPreferences(){
    var pref_promise = new Promise(
        function(resolve, reject){
            var preferences = { "whotracksme": [], "privacyspy": [], "google_safeBrowsing": [], "phishstats": [], "webrisk": [] }
            const pages = PageService.getPages();
            pages.then((res)=>{
                console.log(res)
               // var preferences = { "whotracksme": ["Facebook", "Amazon"], "privacyspy": [], "google_safeBrowsing": [], "phishstats": [], "webrisk": [] }
                for (let i= 0;i<res.length;i++){
                    console.log(res[i]["key"])
                    if (res[i]["key"].includes("WTM")){
                        console.log(res[i]["key"])
                        preferences["whotracksme"].indexOf(res[i]["key"]) === -1 ? preferences["whotracksme"].push(res[i]["key"]) : console.log(res[i]["key"]+" is set already.")
                    }
                    else if (res[i]["key"].includes("Prsspy")){
                        preferences["privacyspy"].indexOf(res[i]["key"]) === -1 ? preferences["whotracksme"].push(res[i]["key"]) : console.log("Preference is set already.")
                    }
                    else if (res[i]["key"].includes("Phish")){
                        preferences["phishstats"].indexOf(res[i]["key"]) === -1 ? preferences["whotracksme"].push(res[i]["key"]) : console.log("Preference is set already.")
                    }
                    else if (res[i]["key"].includes("Google")){
                        preferences["google_safeBrowsing"].indexOf(res[i]["key"]) === -1 ? preferences["whotracksme"].push(res[i]["key"]) : console.log("Preference is set already.")
                    }
                    else if (res[i]["key"].includes("Webrisk")){
                        preferences["webrisk"].indexOf(res[i]["key"]) === -1 ? preferences["whotracksme"].push(res[i]["key"]) : console.log("Preference is set already.")
                    }
                    else if (res[i]["key"].includes("expert")){
                        expert = res[i]["key"]
                    }
                    else if (res[i]["key"].includes("coin")){
                        coins_as_label = res[i]["key"]
                    }
                }
                if (preferences != undefined){
                    resolve(preferences)
                }
            });
        }
    );
    return pref_promise

}

function receivePrefs(datasource, preference) {
    if (preferences === undefined) {
        console.log("is undefined")
        var preferences = { "whotracksme": ["Facebook", "Amazon"], "privacyspy": [], "google_safeBrowsing": [], "phishstats": [], "webrisk": [] }
    }
    var index = preferences[datasource].indexOf(preference);
    if (index !== -1) {
        preferences[datasource].splice(index, 1)
    } else {
        preferences[datasource].push(preference)
    }
    console.log(preferences)
}

function switchExpertMode() {
    if (expert) {
        expert = false
    } else {
        expert = true
    }
}

function sendURLsToBackend(rootNode) {
    var elems = document.getElementsByClassName("yuRUbf");
    var urls = "";
    for (var i of elems) {
        var url = new URL(i.children[0].href);
        urls += url;
        console.log("urls " + url);
    }
    return urls;
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // console.log(this.responseText)
        var output = JSON.parse(JSON.parse(this.responseText)); // dont know why but you have to parse it twice
        console.log(output)

        getVisitedUrls(output);

        printLabels(output)

    }
};
var preferences_promise = getPreferences();
var urls = sendURLsToBackend();
preferences_promise.then((res)=>{
    console.log(res)
    xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true); //Flask projekt muss am laufen sein 
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(urls + "SPLITME" + JSON.stringify(res) + "SPLITME" + expert);
})

function printLabels(output) {

    function storeVar(key, value) {
        if (key == "label") {
            label = value
        }
        if (key == "tracker_count") {
            tracker = value
        }
        if (key == "facebook") {
            facebook = value
        }
        if (key == "amazon") {
            amazon = value
        }
        if (key == "trackers") {
            trackers = value
        }
    }

    function traverse_JSON(obj, func) {
        for (var key in obj) {
            func.apply(this, [key, obj[key]]);
            if (obj[key] !== null && typeof(obj[key]) == "object") {
                //going one step down in the object tree!!
                traverse_JSON(obj[key], func);
            }
        }
    }


    var labels_expert = [
        [chrome.runtime.getURL('images/expert_icons/three_golden_coins.png'), "none"],
        [chrome.runtime.getURL('images/expert_icons/two_golden_coins.png'), "none"],
        [chrome.runtime.getURL('images/expert_icons/one_golden_coin.png'), "none"],

        [chrome.runtime.getURL('images/expert_icons/three_silver_coins.png'), "none"],
        [chrome.runtime.getURL('images/expert_icons/two_silver_coins.png'), "none"],
        [chrome.runtime.getURL('images/expert_icons/one_silver_coin.png'), "none"],

        [chrome.runtime.getURL('images/expert_icons/three_bronze_coins.png'), "none"],
        [chrome.runtime.getURL('images/expert_icons/two_bronze_coins.png'), "none"],
        [chrome.runtime.getURL('images/expert_icons/one_bronze_coin.png'), "none"],

    ]
    var labels = [
        [chrome.runtime.getURL('images/not_found.png'), "none"],
        [chrome.runtime.getURL('images/green_icon_128.png'), "green"],
        [chrome.runtime.getURL('images/yellow_icon_128.png'), "yellow"],
        [chrome.runtime.getURL('images/red_icon_128.png'), "red"]
    ]



    var divs = document.getElementsByClassName("yuRUbf");

    for (var div of divs) {
        var label, tracker, facebook, amazon, trackers;
        var domain = getDomain(div);
        traverse_JSON(output[domain], storeVar);

        expert_mode = true


        var result = [];
        for (let i = 0; i < Object.keys(trackers).length; i++) {
            result.push(trackers[i].company);
        }
        var companies = [...new Set(result)];

        const logos = get_logos_html(companies, result) //Get html for the icon images.

        if (label == 0 || trackers.length == 0) {
            console
            var popup = $('<div class="list"> <div class="entry"><img class="code-selector" src="' + labels[label][0] + '"> <div class=\"content\"> <div class="inner"><h2>We are sorry.</h2><p>We have currently no information about this website.</p><a href="' + chrome.runtime.getURL("views/options.html") + '" target="_blank"><span>Let us know!</span></a></div></div></div></div>');
            popup.appendTo(div);
        } else {
            if (expert_mode) { //this is for the expert mode
                //expert_label = 6; // some number from 1 to 7
                console.log(label)
                var popup = $('<div class="list"> <div class="entry"><img class="code-selector" src="' + labels_expert[label - 1][0] + '"> <div class="content"><div class="inner"><h2>' + tracker + ' Trackers</h2><h4> From:</h4>' + logos + '</div></div></div></div>');
                popup.appendTo(div);


            } else { // this is default mode 
                var popup = $('<div class="list"> <div class="entry"><img class="code-selector" src="' + labels[label - 1][0] + '"> <div class="content"><div class="inner"><h2>' + tracker + ' Trackers</h2><h4> From:</h4>' + logos + '</div></div></div></div>');
                popup.appendTo(div);
            }
        }

    }
    $('head').append("<link type=\"text/css\" rel=\"stylesheet\" href=\"/css/label_hover_style.css\">");
}

function apply_coin_style(coin_style) {
    head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = coin_style;
    } else {
        style.appendChild(document.createTextNode(coin_style));
    }
}

function getDomain(div) {
    var url = JSON.stringify(div.children[0].href)
    if (url.includes("https://")) {
        url = url.replace("https://", "")
    } else {
        console.log("---- http protocol found ----")
        return ""
    }
    url = url.split("/")[0]
    url_split = url.split(".")
    if (url_split.length >= 3) {
        url_split.shift()
    }
    url = url_split.join(".")
    url = url.replace('"', "")
    return url

}

function get_logos_html(v, list) {
    var result = '<ul>'

    v.forEach(x => {
        switch (x) {
            case "Facebook":
                result += '<li><img class="icons" src="' + icons[3] + '"><span>Facebook</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>'
                break;
            case "Amazon":
                result += '<li><img class="icons" src="' + icons[4] + '"><span>Amazon</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>'
                break;
            case "Google":
                result += '<li><img class="icons" src="' + icons[0] + '"><span>Google</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>'
                break;
            case "Kaspersky Lab":
                result += '<li><img class="icons" src="' + icons[5] + '"><span>Kaspersky</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>'
                break;
            case "Wikimedia Foundation":
                result += '<li><img class="icons" src="' + icons[6] + '"><span>Wikimedia</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>'
                break;
            case "Microsoft":
                result += '<li><img class="icons" src="' + icons[8] + '"><span>Microsoft</span><span class="percentage">' + get_percentage(x, list) + '</span></li>'
                break;
            case "BootstrapCDN":
                result += '<li><img class="icons" src="' + icons[7] + '"><span>Boots. CDN</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>'
                break;
            case "Cloudflare":
                result += '<li><img class="icons" src="' + icons[9] + '"><span>Cloudflare</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>'
                break;
            case "Adobe":
                result += '<li><img class="icons" src="' + icons[10] + '"><span>Adobe</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>'
                break;
            case "Twitter":
                result += '<li><img class="icons" src="' + icons[11] + '"><span>Twitter</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>'
                break;
        }
    })
    let others = get_others_percentage(list)
    if (others != "0") {
        result += "<li style='margin-top: 5px'><span style='color: black; font-weight: bold'>Others:</span><span class='percentage'>" + others + "</span></li>"
    }

    return result += "</ul>";
}

function get_percentage(name, list) {
    let counter = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] == name) {
            counter += 1;
        }
    }
    if (counter != 0 && list.length != 0) {
        return Math.round(counter / list.length * 100) + "%"
    } else {
        return "0"
    }
}

function get_others_percentage(list) {
    let counter = 0;
    let companies = ['Facebook', 'Amazon', 'Google', 'Kaspersky Lab', 'Wikimedia Foundation', 'Microsoft', 'BootstrapCDN', 'Adobe', 'Cloudflare', 'Twitter']
    for (let i = 0; i < list.length; i++) {
        if (!companies.includes(list[i])) {
            counter += 1;
        }
    }
    if (counter != 0) {
        return Math.round(counter / list.length * 100) + "%"
    } else {
        return "0"
    }
}

function getVisitedUrls(output) {
    const elems = document.querySelectorAll('.yuRUbf');

    elems.forEach(element => {
        element.addEventListener('click', (e) => { //TODO: Event Listener for right click + "open link in new tab"
            var clickedUrl = new URL(element.children[0].href);
            for (let site in output) {
                let value = output[site];
                let domain = clickedUrl.href;

                if (domain.includes(site)) {
                    let label = value[0]['label'];
                    chrome.storage.local.set({
                        [site]: label
                    });
                }
            }
        });
    });
}



/* code dumpster
-------------------------------------------------------------
function findLabel(domain, label_index){
  var div = findByDomain(domain);
  if(div === null){ // should not happen as it means that the url was not found in website
    return;
  }
  printLabel(div, label_index);
}
*/

/*
function printLabel(whereTo, img_index){
  var divs = document.getElementsByClassName("yuRUbf");
  var labels = ["https://simonk.s3.eu-central-1.amazonaws.com/images/icon_128_clear.png","https://simonk.s3.eu-central-1.amazonaws.com/images/yellow_icon_128.png","https://simonk.s3.eu-central-1.amazonaws.com/images/red_icon_128.png"]
  var img = $('<img class="code-selector">');
  img.attr('src', labels[img_index - 1]);
  img.css('width', '25px')
  img.css('float', 'left ')
  img.css('margin-left', '-2.25em')
  img.css('cursor', 'pointer')
  img.css('margin-top', '0.5em')
  for(div in divs){
    img.attr('src', labels[getLabel(div) - 1]);
    img.appendTo(div)
  }
  //img.appendTo(whereTo);
}

FUCKING RECURSIVE SHIT

function recursiveScan(obj, index) {
  console.log("iteration")
  var res
  switch (index) {
    case 1:
      var anchor = "tracker"
      break;
    case 2:
      var anchor = "label"
      break;
    case 3:
      var anchor = "facebook"
      break;
  }

  if (typeof (anchor) !== 'undefined') {

    Object.keys(obj).forEach(key => {

      if (key == anchor) {
        console.log("current anchor: " + anchor + " and value: " + obj[key] + " typeof " + typeof (obj[key]))
        res = obj[key]
      }

      if (typeof obj[key] === 'object') {
        return recursiveScan(obj[key], index)
      }

    })
  }
  //if(typeof(res) === 'undefined' || null)
  //return ""

  console.log("res " + res + " typeof " + typeof (res))
  return res
}

function nestedLoop(obj) {
  var res
  function recurse(obj, current) {
    for (const key in obj) {
      let value = obj[key];
      if (value != undefined) {
        if (value && typeof value === 'object') {
          recurse(value, key);
        } else {
          if (value == "tracker")
            res = value;
          console.log(value)
          if (value == "label")
            res = value;
        }
      }
    }
  }
  recurse(obj);
  return res;
}

function getLabel(div, output) {
  var url = JSON.stringify(div.children[0].href)
  var domain = "";
  for (var key of Object.keys(output)) {
    if (url.includes(key)) {
      domain = key;
    }
  }
  var index = output[domain];
  return index //1...2....3
}
*/
