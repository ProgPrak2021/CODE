var result = $('h3').closest('div')
var img = $('<img class="code-selector">');
img.attr('src', "https://lisztos.s3.amazonaws.com/images/icon_128_clear.png");
img.css('width', '25px')
img.css('float', 'left')
img.css('margin-left', '-2.25em')
img.css('cursor', 'pointer')
img.css('margin-top', '0.5em')
img.appendTo(result);

$('.code-selector').on('click', function(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      answer = JSON.parse(this.responseText)
      console.log(answer)
    }
  };

  //Flask projekt muss am laufen sein 
  var urls = readSearchResults();
  xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true);
  xhttp.setRequestHeader("Access-Control-Allow-Origin","*");
  xhttp.send(urls);
})

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

