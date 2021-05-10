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
     alert(this.responseText);
    }
  };

  //Flask projekt muss am laufen sein 
  var url_list = readSearchResults();
  xhttp.open("POST", "http://127.0.0.1:5000/sendurls/", true);
  xhttp.setRequestHeader("Access-Control-Allow-Origin","*");
  xhttp.send(url_list);
})

function readSearchResults(rootNode) {
  var elems = document.getElementsByClassName("yuRUbf");
  var url_list = [];
  for(var i of elems){
    url_list.push(i.children[0].href);
  }
console.log(url_list)
return url_list;
}

