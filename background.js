/*
    Idea : We will simply see the current url after some fixed duration of time 
*/
var globalTime = new Date().getTime();

function timeDifference() {
    var currentTime = new Date().getTime();
    return -globalTime + currentTime;
}

function giveDomain(URL) {
    var array = ["http://", "https://", "chrome://", ""]
    for(var i = 0; i < 4; i++){
        var current = array[i];
        var ok = true;
        var iter = 0;
        for(iter = 0; iter < current.length; iter++){
            if(current[iter] ===  URL[iter]){
                continue;
            }else {
                ok = false;
            }
        }
        if(ok){
            var domain_name = [];
            while(iter < URL.length && URL[iter] != '/'){
                domain_name.push(URL[iter]);
                iter++;
            }
            var ans = "";
            if(i == 2){
                ans = "chrome://" + domain_name.join("");
            }else{
                ans = domain_name.join("");
            }
            return ans;
        }
    }
}

var value = setInterval(function(){
    chrome.tabs.query({active:true, lastFocusedWindow:true}, function(tab){
        if(tab[0] != undefined){
            var url = tab[0].url;
            var domain_ = giveDomain(url);
            if(domain_ != undefined){
                var get = localStorage.getItem(domain_);
                if(get == null){
                    localStorage.setItem(domain_, 5);
                }else {
                    localStorage.removeItem(domain_);
                    var value = Number(get) + Number(5);
                    localStorage.setItem(domain_, value);
                }
            }
        }
    });
}, 5000);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.data === "Send Data"){
        sendResponse(localStorage);
    }else {
        localStorage.clear();
        sendResponse("Done");
    }
})
