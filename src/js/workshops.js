var payWithCard = function(stripe, card, clientSecret) {
    loading(true);
    stripe
        .confirmCardPayment(clientSecret, {
            payment_method: {
                card: card
            }
        })
        .then(function(result) {
            if (result.error) {
                // Show error to your customer
                showError(result.error.message);
            } else {
                // The payment succeeded!
                orderComplete(result.paymentIntent.id, true);
            }
        });
};

var orderComplete = function(paymentIntentId, donation) {
    sendToNetlify(donation)
};

var sendToNetlify = function(donation) {
    var $form = $("#payment-form");
    var form_data = new FormData($('#payment-form')[0]);
    /*  $.post($form.attr("action"), $form.serialize()).then(function() {
            alert("Thank you!");
        });*/

    $.ajax({
        url: $form.attr("action"),
        type: 'post',
        data: form_data,
        contentType: false,
        //contentType: 'multipart/form-data',
        processData: false,
        success: function(data) {
            if (donation) {
                document.querySelector(".result-donate-message").classList.remove("hidden");
            } else {
                document.querySelector(".result-no-donate-message").classList.remove("hidden");
            }
            document.querySelector("#submit").disabled = true;
            document.getElementById("payment-form").style.display = "none"

            loading(false);
            sendEmail(donation)

        },
        error: function(request, status, error) {
            console.log(request)
            console.log(status)
        }
    });

};


var showError = function(errorMsgText) {
    loading(false);
    var errorMsg = document.querySelector("#card-error");
    errorMsg.textContent = errorMsgText;
    setTimeout(function() {
        errorMsg.textContent = "";
    }, 4000);
};

// Show a spinner on payment submission
var loading = function(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
};

var sendEmail = function(donation) {

    var nameValue = document.getElementById("name").value;
    var emailValue = document.getElementById("email").value;

    var type="justDonation"
    fetch("/.netlify/functions/sendmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nameValue,
                email: emailValue,
                donation: type
            })
        })
        .then(function(result) {
            return result.json();
        })
        .then(function(data) {
            return data;
        })

}

function triggerBrowserValidation() {
    // The only way to trigger HTML5 form validation UI is to fake a user submit
    // event.
    var submit = document.createElement('input');
    var form = document.getElementById("payment-form");
    submit.type = 'submit';
    submit.style.display = 'none';
    form.appendChild(submit);
    submit.click();
    submit.remove();
}

function fetchPaymentIntent(amount) {
    console.log("fetching payment")
    return fetch("/.netlify/functions/purchase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: amount //need to define how much to purchase first duh
        })
        .then(function(result) {
            return result.json();
        })
}

var card;
function mountForm() {
    var elements = stripe.elements({
        fonts: [{
            cssSrc: 'https://fonts.googleapis.com/css?family=Roboto'
        }]
    });
    var style = {
        base: {
            color: "#32325d",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "14px",
            "::placeholder": {
                color: "#32325d"
            }
        },
        invalid: {
            fontFamily: 'Arial, sans-serif',
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    };
    card = elements.create("card", {
        style: style
    });
    // Stripe injects an iframe into the DOM
    card.mount("#card-element");
    card.on("change", function(event) {
        // Disable the Pay button if there are no card details in the Element
        document.querySelector("#submit").disabled = event.empty;
        document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
    });
}


var stripe;

document.addEventListener("DOMContentLoaded", function() {

/*    document.getElementById("submit").addEventListener("click", function() {
        event.preventDefault();
        document.getElementById("card-element").style.display = "block"
        document.querySelector("#submit").disabled = true;
        var plainInputsValid = true;
        var form = document.getElementById("payment-form");
        Array.prototype.forEach.call(form.querySelectorAll('input'), function(
            input
        ) {
            if (input.checkValidity && !input.checkValidity()) {
                plainInputsValid = false;
                return;
            }
        });
        if (plainInputsValid){
            var value = parseInt(document.getElementById("inputDollar").value) * 100
            fetchPaymentIntent(value).then(function(data){
                payWithCard(stripe, card, data.clientSecret);
            })
        } else {
            triggerBrowserValidation();
        }
    })*/

    document.getElementById("fiveDollar").addEventListener("click", function() {
        document.getElementById("fiveDollar").style.background = "#a3c6c4"
        document.getElementById("tenDollar").style.background = "none"
        document.getElementById("tenDollar").style.color = "#293B74"
        document.getElementById("fiveDollar").style.color = "white"
         document.getElementById("none").style.background = "none"
        document.getElementById("none").style.color = "#293B74"
    })

    document.getElementById("tenDollar").addEventListener("click", function() {
        document.getElementById("tenDollar").style.background = "#a3c6c4"
        document.getElementById("tenDollar").style.color = "white"
        document.getElementById("fiveDollar").style.background = "none"
        document.getElementById("fiveDollar").style.color = "#293B74"
        document.getElementById("none").style.background = "none"
        document.getElementById("none").style.color = "#293B74"
    })

    document.getElementById("none").addEventListener("click", function() {
        document.getElementById("fiveDollar").style.color = "#293B74"
        document.getElementById("tenDollar").style.background = "none"
        document.getElementById("fiveDollar").style.background = "none"
        document.getElementById("tenDollar").style.color = "#293B74"
        document.getElementById("none").style.background = "#a3c6c4"
        document.getElementById("none").style.color = "white"
    })


    //document.querySelector("#submit").disabled = true;

});