/* Some shorthand. */
function value(el) {
	return document.querySelector(el).value || '';
}

function selectEl(el) {
	return document.querySelector(el);
}

/* function handleEvents() {
	document.getElementsByTagName("BUTTON").addEventListener("click", advanceFormStep());
	document.getElementsByClassName("previous").addEventListener("click", retreatFormStep());
	docmuent.
} */

function validateInput() {
	var els = document.getElementsByTagName("INPUT");
	var submitButton = document.querySelector(".submit-button");

	[].forEach.call(els, function (el) {
		el.addEventListener("input", function (event) {
			if (el.validity.valid) {
				submitButton.classList.remove("disabled");
				submitButton.classList.remove("shake");
				$(submitButton).prev().hide();
				el.classList.remove("error");
				$(el).nextAll().eq(1).hide();
			}
			if (!el.validity.valid) {
				submitButton.classList.add("disabled");
				submitButton.classList.add("shake");
				$(submitButton).prev().show();
				el.classList.add("error");
				$(el).nextAll().eq(1).show();
			}
		})
	});
}

function advanceFormStep() {
	var currentStep = document.querySelector('.form-step');
	var finding = true;

	while(finding) {
		if($(currentStep).css('display') == 'block') {
			$(currentStep).toggle();
			$(currentStep).next().toggle();
			break;	
		} else {
			currentStep = $(currentStep).next();
		}
	}
}

function retreatFormStep() {
	var currentStep = document.querySelector('.form-step');
	var finding = true;

	while(finding) {
		if($(currentStep).css('display') == 'block') {
			$(currentStep).toggle();
			$(currentStep).prev().toggle();
			break;	
		} else {
			currentStep = $(currentStep).next();
		}
	}
}

function handleZipResp(data) {
	// Check for error
	if (data.error_msg) {
		console.log(data.error_msg);
	} else {
		var zipList = data.zip_codes;

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
					htmlString = htmlString + '<' + math.round(zipList[1].distance) + ' mi.</li></ul>';
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

function searchForZip() {
	var clientKey = "js-0RdwQ3vrCaId1vH7GQzG7V0m5sqJdFLexZLn2gOFrxTt2AAIr9oz5oWaRnT52Fkz";
	
	var cache = {};
	var zipcode = value('#zip-search').substring(0, 5);
	if (zipcode.length == 5 && /^[0-9]+$/.test(zipcode)) {
		// Check cache
		var cacheKey = zipcode;
		if (cacheKey in cache) {
			handleZipResp(cache[cacheKey]);
		} else {
			var url = "https://www.zipcodeapi.com/rest/"+clientKey+"/radius.json/" + zipcode + "/15/miles";
			
			// Request from API
			$.ajax({
				"url": url,
				"dataType": "json"
			}).done(function(data) {
				handleZipResp(data);
				
				// Store in cache
				cache[cacheKey] = data;

			}).fail(function(data) {
				if (data.responseText && (json = $.parseJSON(data.responseText)))
				{
					// Store in cache
					cache[cacheKey] = json;
					
					// Check for error
					if (json.error_msg) {
						console.log(json.error_msg);
					}
				}
				else {
					console.log('Request failed.');
				}
			});
		}
	}
}

function handleSend() {

	var to = 'jeremiah@jeremiahlangner.com';
	var from = 'fifthofeight@yahoo.com';

	var contents = 'Name: ' + value('#full-name') + '\n' + 
		'Address 1: ' + value('#street-address') + '\n' + 
		'Address 2: ' + value('#street-address-2') + '\n' + 
		'City: ' + value('#city') + '\n' + 
		'State: ' + value('#state') + '\n' + 
		'Zip: ' + value('#zipcode') + '\n' + 
		'Phone Number: ' + value('#phone-number') + '\n' + 
		'Phone Type: ' + value('#phone-type') + '\n' + 
		'Email: ' + value('#email') + '\n' + 
		'Loan Amount Requested: ' + value('#loan-amount') + '\n' + 
		'Best Time to Contact: ' + value('#contact-time') + ' ' + value('#day-of-the-week') + '\n' + 
		'How did you hear about us?: ' + value('#reason') + '\n' + 
		'Additional Customer Comments: ' + value('#comments');

	$.post('https://dry-retreat-60525.herokuapp.com', { from: from, to: to, contents: contents })
		.done(function() {
			$('.modal-body').html("Success! Your results were successfully sent to your selected branch.")
		})
		.fail(function() {
			$('.modal-body').html("Sending your results failed. Try hitting the submit button again.");
		})
		.always(function() {
			setTimeout(function() {
				$('#thanks-modal').toggle();
				}, 3000);	
		});
	
}

function checkSend() {
	var form = document.getElementById("needs-validation");
	
	if (form.checkValidity() == false) {
		/*event.preventDefault();
		event.stopPropagation(); */
		var submitButton = document.querySelector(".submit-button");
		submitButton.classList.add("animated");
		submitButton.classList.add("shake");
	}
	
	if (form.checkValidity() == true) {
		$('#thanks-modal').modal('show');
		handleSend();
	}
}

// handleEvents();
(function() {
	validateInput();
})();

