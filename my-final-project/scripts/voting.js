
    document.addEventListener("DOMContentLoaded", function () {
        const movies = ["Inception", "The Dark Knight", "Interstellar", "Avengers: Endgame", "Titanic"];
        const movieList = document.getElementById("movie-list");

        // Retrieve votes from localStorage or initialize them
        let votes = JSON.parse(localStorage.getItem("movieVotes")) || {};
        movies.forEach(movie => {
            if (!votes[movie]) votes[movie] = 0;
        });

        function updateWinner() {
            let winner = Object.keys(votes).reduce((a, b) => (votes[a] > votes[b] ? a : b));
            document.getElementById("winner-display").textContent = `Current Winner: ${winner} (${votes[winner]} votes)`;
        }

        function updateVotes() {
            localStorage.setItem("movieVotes", JSON.stringify(votes));
            document.querySelectorAll(".vote-count").forEach(countElem => {
                const movie = countElem.dataset.movie;
                countElem.textContent = `Votes: ${votes[movie]}`;
            });
            updateWinner();
        }

        movies.forEach(movie => {
            const movieOption = document.createElement("div");
            movieOption.classList.add("movie-option");

            const title = document.createElement("span");
            title.textContent = movie;

            const voteCount = document.createElement("span");
            voteCount.classList.add("vote-count");
            voteCount.dataset.movie = movie;
            voteCount.textContent = `Votes: ${votes[movie]}`;

            const voteButton = document.createElement("button");
            voteButton.classList.add("vote-button");
            voteButton.textContent = "Vote";
            voteButton.onclick = () => {
                votes[movie]++;
                updateVotes();
            };

            movieOption.appendChild(title);
            movieOption.appendChild(voteCount);
            movieOption.appendChild(voteButton);
            movieList.appendChild(movieOption);
        });

        // Display winner section
        const winnerSection = document.createElement("h2");
        winnerSection.id = "winner-display";
        document.querySelector("main").appendChild(winnerSection);
        updateWinner();
    });

