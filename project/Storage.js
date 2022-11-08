class Storage {
  #country;
  #city;
  set country(name) {
    this.#country = name;
  }
  set city(name) {
    this.#city = name;
  }
  saveItem() {
    localStorage.setItem("mobin-country", this.#country);
    localStorage.setItem("mobin-city", this.#city);
  }
  getItem() {
    const country = localStorage.getItem("mobin-country", this.#country);
    const city = localStorage.getItem("mobin-city", this.#city);
    return {
      country,
      city,
    };
  }
}
const storage = new Storage();
export default storage;
