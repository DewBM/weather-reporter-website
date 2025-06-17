function weatherApp() {
    return {
	weather: {},
	loading: true,

	async fetchWeather() {
	    this.loading = true;
	    const response = await fetch('/api/weather?q=Colombo');
	    if (response.status == 200) {
		const data = await response.json();
		this.weather = data;
		console.log(data);
	    }
	    else {
		console.log(response);
	    }

	    this.loading = false;
	}
    };
}

