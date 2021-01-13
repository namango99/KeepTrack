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
            var ok = true;
            for(var i = 0; i < url.length; i++){
                if(url[i] != "\xa0"){
                    ok = false;
                    break;
                }
            }
            if(ok) {
                return;
            }
            var domain_ = giveDomain(url);
            if(domain_ != undefined){
                var get = localStorage.getItem(domain_);
                if(get == null){
                    var Array = makeArray();
                    updateData(Array, giveSlotNumber());
                    localStorage.setItem(domain_, dataToString(Array));
                }else {
                    // console.log(get);
                    var Array = splitArray(get);
                    // console.log(Array)
                    updateData(Array, giveSlotNumber());
                    // console.log(Array)
                    localStorage.removeItem(domain_);
                    localStorage.setItem(domain_, dataToString(Array));
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

function giveSlotNumber() {
    var time = new Date();
    var hrs = time.getHours();
    return hrs + 1;
}

function makeArray(){
    var ans = [];
    ans.push(0);
    for(var i = 0; i < 24; i++){
        ans.push([i,0]);
    }
    return ans;
}

function dataToString(arr){
    var toString = [];
    toString.push(arr[0]);
    for(var i = 1; i < arr.length; i++){
        toString.push(arr[i][0] + "," + arr[i][1]);
    }
    // console.log(toString);
    return toString.join("|");
}

function splitArray(data){
    var splitted = data.split("|");
    splitted[0] = Number(splitted[0]);
    for(var i = 1; i < splitted.length; i++){
        var now = splitted[i].split(",");
        splitted[i] = [Number(now[0]), Number(now[1])]
    }
    return splitted;
}

function updateData(data, slotNumber){
    // console.log(data + " " + slotNumber + " " + data[slotNumber])
    data[0] += 5;
    data[slotNumber][1] += 5;
}