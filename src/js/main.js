import "../css/style.css";
import { loadHeaderFooter, loadMovies } from "./utils.mjs";
import {
  displayMovieDetails,
  displayAdditionalMovieDetails,
  displayMovieTrailer,
} from "./info.mjs";

// Versión más robusta para detectar si estamos en info.html
const isInfoPage =
  window.location.pathname.includes("info") ||
  window.location.href.includes("info.html");

// Ejecutar solo en la página principal
if (!isInfoPage) {
  loadMovies();
  loadHeaderFooter();
}

// Ejecutar solo en info.html
if (isInfoPage) {
  displayMovieDetails();
  displayAdditionalMovieDetails();
  displayMovieTrailer();
  loadHeaderFooter();
}
