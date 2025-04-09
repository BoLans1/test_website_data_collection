console.log("ITS WORKING");

function changeiFrameUrl(){
    let myIframe = document.getElementById("myIframe");
    if (myIframe) {
        let url_string = "https://eu-nld101.marketo.com/lp/463-CYI-211/Example-Form-with-UserSessionIDs_Example-LP-with-UserSessionID--UTM-capture.html";
        let adsURL = url_string + window.location.search;
        myIframe.src = adsURL;
    } else {
        console.error("iFrame with id 'myIframe' not found.");
    }
}
    
changeiFrameUrl();