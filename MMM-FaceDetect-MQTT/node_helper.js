const NodeHelper = require('node_helper');
const mqtt = require('mqtt');
var moment = require('moment');

module.exports = NodeHelper.create({

	start: function() {
		this.started = false;
		this.config = null;
	},

    startMQTT: function() {
        var self = this;
        this.client = mqtt.connect(this.config.mqttBroker);

        this.client.on('connect', function () {
            self.client.subscribe(self.config.mqttTopic, function (err) {
                if (!err) {
                    console.log('Subscribed to topic: ' + self.config.mqttTopic);
                }
            });
        });

        this.client.on('message', function (topic, message) {
            if (topic === self.config.mqttTopic) {
                self.sendSocketNotification("DATA", message.toString());
            }
        });
    },



	socketNotificationReceived: function(notification, payload) {
        var self = this;
		console.log('INNNN Starting UPPPPP: ' + self.name);
        if (notification === 'CONFIG' && self.started == false) {
			console.log('Starting UPPPPP: ' + self.name);
            self.config = payload;
            self.sendSocketNotification("STARTED", true);
            self.startMQTT();
            self.started = true;
        }
    }
});