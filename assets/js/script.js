//Global Variables
const apiKey = "118087c4eee9cfc3b0ed1bace9c90b04";

//Script
//Adds an object of the city name and coordinates to local storage
function addCity(event) {
    //Prevents default of form submission
    event.preventDefault();
    //Pulls an array of city objects from local storage
    let storedCities = JSON.parse(localStorage.getItem("cities"));

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
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${inputCity}&appid=${apiKey}`)
        .then(response => {
            //Check that response came back good
            if (!response.ok) {
                alert("Could not find city, please try again");
                return;
            };

            return response.json();
        })
        .then(data => {
            //Checks that a city was found
            if (data.length === 0) {
                alert("Could not find city, please try again");
            };

            //Creates an object for the city
            let cityObject = {Name: data[0].name, Lat: data[0].lat, Lon: data[0].lon};

            //Checks if any cities are stored in local storage if no makes object first in the array
            if (!storedCities) {
                let firstCity = new Array(cityObject);
                localStorage.setItem("cities", JSON.stringify(firstCity));
            } else {
                //If there were saved cities, it adds the city object to the array and resaves
                storedCities.push(cityObject);
                localStorage.setItem("cities", JSON.stringify(storedCities));
            };

            //Runs function to make buttons
            populateCities();
        })
};

function populateCities() {

    let storedCities = JSON.parse(localStorage.getItem("cities"));

    //Clears all buttons from list
    var e = document.querySelector("nav");
    var child = e.lastElementChild; 
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    };

        // Loop to generate new list of buttons and display them on page
    if (storedCities) {
        for (let i=0; i < storedCities.length; i++) {
        const newBtn = document.createElement("button");
        let cityBtnName = storedCities[i].Name;
        //Sets the new button to have the text of the cities name
        newBtn.innerHTML = cityBtnName;
        //sets a data number to be used later when pulling weather
        newBtn.dataset.arrayNum = i;
        //Appends to page
        document.getElementById("cityBtns").appendChild(newBtn);
        };
    };
};

//Takes the array number from the button to search then display weather data
function displayWeather (event) {
    // Checks that a button in the nav was pressed and not the nav itself or another element
    let selectedBtn = event.target.closest('button');
    if (!selectedBtn) return;

    //Clears weather area
    var e = document.querySelector(".currentWeather");
    var child = e.lastElementChild; 
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    };

    // Looks up the array number saved as a data property in the element
    let cityNum = selectedBtn.dataset.arrayNum;
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    let cityInfo = storedCities[cityNum];

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityInfo.Lat}&lon=${cityInfo.Lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
        .then(response => {
            //Check that response came back good
            if (!response.ok) {
                alert("Could not find reach server, please try again");
                return;
            };

            return response.json();
        })
        .then(data => {
            //Checks that a city was found
            if (data.length === 0) {
                alert("Sorry, we could not find the weather for that city");
            };

            console.log(data);
            //Set city Name, Date, and Icon
            let cityNameCont = document.createElement("h2");
            cityNameCont.innerHTML = cityInfo.Name;
            document.querySelector(".currentWeather").appendChild(cityNameCont);
            //Set city temp
            let cityTemp = data.current.temp;
            let cityTempCont = document.createElement("p");
            cityTempCont.innerHTML = `Temp: ${cityTemp}°F`;
            document.querySelector(".currentWeather").appendChild(cityTempCont);
            //Set city wind
            let cityWind = data.current.wind_speed;
            let cityWindCont = document.createElement("p");
            cityWindCont.innerHTML = `Wind: ${cityWind} MPH`;
            document.querySelector(".currentWeather").appendChild(cityWindCont);
            //Set city humidity
            let cityHumidity = data.current.humidity;
            let cityHumidityCont = document.createElement("p");
            cityHumidityCont.innerHTML = `Humidity: ${cityHumidity}%`;
            document.querySelector(".currentWeather").appendChild(cityHumidityCont);
            // Set city UV index
            let cityUVI = data.current.uvi;
            let cityUVICont = document.createElement("p");
            cityUVICont.innerHTML = `UV Index: ${cityUVI}`;
            document.querySelector(".currentWeather").appendChild(cityUVICont);
        });
};

// Todo pull city from button clicks
// Todo pull API data from stored logitude and latitude
// Todo place on page

populateCities();

document.getElementById("searchBtn").addEventListener("click", addCity);
document.getElementById("cityBtns").onclick = displayWeather;