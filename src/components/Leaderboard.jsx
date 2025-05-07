import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This component fetches and displays the leaderboard of teams and their total contributions.

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const response = await axios.get('http://localhost:5000/api/leaderboard');
            setLeaderboard(response.data);
        };

        fetchLeaderboard();
    }, []);

    return (
        <div>
            {/* Leaderboard */}
<section className="card">
  <h2>🏆 Leaderboard</h2>
  <ol className="leaderboard-list">
    {leaderboard.map((team, index) => (
      <li key={index}>
        {index === 0 && '🥇'} {index === 1 && '🥈'} {index === 2 && '🥉'} 
        {team.name} – ${team.totalContributions}
      </li>
    ))}
  </ol>
</section>
        </div>
    );
};

export default Leaderboard;