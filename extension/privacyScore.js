chrome.storage.local.get(function(data){
    var labels = Object.values((data));
    var goodLabels = 0; //green or gold
    var unknownLabels = 0;

    console.log(labels);

    for(var i = 0; i < labels.length; i++) {
        if (labels[i]===3){     //TODO: Two score formulas are needed: one for expert mode and one for normal mode
            goodLabels++;
        } else if(labels[i] === 0){
            unknownLabels++;
        } else {
            continue;
        }
    }
    var score = Math.round(goodLabels / (labels.length-unknownLabels) * 100);
    document.getElementById("privacyScore_number").innerHTML = score.toString() + "%";
    document.getElementById("privacyScore_info").innerHTML = getPrivacyInfo(score);
});

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
