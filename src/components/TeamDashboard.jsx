import React from 'react';
import PropTypes from 'prop-types';

// This component displays the team dashboard, showing the total contributions and individual contributions.
// It takes teamData and individualContributions as props.
// The teamData prop contains the total contributions and goal for the team.
const TeamDashboard = ({ teamData, individualContributions }) => {
    return (
        <div>
            <h2>Team Dashboard</h2>
            <p>Total Contributions: ${teamData.totalContributions}</p>
            <p>Goal: ${teamData.goal}</p>
            <ul>
                {individualContributions.map((contribution, index) => (
                    <li key={index}>
                        {contribution.name}: ${contribution.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

TeamDashboard.propTypes = {
    teamData: PropTypes.shape({
        totalContributions: PropTypes.number.isRequired,
        goal: PropTypes.number.isRequired,
    }).isRequired,
    individualContributions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default TeamDashboard;