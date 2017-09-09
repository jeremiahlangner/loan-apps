
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

		var htmlString = '';
		
		// Build html for list.
		zipList.forEach(zipcode, function() {
			htmlString = htmlString + '<ul><li>' + zipcode.city +'</li><li>Zipcode: ' + zipcode.zip_code + '</li><li>Distance: ~' + zipcode.distance + '</li></ul>';
		});
		// Add list to page.
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