function handleInput() {
	var firstName = $('#first-name').val();
	var lastName = $('#last-name').val();
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

	var contactEmail = $('contact-email').val();
	var apiKey = '';

	var newApplicant = 'First Name: ' + firstName + '\n' + 'Last Name: ' + lastName + '\n' + 'Address 1: ' + address + '\n' + 'Address 2: ' + addressTwo + '\n' + 'City: ' + city + '\n' + 'State: ' + state + '\n' + 'Zip: ' + zip + '\n' + 'Phone Number: ' + phoneNumber + '\n' + 'Phone Type: ' + phoneType + '\n' + 'Email: ' + email + '\n' + 'Loan Amount Requested: ' + loanAmount + '\n' + 'Best Time to Contact: ' + time + '\n' + 'How did you hear about us?: ' + reason + '\n' + 'Additional Customer Comments: ' + comments;

	$.post('https://dry-retreat-60525.herokuapp.com', { apiKey: apiKey, to: contactEmail, contents: newApplicant });
}