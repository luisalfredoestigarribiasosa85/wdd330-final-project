// Get movie ID from the query parameter in the URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

export const displayMovieDetails = async () => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${import.meta.env.VITE_API_MOVIES}&language=en-US`);
        if (response.ok) {
            const movieData = await response.json();
            // Display movie details on the page
            const movieDetailsContainer = document.getElementById('movie-details');
            const imageUrl = `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`;
            movieDetailsContainer.innerHTML = `
                <div class="movie-details-content">
                    <img class="poster" src="${imageUrl}" alt="${movieData.title}" loading="lazy">
                    <div class="movie-info">
                        <h2>${movieData.title}</h2>
                        <p>${movieData.overview}</p>
                        <!-- Add more movie details as needed -->
                    </div>
                </div>
            `;
        } else {
            console.error('Error fetching movie details');
        }
    } catch (error) {
        console.error(error);
    }
};




//Display movie trailers...

export const displayMovieTrailer = async () => {
    try {
        // Fetch movie videos from TMDb API (assuming 'videos' endpoint returns trailers)
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${import.meta.env.VITE_API_MOVIES}`);
        if (response.ok) {
            const data = await response.json();
            // Find a trailer among the videos (assuming type 'Trailer')
            const trailer = data.results.find(video => video.type === 'Trailer');
            if (trailer) {
                // Embed YouTube video player
                const trailerContainer = document.getElementById('trailer');
                trailerContainer.innerHTML = `
                    <iframe width="100%" height="400" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
                `;
            } else {
                console.log('No trailer available for this movie.');
            }
        } else {
            console.error('Error fetching movie videos');
        }
    } catch (error) {
        console.error(error);
    }
};




// Display movie details...

export const displayAdditionalMovieDetails = async () => {
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

