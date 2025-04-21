// MMM-FaceDetect-MQTT Module
Module.register("MMM-FaceDetect-MQTT", {
    defaults: {
        mqttBroker: "mqtt://mqtt.eclipseprojects.io",
        mqttTopic: "jamesh/face/verification",
        header: "User Detected",
        // Add user calendar mappings
        userCalendars: {
            "Default": "https://www.officeholidays.com/ics-all/ireland",
            "James": "https://calendar.google.com/calendar/ical/adidassport2016%40gmail.com/public/basic.ics"
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
        var self = this;
        setTimeout(function() {
            self.updateCalendarForUser(self.config.defaultUser);
            self.updateModulesForUser(self.config.defaultUser);
        }, 1000);
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
            this.updateModulesForUser(this.value.user);
        } else {    
            wrapper.innerHTML = `<strong>Unable to Verify: ${this.value.user}</strong>`;
            // Show default calendar if verification fails
            this.updateCalendarForUser(this.config.defaultUser);
            this.updateModulesForUser(this.value.user);
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

    updateCalendarForUser: function(username) {
        if (this.currentUser === username && this.loaded) {
            return; // No change needed if same user and already loaded
        }
        
        this.currentUser = username;
        
        // Get the user's calendar URL or use default if not found
        let calendarUrl = this.config.userCalendars[username];
        if (!calendarUrl) {
            calendarUrl = this.config.userCalendars[this.config.defaultUser];
            console.log(`No calendar found for ${username}, using default`);
        }
        
        // Hide all calendar modules first
        MM.getModules().withClass("calendar").enumerate(function(module) {
            module.hide(username === "Default" ? 0 : 1000); // Hide immediately on startup
        });
        
        // Show the calendar for the current user
        MM.getModules().withClass("calendar").enumerate(function(module) {
            const config = module.config;
            
            // Check if this module has matching calendar URL
            const hasMatchingCalendar = config.calendars && config.calendars.some(cal => cal.url === calendarUrl);
            
            if (hasMatchingCalendar) {
                module.show(1000);
            }
        });
        
        console.log(`Calendar updated for user: ${username}`);
        this.loaded = true;
    },



    updateModulesForUser: function(username) {
        const allModules = MM.getModules();
        
        // Handle "james-only" modules
        allModules.enumerate(function(module) {
            if (module.data.classes && module.data.classes.includes("james-only")) {
                if (username === "James") {
                    module.show(1000);
                } else {
                    module.hide(0); // Hide immediately on startup
                }
            }
        });
        
        // Handle "default-only" modules
        allModules.enumerate(function(module) {
            if (module.data.classes && module.data.classes.includes("default-only")) {
                if (username !== "James") {
                    module.show(1000);
                } else {
                    module.hide(0); // Hide immediately on startup
                }
            }
        });
        
        console.log("Modules updated for user:", username);
    }
    
    
});
