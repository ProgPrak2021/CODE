
document.querySelector('#options').addEventListener('click', function() {
  console.log("Here")
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});