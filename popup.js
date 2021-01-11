var clearDataBtn = document.querySelector("button");

clearDataBtn.addEventListener("click", function(){
    clearData();
    var allData = document.querySelectorAll("td");
    for(var i = 0; i < allData.length; i++){
        allData[i].parentNode.removeChild(allData[i]);
    }
    console.log("Data Cleared! and Extension Restarted..")
})

getData();

function getData(){
    chrome.runtime.sendMessage({data: "Send Data"}, function(response){
        console.log(response)
        var keys = Object.keys(response);
        for(var i = 0; i < keys.length; i++){
            var keyData = keys[i];
            var actualData = response[keyData];
            var table = document.querySelector("table");
            var row = table.insertRow(i);
            var timeInSeconds = Number(actualData);
            var time = convertTime(timeInSeconds);
            row.innerHTML = "<td>" + keyData + "</td>" + "<td class=\"left_assign\">" + time.hours+ " hours </td>" + "<td class=\"left_assign\">" + time.minutes+ " minutes </td>" + "<td class=\"left_assign\">" + time.seconds+ " seconds </td>";
        }
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