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


var result = $('.LC20lb').closest('div')
var img = $('<img class="code-selector">');


/*
 Collects (and just log, at the moment) URLs user clicked on.
 */
function collectUrl() {
  const elems = document.querySelectorAll('.yuRUbf');
  var clickedUrls = '';

  elems.forEach(element => {
    element.addEventListener('click', (e) => {
      if(e.ctrlKey || e.metaKey) {
        //console.log('clicked on: ' + findUrl(element));
        clickedUrls += findUrl(element);
        //console.log('clickedUrls: '+ clickedUrls);
      }
    });
  });
  return clickedUrls;
}
/*
Extracts URL from the Google Search Result element (class name: 'yuRUbf')
 */
function findUrl(element) {
  return new URL(element.children[0].href);
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

//$('.code-selector').on('click', function(){
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    console.log(this.responseText)
    var output = JSON.parse(JSON.parse(this.responseText)); // dont know why but you have to parse it twice

    printLabels(output)

  }
};
var urls = sendURLsToBackend();
xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true); //Flask projekt muss am laufen sein 
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.send(urls);
//})





function printLabels(output) {

  function storeVar(key, value) {
    if (key == "label") {
      //console.log("key: " + key + " value: " + value)
      label = value
    }
    if (key == "tracker") {
      //console.log("key: " + key + " value: " + value)
      tracker = value
    }
    if (key == "facebook") {
      //console.log("key: " + key + " value: " + value)
      facebook = value
    }
  }

  function traverse_JSON(obj, func) {
    for (var key in obj) {
      func.apply(this, [key, obj[key]]);
      if (obj[key] !== null && typeof (obj[key]) == "object") {
        //going one step down in the object tree!!
        traverse_JSON(obj[key], func);
      }
    }
  }


  var labels = [[chrome.runtime.getURL('images/siren.png'), "none"], [chrome.runtime.getURL('images/green_icon_128.png'), "green"], [chrome.runtime.getURL('images/yellow_icon_128.png'), "yellow"], [chrome.runtime.getURL('images/red_icon_128.png'), "red"]]
  var icons = [chrome.runtime.getURL('images/icons/google_icon.png'), chrome.runtime.getURL('images/icons/oracle_icon.png'), chrome.runtime.getURL('images/icons/spy_icon.png'), chrome.runtime.getURL('images/icons/facebook_icon.png')]
  var divs = document.getElementsByClassName("yuRUbf");


  for (var div of divs) {
    var label, tracker, facebook
    var domain = getDomain(div)

    traverse_JSON(output[domain], storeVar);

    //console.log("label " + label + " tracker_count " + tracker + " facebook " + facebook)

    if (facebook == true) {
      var img = $('<div class="list"> <div class="entry"><img class="code-selector" src="' + labels[label][0] + '"> <div class=\"content\"> <div class="inner"><h2>Trackers: ' + tracker + '</h2><h2> Including:</h2><img class="icons" src="' + icons[0] + '"><img class="icons" src="' + icons[3] + '"></div></div></div></div>');
      img.appendTo(div);
    } else {
      var img = $('<div class="list"> <div class="entry"><img class="code-selector" src="' + labels[label][0] + '"> <div class=\"content\"> <div class="inner"><h2>Trackers: ' + tracker + '</h2><h2> Including:</h2><img class="icons" src="' + icons[0] + '"></div></div></div></div>');
      img.appendTo(div);
    }
  }
  $('head').append("<link rel=\"stylesheet\" href=\"/css/hardcoded_style.css\">");

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

  return url

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



-------------------------------------------------------------
*/
