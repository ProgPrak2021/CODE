const coins_expert = [
    [chrome.runtime.getURL('images/not_found.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/three_golden_coins.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/two_golden_coins.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/one_golden_coin.png'), "none"],

    [chrome.runtime.getURL('images/expert_icons/three_silver_coins.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/two_silver_coins.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/one_silver_coin.png'), "none"],

    [chrome.runtime.getURL('images/expert_icons/three_bronze_coins.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/two_bronze_coins.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/one_bronze_coin.png'), "none"]
];

const labels = [
    [chrome.runtime.getURL('images/not_found.png'), "none"],
    [chrome.runtime.getURL('images/green_icon_128.png'), "green"],
    [chrome.runtime.getURL('images/yellow_icon_128.png'), "yellow"],
    [chrome.runtime.getURL('images/red_icon_128.png'), "red"]
];
const labels_expert = [
    [chrome.runtime.getURL('images/not_found.png'), "none"],
    [chrome.runtime.getURL('images/green_icon_128.png'), "green"],
    [chrome.runtime.getURL('images/green_icon_128.png'), "green"],
    [chrome.runtime.getURL('images/green_icon_128.png'), "green"],
    [chrome.runtime.getURL('images/yellow_icon_128.png'), "yellow"],
    [chrome.runtime.getURL('images/yellow_icon_128.png'), "yellow"],
    [chrome.runtime.getURL('images/yellow_icon_128.png'), "yellow"],
    [chrome.runtime.getURL('images/red_icon_128.png'), "red"],
    [chrome.runtime.getURL('images/red_icon_128.png'), "red"],
    [chrome.runtime.getURL('images/red_icon_128.png'), "red"]

];

const labels_coins = [
    [chrome.runtime.getURL('images/not_found.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/one_golden_coin.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/one_silver_coin.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/one_bronze_coin.png'), "none"]
];

const coins_default = [
    [chrome.runtime.getURL('images/not_found.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/one_golden_coin.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/one_silver_coin.png'), "none"],
    [chrome.runtime.getURL('images/expert_icons/one_bronze_coin.png'), "none"],
];

const icons = [
    chrome.runtime.getURL('images/firmenlogos/google_icon.jpeg'),
    chrome.runtime.getURL('images/firmenlogos/oracle_icon.jpeg'),
    chrome.runtime.getURL('images/firmenlogos/spy_icon.jpeg'),
    chrome.runtime.getURL('images/firmenlogos/facebook_icon.jpeg'),
    chrome.runtime.getURL('images/firmenlogos/amazon_icon.jpeg'),
    chrome.runtime.getURL('images/firmenlogos/kaspersky_lab_icon.jpeg'),
    chrome.runtime.getURL('images/firmenlogos/wikimedia_icon.jpeg'),
    chrome.runtime.getURL('images/firmenlogos/bootstrap_cdn_icon.jpeg'),
    chrome.runtime.getURL('images/firmenlogos/microsoft_icon.jpeg'),
    chrome.runtime.getURL('images/firmenlogos/cloudflare_icon.jpeg'),
    chrome.runtime.getURL('images/firmenlogos/adobe_icon.jpeg'),
    chrome.runtime.getURL('images/firmenlogos/twitter_icon.jpeg')
];

const PAGES_KEY = "pages";

