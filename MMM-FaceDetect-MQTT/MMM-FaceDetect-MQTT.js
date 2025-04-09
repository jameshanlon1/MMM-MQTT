// MMM-FaceDetect-MQTT Module
Module.register("MMM-FaceDetect-MQTT", {
    defaults: {
        mqttBroker: "mqtt://test.mosquitto.org",
        mqttTopic: "jamesh/face/verification",
        header: "User Detected",
        // Add user calendar mappings
        userCalendars: {
            "Default": "https://www.calendarlabs.com/templates/ical/US-Holidays.ics",
            "James": "https://calendar.google.com/calendar/ical/adidassport2016%40gmail.com/public/basic.ics",
            "Sarah": "https://calendar.google.com/calendar/ical/3d27b8330b0b947cced8b0f9bb3f00884173e68140451e49ac4b037da682bf19%40group.calendar.google.com/public/basic.ics"
            // Add more users and their calendar URLs as needed
        },
        defaultUser: "Default"
    },
    
    // Define required scripts.
    getScripts: function () {
        return ["moment.js", "font-awesome.css"];
    },
    getStyles: function () {
        return ['MMM-RNV.css'];
    },

    start: function () {
        Log.info('Starting module: ' + this.name);
        this.loaded = false;
        this.currentUser = this.config.defaultUser;
        this.sendSocketNotification('CONFIG', this.config);

        // Hide all calendars initially on startup
        MM.getModules().withClass("calendar").enumerate(function(module) {
            module.hide(0);  // 0ms to hide all calendars instantly
    });
    },

    getDom: function () {
        var wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.innerHTML = "Verifying...";
            return wrapper;
        }

        if (!this.value) {
            this.updateCalendarForUser(this.config.defaultUser);
            wrapper.innerHTML = "No data";
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        
        if (this.value.verified) {
            wrapper.innerHTML = `<strong>${this.config.header}:</strong> ${this.value.user}`;
            // Update the calendar when a user is verified
            this.updateCalendarForUser(this.value.user);
        } else {    
            wrapper.innerHTML = `<strong>Unable to Verify: ${this.value.user}</strong>`;
            // Show default calendar if verification fails
            this.updateCalendarForUser(this.config.defaultUser);
        }
        return wrapper;
    },

    processData: function (data) {
        console.log(data);
        this.value = data;
        return;
    },

    socketNotificationReceived: function (notification, payload, sender) {
        if (notification === "STARTED") {
            this.updateDom();
        } else if (notification === "DATA") {
            this.loaded = true;
            this.processData(JSON.parse(payload));
            if (!this.hidden) {
                this.updateDom();
            }
        }
    },

     // New method to update calendar based on verified user
     updateCalendarForUser: function(username) {
        if (this.currentUser === username) {
            return; // No change needed if same user
        }
    
        this.currentUser = username;
    
        // Get the user's calendar URL or use default if not found
        let calendarUrl = this.config.userCalendars[username];
        if (!calendarUrl) {
            // Use the default calendar if no user calendar is found
            calendarUrl = this.config.userCalendars[this.config.defaultUser];
            console.log(`No calendar found for ${username}, using default`);
        }
    
        // Hide all calendar modules first
        MM.getModules().withClass("calendar").enumerate(function(module) {
            module.hide(1000);
        });
    
        // Show the calendar for the current user or default calendar
        MM.getModules().withClass("calendar").enumerate(function(module) {
            const config = module.config;
            
            // Check if this module has matching calendar URL
            const hasMatchingCalendar = config.calendars && config.calendars.some(cal => cal.url === calendarUrl);
            
            if (hasMatchingCalendar) {
                module.show(1000); // Show matching calendar
            }
        });
    
        console.log(`Calendar updated for user: ${username}`);
    }
    
});
