import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';

// This component allows users to select a team, search for fundraisers, and make contributions to a cause.
// It manages the state of teams, selected team, contribution details, and team progress using React hooks.
// It also fetches the leaderboard data and displays it to the user. The component uses WebSocket to update team progress in real-time.
// The component is structured to provide a user-friendly interface for team contributions and fundraising.
// The component is styled with CSS classes for better presentation.
// The component is designed to be reusable and can be integrated into a larger application for team-based fundraising.
// The component uses the useEffect hook to handle side effects such as fetching data and setting up WebSocket connections.
// The component is designed to be responsive and works well on different screen sizes.

const TeamContribution = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [contribution, setContribution] = useState({ name: '', amount: '' });
    const [teamProgress, setTeamProgress] = useState(null);
    const [cause, setCause] = useState('');
    const [fundraisers, setFundraisers] = useState([]);
    const [thankYouMessage, setThankYouMessage] = useState('');
    const [selectedFundraiser, setSelectedFundraiser] = useState({
        id: null,
        name: '',
        description: '',
    });
    const motivationalMessage = teamProgress 
    ? teamProgress.totalContributions / teamProgress.goal < 0.5
    ? 'Keep going! You are halfway there! 🎉'
    : 'Amazing job! You are almost at your goal! 🚀': '';


//const [leaderboard, setLeaderboard] = useState([]);

// useEffect(() => {
//     const fetchLeaderboard = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/leaderboard');
//             setLeaderboard(response.data);
//         } catch (err) {
//             console.error('Error fetching leaderboard:', err);
//         }
//     };

//     fetchLeaderboard();
// }, []);

const [currentStep, setCurrentStep] = useState(1);
const handleNextStep = () => {
  if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
  }
};

const handlePreviousStep = () => {
  if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
  }
};

useEffect(() => {
    if (teamProgress && teamProgress.totalContributions >= teamProgress.goal) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    }
}, [teamProgress]);