const toPromise = (callback) => {
    return new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        } catch (err) {
            reject(err);
        }
    });
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

    static savePage = async (key, value) => {
        const pages = await this.getPages();
        let updatedPages;
        let found = false;
        for (let i = 0; i < pages.length; i++) {
            if (pages[i]["key"] === key) {
                pages[i]["value"] = value;
                found = true;
                break;
            }
        }
        if (found) {
            updatedPages = [...pages];
        } else {
            updatedPages = [...pages, {key, value}];
        }

        return toPromise((resolve, reject) => {
            chrome.storage.local.set({
                [PAGES_KEY]: updatedPages
            }, () => {
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

let result = $('.LC20lb').closest('div');
let img = $('<img class="code-selector">');

let expert = false;
let coins_as_label = false;

function getPreferences() {
    return new Promise(
        function (resolve, reject) {
            const preferences = {
                "whotracksme": [],
                "privacyspy": [],
                "google_safeBrowsing": [],
                "phishstats": [],
                "tosdr": [],
                "Tilthub": []
            };
            const pages = PageService.getPages();
            pages.then((res) => {
                const contains_https = res.find(elem => elem === "weight_https");
                const contains_coin_label = res.find(elem => elem === "coin");
                if (contains_https) { // If the attribute is set it has to be come after the expert mode. Otherwise it might be ignored since the expert mode is not set yet
                    res.splice(res.indexOf("weight_https"), 1); //remove element
                    res.push("weight_https"); //append it to end of list
                }
                if (!contains_coin_label) {
                    coins_as_label = false;
                }
                //console.log(res)
                let prefs_given = false;
                // var preferences = { "whotracksme": ["Facebook", "Amazon"], "privacyspy": [], "google_safeBrowsing": [], "phishstats": [], "webrisk": [] }
                for (let i = 0; i < res.length; i++) {
                    //console.log(res[i]["key"])
                    prefs_given = true;

                    if (res[i]["key"].includes("WTM")) {
                        //console.log(res[i]["key"])
                        preferences["whotracksme"].indexOf(res[i]["key"]) === -1 ? preferences["whotracksme"].push(res[i]["key"]) : console.log(res[i]["key"] + " is set already.");
                    } else if (res[i]["key"].includes("Prsspy")) {
                        //console.log("jdjd")
                        preferences["privacyspy"].indexOf(res[i]["key"]) === -1 ? preferences["privacyspy"].push(res[i]["key"]) : console.log("Preference is set already.");
                    } else if (res[i]["key"].includes("Phish")) {
                        preferences["phishstats"].indexOf(res[i]["key"]) === -1 ? preferences["phishstats"].push(res[i]["key"]) : console.log("Preference is set already.");
                    } else if (res[i]["key"].includes("Google")) {
                        preferences["google_safeBrowsing"].indexOf(res[i]["key"]) === -1 ? preferences["google_safeBrowsing"].push(res[i]["key"]) : console.log("Preference is set already.");
                    } else if (res[i]["key"].includes("Tosdr")) {
                        preferences["tosdr"].indexOf(res[i]["key"]) === -1 ? preferences["tosdr"].push(res[i]["key"]) : console.log("Preference is set already.");
                    } else if (res[i]["key"].includes("Tilthub")) {
                        preferences["Tilthub"].indexOf(res[i]["key"]) === -1 ? preferences["Tilthub"].push(res[i]["key"]) : console.log("Preference is set already.");
                    } else if (res[i]["key"].includes("expert")) {
                        expert = true;
                    } else if (res[i]["key"].includes("coin")) {
                        coins_as_label = true;
                    } else if (res[i]["key"].includes("weight_https") && expert === true) {
                        preferences["whotracksme"].indexOf(res[i]["key"]) === -1 ? preferences["whotracksme"].push(res[i]["key"]) : console.log(res[i]["key"] + " is set already.");
                    }
                }
                if (preferences !== undefined) {
                    if (!prefs_given) {
                        const d = {"no Preferences": "test"};
                        resolve(d);
                    } else {
                        resolve(preferences);
                    }
                }
            });
        }
    )
}

function receivePrefs(datasource, preference) {
    if (preferences === undefined) {
        console.log("is undefined")
        var preferences = {
            "whotracksme": ["Facebook", "Amazon"],
            "privacyspy": [],
            "google_safeBrowsing": [],
            "phishstats": [],
            "webrisk": []
        }
    }
    const index = preferences[datasource].indexOf(preference);
    if (index !== -1) {
        preferences[datasource].splice(index, 1)
    } else {
        preferences[datasource].push(preference)
    }
    console.log(preferences)
}

function switchExpertMode() {
    expert = !expert;
}

function sendURLsToBackend() {
    const elems = document.getElementsByClassName("yuRUbf");
    let urls = "";
    for (let i of elems) {
        const url = new URL(i.children[0].href);
        urls += url;
        //console.log("urls " + url);
    }
    return urls;
}

const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        // console.log(this.responseText)
        const output = JSON.parse(JSON.parse(this.responseText)); // dont know why but you have to parse it twice
        //console.log(output)
        getVisitedUrls(output); //for privacy score
        printLabels(output);
    }
};

const preferences_promise = getPreferences();

let urls = sendURLsToBackend();
preferences_promise.then((res) => {
    //console.log(JSON.stringify(res));
    xhttp.open("POST", "https://code-dawesys.appspot.com/sendurls/", true); //Flask projekt muss am laufen sein
    //xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true); //Flask projekt muss am laufen sein
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //console.log(JSON.stringify(res))
    //console.log(expert);
    xhttp.send(JSON.stringify({"urls": urls, "preferences": JSON.stringify(res), "expert": expert}));
})

function printLabels(output) {

    function storeVar(key, value) {
        if (key === "label") {
            label = value;
        }
        if (key === "tracker_count") {
            tracker = value;
        }
        if (key === "facebook") {
            facebook = value;
        }
        if (key === "amazon") {
            amazon = value;
        }
        if (key === "trackers") {
            trackers = value;
        }
        if (key === "expert") {
            expert_from_backend = value !== "False";
        }
    }

    function traverse_JSON(obj, func) {
        for (let key in obj) {
            func.apply(this, [key, obj[key]]);
            if (obj[key] !== null && typeof (obj[key]) == "object") {
                //going one step down in the object tree!!
                traverse_JSON(obj[key], func);
            }
        }
    }

    const divs = document.getElementsByClassName("yuRUbf");

    for (let div of divs) {
        var label, tracker, facebook, amazon, trackers, expert_from_backend, popup;
        const domain = getDomain(div);
        traverse_JSON(output[domain], storeVar);

        const result = [];
        //console.log(domain);
        for (let i = 0; i < Object.keys(trackers).length; i++) {
            result.push(trackers[i].company);
        }
        const companies = [...new Set(result)];

        const logos_expert = get_logos_html_expert(companies, result); //Get html for the icon images.
        const logos_normal = get_logos_html_normal(companies, result); //Get html for the icon images.


        if (trackers.length === 0) {
            popup = $('<div class="list"> <div class="entry"><img class="code-selector" alt="Label image" src="' + labels[label][0] + '"> <div class=\"content\"> <div class="inner"><h2>We are sorry.</h2><p>We have currently no information about this website.</p><a href="' + chrome.runtime.getURL("views/options.html") + '" target="_blank"><span>Let us know!</span></a></div></div></div></div>');
        } else {
            if (expert) {
                if (coins_as_label) {
                    popup = $('<div class="list"> <div class="entry"><img class="code-selector" alt="Label image" src="' + coins_expert[label][0] + '"> <div class="content"><div class="inner"><h2>' + tracker + ' Trackers</h2><h4> From:</h4>' + logos_expert + '</div></div></div></div>');
                } else {
                    popup = $('<div class="list"> <div class="entry"><img class="code-selector" alt="Label image" src="' + labels_expert[label][0] + '"> <div class="content"><div class="inner"><h2>' + tracker + ' Trackers</h2><h4> From:</h4>' + logos_expert + '</div></div></div></div>');
                }

            } else { // this is default mode
                if (coins_as_label) {
                    popup = $('<div class="list"> <div class="entry"><img class="code-selector" alt="Label image" src="' + labels_coins[label][0] + '"> <div class="content"><div class="inner"><h2>' + tracker + ' Trackers</h2><h4> From:</h4>' + logos_normal + '</div></div></div></div>');
                } else {
                    console.log(label)
                    popup = $('<div class="list"> <div class="entry"><img class="code-selector" alt="Label image" src="' + labels[label][0] + '"> <div class="content"><div class="inner"><h2>' + tracker + ' Trackers</h2><h4> From:</h4>' + logos_normal + '</div></div></div></div>');
                }
            }
        }
        popup.appendTo(div);
    }
    $('head').append("<link type=\"text/css\" rel=\"stylesheet\" href=\"css/label_hover_style.css\">");
}

function apply_coin_style(coin_style) {
    let head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);

    style = 'text/css';
    if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = coin_style;
    } else {
        style.appendChild(document.createTextNode(coin_style));
    }
}

function getDomain(div) {
    let url = JSON.stringify(div.children[0].href);
    if (url.includes("https://")) {
        url = url.replace("https://", "");
    } else {
        console.log("---- http protocol found ----");
        return "";
    }
    url = url.split("/")[0];
    let url_split = url.split(".");
    if (url_split.length >= 3) {
        url_split.shift();
    }
    url = url_split.join(".").replace('"', "");
    return url;
}

function get_logos_html_expert(v, list) {
    let result = '<ul>';

    v.forEach(x => {
        switch (x) {
            case "Facebook":
                result += '<li><img class="icons" alt="Facebook icon" src="' + icons[3] + '"><span>Facebook</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>';
                break;
            case "Amazon":
                result += '<li><img class="icons" alt="Amazon icon" src="' + icons[4] + '"><span>Amazon</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>';
                break;
            case "Google":
                result += '<li><img class="icons" alt="Google icon" src="' + icons[0] + '"><span>Google</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>';
                break;
            case "Kaspersky Lab":
                result += '<li><img class="icons" alt="Kaspersky icon" src="' + icons[5] + '"><span>Kaspersky</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>';
                break;
            case "Wikimedia Foundation":
                result += '<li><img class="icons" alt="Wikimedia icon" src="' + icons[6] + '"><span>Wikimedia</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>';
                break;
            case "Microsoft":
                result += '<li><img class="icons" alt="Microsoft icon" src="' + icons[8] + '"><span>Microsoft</span><span class="percentage">' + get_percentage(x, list) + '</span></li>';
                break;
            case "BootstrapCDN":
                result += '<li><img class="icons" alt="Boots. CDN icon" src="' + icons[7] + '"><span>Boots. CDN</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>';
                break;
            case "Cloudflare":
                result += '<li><img class="icons" alt="Cloudflare icon" src="' + icons[9] + '"><span>Cloudflare</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>';
                break;
            case "Adobe":
                result += '<li><img class="icons" alt="Adobe icon" src="' + icons[10] + '"><span>Adobe</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>';
                break;
            case "Twitter":
                result += '<li><img class="icons" alt="Twitter icon" src="' + icons[11] + '"><span>Twitter</span><span class="percentage"> ' + get_percentage(x, list) + '</span></li>';
                break;
        }
    });
    let others = get_others_percentage(list);
    if (others !== "0") {
        result += "<li style='margin-top: 5px'><span style='color: black; font-weight: bold'>Others:</span><span class='percentage'>" + others + "</span></li>";
    }
    return result += "</ul>";
}

function get_logos_html_normal(v, list) {
    let result = '<ul><li>';
    let counter = 0;
    v.forEach(x => {
        switch (x) {
            case "Facebook":
                result += '<img class="icons" alt="Facebook icon" src="' + icons[3] + '">';
                counter++;
                result += add_new_entry_hover(counter, result);
                counter = counter % 4;
                break;
            case "Amazon":
                result += '<img class="icons" alt="Amazon icon" src="' + icons[4] + '">';
                counter++;
                result += add_new_entry_hover(counter, result);
                counter = counter % 4;
                break;
            case "Google":
                result += '<img class="icons" alt="Google icon" src="' + icons[0] + '">';
                counter++;
                result += add_new_entry_hover(counter, result);
                counter = counter % 4;
                break;
            case "Kaspersky Lab":
                result += '<img class="icons" alt="Kaspersky icon" src="' + icons[5] + '">';
                counter++;
                result += add_new_entry_hover(counter, result);
                counter = counter % 4;
                break;
            case "Wikimedia Foundation":
                result += '<img class="icons" alt="Wikimedia icon" src="' + icons[6] + '">';
                counter++;
                result += add_new_entry_hover(counter, result);
                counter = counter % 4;
                break;
            case "Microsoft":
                result += '<img class="icons" alt="Microsoft icon" src="' + icons[8] + '">';
                counter++;
                result += add_new_entry_hover(counter, result);
                counter = counter % 4;
                break;
            case "BootstrapCDN":
                result += '<img class="icons" alt="Boots. CDN icon" src="' + icons[7] + '">';
                counter++;
                result += add_new_entry_hover(counter, result);
                counter = counter % 4;
                break;
            case "Cloudflare":
                result += '<img class="icons" alt="Cloudflare icon" src="' + icons[9] + '">';
                counter++;
                result += add_new_entry_hover(counter, result);
                counter = counter % 4;
                break;
            case "Adobe":
                result += '<img class="icons" alt="Adobe icon" src="' + icons[10] + '">';
                counter++;
                result += add_new_entry_hover(counter, result);
                counter = counter % 4;
                break;
            case "Twitter":
                result += '<img class="icons" alt="Twitter icon" src="' + icons[11] + '">';
                counter++;
                result += add_new_entry_hover(counter, result);
                counter = counter % 4;
                break;
        }
    })
    result += "</li></ul>";
    return result
}

function add_new_entry_hover(counter, result) {
    if (counter >= 4) {
        return "</li><li>";
    }
    return ""
}

function get_percentage(name, list) {
    let counter = 0;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === name) {
            counter += 1;
        }
    }
    if (counter !== 0 && list.length !== 0) {
        return Math.round(counter / list.length * 100) + "%";
    } else {
        return "0";
    }
}

