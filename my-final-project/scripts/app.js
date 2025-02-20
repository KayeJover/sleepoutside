const API_KEY = '1c6fb6f48d642a316a1a8bb644e7d909'; 
const BASE_URL = 'https://api.themoviedb.org/3'; 
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w200';


async function fetchMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch movie data.');

        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

async function loadGenres() {
    try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Genres Data:", data); 

        const genreSelect = document.getElementById('genre-filter');
        if (!genreSelect) {
            console.error("Genre select element not found!");
            return;
        }

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

document.addEventListener('DOMContentLoaded', () => {
    loadGenres(); 
    loadFavorites();
});


async function searchMovies(query) {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Search Results:", data); // Log the search results

        displayMovies(data.results);
    } catch (error) {
        console.error('Error searching for movies:', error);
    }
}

// Display movies dynamically
function displayMovies(movies) {
    const container = document.getElementById('movie-container');
    container.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : 'placeholder.jpg'}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average} | 🗓 ${movie.release_date}</p>
        `;
        container.appendChild(movieCard);
    });
}

// Load movies on page load
document.addEventListener('DOMContentLoaded', fetchMovies);


// Handle search button click
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) fetchMovies(query);
});

function showMovieDetails(movieId) {
    const modal = document.getElementById('movie-modal');
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('movie-modal');
    modal.classList.remove('show');
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

    // --- PLAN --- //

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

    ///--- VOTE ---///
    function voteMovie(movieId, title) {
        let votes = JSON.parse(localStorage.getItem('votes')) || {};
    
        if (!votes[movieId]) {
            votes[movieId] = { title: title, count: 1 };
        } else {
            votes[movieId].count++;
        }
    
        localStorage.setItem('votes', JSON.stringify(votes));
        alert(`You voted for "${title}". Total votes: ${votes[movieId].count}`);
        displayVotes();
    }
    
    function displayVotes() {
        const votesContainer = document.getElementById('votes-list');
        votesContainer.innerHTML = '';
    
        const votes = JSON.parse(localStorage.getItem('votes')) || {};
    
        if (Object.keys(votes).length === 0) {
            votesContainer.innerHTML = '<p>No votes yet.</p>';
            return;
        }
    
        for (const movieId in votes) {
            const voteItem = document.createElement('div');
            voteItem.classList.add('vote-item');
            voteItem.innerHTML = `<p>${votes[movieId].title}: ${votes[movieId].count} votes</p>`;
            votesContainer.appendChild(voteItem);
        }
    }
    
    document.addEventListener('DOMContentLoaded', displayVotes);
    
}
