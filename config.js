var config = {
    address: "0.0.0.0",  // Listen on all interfaces (needed for Docker)
    port: 8080,          // Port MagicMirror will run on
    ipWhitelist: [],     // Empty for all IPs or you can restrict to local network

    modules: [
        {
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "Irish News",
						url: "https://www.irishcentral.com/feeds/section-articles.atom"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true
			},
            classes: "default-only"
		},
        {
			module: "compliments",
			position: "lower_third"
		},
        {
            module: "clock",   // Clock module
            position: "top_center",
            config: {
                timeFormat: 24,  // 24-hour format
                displaySeconds: true,  // Show seconds
                showPeriod: true,  // Show AM/PM
            }
        },
        {
            module: "MMM-JamesScores",
            position: "bottom_left",
            config: {
                apiToken: "Wn5Lyy9UBdQxDKfCcMj3nOY676L0WObpp5nJR6uS6rDgL3QCc5f78yzAEgB7",
                teamId: 8, // Change this to your preferred team ID
                maxResults: 5, // Show up to 5 recent and upcoming matches
                showLiveMatches: true,
                showRecentResults: true,
                showUpcomingMatches: true
            },
            classes: "james-only" // Only show for James!
        },        
        // Default calendar - shown when no one is recognized
        {
            module: "calendar",
            header: "Default Calendar",
            position: "top_right",
            config: {
                calendars: [
                    {
                        symbol: "calendar",
                        url: "https://www.officeholidays.com/ics-all/ireland"
                    }
                ],
                maximumEntries: 10,
                timeFormat: "relative"
            },
            classes: "default-only"
        },
        // James's calendar - hidden by default
        {
            module: "calendar",
            header: "James's Calendar",
            position: "top_right",
            config: {
                calendars: [
                    {
                        symbol: "calendar",
                        url: "https://calendar.google.com/calendar/ical/adidassport2016%40gmail.com/public/basic.ics"
                    }
                ],
                maximumEntries: 10,
                timeFormat: "relative"
            },
            hidden: true,
            classes: "james-only"
        },
        // Face detection module
        {
            module: "MMM-FaceDetect-MQTT",
            position: "top_left",
            config: {
                mqttBroker: "mqtt://mqtt.eclipseprojects.io",
                mqttTopic: "jamesh/face/verification",
                header: "Welcome",
                // Define user calendar mappings - URLs must match those in calendar modules
                userCalendars: {
                    "Default": "https://www.officeholidays.com/ics-all/ireland",
                    "James": "https://calendar.google.com/calendar/ical/adidassport2016%40gmail.com/public/basic.ics"
                },
                defaultUser: "Default"
            }
        }
    ]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}