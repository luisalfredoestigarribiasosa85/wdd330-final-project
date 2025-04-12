import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();
services.fetchDataAuth();
let page = 1;

document.addEventListener("DOMContentLoaded", () => {
    const btnPrevious = document.getElementById("btnPrevious");
    const btnNext = document.getElementById("btnNext");
    const inputSearch = document.getElementById("search");
    const btnSearch = document.getElementById("btnSearch");

    // Verify that this is the main page
    if (document.getElementById("app")) {
        loadMovies();
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            if (page < 1000) {
                page += 1;
                loadMovies();
            }
        });
    }

    if (btnPrevious) {
        btnPrevious.addEventListener("click", () => {
            if (page > 1) {
                page -= 1;
                loadMovies();
            }
        });
    }

    if (btnSearch) {
        btnSearch.addEventListener("click", () => {
            const query = inputSearch.value;
            if (query) {
                searchMovies(query);
            }
        });
    }

    loadHeaderFooter();
});

export async function loadMovies() {
    if (!document.getElementById("app")) {
        console.error("Error: Element not found in DOM");
        return;
    }
    try {
        const api = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_API_MOVIES}&language=en-US&page=${page}`);
        const data = await api.json();
        displayMovies(data.results);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

const searchMovies = async (query) => {
    try {
        const api = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_API_MOVIES}&language=en-US&query=${query}&page=${page}`);
        if (api.status === 200) {
            const data = await api.json();
            displayMovies(data.results);
        } else {
            console.log('Error fetching search results');
        }
    } catch (error) {
        console.error(error);
    }
};

const displayMovies = (movies) => {
    let moviesHtml = '';
    movies.forEach(movie => {
        moviesHtml += `
            <div class="movie-card" id="movie-${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" loading="lazy">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <div class="movie-meta">
                        <span>${new Date(movie.release_date).getFullYear()}</span>
                        <span>${movie.vote_average.toFixed(1)} ⭐</span>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementById('app').innerHTML = moviesHtml;

    // Add a redirect to info page event
    movies.forEach(movie => {
        const movieElement = document.getElementById(`movie-${movie.id}`);
        movieElement.addEventListener('click', () => {
            window.location.href = `info.html?id=${movie.id}`;
        });
    });
};

export function loadHeaderFooter() {
    const headerContainer = document.getElementById("header");
    const footerContainer = document.getElementById("footer");

    // Create an array to hold our promises
    const promises = [];

    if (headerContainer) {
        const headerPromise = fetch("/src/partials/header.html")
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
                // Add event listener after header content is loaded
                const surpriseMeButton = document.getElementById('surprise-me');
                if (surpriseMeButton) {
                    surpriseMeButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log('Surprise Me button clicked');
                        fetchRandomMovie();
                    });
                    console.log('Surprise Me button listener added');
                } else {
                    console.error('Surprise Me button not found after header load');
                }
            })
            .catch(error => console.error("Error loading header:", error));
        promises.push(headerPromise);
    }

    if (footerContainer) {
        const footerPromise = fetch("/src/partials/footer.html")
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(error => console.error("Error loading footer:", error));
        promises.push(footerPromise);
    }

    // Return a promise that resolves when all promises are complete
    return Promise.all(promises);
}

// Function to fetch random movie
export async function fetchRandomMovie() {
    try {
        console.log('Starting random movie fetch...'); // Debug log
        // First, get total number of pages
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_API_MOVIES}&sort_by=popularity.desc`);
        if (!response.ok) throw new Error('Failed to fetch movie data');
        const data = await response.json();
        console.log('Got initial movie data'); // Debug log

        const totalPages = Math.min(data.total_pages, 500); // TMDB API has a limit of 500 pages
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
        console.log('Selected random page:', randomPage); // Debug log

        // Fetch movies from random page
        const moviesResponse = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_API_MOVIES}&sort_by=popularity.desc&page=${randomPage}`);
        if (!moviesResponse.ok) throw new Error('Failed to fetch random movies');
        const moviesData = await moviesResponse.json();
        console.log('Got movies from random page'); // Debug log

        // Get random movie from the page
        const randomIndex = Math.floor(Math.random() * moviesData.results.length);
        const randomMovie = moviesData.results[randomIndex];
        console.log('Selected random movie:', randomMovie.title, 'with ID:', randomMovie.id); // Debug log

        // Redirect to the random movie's info page
        const currentPath = window.location.pathname;
        const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
        const infoUrl = `${basePath}info.html?id=${randomMovie.id}`;
        console.log('Redirecting to:', infoUrl); // Debug log
        window.location.href = infoUrl;
    } catch (error) {
        console.error('Error fetching random movie:', error);
        alert('Failed to get a random movie. Please try again.');
    }
}
