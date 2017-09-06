    //********************************************************************************//
    //* Name : Eunsol Lee                                                            *//
    //* zenit login : int222_161e10                                                  *//
    //********************************************************************************//
    //********************************************************************************//
    //*   Do not modify any statements in detailPaymentCalculation function          *//
    //********************************************************************************//

function detailPaymentCalculation(mortAmount,mortDownPayment,mortRate,mortAmortization) {

    //********************************************************************************//
    //*   This function calculates the monthly payment based on the following:       *//
    //*                                                                              *//
    //*               M = P [ i(1 + i)n ] / [ (1 +  i)n - 1]                         *//
    //*                                                                              *//
    //*   Note: This function also updates the payment amount on the form            *//
    //********************************************************************************//
     var paymentError = "";
     var v = mortAmount * 1;
     var d = mortDownPayment * 1;
     var i = mortRate * 1;
     var y = mortAmortization * 1;
     var a = v - d;
         i = i/100/12;
         n = y * 12;
     var f = Math.pow((1+i),n);

     var p = (a * ((i*f)/(f-1))).toFixed(2);

     if (p=="NaN" || p=="Infinity") {
         document.forms[0].payment.value = "";
     }
     else {
           document.forms[0].payment.value = p;
     }

} // End of detailPaymentCalculation function


function calculatePayment() {   

    //********************************************************************************//
    //*   You will need to call the functions that validate the following:           *//
    //********************************************************************************//
    //*        (1)              (2)              (3)             (4)                 *//
    //********************************************************************************//
    //*   Property value  -  Down payment  -  Interest rate -  Amortization          *//
    //********************************************************************************//
    //*   If there are no errors, then call                                          *//
    //*                                                                              *//
    //*      detailPaymentCalculation(...., ......, ......, ......);                 *//
    //*                                                                              *//
    //*   and make sure to pass the four values in the order shown above.            *//
    //*                                                                              *//
    //********************************************************************************//
    //*   If there are errors, present the client the following message in the       *//
    //*   reserved area on the form:                                                 *//
    //*                                                                              *//
    //*   Please complete the form first and then click on Calculate Monthly Payment *//
    //*                                                                              *//
    //********************************************************************************//
	
	var msg = "";
	msg = validProp(msg);
	msg = validDown(msg);	
	msg = validIntRate(msg);	
	msg = validAmortization(msg);
	var mortAmount = document.mortgage.propValue.value;	
	var mortDownPayment = document.mortgage.downPay.value;
	var mortRate = document.mortgage.intRate.value;
	var mortAmortization = document.mortgage.amortization.value;	

	if(msg !== ""){
		document.getElementById("errors").innerHTML = "<p>Please complete the form first and then click on Calculate Monthly Payment</p>";
	} else {	
		detailPaymentCalculation(mortAmount,mortDownPayment,mortRate,mortAmortization);
	}

} // End of calculatePayment function

function formValidation() {

    //***************************************************************************************//
    //*                                                                                     *//
    //* This function calls the different functions to validate all required fields         *//
    //*                                                                                     *//
    //* Once you have called and validated all field, determine if any error(s)             *//
    //*  have been encountered                                                              *//
    //*                                                                                     *//
    //* If any of the required fields are in error:                                         *//
    //*                                                                                     *//
    //*    present the client with a list of all the errors in reserved area                *//
    //*         on the form and                                                             *//
    //*          don't submit the form to the CGI program in order to allow the             *//
    //*          client to correct the fields in error                                      *//
    //*                                                                                     *//
    //*    Error messages should be meaningful and reflect the exact error condition.       *//
    //*                                                                                     *//
    //*    Make sure to return false                                                        *//
    //*                                                                                     *//
    //* Otherwise (if there are no errors)                                                  *//
    //*                                                                                     *//
    //*    Recalculate the monthly payment by calling                                       *//
    //*      detailPaymentCalculation(mortAmount,mortDownPayment,mortRate,mortAmortization) *//
    //*                                                                                     *//
    //*    Change the 1st. character in the field called client to upper case               *//
    //*                                                                                     *//
    //*    Change the initial value in the field called jsActive from N to Y                *//
    //*                                                                                     *//
    //*    Make sure to return true in order for the form to be submitted to the CGI        *//
    //*                                                                                     *//
    //***************************************************************************************//

	var errMsg = "";
	errMsg = validUserID(errMsg);
	errMsg = validClient(errMsg);
	errMsg = validProp(errMsg);
	errMsg = validDown(errMsg);
	errMsg = validLocation(errMsg);
	errMsg = validIncome(errMsg);
	errMsg = validProperties(errMsg);
	errMsg = validYear(errMsg);
	errMsg = validMonth(errMsg);
	errMsg = validIntRate(errMsg);
	errMsg = validAmortization(errMsg);
	
	if(errMsg !== ""){
		showErrors(errMsg);
		return false;		
	} else {	
		// Recalculate the monthly payment
		calculatePayment();
		// Change the first character in the field called client to upper case	
		document.mortgage.client.value = document.mortgage.client.value[0].toUpperCase() + document.mortgage.client.value.substring(1);
		// Change the initial value in the field called jsActive from N to Y
		document.mortgage.jsActive.value = "Y";
		// no errors - return to the browser and submit form
		return true;
	}
} // End of completeFormValidation

