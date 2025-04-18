var config = {
    address: "0.0.0.0",  // Listen on all interfaces (needed for Docker)
    port: 8080,          // Port MagicMirror will run on
    ipWhitelist: [],     // Empty for all IPs or you can restrict to local network

    modules: [
        {
            module: "alert",   // Default alert module
            position: "top_bar"
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
                apiToken: API_TOKEN_SCORES
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
                        url: "https://www.calendarlabs.com/templates/ical/US-Holidays.ics"
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
            classes: "james-only"
        },
        // Face detection module
        {
            module: "MMM-FaceDetect-MQTT",
            position: "top_left",
            config: {
                mqttBroker: "mqtt://test.mosquitto.org",
                mqttTopic: "jamesh/face/verification",
                header: "Welcome",
                // Define user calendar mappings - URLs must match those in calendar modules
                userCalendars: {
                    "Default": "https://www.calendarlabs.com/templates/ical/US-Holidays.ics",
                    "James": "https://calendar.google.com/calendar/ical/adidassport2016%40gmail.com/public/basic.ics"
                },
                defaultUser: "Default"
            }
        }
    ]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}