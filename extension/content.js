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

  //Hier habe ich einen einfachen Server gemacht, um es zu testen. Alternativ kannst du es schon mit dem Flask Projekt testen. 
  xhttp.open("GET", "http://localhost:8080", true);
  xhttp.send();

})


