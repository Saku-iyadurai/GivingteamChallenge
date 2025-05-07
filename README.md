# Giving Teams Challenge

## Project Overview
The Giving Teams Challenge is a Progressive Web App (PWA) designed to facilitate fundraising for nonprofit organizations. Users can search for nonprofits, create or join fundraising teams, track contributions in real-time, and engage in friendly competition through leaderboards.

## Features
- **Nonprofit Search**: Users can search for and select nonprofit organizations by name or cause.
- **Team Management**: Create or join fundraising teams associated with selected nonprofits.
- **Real-Time Tracking**: Track and display team and individual contributions dynamically.
- **Leaderboards**: View leaderboards showcasing top-performing teams and individuals based on contributions.

## Technical Implementation

### 1. Authentication & API Access
- **API Key Generation**: Register and obtain API keys from Every.org's developer dashboard.
- **Authentication**: Use the public API key for accessing public endpoints.

### 2. Nonprofit Search Functionality
- **Endpoint**: `GET /v0.2/search/:searchTerm`
- Users can search for nonprofits and view relevant information.

### 3. Team Creation and Management
- Design a backend system to handle team creation and membership.
- Utilize Every.org's Fundraisers API for managing fundraisers.

### 4. Donation Tracking and Leaderboards
- Set up webhooks for real-time updates on donations.
- Aggregate data to display leaderboards.

### 5. User Interface and Experience
- Create an intuitive and responsive UI.
- Ensure the application is installable as a PWA.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/giving-teams-challenge.git
   ```
2. Navigate to the project directory:
   ```
   cd giving-teams-challenge
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server, run:
```
npm start
```
The application will be available at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.