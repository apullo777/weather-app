import anime from 'animejs/lib/anime.es';

// Data handling 
let units = 'metric'
console.log(`current units are in ${units}`)
let searchTerm;

const parseTemp = (temp) => {
    let parsedTemp =
    units == 'metric' ? Number(temp) - 273.1 : (Number(temp) - 273) * 1.8 + 32;
    console.log(`parsed temp in ${units}`)
    return Math.round(parsedTemp * 10) / 10;
}

const parseSpeed = (speed) => {
    let parsedSpeed =
    units == 'metric' ? Number(speed) : Number(speed) / 3.6;
    console.log(`parsed speed in ${units}`)
    return Math.round(parsedSpeed * 10) / 10;
}

const filterData = (weatherData) => {
    let city = weatherData.name;
    let country = weatherData.sys.country;
    let place = `${city}, ${country}`;
    let { main: weatherTitle, description: weatherDesc } = weatherData.weather[0];
    let details = weatherData.main;
    let {
      feels_like: feeling,
      humidity,
      temp,
      temp_max: maxTemp,
      temp_min: minTemp,
    } = details;
    let windSpeed = weatherData.wind.speed * 3.6 // converting from mph to kph as default
    
    return {
        place,
        weatherTitle,
        weatherDesc,
        feeling: parseTemp(feeling),
        humidity,
        temp: parseTemp(temp),
        maxTemp: parseTemp(maxTemp),
        minTemp: parseTemp(minTemp),
        windSpeed: parseSpeed(windSpeed)
    };
}

const fillResult = ({
    place,
    weatherTitle,
    weatherDesc,
    feeling,
    humidity,
    temp,
    maxTemp,
    minTemp,
    windSpeed,
  }) => {
    let tempUnit = units == 'metric' ? '℃' : '℉';
    let speedUnit = units == 'metric' ? 'kph' : 'mph'; 

    let results = [
      { elementId: '#temp', value: `${temp} ${tempUnit}`},
      { elementId: '#place', value: place },
      { elementId: '#weather', value: weatherTitle },
      { elementId: '#weather-desc', value: weatherDesc },
      { elementId: '#feeling', value: `${feeling} ${tempUnit}`},
      { elementId: '#humidity', value: `${humidity} %` },
      { elementId: '#mintemp', value: `${minTemp} ${tempUnit}`},
      { elementId: '#maxtemp', value: `${maxTemp} ${tempUnit}`},
      { elementId: '#wind-speed', value: `${windSpeed} ${speedUnit}`},
    ];
  
    for (let { elementId, value } of results) {
      document.querySelector(elementId).innerText = value;
    }
    console.log(`filled results in ${units}`)
}

// unit convertion

const temp = document.querySelector('#temp');
const minTemp = document.querySelector('#mintemp');
const maxTemp = document.querySelector('#maxtemp');
const feelingTemp = document.querySelector('#feeling');
const windSpeed = document.querySelector('#wind-speed');

const tempsElem = [temp, minTemp, maxTemp, feelingTemp];
const changedElem = [temp, minTemp, maxTemp, feelingTemp, windSpeed]

// from metric to imperial
const convertUnit = () => {
    // unit sign
    let tempUnit = units == 'metric' ? '℉' : '℃';
    let speedUnit = units == 'metric' ? 'mph' : 'kph'; 
    console.log(`current units are in ${units}`)

    // temp
    let temps = tempsElem.map(
      (temp) => temp.innerText.split(' ')[0]
    );
    tempsElem.forEach((tempElem, index) => {
      let convertedTemp = convertTemp(temps[index]);
      tempElem.innerText = `${Math.round(convertedTemp * 10) / 10} ${tempUnit}`;
    });

    // speed
    let speed = windSpeed.innerText.split(' ')[0]
    let convertedSpeed = convertSpeed(speed)
    windSpeed.innerText = `${Math.round(convertedSpeed * 10) / 10} ${speedUnit}`;

    // convert units
    units = units == 'metric' ? 'imperial' : 'metric';
    console.log(`converted to ${units}`)

    // animation for updated data 
    console.log(changedElem)
    changedElem.forEach((ele) => {
      let textAnimation = anime({
        targets: changedElem,
        opacity: [0, 1],
        translateY: [-8, 0],
        duration: 1500,
      });
    });
}

const convertTemp = (temp) => {
    //Convert from celsius to fahrenheit
    if (units == 'metric') {
      return 1.8 * Number(temp) + 32;
    } else if (units == 'imperial') {
      //Convert from fahrenheit to celsius
      return (5 / 9) * (Number(temp) - 32);
    }
}

const convertSpeed = (speed) => {
    if (units == "metric") {
        return speed / 3.6
    } else if (units == "imperial") {
        return speed * 3.6
    }
}

// HTTPS

const filterInput = (input) => {
  if (isNaN(input) && containsNum(input)) {
    searchTerm = input;
  } else if (isNum(input) && input.length <= 5) {
    searchTerm = `${'zip='}${input}`;
  } else {
    searchTerm = `${'q='}${input}`;
  }
}

function isNum(input) {
  return !/\D/.test(input);
}
function containsNum(input) {
  return /\d/.test(input);
}

async function weatherRequest(input) {
  filterInput(input);
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${searchTerm}&appid=7a6d2bdad83ef9d4b1cba800507a33b6`
    );
    const data = await response.json();
    // get local time
    const dateAndTime = data.timezone;
    dateDiaplay.innerHTML = getLocalTime(dateAndTime)
    return data;
  } catch (error) {
    console.log(error);
  }
}

// local time

const dateDiaplay = document.querySelector('#time');

function getLocalTime(data) {
  let date = new Date();
  let time = date.getTime();
  let localOffset = date.getTimezoneOffset() * 60000;
  let utc = time + localOffset;
  let localTime = utc + 1000 * data;
  let localTimeDate = new Date(localTime);
  return localTimeDate.toLocaleString();
}
  
export {weatherRequest, fillResult, filterData, convertUnit, units, searchTerm};