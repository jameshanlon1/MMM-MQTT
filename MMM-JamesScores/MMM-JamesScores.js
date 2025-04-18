Module.register("MMM-JamesScores", {
    defaults: {
        apiUrl: "https://api.sportmonks.com/v3/football/livescores/inplay?include=participants;scores;venue;periods;events;league",
        apiToken: "Wn5Lyy9UBdQxDKfCcMj3nOY676L0WObpp5nJR6uS6rDgL3QCc5f78yzAEgB7",  // Set in config.js
        updateInterval: 5 * 60 * 1000  // Every 5 minutes
    },

    start: function() {
        this.scores = null;
        this.loaded = false;
        this.sendSocketNotification("GET_SCORES", {
            apiToken: this.config.apiToken
        });
        this.scheduleUpdate(); // Start polling every 5 mins
    },

    socketNotificationReceived: function (notification, payload) {
        console.log("Notification received:", notification); // 🔍 Add this
    
        if (notification === "SCORES_DATA") {
            console.log("Scores payload:", payload); // 🔍 Add this
            this.scores = payload;
            this.loaded = true;
            this.updateDom();
        } else if (notification === "SCORES_ERROR") {
            console.error("Score error:", payload);
        }
    },
    
      

      getDom: function () {
        const wrapper = document.createElement("div");
    
        if (!this.loaded) {
            wrapper.innerHTML = "Loading scores...";
            return wrapper;
        }
    
        if (!this.scores || !this.scores.data || this.scores.data.length === 0) {
            wrapper.innerHTML = "No live matches.";
            return wrapper;
        }
    
        this.scores.data.forEach(match => {
            const div = document.createElement("div");
    
            const homeTeam = match.participants?.find(p => p.meta?.location === "home")?.name || "Home";
            const awayTeam = match.participants?.find(p => p.meta?.location === "away")?.name || "Away";
    
            const homeScore = match.scores?.find(s => s.description === "CURRENT" && s.score.participant === "home")?.score?.goals ?? "-";
            const awayScore = match.scores?.find(s => s.description === "CURRENT" && s.score.participant === "away")?.score?.goals ?? "-";
    
            div.innerHTML = `${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`;
            wrapper.appendChild(div);
        });
    
        return wrapper;
    },
      

    getData: function() {
        const url = `${this.config.apiUrl}&api_token=${this.config.apiToken}`;
        const self = this;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Parse data
                self.scores = (data.data || []).map(match => ({
                    home: match.participants?.[0]?.name || "Team 1",
                    away: match.participants?.[1]?.name || "Team 2",
                    score: `${match.scores?.[0]?.score?.current || 0} - ${match.scores?.[1]?.score?.current || 0}`
                }));
                self.loaded = true;
                self.updateDom();
            })
            .catch(err => {
                console.error("Failed to load scores:", err);
            });
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getData();
        }, this.config.updateInterval);
    }
});
