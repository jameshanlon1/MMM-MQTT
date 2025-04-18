const NodeHelper = require("node_helper");
const axios = require("axios");  // Use axios instead of fetch

module.exports = NodeHelper.create({
  start: function () {
    console.log("[MMM-JamesScores] Node helper started");
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_SCORES") {
      this.getScores(payload);
    }
  },

  getScores: async function (payload) {
    const token = payload.apiToken;
    const url = `https://api.sportmonks.com/v3/football/livescores/inplay?include=participants;scores;venue;periods;events;league&api_token=${token}&league_id=8`;

    try {
      const response = await axios.get(url);  // Use axios to fetch data
      const data = response.data;
      console.log("[MMM-JamesScores] Fetched data:", JSON.stringify(data, null, 2));
      this.sendSocketNotification("SCORES_DATA", data);
    } catch (error) {
      console.error("[MMM-JamesScores] Error fetching scores:", error);
      this.sendSocketNotification("SCORES_ERROR", error.toString());
    }
  }
});
