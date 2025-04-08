var config = {
    address: "0.0.0.0",  // Listen on all interfaces (needed for Docker)
    port: 8080,          // Port MagicMirror will run on
    ipWhitelist: [],     // Empty for all IPs or you can restrict to local network

    // Other MagicMirror config here ...

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
            module: "calendar",  // Calendar module
            position: "top_right",  // Position on the mirror
            config: {
                calendars: [
                    {
                        symbol: "calendar",
                        url: "https://www.googleapis.com/calendar/feeds/primary/public/basic"
                    }
                ]
            }
        },
        {
            module: "MMM-FaceDetect-MQTT",  // Your custom MQTT module
            position: "top_left",
            config: {
                mqttBroker: "mqtt://host.docker.internal",  // Connect to host MQTT broker
                mqttTopic: "jamesh/face/verification",
                updateInterval: 5000,  // Update interval in milliseconds
            }
        }
    ]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}