useEffect(() => {
    const ws = new WebSocket(`ws://localhost:5000/${selectedTeam?.id}`);

    ws.onmessage = (event) => {
        const updatedTeam = JSON.parse(event.data);
        setTeamProgress(updatedTeam);
    };

    return () => ws.close();
}, [selectedTeam]);

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

    useEffect(() => {
        if (selectedTeam) {
            setTeamProgress(selectedTeam);
        }
    }, [selectedTeam]);

    useEffect(() => {
        setSelectedFundraiser(null);
        setFundraisers([]);
        setCause('');
      }, [selectedTeam]);
      
      // to show a spinner
      const [isLoading, setIsLoading] = useState(false);
      const handleFetchFundraisers = async () => {
        if (!cause) {
        //  alert('Please enter a fundraising cause.');
          return;
        }
      
        try {
          setIsLoading(true);
          const response = await axios.post('http://localhost:5001/api/gpt-nonprofits', {
            query: cause,
          });
          setFundraisers(response.data || []);
           // Automatically move to the next step if fundraisers are successfully loaded
        if (response.data && response.data.length > 0) {
          setCurrentStep(3);
        }
        } catch (err) {
          console.error('Error fetching fundraisers:', err);
        //  alert('Failed to fetch fundraisers. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };
      

    const handleContribute = async () => {
        if (!selectedTeam || !selectedFundraiser || !contribution.name || !contribution.amount) {
            alert('Please select a team, a fundraiser, and provide contributor details.');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/api/teams/${selectedTeam.id}/contribute`,
                contribution
            );

            alert(`Contribution added to ${selectedTeam.name}!`);
            setContribution({ name: '', amount: '' });
            setCurrentStep(5);
     
                setThankYouMessage(`🎉 Thank you, ${contribution.name}, for contributing $${contribution.amount} to ${selectedFundraiser.name}!`);
                setCurrentStep(5); // Move to the thank-you step
                setTimeout(() => {
                  setThankYouMessage('');
                  setCurrentStep(1); // Reset to the first step after 5 seconds
                }, 5000);

              
            // Update the team progress with the latest data
            setTeamProgress(response.data.team);
        } catch (err) {
            console.error('Error contributing to team:', err);
            alert('Failed to add contribution. Please try again.');
        }
    };


    return (

<div className="container">
{/* Header */}
<header className="header">
  <h1>Giving Team Challenge</h1>
  <p>Join a team and contribute to a cause!</p>
  <p>Choose a team, select a fundraiser, and make a contribution!</p>
  <p>Lets make a difference together! 🌍</p>
  <p>Powered by <a href="https://www.every.org/">Every.org</a></p>
  <p>Inspired by <a href="https://www.givingteamchallenge.com/">Giving Team Challenge</a></p>
 
</header> 

{/* Step 1: Select Team */}
{currentStep === 1 && (
    <section className="card">
        <h2>1️⃣ Select a Team</h2>
        <select onChange={e => setSelectedTeam(teams.find(t => t.id === parseInt(e.target.value)))}>
            <option value="">-- Choose a team --</option>
            {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select>
        <button onClick={handleNextStep} disabled={!selectedTeam}>
            Next ➡️
        </button>
    </section>
)}

{/* Step 2: Enter Cause */}
{currentStep === 2 && (
    <section className="card">
        <h2>2️⃣ Search for a Fundraiser</h2>
        <input
            type="text"
            placeholder="e.g. education, animal rescue"
            value={cause}
            onChange={(e) => setCause(e.target.value)}
        />
        {isLoading ? (
            <p>🔄 Searching for fundraisers...</p>
        ) : (
            <button
                onClick={handleFetchFundraisers}
                disabled={!cause.trim()}
                style={{
                    opacity: !cause.trim() ? 0.6 : 1,
                    cursor: !cause.trim() ? 'not-allowed' : 'pointer',
                }}
            >
                Search Fundraisers
            </button>
        )}
          <div className="navigation-buttons">
            <button onClick={handlePreviousStep}>⬅️ Back</button>
            <button onClick={handleNextStep} disabled={fundraisers.length === 0}>
                Next ➡️
            </button>
        </div>
    </section>
)}

{/* Step 3: Fundraisers List */}
{currentStep === 3 && fundraisers.length > 0 && (
    <section className="card">
        <h2>3️⃣ Select a Fundraiser</h2>
        <ul className="fundraiser-list">
            {fundraisers.map((f) => (
                <li key={f.id} className="fundraiser-item">
                    <input
                        type="radio"
                        name="fundraiser"
                        value={f.id}
                        onChange={() => setSelectedFundraiser(f)}
                    />
                    <div>
                        <h4>{f.name}</h4>
                        <p>{f.description}</p>
                        {f.logoUrl && <img src={f.logoUrl} alt={f.name} className="logo" />}
                    </div>
                </li>
            ))}
        </ul>
        <div className="navigation-buttons">
            <button onClick={handlePreviousStep}>⬅️ Back</button>
            <button onClick={handleNextStep} disabled={fundraisers.length === 0}>
                Next ➡️
            </button>
        </div>
    </section>
)}

{/* Step 4: Contribute */}
{currentStep === 4 && selectedFundraiser && (
    <section className="card">
        <h2>4️⃣ Make a Contribution</h2>
        <input
            type="text"
            placeholder="Your Name"
            value={contribution.name}
            onChange={(e) => setContribution({ ...contribution, name: e.target.value })}
        />
        <input
            type="number"
            placeholder="Amount"
            value={contribution.amount}
            onChange={(e) => setContribution({ ...contribution, amount: e.target.value })}
        />
        <button onClick={handleContribute}>
            Contribute 🎁
        </button>
    </section>
)}
{currentStep === 5 && thankYouMessage && (
  <section className="card">
    <div className="thank-you-message">
      <p>{thankYouMessage}</p>
    </div>

    {teamProgress && (
      <div className="team-progress-bar" style={{ marginTop: '1.5rem' }}>
        <h3>{teamProgress.name} Progress</h3>
        <p>Goal: ${teamProgress.goal}</p>
        <p>Total Contributions: ${teamProgress.totalContributions}</p>
        <div
          className="progress-bar"
          style={{
            width: '100%',
            background: '#e0e0e0',
            height: '30px',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            className="progress-fill"
            style={{
              width: `${Math.min((teamProgress.totalContributions / teamProgress.goal) * 100, 100)}%`,
              backgroundColor: '#4caf50',
              height: '100%',
              color: 'white',
              textAlign: 'center',
              lineHeight: '30px',
              fontWeight: 'bold',
              transition: 'width 0.5s ease-in-out',
            }}
          >
            {Math.min((teamProgress.totalContributions / teamProgress.goal) * 100, 100).toFixed(1)}%
          </div>
        </div>
      </div>
    )}
  </section>
)}




{/* Motivational Message */}
{motivationalMessage && (
  <section className="card">
    <p className="motivational">{motivationalMessage}</p>
  </section>
)}
</div>

        
    );
};




export default TeamContribution;