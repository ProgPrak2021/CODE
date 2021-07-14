if(document.getElementById("submitButton")) {
    document.getElementById("url").addEventListener("keyup", function () {
        if (event.keyCode === 13) { // 13 is the enter key. TODO: Change input to form, so a submit event can be triggered.
            document.getElementById("submitButton").click();
        }
    })
    document.getElementById("submitButton").addEventListener("click", function () {
        let url = document.getElementById("url").value;
        let hardcoded_preference = {
            "whotracksme": ["Facebook", "Amazon"],
            "privacyspy": [],
            "google_safeBrowsing": [],
            "phishstats": [],
            "webrisk": []
        };
        // call a method that looks for preferences stored in storage api
        let hardcoded_expert_mode = false;
        let body = JSON.stringify({
            "urls": url,
            "preferences": JSON.stringify(hardcoded_preference),
            "expert": hardcoded_expert_mode
        })
        sendURL(body);
    });
}


function sendURL(body) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let labels = [
                [chrome.runtime.getURL('images/not_found.png')],
                [chrome.runtime.getURL('images/green_icon_32.png')],
                [chrome.runtime.getURL('images/yellow_icon_32.png')],
                [chrome.runtime.getURL('images/red_icon_32.png')]
            ];
            // console.log(this.responseText);
            let output = JSON.parse(JSON.parse(this.responseText)); // dont know why but you have to parse it twice
            let first_key = Object.keys(output)[0];
            document.getElementById("calcLabel").style.display = "block";
            let img = labels[output[first_key][1]["label"]];
            console.log(output[first_key][1]);
            if (output[first_key][1]["label"] === 0) {
                document.getElementById("printLabel").innerHTML = "Sorry, we don't have a label for this url yet.";
            } else {
                document.getElementById("printLabel").innerHTML = "The label for the domain " + first_key + " is <img src= "+img+" > </img>.";
            }
        }
    };
    xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true); //Flask projekt muss am laufen sein
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(body);
}

chrome.storage.local.get(function(data) {
    let keys = Object.keys(data); //domains
    let values = Object.values((data)); //labels
    let all_labels = 0;
    let goodLabels = 0; //green or gold
    let unknownLabels = 0;

    //console.log(keys + ': ' + values); //UNCOMMENT TO SEE WHAT LABELS ARE SAVED

    for (let i = 0; i < values.length; i++) {
        if (values[i] !== 'pages') {all_labels++;}
        if (values[i] <= 3) {goodLabels++;
        } else if (values[i] === 0) {unknownLabels++;}
    }
    let score = '';

    let privacyScoreNumber = document.getElementById("privacyScore_number");
    let privacyScoreInfo = document.getElementById("privacyScore_info");

    if (privacyScoreNumber && privacyScoreInfo) {
        if (values.length === 0) {
            privacyScoreNumber.innerHTML = '¯\\_(ツ)_/¯';
            privacyScoreInfo.innerHTML = 'Nothing to show yet.';
        } else {
            score = Math.round(goodLabels / (values.length - unknownLabels) * 100);
            privacyScoreNumber.innerHTML = score.toString() + '%';
            privacyScoreInfo.innerHTML = getPrivacyInfo(score);
        }
    }

    if (document.getElementById('all_labels')) {
        let listOfLabels = '';
        for (let i = 3; i <= keys.length-1; i++){
            if(keys[i] !== 'pages'){
                listOfLabels += keys[i] + ': ' + values[i] + '<br>';
            }
        }
        document.getElementById('all_labels').innerHTML = listOfLabels;
    }
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


if (document.getElementById("reset_stats")) {
    document.getElementById("reset_stats").addEventListener("click", function() {
        chrome.storage.local.get(function(data) {
            if (Object.values(data).length === 0) {
                alert("Your storage is already empty");
            } else {
                chrome.storage.local.clear();
                location.reload();
            }
        });
    });
}
