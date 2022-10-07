import anime from 'animejs/lib/anime.es';

import {
  weatherRequest,
  fillResult,
  filterData,
  convertUnit,
  units,
  searchTerm,
} from './api.js';

const userCity = localStorage.getItem('user_city') || undefined;

const mainScreen = document.querySelector('#main-screen');
const resultScreen = document.querySelector('#result-screen');

window.addEventListener('load', (e) => {
  //Animate main screen
  anime({
    targets: mainScreen,
    opacity: [0, 1],
    translateY: [-10, 0],
    duration: 3000,
  });
});

const cityInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const locBtn = document.querySelector('#location-btn');

searchBtn.addEventListener('click', submitHandler);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitHandler();
});

const errorMsg = document.querySelector('#error');

async function submitHandler() {
  if (validateInput()) {
    try {
      let fetchWeatherData = await weatherRequest(
        cityInput.value
      ).then((data) => fillResult(filterData(data)));

      let resultScreenAnimation = anime({
        targets: resultScreen,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 3000,
        begin: () => {
          mainScreen.style.display = 'none';
          resultScreen.style.display = 'block';
        },
      });
    } catch (e) {
      console.log(e);
      errorMsg.innerText = 'No location found!';
      anime({
        targets: errorMsg,
        opacity: [0, 1],
        begin: () => {
          errorMsg.style.display = 'block';
        },
      });
    }
  } else {
    let inputAnimation = await anime({
      targets: cityInput,
      translateX: [-20, 0],
    });
  }
}

const validateInput = () => {
  return cityInput.value !== '';
}

// geolocation
locBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const successCallback = (location) => {
    let userLocation = `${
      'lat=' + location.coords.latitude + '&lon=' + location.coords.longitude
    }`;
    weatherRequest(userLocation).then((data) => fillResult(filterData(data)))
    let resultScreenAnimation = anime({
      targets: resultScreen,
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 3000,
      begin: () => {
        mainScreen.style.display = 'none';
        resultScreen.style.display = 'block';
      },
    });
  };
  const errorCallback = (error) => {
    alert(error);
  };
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
});


//Return

const returnBtn = document.querySelector('#return-btn');
returnBtn.addEventListener('click', resetHandler);

async function resetHandler() {
  //Clean input
  cityInput.value = '';
  errorMsg.style.display = 'none';

  let mainScreenAnimation = anime({
    targets: mainScreen,
    opacity: [0, 1],
    translateY: [-20, 0],
    duration: 3000,
    begin: () => {
      mainScreen.style.display = 'block';
      resultScreen.style.display = 'none';
    },
  });
}

//Converting units
const convertBtn = document.querySelector('#convert-units-btn');
convertBtn.addEventListener('click', (e) => {
    convertUnit();
  //Switch button text
  convertBtn.innerText = units == 'metric' ? '℉' : '℃';
});

/* DOM content upload animation

let temp = document.querySelector('#temp');
let minTemp = document.querySelector('#mintemp');
let maxTemp = document.querySelector('#maxtemp');
let feelingTemp = document.querySelector('#feeling');
let windSpeed = document.querySelector('#wind-speed');
let elem = [temp, minTemp, maxTemp, feelingTemp, windSpeed];

let state = "off";

const blinkText = () => {
  if (state == "on") {
    state = "off";
    elem.forEach((elem) => {
      elem.style.visibility = "visible";
      setTimeout(blinkText, 1000);
    });
	} else {
		state = "on";
    elem.forEach((elem) => {
      elem.style.visibility = "hidden";
      setTimeout(blinkText, 1000);
    });
	}
}

async function locationHandler(event) {
  event.preventDefault();
  try {
    let userLocation = `${
      'lat=' + location.coords.latitude + '&lon=' + location.coords.longitude
    }`;
    let fetchWeatherData = await weatherRequest(userLocation)
    .then((data) => fillResult(filterData(data)));
    
    let resultScreenAnimation = anime({
        targets: resultScreen,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 3000,
        begin: () => {
          mainScreen.style.display = 'none';
          resultScreen.style.display = 'block';
        },
    });    
  } catch (e) {
    console.log(e);
      errorMsg.innerText = 'No location found!';
      anime({
        targets: errorMsg,
        opacity: [0, 1],
        begin: () => {
          errorMsg.style.display = 'block';
        },
      });
  }
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

*/