function get_others_percentage(list) {
    let counter = 0;
    let companies = ["Facebook", "Amazon", "Google", "Kaspersky Lab", "Wikimedia Foundation", "Microsoft", "BootstrapCDN", "Adobe", "Cloudflare", "Twitter"]
    for (let i = 0; i < list.length; i++) {
        if (!companies.includes(list[i])) {
            counter += 1;
        }
    }
    if (counter !== 0) {
        return Math.round(counter / list.length * 100) + "%";
    } else {
        return "0";
    }
}

function getVisitedUrls(output) {
    const elems = document.querySelectorAll('.yuRUbf');

    elems.forEach(element => {
        element.addEventListener('click', (e) => { //TODO: Event Listener for right click + "open link in new tab"
            const clickedUrl = new URL(element.children[0].href);
            for (site in output) {
                let value = output[site];
                let domain = clickedUrl.href;

                if (domain.includes(site)) {
                    let label = value[0]['label'];
                    chrome.storage.local.set({[site]: label});
                }
            }
        });
    });
}

//############################ PRIVACY SUMMARY ####################################
window.addEventListener("load", function (event) {
    //TODO: Add expert and coin mode to privacy summary
    let labels_score = [
        [chrome.runtime.getURL('images/not_found_32.png')],
        [chrome.runtime.getURL('images/green_icon_32.png')],
        [chrome.runtime.getURL('images/yellow_icon_32.png')],
        [chrome.runtime.getURL('images/red_icon_32.png')]
    ];

    if (document.getElementById("submitButton")) {
        document.getElementById("url").addEventListener("keyup", function () {
            if (event.keyCode === 13) { // 13 is the enter key. TODO: Change input to form, so a submit event can be triggered.
                document.getElementById("submitButton").click();
            }
        })
        document.getElementById("submitButton").addEventListener("click", function () {
            // call a method that looks for preferences stored in storage api
            let url = document.getElementById("url").value;

            let preference = getPreferences();
            preference.then((res) => {
                let body = JSON.stringify({
                    "urls": url,
                    "preferences": JSON.stringify(res),
                    "expert": false
                });
                sendURL(body);
            });
        });
    }

    function sendURL(body) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                // console.log(this.responseText);

                let output = JSON.parse(JSON.parse(this.responseText)); // dont know why but you have to parse it twice
                let first_key = Object.keys(output)[0];
                document.getElementById("calcLabel").style.display = "block";
                let img = labels_score[output[first_key][0]["label"]];
                if (output[first_key][1]["label"] === 0) {
                    document.getElementById("printLabel").innerHTML = "Sorry, we don't have a label for this url yet.";
                } else {
                    document.getElementById("printLabel").innerHTML = "The label for the domain " + first_key + " is <img src= " + img + " > </img>.";
                }
            }
        };
        xhttp.open("POST", "https://code-dawesys.appspot.com/sendurls/", true); //Flask projekt muss am laufen sein
        //xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true); //Flask projekt muss am laufen sein
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhttp.send(body);
    }

    chrome.storage.local.get(function (data) {
        let keys = Object.keys(data); //domains
        let values = Object.values((data)); //labels
        let all_labels = 0;
        let goodLabels = 0; //green or gold
        let unknownLabels = 0;

        console.log(keys + ': ' + values); //UNCOMMENT TO SEE WHAT LABELS ARE SAVED

        for (let i = 0; i < values.length; i++) {
            if (values[i] !== 'pages') {
                all_labels++;
            }
            if (values[i] === 1) {
                goodLabels++;
            }
            if (values[i] === 0) {
                unknownLabels++;
            }
        }
        let score = '';

        let privacyScoreNumber = document.getElementById("privacyScore_number");
        let privacyScoreInfo = document.getElementById("privacyScore_info");

        if (privacyScoreNumber && privacyScoreInfo) {
            if (all_labels === 0) {
                privacyScoreNumber.innerHTML = '¯\\_(ツ)_/¯';
                privacyScoreInfo.innerHTML = 'Nothing to show yet.';
            } else {
                score = Math.round(goodLabels / (all_labels - unknownLabels) * 100);
                privacyScoreNumber.innerHTML = score.toString() + '%';
                privacyScoreInfo.innerHTML = getPrivacyInfo(score);
            }
        }

        if (document.getElementById('all_labels')) {
            let listOfLabels = '';
            for (let i = 0; i <= all_labels - 1; i++) {
                if (i % 8 === 0) {
                    listOfLabels += '<br>';
                }
                if (keys[i] !== 'pages') {
                    let img = labels_score[values[i]];
                    //listOfLabels += keys[i] + ': ' + "&emsp;" + "<img src= " + img + "><br>";
                    listOfLabels += "<img src= " + img + ">";
                }
            }
            document.getElementById('all_labels').innerHTML = listOfLabels;
        }
        console.log(goodLabels + "/ (" + all_labels + " - " + unknownLabels + ")"); //check result
    });


    function getPrivacyInfo(score) {
        let info = "";

        if (score >= 66) {
            info = "Good job! You took good care about your privacy: " +
                score + "% of your visited websites had a good label!";
        } else if (score < 66 && score >= 33) {
            info = "Not bad! You did quite well: " +
                score + "% of your visited websites had a good label.";
        } else {
            info = "Could be better! Only " + score + "% of your visited websites had a good label. " +
                "Next time take a look at the label before you open the page."
        }
        return info;
    }

//Reset statistics (Privacy Score)
    if (document.getElementById("reset_stats")) {
        document.getElementById("reset_stats").addEventListener("click", function () {
            chrome.storage.local.get(function (data) {
                if (Object.values(data).length === 0) {
                    alert("Your storage is already empty");
                } else {
                    chrome.storage.local.clear();
                    location.reload();
                }
            });
        });
    }
});
