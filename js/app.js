function weatherApp() {
  return {
    weather: {},
    loading: true,

    async fetchWeather() {
      this.loading = true;
      const response = await fetch('/api/weather?q=Colombo');
      const data = await response.json();
      this.weather = data;
      this.loading = false;
    }
  };
}

