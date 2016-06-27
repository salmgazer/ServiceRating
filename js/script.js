function onLoad() {
    // A simple check for phones tto make sure device is ready to with all plugins
    document.addEventListener("deviceready", deviceReady, false);
}

var link = "http://realgalacticos.org/app/mail.php?cmd=";
var rating = window.localStorage;

function sendRequest(u) {
    // Send request to server
    //u a url as a string
    //async is type of request
    var obj = $.ajax({
        url: u,
        async: false
    });
    //Convert the JSON string to object
    var result = $.parseJSON(obj.responseText);
    return result; //return object
}

//this function sets the name of the company
function setCompanyName(bool_val) {
    var newname = $("#comp_name").val();
    if (bool_val === 1 && newname !== '') {
        localStorage.setItem("company", newname);
        $(".company-name").html(rating.getItem("company"));
    } else if (bool_val === 2) {
        Materialize.toast("Operation Cancelled", 2000);
    } else {
        alert("You Have Not Entered Any Name");
    }
}

var deviceReady = $(function () {
    // Operations that load at the beginning of the program
    if (rating.getItem('admin_pword') === null) {
        rating.setItem('admin_pword', 'rosedodd');
        rating.setItem('company', 'Company Name');
    }


    $(".company-name").html(getCompanyName());
    $('#rateFormSubmit').click(function (e) {
        e.preventDefault();
        addRate();
    });



    //action listener for getting rates
    $('#getRates').click(function (e) {
        getRates();
    });


    //Action listening for exporting ratings
    $('#exportRates').click(function (e) {
        exportRates();
    });

    //this function clears all rating history
    $("#clearRates").click(function (e) {
        clearRates();
    });

    //ActionListener for setting company name
    $("#setCompName").click(function () {
        $('#confirm-modal').openModal();
    });


    function getCompanyName() {
        return localStorage.getItem("company");
    }

    //this function adds new rate
    function addRate() {
        var rate = $("#rate").val();
        var time_sent = new Date();

        if (rate.length < 1)
            return alert("You need to add a rate");
        rating.setItem(time_sent, rate);
    }

    //this function adds new rate
    function rate(val) {
        var rate = val;
        var time_sent = new Date();

        if (rate.length < 1)
            return alert("You need to add a rate");
        rating.setItem(time_sent, rate);
        console.log(rating.getItem(time_sent));
    }

    //this function returns all existing ratings
    function getRates() {
        document.getElementById("ratesArea").innerHTML = "";
        myRates = "";
        for (var i = 0; i < rating.length; i++) {
            key = rating.key(i);
            if (key !== '' && key !== 'company' && key !== 'admin_pword' && rate !== '') {
                $('#ratesArea').append(key + "     " + rating.getItem(key) + "<br>");
                myRates += key + "," + rating.getItem(key) + "<br>";
                // $('#ratesArea2').append(key + "   " + rating.getItem(key));
            }
        }
        emailRates(myRates);
    }

    function emailRates(myRates) {
        var strUrl = link + "46&receipient=roseabadodd@gmail.com&subject=Ratings from " + rating.company + "&message=" + myRates;
        var objResult = sendRequest(strUrl);
        if (objResult.result === 0) {
            Materialize.toast("Could not send ratings.", 4000, 'red');
            Materialize.toast("Check internet connection.", 4000, 'red');
        } else if (objResult.result == 1) {
            Materialize.toast("Ratings have been emailed to you", 4000, 'green lighten-2');
        }
    }

    //This function shows the number of ratings current in memory
    function getNumRatings() {
        return alert(rating.length);
    }

    //this function clears all of localstorage
    function clearRates() {
        rating.clear();
        if (rating.length == 0)
            alert("rates cleared");
        else
            alert("could not clear rates");
    }

    //this function exports rates into csv
    function exportRates() {
        /*if (rating.length == 0)
            return alert("No ratings yet");

        var $link = $("#dataLink");
        var csv = "";

        csv += "Time sent , Rating \n";
        //we should have the same amount of name/cookie fields
        for (var i = 0; i < rating.length; i++) {
            key = rating.key(i);
            rate = rating.getItem(key);
            //$('#ratesArea').append(key+"   "+localStorage.getItem(key));
            if (key !== '' && key !== 'company' && key !== 'admin_pword' && rate !== '') csv += key + "," + rate + "\n";
        }
        //console.log(csv);
        $link.attr("href", 'data:Application/octet-stream,' + encodeURIComponent(csv))[0].click();
        */
        Materialize.toast("Not yet working", 4000, 'red');
    }

    //A function that does user authemtication before switching
    $('.modal-trigger').leanModal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
    });

    //A function that triggers when there is a switch to the user view
    $("#user-switch").click(function () {
        window.location.reload();
    });


    //    //A function that changes the type of rating being used, whether stars or smileys
    //    $("#user-switch").click(function () {
    //        window.location.replace("index-2.html");
    //    });

    $("#authenticate_btn").click(function () {
        //Authentication
        if ($("#pword").val() === rating.getItem("admin_pword")) {
            $(".user-view").hide();
            $(".admin-view").removeClass("hide");
            $('#modal1').closeModal();
            Materialize.toast("Authenticated", 2000);
        } else {
            Materialize.toast("Sorry Wrong Password", 2000);
        }

    });

    //This function handles the star checks
    $('.star-rating li').click(
        // Handles the click on the star
        function (i) {
            $('.star-rating li').find("i").removeClass("fa-star").addClass("fa-star-o");;
            $(this).prevAll().andSelf().find("i").removeClass("fa-star-o").addClass("fa-star");
            rating_val = $(this).index() + 1;
            rate(rating_val);
            if (rating_val == 1 || rating_val == 2 || rating_val == 3) {
                $(".custom-message p").html("We will do better next time! <span><i class=\"fa fa-frown-o fa-5x red-text\"></i></span>");
            } else if (rating_val == 4 || rating_val == 5) {
                $(".custom-message p").html("See you again soon! <span><i class=\"fa fa-smile-o fa-5x green-text\"></i></span>");
            } else {
                $(".custom-message p").html("Didn't catch that do you mind rating again?");
            }

            setTimeout(function () {
                window.location.reload();
            }, 2000);


        }
    );

    //This function handles the smiley rating
    $('.smiley-rating li').click(
        function (i) {
            smiley = $(this).index();
            rate(smiley);
            if (smiley == 0 || smiley == 1) {
                $(".custom-message p").html("We will do better next time! <span><i class=\"fa fa-frown-o fa-5x red-text\"></i></span>");
            } else if (smiley == 2) {
                $(".custom-message p").html("See you again soon! <span><i class=\"fa fa-smile-o fa-5x green-text\"></i></span>");
            } else {
                $(".custom-message p").html("Didn't catch that do you mind rating again?");
            }


            setTimeout(function () {
                $("#message-modal").closeModal();
                window.location.reload();
            }, 2000);
        }
    );

});
