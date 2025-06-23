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

	if (data.length > 0) {
	    context.showSuggestions = true;
	    context.activeIndex = -1;
	    context.suggestions = data;
	}
	else
	    context.showSuggestions = false;
	console.log(data);
    }
    else {
	console.log(response);
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

	async fetchWeather() {
	    this.loading = true;
	    const queryParam = this.selectedSuggestion != null ? `id:${this.selectedSuggestion.id}` : this.searchQuery;
	    const response = await fetch(`/api/weather?q=${queryParam}`);
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
