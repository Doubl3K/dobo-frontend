const mqtt = require("mqtt");
const client = mqtt.connect("ws://broker.emqx.io:8083");

console.log("------------------------");
console.log("-MQTT client is running-");
console.log("------------------------");

client.on("connect", () => {
	console.log("Client: " + client + "is connected.");
	client.subscribe("presence", (err) => {
		if (!err) {
			client.publish("presence", "Hello mqtt");
		}
	});
});

client.on("message", (topic, message) => {
	// message is Buffer
	console.log(message.toString());
	client.end();
});
