import {currentUnit} from './api.js';

let temp = document.querySelector('#temp');
let minTemp = document.querySelector('#mintemp');
let maxTemp = document.querySelector('#maxtemp');
let feelingTemp = document.querySelector('#feeling');

let tempsElem = [temp, minTemp, maxTemp, feelingTemp];

function convertTempsElem() {
    let tempUnit = '°C';
    let speedUnit = 'km/h';
    let temps = tempsElem.map(
      (temp) => temp.innerText.match(/-?[\d\.]+(?=[°C])/)[0]
    );
    tempsElem.forEach((tempElem, index) => {
      let convertedTemp = convertTemp(temps[index]);
      tempElem.innerText = `${Math.round(convertedTemp * 10) / 10} ${tempUnit}`;
    });
    currentUnit = currentUnit === 0 ? 1 : 0;
}

const convertTemp = (temp) => {
    //Convert from celsius to fahrenheit
    if (currentUnit === 0) {
      return 1.8 * Number(temp) + 32;
    } else if (currentUnit === 1) {
      //Convert from fahrenheit to celsius
      return (5 / 9) * (Number(temp) - 32);
    }
}

// render top left weather data
function renderWeatherInformation(data, units) {
    let tempUnit = '°C';
  
    if (units === 'imperial') {
      tempUnit = '°F';
    }
    const weatherDescription = document.querySelector(
      '.weather-info__description'
    );
    weatherDescription.textContent = utils.capitalize(
      data.current.weather[0].description
    );
    const city = document.querySelector('.weather-info__city');
    city.textContent = data.name;
    const date = document.querySelector('.weather-info__date');
    date.textContent = utils.formatDate(data.current.dt, data.timezone_offset);
    const time = document.querySelector('.weather-info__time');
    time.textContent = utils.formatTime(data.current.dt, data.timezone_offset);
  
    const temperature = document.querySelector('.weather-info__temperature');
    temperature.textContent = `${Math.round(data.current.temp)} ${tempUnit}`;
    const temperatureIcon = document.querySelector('.weather-info__icon');
    temperatureIcon.innerHTML = utils.getIcon(data.current.weather[0].icon);
  }
  
  // render top right wether details
  function renderWeatherDetails(data, units) {
    let tempUnit = '°C';
    let speedUnit = 'km/h';
  
    if (units === 'imperial') {
      tempUnit = '°F';
      speedUnit = 'mph';
    }
  
    // convert windspeed from meters per second to km/h
    if (units === 'metric') {
      data.current.wind_speed *= 3.6;
    }

export {convertTempsElem};