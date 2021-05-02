chrome.runtime.onMessage.addListener ( (message) => {
    console.log("sd")
    chrome.cookies.getAll({url:"https://www.youtube.com/"}, function(cookies){
        console.log("cookies coming")
        console.log(cookies);
        for (var i = 0; i < cookies.length; i++) {
            //console.log(cookies[i] + "deleted");
            //chrome.cookies.remove({
            //  url: "https://" + cookies[i].domain + cookies[i].path,
            //  name: cookies[i].name
            //});
        }
    });
});
