var config = {
    address: "0.0.0.0",  // Listen on all interfaces (needed for Docker)
    port: 8080,          // Port MagicMirror will run on
    ipWhitelist: [],     // Empty for all IPs or you can restrict to local network

    modules: [
        {
            module: "MMM-FaceDetect-MQTT",
            position: "top_left",
            config: {
                mqttBroker: "mqtt://mqtt.eclipseprojects.io",
                mqttTopic: "jamesh/face/verification",
                header: "Welcome",
                // Map detected users to ProfileSwitcher profiles
                userProfiles: {
                    "Default": "default",
                    "James": "james",
                    "Solo": "solo"
                }
            },
            classes: "default everyone"
        },
        {
            module: "MMM-ProfileSwitcher",
            config: {
                // The default profile when no profile is active
                defaultClass: "default",
                // Classes that should be available to all profiles
                everyoneClass: "everyone",
                // Show a notification when switching profiles
                enterMessages: {
                    "james": ["Welcome, James!"],
                    "default": ["Welcome, visitor!"]
                },
                leaveMessages: {
                    "james": ["Goodbye, James!"],
                    "default": ["Goodbye!"]
                }
            }
        },
        
        // Clock - central and prominent
        {
            module: "clock",
            position: "top_center",
            config: {
                timeFormat: 24,
                displaySeconds: true,
                showPeriod: true,
            },
            classes: "default everyone"
        },
        
        // Compliments - below clock to create focal point
        {
            module: "compliments",
            position: "middle_center",
            classes: "everyone"
        },
        
        // Current Weather - top right corner
        {
            module: "weather",
            position: "top_right",
            config: {
                weatherProvider: "openmeteo",
                type: "current",
                lat: 52.25732890926595,
                lon: -7.110712644179762
            },
            classes: "default everyone"
        },
        
        // Weather Forecast - right side underneath current weather
        {
            module: "weather",
            position: "upper_third_right",
            header: "Weather Forecast",
            config: {
                weatherProvider: "openmeteo",
                type: "forecast",
                lat: 52.25732890926595,
                lon: -7.110712644179762
            },
            classes: "default everyone"
        },
        
        // Calendars - arranged together on the right
        // Default calendar - shown when no one is recognized
        {
            module: "calendar",
            header: "Default Calendar",
            position: "bottom_right",
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
            classes: "default"
        },
        
        // James's calendar - hidden by default
        {
            module: "calendar",
            header: "James's Calendar",
            position: "bottom_right",
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
            classes: "james"
        },
        
        // Sports scores - left side for balance
        {
            module: "MMM-JamesScores",
            position: "bottom_left",
            config: {
                apiToken: "Wn5Lyy9UBdQxDKfCcMj3nOY676L0WObpp5nJR6uS6rDgL3QCc5f78yzAEgB7",
                teamId: 8,
                maxResults: 5,
                showLiveMatches: true,
                showRecentResults: true,
                showUpcomingMatches: true
            },
            classes: "james"
        },
        
        // News feed - spans the bottom for a clean finish
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
            classes: "default"
        }
    ]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}