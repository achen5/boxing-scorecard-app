var messageDisplayed = false;

function msieversion() { // Internet Explorer detection

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
        alert("ATTENTION: This app does not support Internet Explorer.");
        console.log("this is true");
        return true;
    }

    return false;
}
msieversion();