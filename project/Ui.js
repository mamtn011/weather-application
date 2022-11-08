import weatherData from "./WeatherData.js";
import storage from "./Storage.js";

class UI {
  #selectDomElements() {
    const form = document.querySelector("form");
    const countryInputElm = document.querySelector("#country");
    const cityInputElm = document.querySelector("#city");
    const msgUiElm = document.querySelector("#messageWrapper");
    const cityUiElm = document.querySelector("#w-city");
    const conditionalIconElm = document.querySelector("#w-icon");
    const conditionalUiElm = document.querySelector("#w-feel");
    const temperatureUiElm = document.querySelector("#w-temp");
    const feelLikeUiElm = document.querySelector("#w-feel-like");
    const pressureUiElm = document.querySelector("#w-pressure");
    const humidityUiElm = document.querySelector("#w-humidity");
    return {
      form,
      countryInputElm,
      cityInputElm,
      msgUiElm,
      cityUiElm,
      conditionalIconElm,
      conditionalUiElm,
      temperatureUiElm,
      feelLikeUiElm,
      pressureUiElm,
      humidityUiElm,
    };
  }
  #clearMsg(msgElm) {
    msgElm.children[0].remove();
  }
  #showMsg(msg) {
    const message = `<div class="alert alert-danger">${msg}</div>`;
    const { msgUiElm } = this.#selectDomElements();
    msgUiElm.insertAdjacentHTML("afterbegin", message);
    setTimeout(() => {
      this.#clearMsg(msgUiElm);
    }, 3000);
  }
  #validateInputs(country, city) {
    if (country === "" || city === "") {
      this.#showMsg("Please, fill up county and city fields.");
      return true;
    } else if (country.length > 2) {
      this.#showMsg("Please, provide valid country code.");
      return true;
    } else {
      return false;
    }
  }
  #getInputsValue() {
    const { countryInputElm, cityInputElm } = this.#selectDomElements();
    const country = countryInputElm.value;
    const city = cityInputElm.value;
    const invalid = this.#validateInputs(country, city);
    if (invalid) {
      return "";
    } else {
      return {
        country,
        city,
      };
    }
  }
  #resetInputs() {
    const { countryInputElm, cityInputElm } = this.#selectDomElements();
    countryInputElm.value = "";
    cityInputElm.value = "";
  }
  #handleRemotData(data) {
    if (data.hasOwnProperty("main")) {
      const { name, main, weather } = data;
      return {
        name,
        main,
        weather,
      };
    } else {
      this.#showMsg("Error: City not matched!");
      return;
    }
  }
  #populateData(data) {
    const {
      cityUiElm,
      conditionalIconElm,
      conditionalUiElm,
      temperatureUiElm,
      feelLikeUiElm,
      pressureUiElm,
      humidityUiElm,
    } = this.#selectDomElements();
    const {
      name,
      main: { feels_like, humidity, pressure, temp },
      weather,
    } = data;
    cityUiElm.textContent = name;
    conditionalIconElm.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
    );
    conditionalUiElm.textContent = weather[0].main;
    temperatureUiElm.textContent = "Temperature: " + temp + " °C";
    feelLikeUiElm.textContent = "Feel like: " + feels_like + " °C";
    pressureUiElm.textContent = "Air pressure: " + pressure + " hPa";
    humidityUiElm.textContent = "Humidity: " + humidity + "%";
  }
  #sendInputsData(sendTo, country, city) {
    sendTo.country = country;
    sendTo.city = city;
  }
  #getDataFromLocalStorage() {
    let { country, city } = storage.getItem();
    if (!country || !city) {
      country = "BD";
      city = "Dhaka";
    }
    return { country, city };
  }
  init() {
    const { form } = this.#selectDomElements();
    form.addEventListener("submit", async (evt) => {
      evt.preventDefault();
      const iputsData = this.#getInputsValue();
      if (!iputsData) return;
      const { country, city } = iputsData;
      this.#resetInputs();
      this.#sendInputsData(weatherData, country, city);
      // send to locat storage
      this.#sendInputsData(storage, country, city);
      storage.saveItem();
      const foundData = await weatherData.getWeather();
      const neededData = this.#handleRemotData(foundData);
      if (!neededData) return;
      this.#populateData(neededData);
    });
    window.addEventListener("DOMContentLoaded", async () => {
      const { country, city } = this.#getDataFromLocalStorage();
      this.#sendInputsData(weatherData, country, city);
      const foundData = await weatherData.getWeather();
      const neededData = this.#handleRemotData(foundData);
      this.#populateData(neededData);
    });
  }
}
const ui = new UI();
export default ui;
