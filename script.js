const cityNameEl = document.getElementById('enter-city');
const button = document.getElementById('search-button');
const weatherFormEl = document.querySelector('#weather-form');
const todayweatherEl = document.querySelector('#today-weather');
const cityName = document.querySelector('#city-name');
const currentPicEl = document.querySelector('#current-pic');
const currentTemp = document.querySelector('#temperature');
const currentHumidity = document.querySelector('#humidity');
const currentWind = document.querySelector('#wind-speed');
const fivedayEl = document.querySelector('#fiveday-header');
const clearEl = document.getElementById('clear-history');
const historyEl = document.getElementById('history');
let searchHistory = JSON.parse(localStorage.getItem('search')) || [];


let formSubmitHandler = function(event) {
    console.log(event);
    event.preventDefault();

    

    const cityName = cityNameEl.value.trim();

    if(cityName){
        getApi(cityName)
    }
}

function convertToF(kelvin){
    return Math.floor((kelvin - 273.15) * 1.8) + 32;
}

    function getApi(city){
        let requestUrl ="https://api.openweathermap.org/data/2.5/weather?q=" + city + '&appid=d42360dd80194eb3d86e1aac7890342a';

        fetch(requestUrl)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                console.log(data);

                
                let cityID = data.id
                let fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=d42360dd80194eb3d86e1aac7890342a";
                fetch(fiveDayUrl)
                .then(function(response){
                    return response.json()
                })
                .then(function(fiveDay){
                    console.log(data);
                    console.log('five', fiveDay)

                let today = new Date()
                let date = today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear();
                console.log(date);
                let weatherPic = data.weather[0].icon;

                todayweatherEl.classList.remove("d-none");
                cityName.innerHTML = data.name + ' ' + date;
                currentPicEl.setAttribute('src', "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png")
                currentTemp.innerHTML = 'Temperature: ' + convertToF(data.main.temp) + ' °F';
                currentHumidity.innerHTML = 'Humidity: ' + data.main.humidity + '%';
                currentWind.innerHTML = 'Wind Speed: ' + data.wind.speed + ' MPH';

                fivedayEl.classList.remove('d-none');

                const forecastEl = document.querySelectorAll('.forecast');
                //5 day forecast date
                for(i=0; i<forecastEl.length; i++){
                    forecastEl[i].innerHTML = '';
                    const forecastIndex = i + 8 + 4;
                    console.log(forecastIndex);
                    const forecastDate = new Date(fiveDay.list[forecastIndex].dt * 1000);
                    const forecastDay = forecastDate.getDate();
                    const forecastMonth = forecastDate.getMonth();
                    const forecastYear = forecastDate.getFullYear();
                    const forecastDateEl = document.createElement('p');
                    forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                    forecastDateEl.innerHTML = (forecastMonth + '/' + forecastDay + '/' + forecastYear);
                    forecastEl[i].append(forecastDateEl);
                    console.log('fiveDay', fiveDay);

                    // 5 day current weather
                    const fiveDayWeatherEl = document.createElement('img');
                    fiveDayWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + fiveDay.list[forecastIndex].weather[0].icon + "@2x.png");
                    fiveDayWeatherEl.setAttribute('alt', fiveDay.list[forecastIndex].weather[0].description);
                    forecastEl[i].append(fiveDayWeatherEl);
                    const fiveDayTempEl = document.createElement('p');
                    fiveDayTempEl.innerHTML = 'Temp: ' + convertToF(fiveDay.list[forecastIndex].main.temp) + '&#176F';
                    forecastEl[i].append(fiveDayTempEl);
                    const fiveDayHumidityEl = document.createElement('p');
                    fiveDayHumidityEl.innerHTML = 'Humidity: ' + fiveDay.list[forecastIndex].main.humidity + '%';
                    forecastEl[i].append(fiveDayHumidityEl);
                }


                })
                
            })
            
            
            
            
    }


    const searchEl = document.getElementById('search-button');

    //Get search History
    searchEl.addEventListener('click', function(){
        const searchTerm = cityNameEl.value;
        getApi(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem('search', JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    clearEl.addEventListener('click', function (){
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    })

    function renderSearchHistory() {
        historyEl.innerHTML = '';
        for (let i = 0; i < searchHistory.length; i++){
            const historyItem = document.createElement('input');
            historyItem.setAttribute('type', 'text');
            historyItem.setAttribute('readonly', true);
            historyItem.setAttribute('class', 'form-control d-block bg-white');
            historyItem.setAttribute('value', searchHistory[i]);
            historyItem.setAttribute('click', function(){
                getApi(historyItem.value);
            })
            historyEl.append(historyItem)
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0){
        getApi(searchHistory[searchHistory.length]);
    }

    





    
    weatherFormEl.addEventListener('click', formSubmitHandler);
    
    
    
    
    
    


