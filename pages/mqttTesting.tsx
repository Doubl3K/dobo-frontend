/* import type { MqttClient } from "mqtt";
import { useRef, useState } from "react";
import useMqtt from "../src/app/useMqtt";

export default function Home() {
	const [incommingMessages, setIncommingMessages] = useState<any[]>([]);
	const addMessage = (message: any) => {
		setIncommingMessages((incommingMessages) => [
			...incommingMessages,
			message,
		]);
	};
	const clearMessages = () => {
		setIncommingMessages(() => []);
	};

	const incommingMessageHandlers = useRef([
		{
			topic: "raspi/test/luefter",
			handler: (msg: string) => {
				addMessage(msg);
			},
		},
	]);

	const mqttClientRef = useRef<MqttClient | null>(null);
	const setMqttClient = (client: MqttClient) => {
		mqttClientRef.current = client;
	};
	useMqtt({
		uri: "mqtt://test.mosquitto.org:8081",

		topicHandlers: incommingMessageHandlers.current,
		onConnectedHandler: (client) => setMqttClient(client),
	});

	const publishMessages = (client: any) => {
		if (!client) {
			console.log("(publishMessages) Cannot publish, mqttClient: ", client);
			return;
		}

		client.publish("topic1", "1st message from component");
	};

	return (
		<div>
			<h2>Subscribed Topics</h2>
			{incommingMessageHandlers.current.map((i) => (
				<p key={Math.random()}>{i.topic}</p>
			))}
			<h2>Incomming Messages:</h2>
			{incommingMessages.map((m) => (
				<p key={Math.random()}>{m.payload.toString()}</p>
			))}
			<button onClick={() => publishMessages(mqttClientRef.current)}>
				Publish Test Messages
			</button>
			<button onClick={() => clearMessages()}>Clear Test Messages</button>
		</div>
	);
}
 */
let messageRecieved = "No message yet";
export default function MqttTesting() {
	return (
		<div>
			<h1>MQTT Testing</h1>
			<p>MQTT Testing Page</p>
			<button onClick={connectMe}>Connect</button>
			<div id="data">{messageRecieved}</div>
		</div>
	);
}

import mqtt from "mqtt";
const client = mqtt.connect("ws://test.mosquitto.org:8080");
console.log("Client: " + client);

client.on("connect", (event) => {
	console.log(event);

	console.log("me amo es connected");

	client.subscribe("presence", (err) => {
		console.log("Subscribed to FBS/LF8_Projekt/Zeit. Wating for message");
	});
});

client.publish("presence", "Hello mqtt");

client.on("error", (error) => {
	console.log("Error: " + error);
	console.log("client: " + client);
});

client.on("message", (topic, message) => {
	console.log(message.toString());
	messageRecieved = message.toString();
});

function connectMe() {
	console.log("Connecting to MQTT");
	client.publish("presence", "Hello mqtt");
	console.log(client);
	client.reconnect();
	console.log(client);
}
