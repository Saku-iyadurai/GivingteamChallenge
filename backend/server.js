const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Local storage for donations (in-memory)
let donations = []; // Declare and initialize the donations array

const teams = []; // In-memory storage for teams


// Route to create a new team
app.post('/api/teams', (req, res) => {
    const { name, goal } = req.body;

    if (!name || !goal) {
        return res.status(400).json({ error: 'Team name and goal are required' });
    }

    const newTeam = {
        id: teams.length + 1,
        name,
        goal,
        totalContributions: 0,
        members: [],
    };

    teams.push(newTeam);
    res.status(201).json(newTeam);
});

// Route to get all teams
app.get('/api/teams', (req, res) => {
    res.json(teams);
});

const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Store WebSocket connections
const connections = new Map();

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
    const teamId = req.url.split('/')[1]; // Extract teamId from the URL
    if (!connections.has(teamId)) {
        connections.set(teamId, []);
    }
    connections.get(teamId).push(ws);

    ws.on('close', () => {
        const teamConnections = connections.get(teamId) || [];
        connections.set(
            teamId,
            teamConnections.filter((conn) => conn !== ws)
        );
    });
});

// Broadcast updates to all WebSocket clients for a specific team
const broadcastUpdate = (teamId, team) => {
    const teamConnections = connections.get(teamId) || [];
    teamConnections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(team));
        }
    });
};

// Update the contribution route to broadcast updates
app.post('/api/teams/:teamId/contribute', (req, res) => {
    const { teamId } = req.params;
    const { name, amount } = req.body;

    if (!name || !amount) {
        return res.status(400).json({ error: 'Contributor name and amount are required' });
    }

    const team = teams.find((t) => t.id === parseInt(teamId));
    if (!team) {
        return res.status(404).json({ error: 'Team not found' });
    }

    const contribution = { name, amount: parseFloat(amount)  };
    team.members.push(contribution);
    team.totalContributions += parseFloat(amount); // Add as a number

    // Broadcast the updated team to all connected clients
    broadcastUpdate(teamId, team);

    res.status(201).json({ success: true, team });
});

// Upgrade HTTP server to handle WebSocket connections
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
    });
});

// Route to get the leaderboard
app.get('/api/leaderboard', (req, res) => {
    const leaderboard = teams
        .sort((a, b) => b.totalContributions - a.totalContributions)
        .map((team) => ({
            name: team.name,
            totalContributions: team.totalContributions,
        }));

    res.json(leaderboard);
});


// // API Base URL and API Key
// const API_BASE_URL = 'https://partners.every.org/v0.2';
// const EVERY_ORG_API_KEY = 'pk_live_fa59d05e56ab415eef3862ae65b37aff';
// app.get('/api/search/:searchTerm', async (req, res) => {
//     const { searchTerm } = req.params;
//     const queryParams =
//      {
//         "apiKey": EVERY_ORG_API_KEY,
//         "take": 3
//     } // Extract query parameters from the request
//     console.log(`Searching for nonprofits with term: ${searchTerm} and query params:`, queryParams);

//     try {
//         // Construct the query string for the API request
//         const response = await get(`${API_BASE_URL}/search/${searchTerm}`, {
           
//             params: queryParams, // Pass query parameters to the API request
//         });

//         console.log('API response:', response.data);
//         res.json(response.data);
//     } catch (error) {
//         console.log('Error fetching nonprofits:', error.message);
//         res.status(500).json({ error: 'Error fetching nonprofits' });
//     }
// });

// Route to donate to a nonprofit
app.post('/api/donate', async (req, res) => {
    const { nonprofitId, amount } = req.body;
    try {
         // Save the donation to local storage (in-memory)
         const donation = { nonprofitId, amount, timestamp: new Date().toISOString() };
         donations.push(donation);
 
         console.log('Donation saved locally:', donation);
 
         // Respond to the client
         res.json({ success: true, donation });
    } catch (error) {
        res.status(500).json({ error: 'Error processing donation' });
    }
});

// Route to get all donations
app.get('/api/donations', (req, res) => {
    res.json(donations);
});

// // Route to get fundraiser details
// app.get('/api/fundraiser/:fundraiserId', async (req, res) => {
//     const { fundraiserId } = req.params;
//     const queryParams =
//      {
//         "apiKey": EVERY_ORG_API_KEY,
//         "take": 3
//     } 
//     try {
//         const response = await get(`${API_BASE_URL}/nonprofit/maps/${fundraiserId}`,  {
           
//             params: queryParams, // Pass query parameters to the API request
//         });
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching fundraiser details' });
//     }
// });

// Route to get the overlay for a specific team
// app.get('/overlay/:teamId', (req, res) => {
//     const { teamId } = req.params;
//     const team = teams.find((t) => t.id === parseInt(teamId));

//     if (!team) {
//         return res.status(404).send('Team not found');
//     }
//     res.setHeader('X-Frame-Options', 'ALLOWALL'); // Allow embedding in iframes
//     res.send(`
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <title>${team.name} Team Progress</title>
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     text-align: center;
//                     background-color: transparent;
//                     margin: 0;
//                     padding: 0;
//                 }
//                 .overlay {
//                     margin-top: 20%;
//                 }
//                 .progress-bar {
//                     width: 80%;
//                     margin: 20px auto;
//                     background-color: #ddd;
//                     border-radius: 5px;
//                     overflow: hidden;
//                 }
//                 .progress {
//                     height: 30px;
//                     background-color: #4caf50;
//                     text-align: center;
//                     color: white;
//                     line-height: 30px;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="overlay">
//                 <h1 id="team-name">${team.name}</h1>
//                 <h2 id="team-goal">Goal: $${team.goal}</h2>
//                 <h2 id="team-contributions">Total Contributions: $${team.totalContributions}</h2>
//                 <div class="progress-bar">
//                     <div id="progress" class="progress" style="width: ${(team.totalContributions / team.goal) * 100}%;"></div>
//                 </div>
//             </div>
//             <script>
//                 const teamId = ${team.id};
//                 const ws = new WebSocket('ws://' + location.host + '/' + teamId);

//                 ws.onmessage = (event) => {
//                     const updatedTeam = JSON.parse(event.data);
//                     document.getElementById('team-name').textContent = updatedTeam.name;
//                     document.getElementById('team-goal').textContent = 'Goal: $' + updatedTeam.goal;
//                     document.getElementById('team-contributions').textContent = 'Total Contributions: $' + updatedTeam.totalContributions;
//                     document.getElementById('progress').style.width = (updatedTeam.totalContributions / updatedTeam.goal) * 100 + '%';
//                 };
//             </script>
//         </body>
//         </html>
//     `);
// });
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});