window.addEventListener("load", function(event) {
    document.getElementById("Facebook").addEventListener('click', function() {
        receivePrefs("Facebook");
    });
    document.getElementById("Amazon").addEventListener('click', function() {
        receivePrefs("Amazon");
    });
    document.getElementById("weight_tracker").addEventListener('click', function() {
        receivePrefs("weight_tracker");
    });
    document.getElementById("disable").addEventListener('click', function() {
        receivePrefs("disable");
    });

});