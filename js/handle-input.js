/* Form validation */
(function() {
  "use strict";
  window.addEventListener("load", function() {
    var form = document.getElementById("needs-validation");
    form.addEventListener("submit", function(event) {
      if (form.checkValidity() == false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
      if (form.checkValidity() == true) {
        handleInput();
      }
    }, false);
  }, false);
}());

/* Advance through forms */
function advanceStep() {
	var currentStep = document.querySelector('.form-step');
	var finding = true;

	while(finding) {
		if($(currentStep).css('display') == 'block') {
			console.log(currentStep);
			$(currentStep).toggle();
			$(currentStep).next().toggle();
			break;	
		} else {
			currentStep = $(currentStep).next();
		}
	}
}

function retreatStep() {
	var currentStep = document.querySelector('.form-step');
	var finding = true;

	while(finding) {
		if($(currentStep).css('display') == 'block') {
			console.log(currentStep);
			$(currentStep).toggle();
			$(currentStep).prev().toggle();
			break;	
		} else {
			currentStep = $(currentStep).next();
		}
	}
}

/* Zip Code Query */
function handleResp(data) {
	// Check for error
	if (data.error_msg)
		console.log(data.error_msg);
	// else if ("distance" in data)
	// {
	// 	// Show div
	// 	container.find("div.distance").show()
	// 	// Set distance
	// 	.find("span.distance").text(data.distance + " miles");
	// }
	else {
		var zipList = data.zip_codes;
		console.log(zipList);

		// cache queried zipcode
		var queryZip = {};
		zipList.forEach(function(zipcode) {
			if(zipcode.distance == 0) {
				queryZip = zipcode;
			}
		});

		// sort the zipcode list from closest to furthest
		zipList.sort(function(a, b) {
		    return parseFloat(a.distance) - parseFloat(b.distance);
		});

		var htmlString = '';
		
		// Build html for list.
		zipList.slice(0, 6).forEach(function(zipcode) {
			if(zipcode.state = queryZip.state) {
				htmlString = htmlString + 
					'<ul style="list-style-type:none; padding-left: 0;"><li>' + 
					zipcode.city + ', ' + zipcode.state + 
					'</li><li>Zipcode: ' + zipcode.zip_code + 
					'</li><li>Distance: ';
				if (zipcode.distance == 0) {
					htmlString = htmlString + '<' + zipList[1].distance.toFixed() + ' mi.</li></ul>';
				} else {
					htmlString = htmlString + '~' + zipcode.distance.toFixed(1) + ' mi.</li></ul>';
				}	
			}
		});
		// Add list to page.
		$('.location-header').show();
		$('#zipcode-info').html(htmlString);
	}
}

function searchForZip () {
	var clientKey = "js-0RdwQ3vrCaId1vH7GQzG7V0m5sqJdFLexZLn2gOFrxTt2AAIr9oz5oWaRnT52Fkz";
	
	var cache = {};
	var zipcode = $('#zip-search').val().substring(0, 5); //$("input[name='zipcode']").val().substring(0, 5);
	if (zipcode.length == 5 && /^[0-9]+$/.test(zipcode)) {
		// Clear error
		// errorDiv.empty();
		// Check cache
		var cacheKey = zipcode;
		if (cacheKey in cache) {
			handleResp(cache[cacheKey]);
		} else {
			// Build url
			// https://zipcodedistanceapi.redline13.com/rest/<api_key>/radius.csv/08057/5/miles?minimal
			var url = "https://www.zipcodeapi.com/rest/"+clientKey+"/radius.json/" + zipcode + "/15/miles";
			
			// Make AJAX request
			$.ajax({
				"url": url,
				"dataType": "json"
			}).done(function(data) {
				handleResp(data);
				
				// Store in cache
				cache[cacheKey] = data;

			}).fail(function(data) {
				if (data.responseText && (json = $.parseJSON(data.responseText)))
				{
					// Store in cache
					cache[cacheKey] = json;
					
					// Check for error
					if (json.error_msg)
						console.log(json.error_msg);
				}
				else
					console.log('Request failed.');
			});
		}
	}
}

/* Form Submission */
function handleInput() {
	var fullName = $('#full-name').val();
	var address = $('#street-address').val();
	var addressTwo = $('street-address-2').val() || '';
	var city = $('#city').val();
	var state = $('#state').val();
	var zip = $('#zipcode').val();
	var phoneNumber = $('#phone-number').val();
	var phoneType = $('#phone-type').val();
	var email = $('#email').val();
	var loanAmount = $('#loan-amount').val();
	var time = $('#contact-time').val() + ' ' + $('#day-of-the-week').val();
	var reason = $('#reason').val();
	var comments = $('#comments').val() || '';

	var to = /* $('contact-email').val(); */ 'jeremiah@jeremiahlangner.com';
	var from = 'fifthofeight@yahoo.com'
	var apiKey = '';

	var contents = 'Name: ' + fullName + '\n' + 'Address 1: ' + address + '\n' + 'Address 2: ' + addressTwo + '\n' + 'City: ' + city + '\n' + 'State: ' + state + '\n' + 'Zip: ' + zip + '\n' + 'Phone Number: ' + phoneNumber + '\n' + 'Phone Type: ' + phoneType + '\n' + 'Email: ' + email + '\n' + 'Loan Amount Requested: ' + loanAmount + '\n' + 'Best Time to Contact: ' + time + '\n' + 'How did you hear about us?: ' + reason + '\n' + 'Additional Customer Comments: ' + comments;

	$(window).bind('beforeunload', function() {
		$.post('https://dry-retreat-60525.herokuapp.com', { apiKey: apiKey, from: from, to: to, contents: contents });
	});
}
