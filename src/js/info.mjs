import { initializeCommon } from './common.mjs';

// Function to handle favorites
function toggleFavorite(movieId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(movieId);

    if (index === -1) {
        favorites.push(movieId);
        alert('Movie added to favorites!');
    } else {
        favorites.splice(index, 1);
        alert('Movie removed from favorites!');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButton(movieId);
}

// Function to update favorite button state
function updateFavoriteButton(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorite = favorites.includes(movieId);
    const favoriteButton = document.getElementById('favorite');

    if (favoriteButton) {
        favoriteButton.textContent = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
        favoriteButton.className = isFavorite ? 'favorite-button active' : 'favorite-button';
    }
}

export const displayMovieDetails = async (movieId) => {
    if (!movieId) {
        console.error('No movie ID provided');
        // Show error message to user
        const mainContent = document.querySelector('.movie-details-container');
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
        // Fetch movie details with credits
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_API_MOVIES}&language=en-US&append_to_response=credits`);
        if (response.ok) {
            const movieData = await response.json();

            // Update movie poster
            const moviePoster = document.getElementById('movie-poster');
            if (moviePoster) {
                moviePoster.src = `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`;
                moviePoster.alt = movieData.title;
            }

            // Update movie title
            const movieTitle = document.getElementById('movie-title');
            if (movieTitle) {
                movieTitle.textContent = movieData.title;
            }

            // Update release date
            const releaseDate = document.getElementById('release-date');
            if (releaseDate) {
                const date = new Date(movieData.release_date);
                releaseDate.textContent = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            // Update runtime
            const runtime = document.getElementById('runtime');
            if (runtime) {
                const hours = Math.floor(movieData.runtime / 60);
                const minutes = movieData.runtime % 60;
                runtime.textContent = `${hours}h ${minutes}m`;
            }

            // Update genre
            const genre = document.getElementById('genre');
            if (genre) {
                genre.textContent = movieData.genres.map(genre => genre.name).join(', ');
            }

            // Update plot summary
            const plotSummary = document.getElementById('plot-summary');
            if (plotSummary) {
                plotSummary.textContent = movieData.overview;
            }

            // Update director
            const director = document.getElementById('director');
            if (director) {
                const directorInfo = movieData.credits.crew.find(member => member.job === 'Director');
                director.textContent = directorInfo ? directorInfo.name : 'N/A';
            }

            // Update cast
            const cast = document.getElementById('cast');
            if (cast) {
                const castNames = movieData.credits.cast.slice(0, 5).map(member => member.name).join(', ');
                cast.textContent = castNames || 'N/A';
            }

            // Update production studio
            const productionStudio = document.getElementById('production-studio');
            if (productionStudio) {
                const studioName = movieData.production_companies[0]?.name || 'N/A';
                productionStudio.textContent = studioName;
            }

            // Add event listener to favorite button
            const favoriteButton = document.getElementById('favorite');
            if (favoriteButton) {
                favoriteButton.addEventListener('click', () => toggleFavorite(movieId));
                updateFavoriteButton(movieId);
            }
        } else {
            console.error('Error fetching movie details');
            // Show error message to user
            const mainContent = document.querySelector('.movie-details-container');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div class="error-message">
                        <h2>Error</h2>
                        <p>Failed to fetch movie details. Please try again later.</p>
                        <a href="index.html" class="btn btn-primary">Go to Home Page</a>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error(error);
        // Show error message to user
        const mainContent = document.querySelector('.movie-details-container');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-message">
                    <h2>Error</h2>
                    <p>An error occurred while fetching movie details. Please try again later.</p>
                    <a href="index.html" class="btn btn-primary">Go to Home Page</a>
                </div>
            `;
        }
    }
};

//Display movie trailers...

export const displayMovieTrailer = async (movieId) => {
    if (!movieId) {
        console.error('No movie ID provided');
        return;
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${import.meta.env.VITE_API_MOVIES}`);
        if (response.ok) {
            const data = await response.json();
            const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            const trailerContainer = document.getElementById('trailer');

            if (trailer && trailerContainer) {
                // Get movie title for the iframe title
                const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_API_MOVIES}`);
                const movieData = await movieResponse.json();

                trailerContainer.innerHTML = `
                    <iframe 
                        width="100%" 
                        height="400" 
                        src="https://www.youtube.com/embed/${trailer.key}" 
                        title="${movieData.title} Trailer" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                `;
            } else if (trailerContainer) {
                trailerContainer.innerHTML = '<p>No trailer available</p>';
            }
        } else {
            console.error('Error fetching movie videos');
        }
    } catch (error) {
        console.error(error);
    }
};

// Display movie details...

export const displayAdditionalMovieDetails = async (movieId) => {
    if (!movieId) {
        console.error('No movie ID provided');
        return;
    }

    try {
        // Fetch detailed movie information from TMDb API
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_API_MOVIES}&language=en-US&append_to_response=credits`);
        if (response.ok) {
            const movieData = await response.json();
            // Display additional movie details on the page

            // Genre
            document.getElementById('genre').textContent = movieData.genres.map(genre => genre.name).join(', ');

            // Release Date
            document.getElementById('release-date').textContent = movieData.release_date;

            // Runtime
            document.getElementById('runtime').textContent = movieData.runtime;

            // Director
            const director = movieData.credits.crew.find(member => member.job === 'Director');
            document.getElementById('director').textContent = director ? director.name : 'N/A';

            // Cast
            const castNames = movieData.credits.cast.map(member => member.name).join(', ');
            document.getElementById('cast').textContent = castNames;

            // Production Studio
            document.getElementById('production-studio').textContent = movieData.production_companies.map(company => company.name).join(', ');

            // Plot Summary
            document.getElementById('plot-summary').textContent = movieData.overview;
        } else {
            console.error('Error fetching additional movie details');
        }
    } catch (error) {
        console.error(error);
    }
};

// Get movie ID from URL parameters
function getMovieId() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (!movieId) {
        console.error('No movie ID provided');
        // Redirect to home page if no movie ID is provided
        window.location.href = 'index.html';
    }
    return movieId;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    const movieId = getMovieId();
    if (movieId) {
        await displayMovieDetails(movieId);
        await displayMovieTrailer(movieId);
        await displayAdditionalMovieDetails(movieId);
    }
    await initializeCommon();
});

