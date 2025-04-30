// MMM-FaceDetect-MQTT Module
Module.register("MMM-FaceDetect-MQTT", {
    defaults: {
      mqttBroker: "mqtt://mqtt.eclipseprojects.io",
      mqttTopic: "jamesh/face/verification",
      header: "User Detected",
      userProfiles: {
        "Default": "default",
        "James": "james",
        "Solo": "solo"
        // Add more users and their profiles as needed
      },
      defaultUser: "Default"
    },
  
    // Load necessary scripts and styles
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
    },
  
    getDom: function () {
      var wrapper = document.createElement("div");
  
      if (!this.loaded) {
        wrapper.innerHTML = "Verifying...";
        return wrapper;
      }
  
      if (!this.value) {
        wrapper.innerHTML = "No data";
        wrapper.className = "dimmed light small";
        return wrapper;
      }
  
      if (this.value.verified) {
        wrapper.innerHTML = `<strong>${this.config.header}:</strong> ${this.value.user}`;
        this.switchProfileForUser(this.value.user);
      } else {
        wrapper.innerHTML = `<strong>Unable to Verify: ${this.value.user}</strong>`;
        this.switchProfileForUser(this.config.defaultUser);
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
  
    switchProfileForUser: function (username) {
      if (this.currentUser === username && this.loaded) {
        return; // No change needed if same user and already loaded
      }
  
      this.currentUser = username;
  
      // Get the user's profile name or use default if not found
      let profileName = this.config.userProfiles[username];
      if (!profileName) {
        profileName = this.config.userProfiles[this.config.defaultUser];
        console.log(`No profile found for ${username}, using default`);
      }
  
      // Send notification to ProfileSwitcher to change current profile
      this.sendNotification("CURRENT_PROFILE", profileName);
      this.updateDom(0);
  
      console.log(`Profile switched for user: ${username} to profile: ${profileName}`);
      this.loaded = true;
    }
  });
  