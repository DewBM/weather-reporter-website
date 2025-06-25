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
    try {
	const response = await fetch(`/api/suggestions?q=${query}`);

	if (response.status === 404)
	    throw new Error("Resource not found for location suggestions!");
	
	const data = await response.json();
	
	if (response.status === 200) {
	    if (data.length > 0) {
		context.showSuggestions = true;
		context.activeIndex = -1;
		context.suggestions = data;
	    }
	    else
		context.showSuggestions = false;
	}
	else
	    throw new Error(data.error);
    }
    catch (e) {
	context.error = e.message || "Something went wrong fetching location suggestions";
	console.log(context.error);
    }
}

const debouncedSearch = debounce(fetchSuggestions, 300);

function weatherApp() {
    return {
	weather: {},
	loading: true,
	searchQuery: "",
	suggestions: [],
	showSuggestions: false,
	selectedSuggestion: null,
	activeIndex: -1,
	error: null,

	async fetchWeather() {
	    this.loading = true;
	    this.error = null;

	    const queryParam = this.selectedSuggestion != null ? `id:${this.selectedSuggestion.id}` : this.searchQuery;

	    try {
		const response = await fetch(`/api/weather?q=${queryParam}`);

		if (response.status === 404)
		    throw new Error("Resource not found for weather data");

		const data = await response.json();

		if (response.status === 200)
		    this.weather = data;
		else
		    throw new Error(data.error);
	    }
	    catch (e) {
		this.error = e.message || "Something went wrong fetching weather data!";
	    }
	    finally {
		this.loading = false;
	    }
	},

	onSearchInput() {
	    if (this.searchQuery != '')
		debouncedSearch(this.searchQuery, this);
	    else
		this.suggestions = [];
	},

	async selectSuggestion(item) {
	    this.selectedSuggestion = item;
	    this.showSuggestions = false;
	    this.searchQuery = item.name;
	    await this.fetchWeather();
	},

	moveDown() {
	    if (this.suggestions.length === 0) return;
	    this.activeIndex = (this.activeIndex + 1) % this.suggestions.length;

	    this.scrollToActive();
	},

	moveUp() {
	    if (this.suggestions.length === 0) return;
	    this.activeIndex = (this.activeIndex - 1 + this.suggestions.length) % this.suggestions.length;

	    this.scrollToActive();
	},

	scrollToActive() {
	    this.$nextTick(() => {
		const activeEl = document.querySelector(`[data-index="${this.activeIndex}"]`);
		if (activeEl) activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
	    });
	}
    };
}
