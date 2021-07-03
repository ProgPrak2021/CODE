window.addEventListener("load", function() {
    if(document.getElementById("submitButton")) {
        document.getElementById("submitButton").addEventListener("click", function () {
            console.log("jsjs");
            url = document.getElementById("url").value;
            var hardcoded_preference = {
                "whotracksme": ["Facebook", "Amazon"],
                "privacyspy": [],
                "google_safeBrowsing": [],
                "phishstats": [],
                "webrisk": []
            }
            // call a method that looks for preferences stored in storage api
            var hardcoded_expert_mode = false
            var body = url + "SPLITME" + JSON.stringify(hardcoded_preference) + "SPLITME" + hardcoded_expert_mode
            sendURL(body);
        })
    }
});

function sendURL(body) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText)
            var output = JSON.parse(JSON.parse(this.responseText)); // dont know why but you have to parse it twice
            first_key = Object.keys(output)[0]
            console.log(output[first_key][0]["label"]);
            document.getElementById("calcLabel").style.display = "block";
            document.getElementById("printLabel").innerText = "The label for the domain " + first_key + " is " + output[first_key][0]["label"] + ".";
        }
    };
    xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true); //Flask projekt muss am laufen sein 
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.send(body);
}

chrome.storage.local.get(function(data) {
    var labels = Object.values((data));
    var goodLabels = 0; //green or gold
    var unknownLabels = 0;

    //console.log(labels); //UNCOMMENT TO SEE WHAT LABELS ARE SAVED

    for (var i = 0; i < labels.length; i++) {
        if (labels[i] >= 7) { //TODO: Two score formulas are needed: one for expert mode and one for normal mode
            goodLabels++;
        } else if (labels[i] === 0) {
            unknownLabels++;
        } else {
            continue;
        }
    }
    var score = '';

    const privacyScoreNumber = document.getElementById("privacyScore_number");
    let privacyScoreInfo = document.getElementById("privacyScore_info");

    if (privacyScoreNumber && privacyScoreInfo) {
        if (labels.length === 0) {
            privacyScoreNumber.innerHTML = '¯\\_(ツ)_/¯';
            privacyScoreInfo.innerHTML = 'Nothing to show yet.';
        } else {
            score = Math.round(goodLabels / (labels.length - unknownLabels) * 100);
            privacyScoreNumber.innerHTML = score.toString() + '%';
            privacyScoreInfo.innerHTML = getPrivacyInfo(score);
        }
    }
});


function getPrivacyInfo(score) {
    var info = "";

    if (score >= 66) {
        info = "Good job! You took good care about your privacy: " +
            score + "% of your visited websites had a green label!";
    } else if (score < 66 && score >= 33) {
        info = "Not bad! You did quite well: " +
            score + "% of your visited websites had a green label";
    } else {
        info = "Could be better! Only " + score + "% of your visited websites had a green label. " +
            "Next time take a look at the label before you open the page."
    }
    return info;
}


var btn = document.getElementById("reset_stats");

if (btn) {
    btn.addEventListener("click", function() {
        chrome.storage.local.get(function(data) {
            if (Object.values(data).length === 0) {
                alert("Your storage is already empty");
            } else {
                chrome.storage.local.clear();
                location.reload();
            }
        })
    })
}

chrome.storage.onChanged.addListener(function() {
    location.reload();
});
