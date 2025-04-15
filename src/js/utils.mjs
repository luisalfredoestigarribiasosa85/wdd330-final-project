export async function loadMovies(page = 1) {
    if (!document.getElementById("app")) {
        console.error("Error: Element not found in DOM");
        return;
    }
    try {
        const api = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_API_MOVIES}&language=en-US&page=${page}`);
        if (!api.ok) {
            throw new Error(`HTTP error! status: ${api.status}`);
        }
        const data = await api.json();
        displayMovies(data.results);
    } catch (error) {
        console.error(`Error loading movies: ${error}`);
    }
}

export const searchMovies = async (query, page = 1) => {
    try {
        const api = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_API_MOVIES}&language=en-US&query=${query}&page=${page}`);
        if (!api.ok) {
            throw new Error(`HTTP error! status: ${api.status}`);
        }
        const data = await api.json();
        displayMovies(data.results);
    } catch (error) {
        console.error(`Error searching movies: ${error}`);
    }
};

const displayMovies = (movies) => {
    let moviesHtml = '';
    movies.forEach(movie => {
        const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/images/no-poster.jpg';
        const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
        const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

        moviesHtml += `
            <div class="movie-card" id="movie-${movie.id}">
                <img src="${posterPath}" alt="${movie.title}" loading="lazy">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <div class="movie-meta">
                        <span>${releaseYear}</span>
                        <span>${voteAverage} ⭐</span>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById('app').innerHTML = moviesHtml;

    // Add a redirect to info page event
    movies.forEach(movie => {
        const movieElement = document.getElementById(`movie-${movie.id}`);
        if (movieElement) {
            movieElement.addEventListener('click', () => {
                window.location.href = `info.html?id=${movie.id}`;
            });
        }
    });
};

// Function to fetch random movie
export async function fetchRandomMovie() {
    try {
        console.log('API Key:', import.meta.env.VITE_API_MOVIES);
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_API_MOVIES}&sort_by=popularity.desc`);
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Total pages:', data.total_pages);

        const totalPages = Math.min(data.total_pages, 500);
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
        console.log('Random page:', randomPage);

        const moviesResponse = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_API_MOVIES}&sort_by=popularity.desc&page=${randomPage}`);
        console.log('Movies response status:', moviesResponse.status);
        if (!moviesResponse.ok) {
            throw new Error(`HTTP error! status: ${moviesResponse.status}`);
        }
        const moviesData = await moviesResponse.json();
        console.log('Movies data:', moviesData);

        const randomIndex = Math.floor(Math.random() * moviesData.results.length);
        const randomMovie = moviesData.results[randomIndex];
        console.log('Random movie:', randomMovie);

        // Redirect to the info page with the random movie ID
        window.location.href = `info.html?id=${randomMovie.id}`;
    } catch (error) {
        console.error('Error fetching random movie:', error);
        alert('Failed to get a random movie. Please try again.');
    }
}
