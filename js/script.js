var rating = window.localStorage;

//this function sets the name of the company
function setCompanyName(bool_val) {
    if (bool_val === 1) {
        localStorage.setItem("company", $("#comp_name").val());
        $(".company-name").html(rating.getItem("company"));
    } else {
        Materialize.toast("Opertaion Cancelled", 2000);
    }
}

$(function () {
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
        var myRates = "Time sent, Rating";
        for (var i = 0; i < rating.length; i++) {
            key = rating.key(i);
            if (key !== '' && key !== 'company' && key !== 'admin_pword' && rate !== '') {
                $('#ratesArea').append(key + "   " + rating.getItem(key));
                myRates += key+","+rating.getItem(key)+"<br>";
                //$('#ratesArea2').append(key + "   " + rating.getItem(key));
            }
        }
        cordova.plugins.email.isAvailable(
          function (isAvailable) {
              alert('Service is not available');
          }
        );
        cordova.plugins.email.open({
            to:      'salifumutaru@gmail.com',
            subject: 'Ratings from '+rating.company,
            body:    myRates,
            isHtml:  true
        });
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
        if (rating.length == 0)
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
            var $toastContent = "Thank You For Rating Us " + rating_val + " Stars";
            Materialize.toast($toastContent, 5000);

            setTimeout(function () {
                window.location.reload();
            }, 3000);


        }
    );

});
