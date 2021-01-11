var clearDataBtn = document.querySelector("button");

clearDataBtn.addEventListener("click", function(){
    clearData();
    var allData = document.querySelectorAll("td");
    for(var i = 0; i < allData.length; i++){
        allData[i].parentNode.removeChild(allData[i]);
    }
    console.log("Data Cleared! and Extension Restarted..")
    var span = document.querySelector("span");
    span.innerHTML = 0 + " hours " + 0 + " minutes " + 0 + " seconds "; 
})

getData();

function getData(){
    chrome.runtime.sendMessage({data: "Send Data"}, function(response){
        console.log(response)
        var keys = Object.keys(response);
        var overAllTime = 0;
        var sortable = []
        for(var i = 0; i < keys.length; i++){
            var keyData = keys[i];
            var actualData = response[keyData];
            sortable.push([keyData, actualData]);
            overAllTime += Number(actualData)
        }
        sortable.sort(function(a, b){
            return b[1] - a[1];
        })
        for(var i = 0; i < sortable.length; i++){
            var keyData = sortable[i][0]
            var actualData = sortable[i][1]
            var table = document.querySelector("table");
            var row = table.insertRow(i);
            var timeInSeconds = Number(actualData);
            var time = convertTime(timeInSeconds);
            row.innerHTML = "<td>" + keyData + "</td>" + "<td class=\"left_assign\">" + time.hours+ " hours </td>" + "<td class=\"left_assign\">" + time.minutes+ " minutes </td>" + "<td class=\"left_assign\">" + time.seconds+ " seconds </td>";
        }
        var span = document.querySelector("span");
        var time = convertTime(overAllTime);
        span.innerHTML = time.hours + " hours " + time.minutes + " minutes " + time.seconds + " seconds "; 
    })
}

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