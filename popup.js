getData();

function getData(){
    chrome.runtime.sendMessage({data: "Send Data"}, function(response){
        console.log(response)
        var keys = Object.keys(response);
        var overAllTime = 0;
        var sortable = []
        for(var i = 0; i < keys.length; i++){
            var keyData = keys[i];
            var actualData = splitArray(response[keyData])[0];
            sortable.push([keyData, actualData, splitArray(response[keyData])]);
            overAllTime += Number(actualData)
        }
        sortable.sort(function(a, b){
            return b[1] - a[1];
        })
        for(var i = 0; i < sortable.length; i++){
            var keyData = sortable[i][0]
            var actualData = sortable[i][1]
            var data = document.querySelector("body");
            var timeInSeconds = Number(actualData);
            var time = convertTime(timeInSeconds);
            var newData = document.createElement("h3");
            newData.style = "clear: both;";
            newData.innerHTML = "<span class=\"space leftAlign\">" + keyData + "</span>" + makeButton(i) + "<span class=\"space rightAlign\"> " + time.hours+ " hours " + "   " + time.minutes+ " minutes" + "     " + time.seconds+ " seconds </span>" 
            data.appendChild(newData);
            var newDataChild = document.createElement("div");
            newDataChild.style = "clear: both;";
            newDataChild.innerHTML = innerDataUpdated(sortable[i][2], i);
            data.appendChild(newDataChild);

            var btn = ".toggle" + i;
            var tab = ".hide" + i;
            var toggleBtn = document.querySelector(btn);
            toggleBtn.myParam = "" + tab;
            toggleBtn.addEventListener("click", function(event) {
                var giveTab = event.currentTarget.myParam;
                var tab_ = document.querySelector(giveTab);
                tab_.classList.toggle("hide");
                var iconId = ".icon" + giveTab.slice(5, giveTab.length);
                var icontag = document.querySelector(iconId);
                if(icontag.style.transform == "") {
                    icontag.style.transform = "rotate(180deg)"
                }else {
                    icontag.style.transform = "";
                }
            })
        }
        
        var span = document.querySelector("span");
        span.className = "bigSize";
        var time = convertTime(overAllTime);
        span.innerHTML = "\xa0\xa0\xa0" + time.hours + " hours " + time.minutes + " minutes "; 

        var body = document.querySelector("body");
        var clearButton = document.createElement("button");
        clearButton.className = "clear";
        clearButton.innerHTML = "Clear Data";
        body.appendChild(clearButton);

        var clearDataBtn = document.querySelector(".clear");

        clearDataBtn.addEventListener("click", function(){
            clearData();
            var allData = document.querySelectorAll("div");
            for(var i = 0; i < allData.length; i++){
                allData[i].parentNode.removeChild(allData[i]);
            }
            allData = document.querySelectorAll("h3");
            for(var i = 0; i < allData.length; i++){
                allData[i].parentNode.removeChild(allData[i]);
            }
            console.log("Data Cleared! and Extension Restarted..")
            var span = document.querySelector("span");
            span.innerHTML = 0 + " hours " + 0 + " minutes " + 0 + " seconds "; 
        })


        

        chrome.runtime.sendMessage({data: "Give State"}, function(response){
            var pauseButton = document.createElement("button");
            var body = document.querySelector("body");
            // TODO  -> Get State of app currently from background.js
            // var response = giveState();
            if(response) {
                // Running State -> make button that show to pause
                pauseButton.className = "pause"; // yellow in color
                pauseButton.textContent = "PAUSE";
            }else {
                // Paused State -> make button that show to resume
                pauseButton.className = "resume";
                pauseButton.textContent = "Resume";
            }
            body.appendChild(pauseButton);

            pauseButton.addEventListener("click", function() {
                pauseButton.classList.toggle("pause");
                pauseButton.classList.toggle("resume");
                if(pauseButton.classList.contains("pause")) {
                    pauseButton.textContent = "PAUSE";
                }else {
                    pauseButton.textContent = "RESUME";
                }
                chrome.runtime.sendMessage({data: "Change State"}, function(response){
                })
            })

        }) 
    })
}

function makeButton(number){
    var data = "<button class=\"toggle" + number + "\">" + "<i class=\"fas icon" + number +  " fa-caret-down\"></i>" + "</button>"
    return data;
}

// function giveState() {
//     chrome.runtime.sendMessage({data: "Give State"}, function(response){
//         return response;
//     }) 
// }

function clearData() {
    chrome.runtime.sendMessage({data: "Clear Data"}, function(response){
    });
}

function convertTime(timeInSeconds) {
    var hrs = Math.floor(timeInSeconds/(60 * 60));
    timeInSeconds -= hrs * 60 * 60;
    var mins = Math.floor(timeInSeconds/60);
    timeInSeconds -= mins * 60;
    var secs = timeInSeconds;
    return {"hours":hrs, "minutes":mins, "seconds":secs};
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

function innerDataUpdated(data, number) { 
    var html = ["<table class=\"hide hide" + number + "\">"]
    html.push("<thead>")
    html.push("<tr>")
    html.push("<td>START</td><td>END</td><td>HRS</td><td>MINS</td><td>SECS</td>")
    html.push("</tr></thead>")
    html.push("<tbody>")
    for(var i = 1; i < data.length; i++){
        html.push("<tr>")
        var time = convertTime(data[i][1])
        html.push("<td>" + (i - 1) + "</td><td>" + i + "</td><td>" + time.hours + "</td><td>" + time.minutes + "</td><td>" + time.seconds + "</td>")
        html.push("</tr>")
    }
    html.push("</tbody>")
    html.push("</table>");
    return html.join("");
}