let players = [];
let matches = [];
let currentRound = 1;
let tournamentStarted = false;

function addPlayer() {
    const playerNameInput = document.getElementById("playerName");
    const playerName = playerNameInput.value.trim();

    if (playerName !== "") {
        if (players.some(player => player.name === playerName)) {
            alert("El nombre del jugador ya existe. Por favor, ingresa un nombre diferente.");
        } else {
            players.push({ name: playerName, points: 0 });
            updateStandings();
            playerNameInput.value = ""; // Limpiar el campo de entrada después de agregar un jugador
        }
    } else {
        alert("Por favor, ingresa un nombre válido para el jugador.");
    }
}

function updateStandings() {
    players.sort((a, b) => b.points - a.points);

    const standingsTable = document.getElementById("standings");
    standingsTable.innerHTML = `
        <tr>
            <th>Posición</th>
            <th>Jugador</th>
            <th>Puntos</th>
        </tr>
    `;

    players.forEach((player, index) => {
        const row = standingsTable.insertRow(-1);
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = player.name;
        row.insertCell(2).textContent = player.points;
    });
}

function playTournament() {
    generateMatches();
    displayMatchesByRound();
    document.getElementById("playerName").style.display = "none";
    document.getElementById("playerName").previousElementSibling.style.display = "none"; // Ocultar el texto "Jugadores:"
    document.querySelector("button").style.display = "none"; // Ocultar el botón "Agregar Jugador"
    document.querySelectorAll("button")[1].style.display = "none"; // Ocultar el botón "Iniciar Torneo"
}

function generateMatches() {
    matches = [];

    let numPlayers = players.length;

    if (numPlayers % 4 !== 0) {
        alert("El número de jugadores debe ser múltiplo de 4 para formar los enfrentamientos correctamente en parejas de 2 vs 2.");
        return;
    }

    let playerIndices = [...Array(numPlayers).keys()]; // Array de índices de jugadores

    for (let round = 1; round < numPlayers; round++) {
        let roundMatches = [];

        for (let i = 0; i < numPlayers / 2; i += 2) {
            let homeIndex1 = playerIndices[i];
            let homeIndex2 = playerIndices[i + 1];
            let awayIndex1 = playerIndices[i + numPlayers / 2];
            let awayIndex2 = playerIndices[i + numPlayers / 2 + 1];

            roundMatches.push({
                home: [players[homeIndex1].name, players[homeIndex2].name],
                away: [players[awayIndex1].name, players[awayIndex2].name],
                homeScore: [0, 0],
                awayScore: [0, 0]
            });
        }

        matches.push(roundMatches);

        // Rotar los índices de los jugadores para la siguiente ronda
        playerIndices.splice(1, 0, playerIndices.pop());
    }
}

function updateResults() {
    players.forEach(player => player.points = 0); // Reiniciar los puntos de todos los jugadores antes de recalcularlos

    matches.forEach(roundMatches => {
        roundMatches.forEach(match => {
            const homeScore = parseInt(document.getElementById(`match${match.home[0]}-${match.home[1]}-home`).value);
            const awayScore = parseInt(document.getElementById(`match${match.away[0]}-${match.away[1]}-away`).value);

            if (!isNaN(homeScore) && !isNaN(awayScore)) {
                match.homeScore = [homeScore, homeScore];
                match.awayScore = [awayScore, awayScore];
                players.find(p => p.name === match.home[0]).points += homeScore;
                players.find(p => p.name === match.home[1]).points += homeScore;
                players.find(p => p.name === match.away[0]).points += awayScore;
                players.find(p => p.name === match.away[1]).points += awayScore;
            }
        });
    });

    updateStandings(); // Actualizar la tabla de posiciones después de cada partido
}

function displayMatchesByRound() {
    let matchesHTML = "";

    matches.forEach((roundMatches, roundIndex) => {
        matchesHTML += `<h2>Jornada ${roundIndex + 1}:</h2>`;

        roundMatches.forEach((match, matchIndex) => {
            matchesHTML += `<p>Partido ${matchIndex + 1}:
                            ${match.home[0]} y ${match.home[1]} <input type="number" id="match${match.home[0]}-${match.home[1]}-home" min="0"> -
                            ${match.away[0]} y ${match.away[1]} <input type="number" id="match${match.away[0]}-${match.away[1]}-away" min="0"></p>`;
        });
    });

    document.getElementById("results").innerHTML = matchesHTML;

    matches.forEach((roundMatches, roundIndex) => {
        roundMatches.forEach((match, matchIndex) => {
            document.getElementById(`match${match.home[0]}-${match.home[1]}-home`).addEventListener('input', updateResults);
            document.getElementById(`match${match.away[0]}-${match.away[1]}-away`).addEventListener('input', updateResults);
        });
    });
}
