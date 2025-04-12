import "../css/style.css";
import { loadHeaderFooter, loadMovies, fetchRandomMovie } from "./utils.mjs";
import {
  displayMovieDetails,
  displayAdditionalMovieDetails,
  displayMovieTrailer,
} from "./info.mjs";
import { initializeCommon } from "./common.mjs";

// Initialize common elements
initializeCommon();

// Load header and footer on all pages
document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter().then(() => {
    // Add event listener after header is loaded
    const hamburger = document.getElementById("hamburger");
    const nav = document.querySelector(".nav-menu");

    if (hamburger && nav) {
      hamburger.addEventListener("click", (e) => {
        e.stopPropagation();
        hamburger.classList.toggle("active");
        nav.classList.toggle("show");
        // Prevent scrolling when menu is open
        document.body.style.overflow = nav.classList.contains("show")
          ? "hidden"
          : "";
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !nav.contains(e.target) &&
          !hamburger.contains(e.target) &&
          nav.classList.contains("show")
        ) {
          nav.classList.remove("show");
          hamburger.classList.remove("active");
          document.body.style.overflow = "";
        }
      });

      // Close menu when clicking on a link
      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          nav.classList.remove("show");
          hamburger.classList.remove("active");
          document.body.style.overflow = "";
        });
      });
    }
  });

  // Versión más robusta para detectar si estamos en info.html
  const isInfoPage =
    window.location.pathname.includes("info") ||
    window.location.href.includes("info.html");

  // Ejecutar solo en la página principal
  if (!isInfoPage && window.location.pathname.includes("index.html")) {
    loadMovies();
  }

  // Ejecutar solo en info.html
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

    // Display movie details and trailer
    Promise.all([
      displayMovieDetails(movieId),
      displayAdditionalMovieDetails(movieId),
      displayMovieTrailer(movieId),
    ]).catch((error) => {
      console.error("Error displaying movie details:", error);
      const mainContent = document.querySelector(".movie-details-container");
      if (mainContent) {
        mainContent.innerHTML = `
          <div class="error-message">
            <h2>Error</h2>
            <p>An error occurred while loading the movie details. Please try again later.</p>
            <a href="index.html" class="btn btn-primary">Go to Home Page</a>
          </div>
        `;
      }
    });
  }

  // Add event listener for surprise me button
  const surpriseMeButton = document.getElementById("surprise-me");
  if (surpriseMeButton) {
    surpriseMeButton.addEventListener("click", (e) => {
      e.preventDefault();
      fetchRandomMovie();
    });
  }
});

// Favorites Management
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

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

document.addEventListener("DOMContentLoaded", () => {
  updateFavoriteButtons();
  document.querySelectorAll(".favorite-button").forEach((button) => {
    button.addEventListener("click", () => {
      toggleFavorite(button.dataset.movieId);
    });
  });
});
