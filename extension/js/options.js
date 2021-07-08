window.addEventListener("load", function(event) {

    const setUpEventListeners =  function(){
        if (document.getElementById("FacebookWTM") && document.getElementById("AmazonWTM")
            && document.getElementById("weight_trackerWTM") && document.getElementById("disableWTM")
            && document.getElementById("disablePrsspy") && document.getElementById("disablePhish")
            && document.getElementById("diableGoogle") && document.getElementById("disableWebrisk")
            && document.getElementById("coinLabel") && document.getElementById("expertMode")) {
            console.log("jfjdfjfjd")
            document.getElementById("FacebookWTM").addEventListener('click', function () {
                PageService.savePage("FacebookWTM", "change");
            });
            document.getElementById("AmazonWTM").addEventListener('click', function () {
                PageService.savePage("AmazonWTM", "change");
            });
            document.getElementById("weight_trackerWTM").addEventListener('click', function () {
                PageService.savePage("weight_trackerWTM", "change");
            });
            document.getElementById("disableWTM").addEventListener('click', function () {
                PageService.savePage("disableWTM", "change");
            });
            document.getElementById("disablePrsspy").addEventListener('click', function () {
                PageService.savePage("disablePrsspy", "change");
            });
            document.getElementById("disablePhish").addEventListener('click', function () {
                PageService.savePage("disablePhish", "change");
            });
            document.getElementById("diableGoogle").addEventListener('click', function () {
                PageService.savePage("diableGoogle", "change");
            });
            document.getElementById("disableWebrisk").addEventListener('click', function () {
                PageService.savePage("disableWebrisk", "change");
            });
            document.getElementById("coinLabel").addEventListener('click', function () {
                PageService.savePage("coinLabel", "change");
            });
            document.getElementById("expertMode").addEventListener('click', function () {
                PageService.savePage("expertMode", "change");
            });
        }
    }
    function clickButtons(callback){ // function is called at last 

        const pages = PageService.getPages();
        pages.then((res)=>{
            console.log(res);
            for (let i= 0;i<res.length;i++){
                document.getElementById(res[i]["key"]).click();
            }
            callback(); // set up event listeners activating correct buttons
        })
    }

    const PAGES_KEY = 'pages';

    const toPromise = (callback) => {
        const promise = new Promise((resolve, reject) => {
            try {
                callback(resolve, reject);
            } catch (err) {
                reject(err);
            }
        });
        return promise;
    }


    class PageService {

        static getPages = () => {
            return toPromise((resolve, reject) => {
                chrome.storage.local.get([PAGES_KEY], (result) => {
                    if (chrome.runtime.lastError)
                        reject(chrome.runtime.lastError);

                    const researches = result.pages ?? [];
                    resolve(researches);
                });
            });
        }

        static savePage = async(key, value) => {
            const pages = await this.getPages();
            var updatedPages;
            var new_pages;
            var found = false;
            var newValue = "true";
            console.log(key)
            //var new_pages = pages.filter(page =>page["key"] === key);
            for (let i = 0;i<pages.length;i++){
                if(pages[i]["key"]==key){
                    var index = pages.indexOf(pages[i])
                    pages.splice(index,1);
                    //console.log(pages);
                    updatedPages = [...pages];
                    found = true;
                    break;
                }
            }
            console.log(pages)
            if(!found){
                updatedPages = [...pages, { key, newValue}];
            }

            return toPromise((resolve, reject) => {
                chrome.storage.local.set({
                    [PAGES_KEY]: updatedPages }, () => {
                    if (chrome.runtime.lastError)
                        reject(chrome.runtime.lastError);
                    resolve(updatedPages);
                });
            });
        }

        static clearPages = () => {
            return toPromise((resolve, reject) => {
                chrome.storage.local.remove([PAGES_KEY], () => {
                    if (chrome.runtime.lastError)
                        reject(chrome.runtime.lastError);
                    resolve();
                });
            });
        }
    }
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            var storageChange = changes[key];
            console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
        }
    });
    clickButtons(setUpEventListeners);
});

/*
If you're interested in tracking changes made to a data object, you can add a listener to its onChanged event. 
Whenever anything changes in storage, that event fires. Here's sample code to listen for saved changes:
*/
