/*
window.addEventListener("load", function (event) {
    document.getElementById("Facebook").addEventListener('click', function () {
        receivePrefs("Facebook");
    });
    document.getElementById("Amazon").addEventListener('click', function () {
        receivePrefs("Amazon");
    });
    document.getElementById("weight_tracker").addEventListener('click', function () {
        receivePrefs("weight_tracker");
    });
    document.getElementById("disable").addEventListener('click', function () {
        receivePrefs("disable");
    });

});
*/

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText)
    }
};


/* START
######################################################################################################
*/

document.addEventListener('DOMContentLoaded', async () => {

    const facebook = document.getElementsByClassName("btn-facebook")

    const buttons = document.getElementsByName("toggle")
    for (var elem of buttons) {
        console.log(elem.className.split(" ")[0])
    }

    facebook[0].addEventListener("click", tester, false);
    function tester() {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
        } else {
            this.classList.add("active");
            console.log("works")
            PageService.savePage("facebook", "true")
            PageService.savePage("amazon", "true")


        }
    };



    //store var

    await sendPages();


});


const sendPages = async () => {
    const visitedPages = await PageService.getPages();
    console.log(visitedPages)

    visitedPages.forEach(page => {
        console.log(page)
    });
}


xhttp.open("POST", "http://127.0.0.1:5000/receive_preferences", true); //Flask projekt muss am laufen sein 
xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
xhttp.send("[Facebook: true, Amazon: false, ....]");





const PAGES_KEY = 'pages';

const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        }
        catch (err) {
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

    static savePage = async (button, clicked) => {
        const pages = await this.getPages();
        const updatedPages = [...pages, { button, clicked }];

        return toPromise((resolve, reject) => {

            chrome.storage.local.set({ [PAGES_KEY]: updatedPages }, () => {
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


/*
If you're interested in tracking changes made to a data object, you can add a listener to its onChanged event. 
Whenever anything changes in storage, that event fires. Here's sample code to listen for saved changes:
*/

chrome.storage.onChanged.addListener(function (changes, namespace) {
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