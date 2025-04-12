import { initializeCommon } from "./common.mjs";

// Function to load and display favorite movies
async function loadFavorites() {
  const favoritesContainer = document.getElementById("favorites-container");
  const noFavorites = document.getElementById("no-favorites");
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  if (favorites.length === 0) {
    favoritesContainer.classList.add("d-none");
    noFavorites.classList.remove("d-none");
    return;
  }

  favoritesContainer.classList.remove("d-none");
  noFavorites.classList.add("d-none");
  favoritesContainer.innerHTML = "";

  for (const movieId of favorites) {
    try {
      const movie = await getMovieDetails(movieId);
      const movieElement = createMovieElement(movie);
      favoritesContainer.appendChild(movieElement);
    } catch (error) {
      console.error("Error loading favorite movie:", error);
    }
  }
}

// Function to create movie element
function createMovieElement(movie) {
  const movieDiv = document.createElement("div");
  movieDiv.className = "col";

  movieDiv.innerHTML = `
        <div class="favorite-movie-card">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="card-body">
                <h3>${movie.title}</h3>
                <div class="movie-meta">
                    <span>${movie.release_date.split("-")[0]}</span>
                    <span>${movie.vote_average.toFixed(1)} ⭐</span>
                </div>
                <button class="btn-remove" data-id="${movie.id}">
                    Remove from Favorites
                </button>
            </div>
        </div>
    `;

  const removeButton = movieDiv.querySelector(".btn-remove");
  removeButton.addEventListener("click", () => {
    removeFromFavorites(movie.id);
    movieDiv.remove();
    if (document.querySelectorAll(".favorite-movie-card").length === 0) {
      document.getElementById("favorites-container").classList.add("d-none");
      document.getElementById("no-favorites").classList.remove("d-none");
    }
  });

  return movieDiv;
}

// Function to remove movie from favorites
function removeFromFavorites(movieId) {
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  movieId = movieId.toString();
  favorites = favorites.filter((id) => id !== movieId);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Remove the movie card from the DOM
  const movieCard = document
    .querySelector(`[data-id="${movieId}"]`)
    .closest(".col");
  if (movieCard) {
    movieCard.remove();
  }

  // Show no favorites message if no movies left
  if (document.querySelectorAll(".favorite-movie-card").length === 0) {
    document.getElementById("favorites-container").classList.add("d-none");
    document.getElementById("no-favorites").classList.remove("d-none");
  }
}

// Function to get movie details
async function getMovieDetails(movieId) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_API_MOVIES}`,
    );
    if (!response.ok) throw new Error("Failed to fetch movie details");
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  initializeCommon();
  loadFavorites();
});
