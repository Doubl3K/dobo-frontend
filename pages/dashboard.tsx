import mqtt from "mqtt";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import JsonMockup from "../docs/mockupData.json";
import CardLineChart from "../src/components/Chart";
import "../styles/globals.css";

const GaugeChart = dynamic(() => import("react-gauge-chart"), { ssr: false });
let client;

export default function Dashboard() {
	const [temperature, setTemperature] = useState<number>(0);
	const [humidity, setHumidity] = useState<number>(0);
	const [cubeColor, setCubeColor] = useState<string>("000000");
	const [mqttDataRecieved, setMqttDataRecieved] = useState<string>(
		"No data recieved yet"
	);
	const [mqttData, setMqttData] = useState<string[]>([]); // New state variable

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTemperature(randomNumberForTesting());
			setHumidity(randomNumberForTesting());
			const newColor = randomColorForTesting();
			setCubeColor(newColor);
			changeCubeColorToHex(newColor);
			setMqttDataRecieved(randomMqttData());
			const randomData = randomMqttData();
			connectMe(setMqttData);
		}, 1000);

		// cleanup function to clear the interval when the component unmounts
		return () => clearInterval(intervalId);
	}, []);

	return (
		<>
			<button onClick={sendTestData}>Test</button>
			<div className="gridWrapper">
				<div className="cardGrid">
					<div className="tempWrapper card">
						<label htmlFor="temperature">Current Temperature: </label>
						mqtt
						<GaugeChart
							id="gauge-chart1"
							percent={temperature / 100}
							formatTextValue={(value) => `${temperature}°C`}
						/>
					</div>
					<div className="wetWrapper card">
						<label htmlFor="humidity">Current Humidity: </label>

						<GaugeChart
							id="gauge-chart1"
							percent={humidity / 100}
							formatTextValue={(value) => `${humidity}%`}
						/>
					</div>
					<div className="cubeWrapper card">
						<label htmlFor="cubeColor">Current Cube Color: </label>
						{temperature !== null && <span id="cubeColor">#{cubeColor}</span>}
						<span className="cubeSpan">
							<div className="container">
								<div className="cube">
									<div className="face front">#{cubeColor}</div>
									<div className="face back">#{cubeColor}</div>
									<div className="face right">#{cubeColor}</div>
									<div className="face left">#{cubeColor}</div>
									<div className="face top">#{cubeColor}</div>
									<div className="face bottom">#{cubeColor}</div>
								</div>
							</div>
						</span>
					</div>
					<div className="temperatureChartWrapper card">
						<CardLineChart title="Temperature Development over time" id="1" />
						<CardLineChart title="Humuidity Development over time" id="2" />
					</div>
					<div className="dataRecieved card">
						<label htmlFor="data">Cost table</label>
						<p id="data">No data recieved yet</p>
						<button
							onClick={() => connectMe(setMqttData)}
							className="connectButton">
							Test Call
						</button>
					</div>
					<div className="dateRecievedHistory card">
						<label htmlFor="mqttData">MQTT data: </label>
						<span className="dataHistory mqtt">
							{mqttData.length === 0
								? "No Data received yet"
								: mqttData.join(", ")}
						</span>
						<button onClick={() => sendTestData()} className="connectButton">
							Connect
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

function randomNumberForTesting() {
	return Math.floor(Math.random() * 100);
}

function randomColorForTesting() {
	const hexColor = Math.floor(Math.random() * 16777215).toString(16);
	return hexColor.padStart(6, "0");
}

function changeCubeColorToHex(hexColor: string): void {
	const cubeFaces: HTMLCollectionOf<Element> =
		document.getElementsByClassName("face");

	for (let i = 0; i < cubeFaces.length; i++) {
		cubeFaces[i].style.backgroundColor = `#${hexColor}`;
	}
}

function randomMqttData() {
	let data = "MQTT: ";
	let random = Math.floor(Math.random() * 100);
	return data + random;
}

function connectMe(
	setMqttData: React.Dispatch<React.SetStateAction<string[]>>
) {
	document.getElementsByClassName("dataHistory")[0]!.innerHTML =
		"Connecting To MQTT Server...";

	setTimeout(() => {
		let test = document.createElement("p");
		const randomData = randomMqttData();
		setMqttData((prevData) => [...prevData, randomData]);
		const dataHistoryElement =
			document.getElementsByClassName("dataHistory")[0];
		test.textContent = randomData;
		dataHistoryElement.appendChild(test);
	}, 2000);
}
function sendTestData() {
	let data: JSON = JsonMockup;
	console.log(data.toString());

	client.publish("jsonTest", JSON.stringify(data));
	console.log(JsonMockup);
}

let official = "FBS/LF8_Projekt/JSON";
let test = "jsonTest";

function startMqttConnection() {
	console.log("Starting MQTT Connection");

	client = mqtt.connect("ws://test.mosquitto.org:8080");

	client.on("connect", () => {
		client.subscribe(test, (err) => {
			if (!err) {
				console.log(test);
			}
		});
	});

	client.on("message", (topic, message) => {
		console.log("Data recieved");
		handleJson(message);
	});
}

function handleJson(data) {
	let jsonData: JSON = JSON.parse(data);
	getEnergieCosts(jsonData);
	console.log(jsonData);
}

function getEnergieCosts(data: JSON) {
	let costs = data[0];
	console.log(costs);
}
startMqttConnection();
