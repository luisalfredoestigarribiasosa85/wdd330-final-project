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
            <div class="movie" id="movie-${movie.id}">
                <img class="poster" src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" loading="lazy">
                <h3 class="title">${movie.title}</h3>
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
    const headerContainer = document.querySelector("header");
    const footerContainer = document.querySelector("footer");

    if (headerContainer) {
        fetch("./partials/header.html")
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
            })
            .catch(error => console.error("Error loading header:", error));
    }

    if (footerContainer) {
        fetch("./partials/footer.html")
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(error => console.error("Error loading footer:", error));
    }
}
