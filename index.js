let inputSearch = document.querySelector("#input_search");
let btnSearch = document.querySelector("#btn_search");   
let cityLocation = "yerevan";
let currentWeatherData;
let dailyForecastData;

btnSearch.addEventListener("click", onBtnSearch);

document.addEventListener("DOMContentLoaded", onDomLoad);

function onDomLoad() {
    getCityImageData(); 
    getCureentWeatherData();
    getDailyForecast();  
}



function onBtnSearch(event) {
    event.preventDefault();
    cityLocation = inputSearch.value;
    
    getCityImageData(); 
    getCureentWeatherData();
    getDailyForecast();  
}

//WEATHERBIT API
// using weatherbit api to get weather information
async function getCureentWeatherData() {
    //await the response of the fetch call
   
    try {
        let response = await fetch(`https://api.weatherbit.io/v2.0/current?city=${cityLocation}&units=m&key=d42a74cfefea45eeb830c45c2b0109fa`);
        console.log("dd", response);
        if (response.status !== 200) {
            throw new Error("Cant get Data from API")
        }
        //proceed once the first promise is resolved.
        let currentWeatherData = await response.json();
        //proceed only when the second promise is resolved
        showCurrentWeatherData(currentWeatherData.data[0]);
    } catch (err) {
        alert(err);
    }
    
}

function showCurrentWeatherData(currentWeatherData) {
    console.log(currentWeatherData,"hh");
    // get several info about weather conditions
    let cityImgWrapper = document.querySelector("#city_img");
    let cityName = currentWeatherData.city_name;
    let temperature = Math.ceil(currentWeatherData.temp);
    let currentTime = `${new Date().getHours()}:${new Date().getMinutes()}` ;
    let description = currentWeatherData.weather.description;
    let weatherIcon = currentWeatherData.weather.icon;
    let humidity = currentWeatherData.rh;
    let pressure = currentWeatherData.pres;
    let visibility = currentWeatherData.vis;
    let dewPoint = currentWeatherData.dewpt;
    let windSpeed = currentWeatherData.wind_spd;
    let windDir = currentWeatherData.wind_dir;
    let uvIndex = currentWeatherData.uv;
    let cloudCov = currentWeatherData.clouds;

    // create dom elements to show weather conditions on screen
    let hum = document.querySelector("#humidity");
    let pres = document.querySelector("#pressure");
    let vis = document.querySelector("#visibility");
    let dew_pnt = document.querySelector("#dew_point");
    let wind_spd = document.querySelector("#wind_speed");
    let wind_dir = document.querySelector("#wind_dir");
    let uv_idx = document.querySelector("#uv_index");
    let cloud_cov = document.querySelector("#cloud_cov");
    let weatherTitle = document.querySelector("#weather_title");
    let cityNameText = document.querySelector("#city_name_text");
    let currentTimeText = document.querySelector("#current_time_text");
    let tempText = document.querySelector("#temp_text");
    let weatherDesc = document.querySelector("#weather_desc");
    let mainWeatherIcon = document.querySelector("#main_weather_icon");
    let mainIcon = currentWeatherData.weather.icon;
    
    // save weather conditions in dom elements
    mainWeatherIcon.src = `img/icons/${mainIcon}.png`;
    cityNameText.innerHTML = cityName;
    currentTimeText.innerHTML = currentTime;
    tempText.innerHTML = temperature;
    weatherDesc.innerHTML = description;
    weatherTitle.innerHTML = cityName;
    hum.innerHTML = Math.round(humidity) + "%";
    pres.innerHTML = (pressure).toFixed(1) + " mb";
    vis.innerHTML = visibility + "km";
    dew_pnt.innerHTML = dewPoint + " &ordm";
    wind_spd.innerHTML = (windSpeed * 3.6).toFixed(1) + "km/h";
    wind_dir.innerHTML = windDir + " &ordm";
    uv_idx.innerHTML = Math.round(uvIndex) + " of 11";
    cloud_cov.innerHTML = cloudCov + "%";
}   


//WEATHERBIT API
// using weatherbit api to get weather information
async function getDailyForecast() {
    try {
        let response = await fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${cityLocation}&days=5&key=d42a74cfefea45eeb830c45c2b0109fa`);
        console.log(response,"aa");
        if (response.status !== 200) {
            throw new Error("Cant get data from API");
        }
        //proceed once the first promise is resolved.
        let dailyForecastData = await response.json();
    
        showDailyForecast(dailyForecastData.data);
    } catch (err) {
        alert(err);
    }
    
}

function showDailyForecast(data) {
    
    
    
    let totalDaysCount = 5;
    let totalConditionsCount = 5;
    let days = createDays();
    addConditionElementsOnEachDay(days);
    console.log(data,"bb")

    function createDays() {
        let days = [];
        for (let i = 0; i < totalDaysCount; i++) {
            days[i] = [];
        }

        return days;
    }

    function addConditionElementsOnEachDay(days) {
        for (let i = 0; i < days.length; i++) {
            
                days[i][0] = document.querySelector(`#daily_date${i+1}`);
                days[i][1] = document.querySelector(`#daily_hi${i+1}`);
                days[i][2] = document.querySelector(`#daily_low${i+1}`);
                days[i][3] = document.querySelector(`#daily_icon${i+1}`);
                days[i][4] = document.querySelector(`#daily_precip${i+1}`);
            
        }
    }

    for (let i = 0; i < 5; i++) {
        let tommorow = new Date();
        // creating tommorow date object to get next day on each iteration
        tommorow.setDate(tommorow.getDate() + i);
        // converting new Date object day of week to literal
        days[i][0].innerHTML = convertDayOfWeek(tommorow.getDay()) + " " + tommorow.getDate();
        days[i][1].innerHTML = data[i].max_temp + "&ordm";
        days[i][2].innerHTML = data[i].min_temp + "&ordm";
        days[i][3].src = `img/icons/${data[i].weather.icon}.png`;
        days[i][4].innerHTML = data[i].precip.toFixed(1) + "%";
    }
}

// async function getCurrentTime(city) {
//     // let currentTime = await fetch(`http://worldtimeapi.org/api/timezone/${city}`)
//     let currentTime = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?${city}`)
//     console.log(currentTime);
// }

function convertDayOfWeek(day) {
    switch(day) {
        case 0: return "SUN"
        case 1: return "MON"
        case 2: return "TUE"
        case 3: return "WED"
        case 4: return "THU"
        case 5: return "FRI"
        case 6: return "SAT"
    }
}

let cityText = document.querySelector("#city_text");

function showCityImage(data) {
    let cityImgWrapper = document.querySelector("#city_img");
    let firstImageData = data.photos.photo[0];
    let id = firstImageData.id;
    let serverId = firstImageData.server;
    let secret = firstImageData.secret;
    let cityImgLink = `https://live.staticflickr.com/${serverId}/${id}_${secret}_c.jpg` 
    cityImgWrapper.classList.add("my-93vh");
    cityImgWrapper.style.background = `no-repeat center / cover url("${cityImgLink}")`;
}

// FLICKR API
// using flickr api to get image for each city we search
async function getCityImageData() {
    try {
        let response = await fetch(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=19578a72dc30089c99f3978ea76db611&sort=relevance&text=${cityLocation} city view&format=json&nojsoncallback=1`);
        if (response.status !== 200) {
            throw new Error("cant get image from Flickr API");
        }
        //proceed once the first promise is resolved.
        let cityImageData = await response.json()

        showCityImage(cityImageData);
    } catch(err) {
        alert(err);
    }
    
}	

