(function() { 

  /* Some shorthand.*/
  function value(el) {
      return document.querySelector(el).value || '';
  }

  function is_all_ws( nod )
  {
    return !(/[^\t\n\r ]/.test(nod.textContent));
  }

  function is_ignorable( nod ) {
    return ( nod.nodeType == 8) || // A comment node
           ( (nod.nodeType == 3) && is_all_ws(nod) ); // a text node, all ws
  }

  function previousElementSibling(el) {
    while ((el = el.previousSibling)) {
      if (!is_ignorable(el)) return el;
    }
    return null;
  }

  function skipSib(el, i) {
    var targetEl = el.nextElementSibling;
    for(var j=1; j <= i; j++) {
      targetEl = targetEl.nextElementSibling;
      if(j == i) {
        return targetEl;
      }
    }
    return null;
  }

  function handleEvents() {
    var buttons = document.getElementsByTagName("BUTTON");
    [].forEach.call(buttons, function(button) {
      var action = button.getAttribute('data-action');
      button.addEventListener("click", app[action]);
    });
  }

  function validateInput() {
    var els = document.getElementsByTagName("INPUT");
    var submitButton = document.querySelector(".submit-button");

    [].forEach.call(els, function (el) {
      el.addEventListener("input", function (event) {
        if (el.validity.valid) {
          submitButton.classList.remove("disabled", "shake");
          previousElementSibling(submitButton).style.display = "none";
          el.classList.remove("error");
          skipSib(el, 1).style.display = "none";
        } else if (!el.validity.valid) {
          submitButton.classList.add("disabled", "shake");
          previousElementSibling(submitButton).style.display = "block";
          el.classList.add("error");
          skipSib(el, 1).style.display = "block";
        }
      });
    });
  }

  function advanceFormStep() {
    var currentStep = document.querySelector('.form-step');
    var finding = true;

    while(finding) {
      if(currentStep.style.display !== "none") {
        currentStep.style.display = "none";
        currentStep.nextElementSibling.style.display = "inline";
        break;    
      } else {
        currentStep = currentStep.nextElementSibling;
      }
    }
  }

  function retreatFormStep() {
    var currentStep = document.querySelector('.form-step');
    var finding = true;

    while(finding) {
      if(currentStep.style.display !== "none") {
        currentStep.style.display = "none";
        previousElementSibling(currentStep).style.display = "inline";
        break;  
      } else {
        currentStep = currentStep.nextElementSibling;
      }
    }
  }

  function handleZipResp(data) {
    // Check for error
    if (data.error_msg) {
      console.log(data.error_msg);
    } else {
      var queryZip = {};
      var zipList = data.zip_codes;
      var output = '';
      
      zipList.forEach(function(zipcode) {
        if(zipcode.distance == '0') {
            queryZip = zipcode;
        }
      });

      // sort the zipcode list from closest to furthest
      zipList.sort(function(a, b) {
        return parseFloat(a.distance) - parseFloat(b.distance);
      });

      // Build html for list.
      zipList.slice(0, 6).forEach(function(zipcode) {

        if(zipcode.state == queryZip.state) {
          output = output + 
            '<ul style="list-style-type:none; padding-left: 0;"><li>' + 
            zipcode.city + ', ' + zipcode.state + 
            '</li><li>Zipcode: ' + zipcode.zip_code + 
            '</li><li>Distance: ';
          
          if (zipcode.distance == '0') {
            output = output + '<' + Math.round(zipList[1].distance) + ' mi.</li></ul>';
          } else {
            output = output + '~' + zipcode.distance.toFixed(1) + ' mi.</li></ul>';
          }   
        
        }
      });

      document.querySelector('#zipcode-info').innerHTML = output;
      document.querySelector('.location-header').style.display = "block";
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
          
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            cache[cacheKey] = data;
            handleZipResp(data);
          } else {
            console.log(xhr.status);
            cache[cacheKey] = json;
          }
        };
        xhr.send();
      }
    }
  }

  function requestPost(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log("Successfully sent post request.")
      }
      else {
        console.log(xhr.status);
      }
    }
    xhr.send(JSON.stringify(data));
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

    requestPost('https://dry-retreat-60525.herokuapp.com', { from: from, to: to, contents: contents });
  }

  function checkSend() {
    var form = document.getElementById("needs-validation");
    
    if (form.checkValidity() === false) {
      /*event.preventDefault();
      event.stopPropagation(); */
      var submitButton = document.querySelector('.submit-button');
      submitButton.classList.add("animated");
      submitButton.classList.add("shake");
    }
    
    if (form.checkValidity() === true) {
      // $('#thanks-modal').modal('show');
      handleSend();
    }
  }

  // namespace variable
  var app = {
    searchForZip: searchForZip,
    advanceFormStep: advanceFormStep,
    retreatFormStep: retreatFormStep,
    checkSend: checkSend
  };

  handleEvents();
  validateInput();
})();
