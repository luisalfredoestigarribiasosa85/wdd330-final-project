const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
    },
};

export default class ExternalServices {
    constructor() {
        // Constructor implementation
    }

    async fetchDataAuth() {
        await fetch("https://api.themoviedb.org/3/authentication", options)
            .then((res) => res.json())
            .then((res) => console.log(res))
            .catch((err) => console.error(err));
    }

    async fetchRandomMovie() {
        try {
            console.log('Starting random movie fetch...');
            const apiKey = import.meta.env.VITE_API_MOVIES;
            if (!apiKey) {
                throw new Error('API key not found');
            }

            // First, get total number of pages
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`);
            if (!response.ok) throw new Error('Failed to fetch movie data');
            const data = await response.json();
            console.log('Got initial movie data');

            const totalPages = Math.min(data.total_pages, 500); // TMDB API has a limit of 500 pages
            const randomPage = Math.floor(Math.random() * totalPages) + 1;
            console.log('Selected random page:', randomPage);

            // Fetch movies from random page
            const moviesResponse = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=${randomPage}`);
            if (!moviesResponse.ok) throw new Error('Failed to fetch random movies');
            const moviesData = await moviesResponse.json();
            console.log('Got movies from random page');

            // Get random movie from the page
            const randomIndex = Math.floor(Math.random() * moviesData.results.length);
            const randomMovie = moviesData.results[randomIndex];
            console.log('Selected random movie:', randomMovie.title, 'with ID:', randomMovie.id);

            // Redirect to the random movie's info page
            window.location.href = `info.html?id=${randomMovie.id}`;
        } catch (error) {
            console.error('Error fetching random movie:', error);
            alert('Failed to get a random movie. Please try again.');
        }
    }
}

