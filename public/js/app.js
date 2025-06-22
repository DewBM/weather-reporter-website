const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
	window.clearTimeout(timeoutId);
	timeoutId = window.setTimeout(() => {
	    callback(...args);
	}, wait);
    };
}

const fetchSuggestions = async (query, context) => {
    console.log(`Debounced Search: ${query}`);

    const response = await fetch(`/api/suggestions?q=${query}`);
    if (response.status == 200) {
	const data = await response.json();
	context.suggestions = data.map((item) => item.name);
	console.log(data);
    }
    else {
	console.log(response);
    }
}

const debouncedSearch = debounce(fetchSuggestions, 500);

function weatherApp() {
    return {
	weather: {},
	loading: true,
	searchQuery: "",
	suggestions: [],

	async fetchWeather() {
	    this.loading = true;
	    const response = await fetch(`/api/weather?q=${this.searchQuery}`);
	    if (response.status == 200) {
		const data = await response.json();
		this.weather = data;
		console.log(data);
	    }
	    else {
		console.log(response);
	    }

	    this.loading = false;
	},

	onSearchInput() {
	    debouncedSearch(this.searchQuery, this);
	},

	async selectSuggestion(item) {
	    this.searchQuery = item;
	    await this.fetchWeather();
	}
    };
}
