



chrome.runtime.sendMessage({greeting: "hello"});
  //console.log(response.farewell);
console.log("test");
console.log("nesMessage");
readSearchResults();
function readSearchResults(rootNode) {
  console.log(rootNode)
  var elems = document.getElementsByClassName("yuRUbf");
  for(var i of elems){
    console.log(i.children[0].href);
  }
 }