var result = $('.LC20lb').closest('div')
var img = $('<img class="code-selector">');

img.attr('src', "https://simonk.s3.eu-central-1.amazonaws.com/images/siren.png"); //icon_128_clear
img.css('width', '30px')
img.css('float', 'left')
img.css('margin-left', '-2.5em')
img.css('cursor', 'pointer')
img.css('margin-top', '0.5em')
img.appendTo(result);
console.log(result);

function sendURLsToBackend(rootNode) { 
  var elems = document.getElementsByClassName("yuRUbf");
  var urls = "";
  for(var i of elems){
    var url = new URL(i.children[0].href);
    urls += url;
    console.log("urls "+url);
  }
return urls;
}

/*
-----------------------------------------------
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
------------------------------------------------
*/

//$('.code-selector').on('click', function(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText)
      var output = JSON.parse(JSON.parse(this.responseText)); // dont know why but you have to parse it twice
      
      printLabels(output)
      /*
      for (var key of Object.keys(output)) {
        console.log("key "+key)
        getDiv(key)
        //findLabel(key, output[key]);
      }
      console.log(getDiv("kino.de"))
      */
    }
};

  //Flask projekt muss am laufen sein 
  var urls = sendURLsToBackend();
  xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true);
  xhttp.setRequestHeader("Access-Control-Allow-Origin","*");
  xhttp.send(urls);
//})


function printLabels(output){
  var labels = ["https://simonk.s3.eu-central-1.amazonaws.com/images/icon_128_clear.png","https://simonk.s3.eu-central-1.amazonaws.com/images/yellow_icon_128.png","https://simonk.s3.eu-central-1.amazonaws.com/images/red_icon_128.png"]
  var divs = document.getElementsByClassName("yuRUbf");
  
  for(var div of divs){
    var label = getLabel(div, output)
    if(label <= 0){
      break;
    } else {
      var img = $('<div class="list"> <div class="entry"><img class="code-selector" src="'+labels[label - 1]+'"> <div class=\"content\"><h2>headline</h2><p> example text example text example text example text</p></div></div></div>');
    }
    /* img.attr('src', labels[label - 1]);
    img.css('width', '25px')
    img.css('float', 'left ')
    img.css('margin-left', '-2.25em')
    img.css('cursor', 'pointer')
    img.css('margin-top', '0.5em')
    */
    img.appendTo(div);  
    //$("").appendTo(div)
    //div.innerHTML += "<div class=\"lololo\">"+JSON.stringify(img)+"<p>jahsjdhsjhd</p> </div>";
  }
  $('head').append("<link rel=\"stylesheet\" href=\"/css/label_hover_style.css\">");
}

function getLabel(div, output){
  var url = JSON.stringify(div.children[0].href)
  var domain = "";
  for(var key of Object.keys(output)){
    if(url.includes(key)){
      domain = key;
    }
  }
  var index = output[domain];
  return index //1...2....3
}

/*
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
*/
