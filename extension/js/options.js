function helper(msg) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // console.log(this.responseText)
      console.log("Preferences are updated!")
    }
  };
  xhttp.open("POST", "http://127.0.0.1:5000/sendPref/", true); //Flask projekt muss am laufen sein 
  xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhttp.send("whotracksmeSPLIT" + msg);
}
window.addEventListener("load", function (event) {
  document.getElementById("Facebook").addEventListener('click', function () {
    helper("Facebook");
  });
  document.getElementById("Amazon").addEventListener('click', function () {
    helper("Amazon");
  });
  document.getElementById("weight_tracker").addEventListener('click', function () {
    helper("weight_tracker");
  });
  document.getElementById("disable").addEventListener('click', function () {
    helper("disable");
  });

});