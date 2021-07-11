// Initialize global variables and constants
const DIGITS = ['1', '2', '3', '4', '5', '6','7','8', '9', '0']; // array with numbers
const FEDERAL_TAX_RATE = [  // rate for federal taxes calculating
    [10, 0],
    [12, 9875],
    [22, 40125],
    [24, 85525],
    [32, 163300],
    [35, 207350],
    [37, 518400]
];
const STATE_TAX_RATE = [  // rate for state taxes calculating
    [3.54, 0],
    [4.65, 11970],
    [6.27, 23930],
    [7.65, 263480]
];
const SSN_TAX_RATE = [  // rate for ssn taxes calculating
    [6.2, 0],
    [0, 137700]
];
const MEDICARE_TAX_RATE = [  // rate for medicare taxes calculating
    [1.45, 0],
    [2.35, 200000]
];
let card = document.getElementById('card');  // variable for holding element of card block
let salary = document.getElementById('gross-salary');   // variable for holding element of input

salary.focus();  // Focusing on input on page load

inputMask(salary);  // Run function with mask of input, that accept digits only

salary.onkeydown = function(e) { // Run function which shows table with taxes on enter key down
   if (e.keyCode == 13) {
       e.preventDefault();
       showTaxes();
   }
};

// Method which runs createTable method, then runs  calculateTaxes method and inserts result into the table
function showTaxes() {
    let table = createTable();
    let taxes = calculateTaxes(+salary.value);
    taxes.forEach((taxesData) => {
        insertRowIntoTable(table, taxesData);
    });
    card.appendChild(table);
    salary.focus();
}

// Method which creates an HTML element of table whith classes and id attribute and returns it
function createTable() {
    deleteElementByIdIfExists("taxesTable");
    let table = document.createElement('table');
    table.classList.add("table", "table-bordered", "taxesTable");
    table.setAttribute("id", "taxesTable");
    return table;
}

// Method which receives table and data and insers data into the table
function insertRowIntoTable(table, data) {
    table.innerHTML += '<tr><th>' + data[0] + '</th><td>' + data[1] + '</td></tr>';
}

// Method which calculates all taxes using constants end returns array of taxes data
function calculateTaxes(grossSalary) {
    let taxesData = [];
    let grossPay = grossSalary;
    let federalTaxes = getTaxes(grossSalary, FEDERAL_TAX_RATE);
    let stateTaxes = getTaxes(grossSalary, STATE_TAX_RATE);
    let medicareTaxes = getTaxes(grossSalary, MEDICARE_TAX_RATE);
    let ssnTaxes = getTaxes(grossSalary, SSN_TAX_RATE);
    let totalTaxes = federalTaxes + stateTaxes + ssnTaxes;
    let totalTaxesPercent = grossPay > 0 ? totalTaxes * 100 / grossPay : 0;
    let netPay = grossPay - totalTaxes;
    taxesData.push(['Gross Pay', '$' + numberWithSpaces(grossPay)]);
    taxesData.push(['Federal Taxes', '$' + numberWithSpaces(federalTaxes)]);
    taxesData.push(['State Taxes', '$' + numberWithSpaces(stateTaxes)]);
    taxesData.push(['Medicare Taxes', '$' + numberWithSpaces(medicareTaxes)]);
    taxesData.push(['SSN Taxes', '$' + numberWithSpaces(ssnTaxes)]);
    taxesData.push(['Total Taxes, $', '$' + numberWithSpaces(totalTaxes)]);
    taxesData.push(['Total Taxes, %', totalTaxesPercent.toFixed(2) + '%']);
    taxesData.push(['Net Pay', '$' + numberWithSpaces(netPay)]);
    return taxesData;
}

// Method that converts the output of a number to a currency format: 9 999 999.99
function numberWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    parts[1] = parts[1] ? parts[1].substring(0, 2) : '00';
    return parts.join(".");
}

// Method that recievs gross salary value of input and constant of appropriate taxes rate and returns result
// of taxes calculation
function getTaxes(grossSalary, rate) {
    let taxes = 0;
    if (grossSalary > 0) {
        for (var i = 0; i < rate.length; i++) {
            if (grossSalary >= rate[i][1]) {
                taxes += ((i + 1 in rate && grossSalary >= rate[i+1][1] ?
                    rate[i+1][1] : grossSalary) - rate[i][1]) *
                    rate[i][0] / 100;
            } else {
                break;
            }
        }
    } else {
        axes = 0;
    }
    return taxes;
}

// Method which takes input element, adds eventListener to it, and excluds any other symbols except numbers
function inputMask(input) {
    input.addEventListener('input', event => {
        event.preventDefault();
        let inputString = event.target.value;
        if (inputString.length > 0) {
            let lastChar = inputString[inputString.length - 1];
            if (!DIGITS.includes(lastChar)) {
                let acceptableString = inputString.substring(0, inputString.length - 1);
                input.value = acceptableString;
            }
        } else {
            deleteElementByIdIfExists("taxesTable");
        }
    });
}

// Method that delete HTML element by its id if it exists on the page
function deleteElementByIdIfExists(id) {
    let el = document.getElementById(id);
    if(el != null) {
        el.parentNode.removeChild(el);
    }
}