function showErrors(msg){
	msg += "";
	document.getElementById("errors").innerHTML = msg;
} // End of showErrors

function validUserID(errMsg){
	var user = document.mortgage.userId.value;	
	var c = 0;
	
	if(user.length != 10){
		errMsg += "<p>Client ID All 10 positions must be present.</p>";
	} else {
		for(var i = 0; i < 4; i++){
			if(isNaN(user[i])){
				c++;
			}		
		}
		if(c > 0){
			errMsg += "<p>Client ID Position 1 to 4 must be mumeric digits</p>";
		} else {
			for(var i = 5; i < 10 ; i++){
				if(isNaN(user[i])){
					c++;
				}
			}
			if(c > 0){
				errMsg += "<p>Client ID Position 5 to10 must be mumeric digits</p>";
			} else {
				if(user[4] != "-"){
					errMsg += "<p>Client ID Position 5 must be a hyphen (-)</p>";
				} 
			}				
		}								
	}		
	
	// only be checked if above rules have passed
	if(errMsg === ""){
		var lsum = 0, rsum = 0;
		for(var i = 0; i < 4; i++){ 
			lsum += parseInt(user[i]);
		}		
		if(lsum <= 0){
			errMsg += "<p>Client ID The sum of the first 4 numbers must be greater than 0<p>";
		} else {
			for(var i = 5; i < 10; i++){ 
				rsum += parseInt(user[i]);
			}		
			if(rsum <= 0){
				errMsg += "<p>Client ID The sum of the last 5 numbers must be greater than 0</p>";
			} else {
				if(rsum !== (lsum * 2) + 2) {
					errMsg += "<p>Client ID The sum of the last 5 numbers must be the double plus 2 the sume of the first 4 numbers</p>";
				}				
			}	
		}		
	}			
	return errMsg;
} // End of validUserID

function validClient(errMsg){
	var name = document.mortgage.client.value;
	var c1 = 0, c2 = 0, c3 = 0;	

	if(name.length == 0 ){
		errMsg += "<p>Client name must be present</p>";
	} else if(name[0] === "'"){
		errMsg += "<p>Client name can't start with an apostrophe(') </p>";		
	} else {
		for(var i = 0; i < name.length; i++){
			if((name.charCodeAt(i) < 65) || (name.charCodeAt(i) > 90) && (name.charCodeAt(i) < 97) || (name.charCodeAt(i) > 122)){
					c3++;
			}
			if(name.charCodeAt(i) == 39){
				c3--;
				c2++;
			}
		}		
		if(c3 > 0){
			errMsg += "<p>Client name must be alphabetic characters [a-z][A-Z].</p>"
		} else {
			if(c2 > 1){
				errMsg += "<p>Client name only can have 1 apostrophe.</p>"
			} else {
				for(var i = 0; i < 3; i++){
					if((name.charCodeAt(i) < 65) || (name.charCodeAt(i) > 90) && (name.charCodeAt(i) < 97) || (name.charCodeAt(i) > 122)){
						c1++;
					}	
				}
				if(c1 > 0){
					return errMsg += "<p>Client name must have at least 3 alphabetic characters [a-z][A-Z] at the beginning of the field.</p>"
				} else 	if(name[name.length - 1] === "'"){
					errMsg += "<p>Client name can't end with an apostrophe(') </p>";	
				}
			}
		}
	}		
	
	return errMsg;	
}// End of validClient

