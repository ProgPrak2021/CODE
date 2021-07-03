window.addEventListener("load", function(event) {
    document.getElementById("FacebookWTM").addEventListener('click', function() {
        //receivePrefs("Facebook");
    });
    document.getElementById("AmazonWTM").addEventListener('click', function() {
        //receivePrefs("Amazon");
    });
    document.getElementById("weight_trackerWTM").addEventListener('click', function() {
        //receivePrefs("weight_tracker");
    });
    document.getElementById("disableWTM").addEventListener('click', function() {
        //receivePrefs("disable");
    });
    document.getElementById("disableWTM").addEventListener('click', function() {
        //receivePrefs("disable");
    });
    document.getElementById("disableWTM").addEventListener('click', function() {
        //receivePrefs("disable");
    });
    document.getElementById("disableWTM").addEventListener('click', function() {
        //receivePrefs("disable");
    });
    document.getElementById("disableWTM").addEventListener('click', function() {
        //receivePrefs("disable");
    });
    document.getElementById("disableWTM").addEventListener('click', function() {
        //receivePrefs("disable");
    });
    document.getElementById("disableWTM").addEventListener('click', function() {
        //receivePrefs("disable");
    });
    document.getElementById("disableWTM").addEventListener('click', function() {
        //receivePrefs("disable");
    });
    disablePrsspy
    disablePhish
    diableGoogle
    disableWebrisk
    coinLabel
    expertMode

});

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

                const researches = result.pages ? ? [];
                resolve(researches);
            });
        });
    }

    static savePage = async(title, url) => {
        const pages = await this.getPages();
        const updatedPages = [...pages, { title, url }];

        return toPromise((resolve, reject) => {

            chrome.storage.local.set({
                [PAGES_KEY]: updatedPages
            }, () => {
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