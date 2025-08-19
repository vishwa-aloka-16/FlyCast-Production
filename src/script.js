const dep = document.getElementById('from');
const arr = document.getElementById('to');
const airline = document.getElementById('airline');
const date = document.getElementById('date');
const time = document.getElementById('time');
const airports = document.getElementById('airports');
const weather = document.getElementById('weather');
const nas = document.getElementById('nas');
const contBtn = document.getElementById('continue');

// ticket elements
const depTicket = document.getElementById('depTicket');
const arrTicket = document.getElementById('arrTicket');
const airlineTicket = document.getElementById('airlineTicket');
const depFullTicket = document.getElementById('depFullTicket');
const arrFullTicket = document.getElementById('arrFullTicket');
const dateTicket = document.getElementById('dateTicket');
const timeTicket = document.getElementById('timeTicket');
const imgTicket = document.getElementById('imgTicket');
const ticketBtn = document.getElementById('ticketBtn');

// Function to update the airline image based on selected airline
function updateAirlineImage() {
    const airlineData = [
        {name: "United Air Lines Inc.", logo: "https://logo.clearbit.com/united.com"},
        {name: "Delta Air Lines Inc.", logo: "https://logo.clearbit.com/delta.com"},
        {name: "Spirit Air Lines", logo: "https://logo.clearbit.com/spirit.com"},
        {name: "Southwest Airlines Co.", logo: "https://logo.clearbit.com/southwest.com"},
        {name: "American Airlines Inc.", logo: "https://logo.clearbit.com/aa.com"},
        {name: "Republic Airline", logo: "https://logo.clearbit.com/rjet.com"},
        {name: "Alaska Airlines Inc.", logo: "https://logo.clearbit.com/alaskaair.com"},
        {name: "JetBlue Airways", logo: "https://logo.clearbit.com/jetblue.com"},
        {name: "PSA Airlines Inc.", logo: "https://logo.clearbit.com/psaairlines.com"},
        {name: "Allegiant Air", logo: "https://logo.clearbit.com/allegiantair.com"},
        {name: "ExpressJet Airlines LLC d/b/a aha!", logo: "https://logo.clearbit.com/aha-air.com"},
        {name: "SkyWest Airlines Inc.", logo: "https://logo.clearbit.com/skywest.com"},
        {name: "Endeavor Air Inc.", logo: "https://logo.clearbit.com/endeavorair.com"},
        {name: "Envoy Air", logo: "https://logo.clearbit.com/envoyair.com"},
        {name: "Frontier Airlines Inc.", logo: "https://logo.clearbit.com/flyfrontier.com"},
        {name: "Mesa Airlines Inc.", logo: "https://logo.clearbit.com/mesa-air.com"},
        {name: "Horizon Air", logo: "https://logo.clearbit.com/horizonair.com"},
        {name: "Hawaiian Airlines Inc.", logo: "https://logo.clearbit.com/hawaiianairlines.com"}
        ];
    const selectedAirline = airline.value;
    const airlineInfo = airlineData.find(a => a.name === selectedAirline);
    if (airlineInfo) {
        imgTicket.src = airlineInfo.logo;
        imgTicket.alt = airlineInfo.name;
    } 
    else {
        imgTicket.src = "./airline.png"; // Default image if no match found
        imgTicket.alt = "Airline Logo";
    }
}

// Function to update ticket information
function updateTicketInfo() {
    depTicket.textContent = dep.value.split('-')[0];
    arrTicket.textContent = arr.value.split('-')[0];
    airlineTicket.textContent = airline.value;
    depFullTicket.textContent = dep.value.split('-')[1];
    arrFullTicket.textContent = arr.value.split('-')[1];
    dateTicket.textContent = date.value;
    timeTicket.textContent = time.value;
}


// Prepare data to send to API 
function prepareData() {
    const selectedDate = new Date(date.value);
    
    const data = {
        dep: dep.value,
        arr: arr.value,
        AIRLINE: airline.value,
        MONTH: parseInt(date.value.split('-')[1]),    // extract month as int
        DAY_OF_WEEK: selectedDate.getDay(), // get day of the week (0-6, where 0 is Sunday)
        DEP_HOUR: parseInt(time.value.split(':')[0]), // extract hour from time

        // Checkboxes
        DELAY_DUE_WEATHER: weather.checked ? 1 : 0,
        DELAY_DUE_NAS: nas.checked ? 1 : 0,

        // Always fixed values
        DELAY_DUE_CARRIER: 0,
    };
    return data;
}

const probability = document.getElementById('probability');
const parentage = document.getElementById('parentage');
const chanceL = document.getElementById('chanceOfDelayL');
const chanceS = document.getElementById('chanceOfDelayS');
const chanceDiv = document.getElementById('chanceDiv');

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const data = prepareData();
    console.log("Form submitted with data:", data);

    fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Update the prediction elements with the response data
        probability.textContent = data.delay_probability;
        parentage.textContent = `${(data.delay_probability * 100)}%`;
        if (data.delay_probability > 0.5) {
            chanceS.textContent = "There is a high Chance that your flight will be delayed";
            chanceL.textContent = "HIGH";
            chanceDiv.style.color = "#670000"; // Change background color for high chance
            chanceDiv.style.border = "#5px solid #670000"; // Change background color for high chance
            chanceDiv.style.animation = "blinkRed 1s infinite ease-out"; // Change background color for high chance

        }else if (data.delay_probability > 0.4) {
            chanceS.textContent = "There is a Medium Chance that your flight will be delayed";
            chanceL.textContent = "MEDIUM";
            chanceDiv.style.color = "#ffd500"; // Change background color for high chance
            chanceDiv.style.border = "#5px solid #ffd500"; // Change background color for high chance
            chanceDiv.style.animation = "blinkYellow 1s infinite ease-out"; // Change background color for high chance

        } else {
            chanceS.textContent = "There is a Low Chance that your flight will be delayed";
            chanceL.textContent = "LOW";
            chanceDiv.style.color = "#007e0b"; // Change background color for high chance
            chanceDiv.style.border = "#5px solid #007e0b"; // Change background color for high chance
            chanceDiv.style.animation = "blinkGreen 1s infinite ease-out"; // Change background color for high chance
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



contBtn.addEventListener('click', (e) => {
    e.preventDefault();
    updateTicketInfo();
    updateAirlineImage();
    handleSubmit(e);

    

} );