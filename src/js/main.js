import "../css/style.css";
import { loadHeaderFooter, loadMovies } from "./utils.mjs";
import {
  displayMovieDetails,
  displayAdditionalMovieDetails,
  displayMovieTrailer,
} from "./info.mjs";

// Ejecutar solo en la página principal
if (!window.location.pathname.includes("index")) {
  loadMovies();
  loadHeaderFooter();
}

// Ejecutar solo en info_page/index.html
if (window.location.pathname.includes("info")) {
  displayMovieDetails();
  displayAdditionalMovieDetails();
  displayMovieTrailer();
  loadHeaderFooter();
}
