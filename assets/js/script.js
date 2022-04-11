//Global Variables
const apiKey = "118087c4eee9cfc3b0ed1bace9c90b04"

//Script
//Adds an object of the city name and coordinates to local storage
function addCity(event) {
    //Prevents default of form submission
    event.preventDefault();
    //Pulls an array of city objects from local storage
    let storedCities = new Array (JSON.parse(localStorage.getItem("cities")));

    //Pull seached city from input and does a null check
    var inputField = document.getElementById("citySearch");
    var inputCity = inputField.value.trim();

    if (!inputCity) {
        window.alert("Please enter a city to begin");
        return;
    };

    //Reset input to blank
    inputField.value = "";

    //Uses city name for API geocoding
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputCity}&appid=${apiKey}`)
        .then(response => {
            //Check that response came back good
            if (!response.ok) {
                alert("Could not find city, please try again");
                return;
            }

            return response.json();
        })
        .then(data => {
            //Checks that a city was found
            if (data.length === 0) {
                alert("Could not find city, please try again");
            };

            //Creates an object for the city
            let cityObject = { Name: data[0].name, Lat: data[0].lat, Lon: data[0].lon};

            //Checks if any cities are stored in local storage if no makes object first in the array
            if (!storedCities[0]) {
                localStorage.setItem("cities", JSON.stringify(cityObject));
            } else {
                //If there were saved cities, it adds the city object to the array and resaves
                storedCities.push(cityObject);
                localStorage.setItem("cities", JSON.stringify(storedCities));
            };

            //Runs function to make buttons
            populateCities();
        })
}

function populateCities() {

    const myNode = document.getElementById("cityBtns");

    myNode.replaceChildren();
}

//TODO Clear all buttons of saved cities
//TODO Populate city buttons
document.getElementById("searchBtn").addEventListener("click", addCity)