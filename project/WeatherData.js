class WeatherData {
  #country;
  #city;
  set country(name) {
    this.#country = name;
  }
  set city(name) {
    this.#city = name;
  }
  #API_KEY = "8f91db34ebba63f73531971f9c870c6a";
  async getWeather() {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${this.#city},${
        this.#country
      }&units=metric&appid=${this.#API_KEY}`
    );
    return await res.json();
  }
}
const weatherData = new WeatherData();
export default weatherData;
