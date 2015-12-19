var rating = window.localStorage;

$(function () {
$('#rateForm').submit(function(e){
    e.preventDefault();
    addRate();
    });
});

//action listener for getting rates
$(function () {
    $('#getRates').click(function(e){
        getRates();
    })
});

//Action listening for exporting ratings
$(function () {
    $('#exportRates').click(function (e){
        exportRates();
    })
})

//this function clears all rating history
$(function () {
    $("#clearRates").click(function (e){
        clearRates();
    })
})

//ActionListener for setting company name
$(function () {
    $('#setCompName').submit( function(e){
        e.preventDefault();
        setCompanyName();
    })
})

//this function sets the name of the company
function setCompanyName(){
    var compName = $("#compName");
    localStorage.setItem("company", compName);
}

function getCompanyName(){
    alert(localStorage.getItem("company"));
}

//this function adds new rate
function addRate(){
    var rate = $("#rate").val();
    var time_sent = new Date();
    
    if(rate.length < 1)
        return alert("You need to add a rate");
    
    rating.setItem(time_sent, rate);
    alert(rating.getItem(time_sent));
}

//this function returns all existing ratings
function getRates(){
    document.getElementById("ratesArea").innerHTML = "";
    for (var i = 0; i < rating.length; i++){
        key = rating.key(i);
        $('#ratesArea').append(key+"   "+rating.getItem(key));
    }
}

//This function shows the number of ratings current in memory
function getNumRatings(){
    return alert(rating.length);
}

//this function clears all of localstorage
function clearRates(){
    rating.clear();
    if(rating.length == 0)
        alert("rates cleared");
    else
        alert("could not clear rates");
}

//this function exports rates into csv
function exportRates(){
    if(rating.length == 0)
        return alert("No ratings yet");
    
    var $link = $("#dataLink");
    var csv = "";
    
    csv += "Time sent , Rating \n";
		//we should have the same amount of name/cookie fields
    for (var i = 0; i < rating.length; i++){
        key = rating.key(i);
        rate = rating.getItem(key);
        //$('#ratesArea').append(key+"   "+localStorage.getItem(key));
        if(key !== '' && rate !== '') csv += key + "," + rate + "\n";	
    }
		//console.log(csv);
		$link.attr("href", 'data:Application/octet-stream,' + encodeURIComponent(csv))[0].click();
}