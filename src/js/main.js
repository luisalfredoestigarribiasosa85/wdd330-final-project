import "../css/style.css";
import { loadMovies, searchMovies } from "./utils.mjs";
import { initializeCommon } from "./common.mjs";

// Favorites Management
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentPage = 1; // Local page variable

function toggleFavorite(movieId) {
  const index = favorites.indexOf(movieId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(movieId);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoriteButtons();
}

function updateFavoriteButtons() {
  document.querySelectorAll(".favorite-button").forEach((button) => {
    const movieId = button.dataset.movieId;
    if (favorites.includes(movieId)) {
      button.classList.add("active");
      button.textContent = "Remove from Favorites";
    } else {
      button.classList.remove("active");
      button.textContent = "Add to Favorites";
    }
  });
}

// Single DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Initialize common elements (header, footer, hamburger menu)
    await initializeCommon();

    // Check if we're on the info page
    const isInfoPage = window.location.pathname.includes("info") ||
      window.location.href.includes("info.html");

    // Handle main page
    if (!isInfoPage) {
      try {
        await loadMovies(currentPage);

        // Setup pagination and search
        const btnPrevious = document.getElementById("btnPrevious");
        const btnNext = document.getElementById("btnNext");
        const inputSearch = document.getElementById("search");
        const btnSearch = document.getElementById("btnSearch");

        if (btnNext) {
          btnNext.addEventListener("click", () => {
            if (currentPage < 1000) {
              currentPage += 1;
              loadMovies(currentPage).catch((error) => {
                console.error("Error loading next page:", error);
              });
            }
          });
        }

        if (btnPrevious) {
          btnPrevious.addEventListener("click", () => {
            if (currentPage > 1) {
              currentPage -= 1;
              loadMovies(currentPage).catch((error) => {
                console.error("Error loading previous page:", error);
              });
            }
          });
        }

        if (btnSearch) {
          btnSearch.addEventListener("click", () => {
            const query = inputSearch.value;
            if (query) {
              searchMovies(query, currentPage).catch((error) => {
                console.error("Error searching movies:", error);
              });
            }
          });
        }
      } catch (error) {
        console.error("Error in main page initialization:", error);
        const app = document.getElementById("app");
        if (app) {
          app.innerHTML = `
            <div class="error-message">
              <h2>Error</h2>
              <p>Failed to load movies. Please check your internet connection and try again.</p>
            </div>
          `;
        }
      }
    }

    // Handle info page
    if (isInfoPage) {
      const urlParams = new URLSearchParams(window.location.search);
      const movieId = urlParams.get("id");

      if (!movieId) {
        console.error("No movie ID provided");
        const mainContent = document.querySelector(".movie-details-container");
        if (mainContent) {
          mainContent.innerHTML = `
            <div class="error-message">
              <h2>Error</h2>
              <p>No movie ID provided. Please go back to the home page and select a movie.</p>
              <a href="index.html" class="btn btn-primary">Go to Home Page</a>
            </div>
          `;
        }
        return;
      }

      try {
        // Import info page functions only when needed
        const { displayMovieDetails, displayAdditionalMovieDetails, displayMovieTrailer } = await import("./info.mjs");

        // Display movie details and trailer
        await Promise.all([
          displayMovieDetails(movieId),
          displayAdditionalMovieDetails(movieId),
          displayMovieTrailer(movieId),
        ]);
      } catch (error) {
        console.error("Error displaying movie details:", error);
        const mainContent = document.querySelector(".movie-details-container");
        if (mainContent) {
          mainContent.innerHTML = `
            <div class="error-message">
              <h2>Error</h2>
              <p>Failed to load movie details. Please try again later.</p>
              <a href="index.html" class="btn btn-primary">Go to Home Page</a>
            </div>
          `;
        }
      }
    }

    // Setup favorites
    updateFavoriteButtons();
    document.querySelectorAll(".favorite-button").forEach((button) => {
      button.addEventListener("click", () => {
        toggleFavorite(button.dataset.movieId);
      });
    });
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});