function validProp(errMsg){
	var prop = document.mortgage.propValue.value;
	var c = 0;
	
	if(prop.length == 0){
		errMsg += "<p>Property Value must be present</p>";
	} else {
		if(isNaN(prop)){
			errMsg += "<p>Property Value must be numeric</p>";
		} else if(parseInt(prop) <= 0){
			errMsg += "<p>Property Value must be a positive</p>";
        } else {
			for(var i = 0; i < prop.length; i++){
				if(prop[i] == "."){
					c++;
                }
            }
            if(c > 0){
				errMsg += "<p>Property Value must be a whole number</p>";
            } 
            var dp = document.mortgage.downPay.value;
            if(dp.length == 0){
				errMsg += "<p>Please provide the value for the down payment first.</p>";
            } else if(prop <= dp + 65000){
				errMsg += "<p>Property Value should be $65,000 more than the down payment</p>";
            }
		}	
	}	
	return errMsg;
}

function validDown(errMsg){
	var down = document.mortgage.downPay.value;
	var c = 0;
	
	if(down.length == 0){
		errMsg += "<p>Down Payment must be present</p>";
	} else {
		if(isNaN(down)){
			errMsg += "<p>Down Payment must be numeric</p>";
		} else if(parseInt(down) <= 0){
            errMsg += "<p>Down Payment  must be a positive</p>";
        } else {
			for(var i = 0; i < down.length; i++){
				if(down[i] == "."){
					c++;
                }
            }
            if(c > 0){
                errMsg +=  errMsg += "<p>Down Payment must be a whole number/<p>";
            } 
            var pv = document.mortgage.propValue.value;
            if(pv.length == 0){
				errMsg += "<p>Please provide the Property Value first</p>";
            } else if(down < pv * 0.2){
                errMsg += "<p>Down Payment should be at least 20% of the value of the property Value</p>";
            }
		}
	}
	return errMsg;
}

function validLocation(errMsg){
	if(document.mortgage.propLocation.selectedIndex == -1){
		errMsg += "<p>Location must be selected</p>";
	} 
	return errMsg;
}

function validIncome(errMsg){
	if(document.mortgage.income.selectedIndex == -1){
		errMsg += "<p>Income must be selected</p>";
	} 
	return errMsg;	
}

function validProperties(errMsg){
	var detail = document.mortgage.propDetails;
	var count = 0;
	for(var i = 0; i < detail.length; i++){
		if(detail[i].checked === true){
			count++;
		}
	}	
	if(count < 1){
		errMsg += "<p>Property Type must be selected</p>";
	} 
	return errMsg;	
}

function validYear(errMsg){
	var year = document.mortgage.mortYear.value;
	var y = Number(year);
	var currentYear = (new Date()).getFullYear();

	if(year.length == 0 ){
		errMsg += "<p>Mortgage Year must be present.</p>";
	} else {
		if (isNaN(year)){
			errMsg += "<p>Mortgage Year must be numeric.</p>";
		} else if(currentYear != y && y != currentYear + 1){
			errMsg += "<p>Mortgage Year must be equal to current year or 1 year greater than current year.</p>";
		} 
	}
	return errMsg;	
}

function validMonth(errMsg){
	var month = document.mortgage.mortMonth.value;
	var m = Number(month);
	var currentMonth = (new Date()).getMonth() + 1;

	if(month.length == 0 ){
		errMsg += "<p>Mortgage Month must be present.</p>";
	} else {
		if (isNaN(month)){
			errMsg += "<p>Mortgage Month must be numeric.</p>";
		} else if(m < 1 || m > 12){
			errMsg += "<p>Mortgage Month must be between 1 to 12.</p>";
		} else if(currentMonth != m && m != currentMonth + 1){
			errMsg += "<p>Mortgage Month must be equal to current month or 1 month greater than current month.</p>";
		} 
	}
	return errMsg;		
}

function validIntRate(errMsg){
	var intRate = document.mortgage.intRate.value;
	var i = Number(intRate);

	if(intRate.length == 0 ){
		errMsg += "<p>Interest Rate must be present.</p>";
	} else {
		if (isNaN(intRate)){
			errMsg += "<p>Interest Rate must be numeric.</p>";
		} else if(i < 3 || i > 16 && i < 3000 || i > 16000){
			errMsg += "<p>Interest Rate must be between 3,000 to 16,000.</p>";
		} 
	}
	return errMsg;	
	
}

function validAmortization(errMsg){
	var am = document.mortgage.amortization.value;
	var a = Number(am);

	if(am.length == 0){
		errMsg += "<p>Amortization must be present.</p>";
	} else {
		if (isNaN(am)){
			errMsg += "<p>Amortization must be numeric.</p>";
		} else if(a < 5 || a > 20){
			errMsg += "<p>Mortgage Month must be between 1 to 12.</p>";
		} 
	}
	return errMsg;		
}


