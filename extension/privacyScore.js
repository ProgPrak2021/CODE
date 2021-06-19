var urls;
var countURLs;
var score;

var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
var oneWeekAgo = (new Date).getTime() - millisecondsPerWeek;

chrome.history.search({
  'text': '',
  'startTime': oneWeekAgo
}, function (historyItems) {
  this.urls = "";
  this.countURLs = 0;
  for (var i = 0; i < historyItems.length; i++) {
    if (historyItems[i].url.includes("chrome-") || historyItems[i].url.includes("google.com/search?")) {
      //do not include google search pages and chrome internal pages
      continue;
    }
    this.urls += historyItems[i].url.toString();
    this.countURLs++;
  }
});


/*
  Returns the meaning of the privacy score number.
 */
function getPrivacyInfo(score){
  var info = "";

  if (score >= 66) {
    info = "Good job! You took good care about your privacy in the past week: "
        + score + "% of your visited websites had a green label!";
  } else if (score < 66 && score >= 33) {
    info = "Not bad! You did quite well in the past week: "
        + score + "% of your visited websites had a green label";
  } else {
    info = "Could be better! Only " + score + "% of your visited websites had a green label. "
        + "Next time take a look at the label before you open the page."
  }
  return info;
}

/*
  Calculates labels from JSON output.
 */
function privacyScore(output) {
  var labels = [];

  for (let key in output) {
    let value = output[key];
    let entry = value[0];
    labels.push(entry.label);
  }
  var greenLabels = 0;
  var unknownLabels = 0;
  for (var i = 0; i < labels.length; i++) {
    if (labels[i] == 1) {
      greenLabels++;
    } else if (labels[i] == 0) {
      unknownLabels++;
    }
  }
  //Score = #green / (all-unknown) * 100
  score = Math.round(greenLabels / (countURLs-unknownLabels) * 100);

  // console.log("labels " + labels);
  // console.log("urls " + countURLs);
  // console.log("greenLabels: "+ greenLabels + " score: " + score);

  document.getElementById("privacyScore_number").innerHTML = score.toString() + "%";
  document.getElementById("privacyScore_info").innerHTML = getPrivacyInfo(score);
}


var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    var output = JSON.parse(JSON.parse(this.responseText));
    privacyScore(output);
  }
};


xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true); //Flask projekt muss am laufen sein
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.send(urls);
