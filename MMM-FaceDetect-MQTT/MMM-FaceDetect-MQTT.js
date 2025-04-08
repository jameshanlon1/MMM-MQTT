Module.register("MMM-FaceDetect-MQTT", {
    defaults: {
        mqttBroker: "mqtt://host.docker.internal",
        mqttTopic: "jamesh/face/verification",
        header: "API Data",
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
        this.loaded = false; // Ensure it's not marked as loaded yet
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
        
        if (this.value.verified)
            wrapper.innerHTML = `<strong>${this.config.header}:</strong> ${this.value.user}`;
        else    
            wrapper.innerHTML = `<strong>Unable to Verify: ${this.value.user}</strong>`;
        return wrapper;
    },
    processData: function (data) {
        console.log(data)
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
    
    }
    
);
