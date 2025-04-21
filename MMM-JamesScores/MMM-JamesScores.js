Module.register("MMM-JamesScores", {
    defaults: {
        apiToken: "Wn5Lyy9UBdQxDKfCcMj3nOY676L0WObpp5nJR6uS6rDgL3QCc5f78yzAEgB7",  // Set in config.js
        updateInterval: 5 * 60 * 1000,  // Every 5 minutes
        teamId: 8, // Default to Liverpool FC (change to your preferred team)
        maxResults: 10, // Maximum number of results to show
        showLiveMatches: true,
        showRecentResults: true,
        showUpcomingMatches: true
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.teamData = null;
        this.liveMatches = null;
        this.recentResults = null;
        this.upcomingMatches = null;
        this.loaded = false;
        
        // Initial data request
        this.sendSocketNotification("GET_TEAM_DATA", {
            apiToken: this.config.apiToken,
            teamId: this.config.teamId,
            maxResults: this.config.maxResults
        });
        
        // Schedule updates
        var self = this;
        setInterval(function() {
            self.sendSocketNotification("GET_TEAM_DATA", {
                apiToken: self.config.apiToken,
                teamId: self.config.teamId,
                maxResults: self.config.maxResults
            });
        }, this.config.updateInterval);
    },

    getStyles: function() {
        return ["MMM-JamesScores.css"];
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "TEAM_DATA") {
            console.log("Received team data");
            this.teamData = payload.team;
            this.liveMatches = payload.live || [];
            this.recentResults = payload.recent || [];
            this.upcomingMatches = payload.upcoming || [];
            this.loaded = true;
            this.updateDom();
        }
        else if (notification === "TEAM_DATA_ERROR") {
            console.error("Error fetching team data:", payload);
            this.loaded = true; // Mark as loaded even on error
            this.updateDom();
        }
    },

    getDom: function () {
        const wrapper = document.createElement("div");
        wrapper.className = "scores-wrapper";

        // Check if still loading
        if (!this.loaded) {
            wrapper.innerHTML = "Loading team data...";
            return wrapper;
        }

        // Team header
        if (this.teamData) {
            const teamHeader = document.createElement("div");
            teamHeader.className = "team-header";
            teamHeader.innerHTML = this.teamData.name;
            wrapper.appendChild(teamHeader);
        }

        // Live Matches Section
        if (this.config.showLiveMatches) {
            const liveHeader = document.createElement("div");
            liveHeader.className = "section-header";
            liveHeader.innerHTML = "Live Match";
            wrapper.appendChild(liveHeader);

            if (!this.liveMatches || this.liveMatches.length === 0) {
                const noLive = document.createElement("div");
                noLive.className = "no-matches";
                noLive.innerHTML = "No live matches right now";
                wrapper.appendChild(noLive);
            } else {
                const liveList = document.createElement("div");
                liveList.className = "scores-list";
                
                this.liveMatches.forEach(match => {
                    const matchItem = this.createMatchElement(match, "live", this.config.teamId);
                    if (matchItem) {
                        liveList.appendChild(matchItem);
                    }
                });
                
                wrapper.appendChild(liveList);
            }
        }

        // Recent Results Section
        if (this.config.showRecentResults) {
            const recentHeader = document.createElement("div");
            recentHeader.className = "section-header";
            recentHeader.innerHTML = "Recent Results";
            wrapper.appendChild(recentHeader);

            if (!this.recentResults || this.recentResults.length === 0) {
                const noRecent = document.createElement("div");
                noRecent.className = "no-matches";
                noRecent.innerHTML = "No recent results available";
                wrapper.appendChild(noRecent);
            } else {
                const recentList = document.createElement("div");
                recentList.className = "scores-list";
                
                this.recentResults.forEach(match => {
                    const matchItem = this.createMatchElement(match, "recent", this.config.teamId);
                    if (matchItem) {
                        recentList.appendChild(matchItem);
                    }
                });
                
                wrapper.appendChild(recentList);
            }
        }

        // Upcoming Matches Section
        if (this.config.showUpcomingMatches) {
            const upcomingHeader = document.createElement("div");
            upcomingHeader.className = "section-header";
            upcomingHeader.innerHTML = "Upcoming Matches";
            wrapper.appendChild(upcomingHeader);

            if (!this.upcomingMatches || this.upcomingMatches.length === 0) {
                const noUpcoming = document.createElement("div");
                noUpcoming.className = "no-matches";
                noUpcoming.innerHTML = "No upcoming matches scheduled";
                wrapper.appendChild(noUpcoming);
            } else {
                const upcomingList = document.createElement("div");
                upcomingList.className = "scores-list";
                
                this.upcomingMatches.forEach(match => {
                    const matchItem = this.createMatchElement(match, "upcoming", this.config.teamId);
                    if (matchItem) {
                        upcomingList.appendChild(matchItem);
                    }
                });
                
                wrapper.appendChild(upcomingList);
            }
        }

        return wrapper;
    },

    createMatchElement: function(match, type, teamId) {
        const scoreItem = document.createElement("div");
        scoreItem.className = "score-item";

        // Find home and away teams
        const homeTeam = match.participants?.find(p => p.meta?.location === "home");
        const awayTeam = match.participants?.find(p => p.meta?.location === "away");
        
        if (!homeTeam || !awayTeam) {
            return null; // Skip if we can't find both teams
        }

        // Highlight the team we're tracking
        const homeClass = homeTeam.id === teamId ? "home-team our-team" : "home-team";
        const awayClass = awayTeam.id === teamId ? "away-team our-team" : "away-team";

        // Find score
        let homeScore = "-";
        let awayScore = "-";
        
        if (type !== "upcoming" && match.scores) {
            // For live and recent matches
            const homeScoreObj = match.scores.find(s => 
                s.participant === "home" && (s.type?.name === "current" || s.type?.name === "ft"));
            const awayScoreObj = match.scores.find(s => 
                s.participant === "away" && (s.type?.name === "current" || s.type?.name === "ft"));
                
            if (homeScoreObj) homeScore = homeScoreObj.goals;
            if (awayScoreObj) awayScore = awayScoreObj.goals;
        }

        // Get match info based on type
        let matchInfo = "";
        if (type === "live" && match.time) {
            matchInfo = match.time.minute ? `${match.time.minute}'` : match.time.status;
            scoreItem.classList.add("live-match");
        } else if (type === "recent" && match.starting_at) {
            // Format date for completed matches
            const matchDate = new Date(match.starting_at.date_time);
            matchInfo = matchDate.toLocaleDateString();
        } else if (type === "upcoming" && match.starting_at) {
            // Format date and time for upcoming matches
            const matchDate = new Date(match.starting_at.date_time);
            matchInfo = `${matchDate.toLocaleDateString()} ${matchDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            
            // Add competition name if available
            if (match.league && match.league.name) {
                matchInfo += ` - ${match.league.name}`;
            }
        }

        // Create the score display
        scoreItem.innerHTML = `
            <span class="${homeClass}">${homeTeam.name}</span>
            <span class="score">${homeScore} - ${awayScore}</span>
            <span class="${awayClass}">${awayTeam.name}</span>
            <span class="match-info">${matchInfo}</span>
        `;
        
        return scoreItem;
    }
});