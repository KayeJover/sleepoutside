const API_KEY = 'YOUR_TMDB_API_KEY';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w200';

document.addEventListener('DOMContentLoaded', () => {
    loadGenres();
    loadFavorites();
});

async function loadGenres() {
    try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        const data = await response.json();
        const genreSelect = document.getElementById('genre-filter');

        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

async function searchMovies() {
    const query = document.getElementById('search-input').value.trim();
    const genre = document.getElementById('genre-filter').value;
    const loadingText = document.getElementById('loading');
    const resultsContainer = document.getElementById('search-results');

    resultsContainer.innerHTML = '';
    loadingText.style.display = 'block';

    try {
        let url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;
        if (genre) {
            url += `&with_genres=${genre}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        loadingText.style.display = 'none';

        if (data.results.length === 0) {
            resultsContainer.innerHTML = '<p>No movies found. Try a different search.</p>';
            return;
        }

        data.results.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : 'placeholder.jpg'}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <button onclick="showMovieDetails(${movie.id})">Details</button>
                <button class="favorite-button" onclick="toggleFavorite(${movie.id}, '${movie.title}', '${movie.poster_path}')">❤️ Favorite</button>
            `;
            resultsContainer.appendChild(movieCard);
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        loadingText.style.display = 'none';
        resultsContainer.innerHTML = '<p>Failed to load movies. Please try again later.</p>';
    }
}

async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        const movie = await response.json();

        const modal = document.getElementById('movie-modal');
        const modalContent = document.getElementById('modal-content');

        modalContent.innerHTML = `
            <button class="modal-close" onclick="closeModal()">Close</button>
            <h2>${movie.title}</h2>
            <img src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : 'placeholder.jpg'}" alt="${movie.title}">
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p>${movie.overview || 'No description available.'}</p>
        `;

        modal.style.display = 'flex';
    } catch (error) {
        console.error('Error loading movie details:', error);
    }
}

function closeModal() {
    document.getElementById('movie-modal').style.display = 'none';
}

// --- FAVORITES FEATURE ---
function toggleFavorite(movieId, title, posterPath) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const index = favorites.findIndex(movie => movie.id === movieId);
    if (index === -1) {
        favorites.push({ id: movieId, title, posterPath });
        alert(`${title} added to favorites!`);
    } else {
        favorites.splice(index, 1);
        alert(`${title} removed from favorites!`);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites();
}

function loadFavorites() {
    const favoritesContainer = document.getElementById('favorites-list');
    favoritesContainer.innerHTML = '';

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p>No favorite movies yet.</p>';
        return;
    }

    // --- PLAN ---

    favorites.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.posterPath ? IMG_BASE_URL + movie.posterPath : 'placeholder.jpg'}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button class="favorite-button" onclick="toggleFavorite(${movie.id}, '${movie.title}', '${movie.posterPath}')">❌ Remove</button>
        `;
        favoritesContainer.appendChild(movieCard);
    });

    document.getElementById('event-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const eventName = document.getElementById('event-name').value;
        const eventDate = document.getElementById('event-date').value;
        const eventTime = document.getElementById('event-time').value;
        const participants = document.getElementById('participants').value;
        
        const eventSummary = `
            <h3>Event Summary</h3>
            <p><strong>Name:</strong> ${eventName}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Time:</strong> ${eventTime}</p>
            <p><strong>Participants:</strong> ${participants}</p>
        `;
        
        document.getElementById('event-summary').innerHTML = eventSummary;
    });

    
}
