var result = $('h3').closest('div')
var img = $('<img class="code-selector">');
img.attr('src', "https://lisztos.s3.amazonaws.com/images/icon_128_clear.png");
//img.attr('src', 'https://www.google.com/search?q=orange&sxsrf=ALeKk02SZqG-A6h6nM_XrHyIU98gIgRk9w:1621172387851&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjDl7Diqc7wAhXTCWMBHY61BmsQ_AUoA3oECAIQBQ&biw=1920&bih=937#imgrc=kBUCtsWcfmgoVM'); //select img from src folder? 
img.css('width', '25px')
img.css('float', 'left')
img.css('margin-left', '-2.25em')
img.css('cursor', 'pointer')
img.css('margin-top', '0.5em')
img.appendTo(result);
//var all_labels = ["https://lisztos.s3.amazonaws.com/images/icon_128_clear.png","",""]
$('.code-selector').on('click', function(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      answer = JSON.parse(this.responseText)
      console.log(answer);
      console.log(answer[0]);
      findLabels(answer)
    }
  };

  //Flask projekt muss am laufen sein 
  var urls = readSearchResults();
  xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true);
  xhttp.setRequestHeader("Access-Control-Allow-Origin","*");
  xhttp.send(urls);

  /*GET method for key-value list (domain, [1,2,3])
  set img depending on number
  
  
  
  
  
  
  */
})
function printLabel(whereTo, img_index){
  var img = $('<img class="code-selector">');
  img.attr('src', all_labels[img_index]);
  img.css('width', '25px')
  img.css('float', 'left')
  img.css('margin-left', '-2.25em')
  img.css('cursor', 'pointer')
  img.css('margin-top', '0.5em')
  img.appendTo(whereTo);
}
function findLabels(answer){
  for( var dict of answer){
    var div = findByDomain(dict[0]);
    if(div === null){ // should not happen as it means that the url was not found in website
      break;
    }
    printLabel(div, dict[1]);

  }
}
function findByDomain(domain){
  var elems = document.getElementsByClassName("yuRUbf");
  var urls = "";
  for(var div of elems){
    var url = i.children[0].href
    if(url.includes(domain)){
      return i
    }
  }
  return null;
}
function readSearchResults(rootNode) {
  var elems = document.getElementsByClassName("yuRUbf");
  var urls = "";
  for(var i of elems){
    var url = new URL(i.children[0].href)
    urls += url
   /* 
    domain = url.hostname;
    domain = domain.replace('www.','');
    domain = domain.replace('de.','');
    urls+=domain; //output is a domain 
    urls+="Split";
    */
  }
return urls;
}

