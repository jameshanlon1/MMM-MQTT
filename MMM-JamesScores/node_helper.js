const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
  start: function () {
    console.log("[MMM-JamesScores] Node helper started");
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_TEAM_DATA") {
      this.getTeamData(payload);
    }
  },

  getTeamData: async function (payload) {
    const token = payload.apiToken;
    const teamId = payload.teamId;
    const maxResults = payload.maxResults || 10;
    
    try {
      // First, get the team information
      const teamUrl = `https://api.sportmonks.com/v3/football/teams/${teamId}?api_token=${token}`;
      const teamResponse = await axios.get(teamUrl);
      const teamData = teamResponse.data.data;
      
      // Now get the fixtures (past, current, and upcoming) for this team
      const today = new Date();
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - 30); // Last 30 days
      
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 30); // Next 30 days
      
      // Format dates as YYYY-MM-DD
      const startDate = pastDate.toISOString().split('T')[0];
      const endDate = futureDate.toISOString().split('T')[0];
      
      // Get the fixtures for this team between these dates
      const fixturesUrl = `https://api.sportmonks.com/v3/football/teams/${teamId}?api_token=${token}`;
      
      const fixturesResponse = await axios.get(fixturesUrl);
      const fixtures = fixturesResponse.data.data;
      
      // Categorize fixtures into live, recent, and upcoming
      const liveMatches = [];
      const recentResults = [];
      const upcomingMatches = [];
      
      fixtures.forEach(fixture => {
        // Get fixture date
        const fixtureDate = new Date(fixture.starting_at.date_time);
        
        if (fixture.state.id === 3) { // Live match
          liveMatches.push(fixture);
        } 
        else if (fixture.state.id === 4 || fixture.state.id === 5) { // Finished/Postponed
          // Only include if it happened in the past
          if (fixtureDate < today) {
            recentResults.push(fixture);
          }
        }
        else if (fixture.state.id === 1 || fixture.state.id === 2) { // Not started/Pre-match
          // Only include if it's in the future
          if (fixtureDate > today) {
            upcomingMatches.push(fixture);
          }
        }
      });
      
      // Sort recent results by date (most recent first)
      recentResults.sort((a, b) => {
        const dateA = new Date(a.starting_at.date_time);
        const dateB = new Date(b.starting_at.date_time);
        return dateB - dateA;
      });
      
      // Limit to maxResults
      const limitedRecentResults = recentResults.slice(0, maxResults);
      
      // Sort upcoming matches by date (soonest first)
      upcomingMatches.sort((a, b) => {
        const dateA = new Date(a.starting_at.date_time);
        const dateB = new Date(b.starting_at.date_time);
        return dateA - dateB;
      });
      
      // Limit to maxResults
      const limitedUpcomingMatches = upcomingMatches.slice(0, maxResults);
      
      // Send the data back to the module
      this.sendSocketNotification("TEAM_DATA", {
        team: teamData,
        live: liveMatches,
        recent: limitedRecentResults,
        upcoming: limitedUpcomingMatches
      });
      
    } catch (error) {
      console.error("[MMM-JamesScores] Error fetching team data:", error);
      this.sendSocketNotification("TEAM_DATA_ERROR", error.toString());
    }
  }
});