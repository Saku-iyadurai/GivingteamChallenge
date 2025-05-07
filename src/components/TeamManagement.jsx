import React, { useState, useEffect } from 'react';
import axios from 'axios';

// This component allows users to manage teams, including creating new teams and viewing existing ones.
// It uses React hooks to manage state and side effects, and Axios for API requests to a local server.
// The component is structured to provide a user-friendly interface for team management, including input fields for team name and goal amount.
// The component also handles the display of existing teams in a table format, showing their total contributions and number of members.
// The component is designed to be reusable and can be integrated into a larger application for team-based fundraising.
// The component is styled with CSS classes for better presentation.


const TeamManagement = () => {
    const [newTeam, setNewTeam] = useState({ name: '', goal: '' });
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/teams');
                setTeams(response.data);
            } catch (err) {
                console.error('Error fetching teams:', err);
            }
        };

        fetchTeams();
    }, []);

    const handleCreateTeam = async () => {
        if (!newTeam.name || !newTeam.goal) {
            alert('Please provide a team name and goal.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/teams', newTeam);
            alert(`Team "${response.data.name}" created successfully!`);
            setTeams([...teams, response.data]);
            setNewTeam({ name: '', goal: '' });
        } catch (err) {
            console.error('Error creating team:', err);
            alert('Failed to create team. Please try again.');
        }
    };

    return (
        <div>
            <h2>Manage Teams</h2>

            {/* Create Team Form */}
            <div>
                <h3>Create a New Team</h3>
                <input
                    type="text"
                    placeholder="Team Name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Goal Amount"
                    value={newTeam.goal}
                    onChange={(e) => setNewTeam({ ...newTeam, goal: e.target.value })}
                />
                <button onClick={handleCreateTeam}>Create Team</button>
            </div>

            {/* Existing Teams Table */}
            <div>
                <h3>Existing Teams</h3>
                {teams.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>Goal</th>
                                <th>Total Contributions</th>
                                <th>Members</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teams.map((team) => (
                                <tr key={team.id}>
                                    <td>{team.name}</td>
                                    <td>${team.goal}</td>
                                    <td>${team.totalContributions}</td>
                                    <td>{team.members.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No teams available. Create a new team to get started!</p>
                )}
            </div>
        </div>
    );
};

export default TeamManagement;